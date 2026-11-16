import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import DocumentPreviewDrawer from "./DocumentPreviewDrawer";
import { addMessage, setIsLoading } from "../../redux/message.slice";
import { setClassifiedResult, setDrawerOpen } from "../../redux/legalCase.slice";
import { LegalMockService } from "../../features/legalMock.service";

export default function ChatArea() {
  const dispatch = useDispatch();
  const { activeDomain } = useSelector((state) => state.legalCase);
  const { isLoading } = useSelector((state) => state.message);
  const [activeFile, setActiveFile] = useState(null);

  // Centralized prompt execution function
  const handleExecutePrompt = useCallback(
    async (promptText, domainOverride = null, file = null) => {
      const prompt = (promptText || "").trim();
      if (!prompt && !file) return;

      const domain = domainOverride || activeDomain;

      // 1. Add citizen user message
      const userImages = [];
      if (file && file.type?.startsWith("image/")) {
        userImages.push(URL.createObjectURL(file));
      }

      dispatch(
        addMessage({
          role: "user",
          content: prompt || (file ? `[Uploaded Document: ${file.name}]` : ""),
          images: userImages
        })
      );

      dispatch(setIsLoading(true));

      try {
        // 2. Perform AI legal classification & response synthesis
        const result = await LegalMockService.classifyAndAnalyze(prompt, domain);

        // 3. Update Redux legal case state
        dispatch(setClassifiedResult(result));

        // 4. Append assistant response
        dispatch(
          addMessage({
            role: "assistant",
            content: result.answer,
            draftNotice: result.draftNotice
          })
        );
      } catch (error) {
        console.error("LegalMockService error:", error);
        dispatch(
          addMessage({
            role: "assistant",
            content: "An error occurred while assessing the grievance under Indian law. Please try again."
          })
        );
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [activeDomain, dispatch]
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#F4F6F8]">
      {/* Scrollable Conversation Stream */}
      <MessageList onTriggerPrompt={(prompt, domain) => handleExecutePrompt(prompt, domain)} />

      {/* Multimodal Legal Query Bar */}
      <ChatInput
        onSendPrompt={(prompt, domain, file) => handleExecutePrompt(prompt, domain, file)}
        disabled={isLoading}
      />

      {/* Side-by-Side Live Document Preview Studio Drawer */}
      <DocumentPreviewDrawer />
    </div>
  );
}
