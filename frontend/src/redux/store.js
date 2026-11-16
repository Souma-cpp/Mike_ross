import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user.slice";
import conversationSlice from "./conversation.slice";
import messageSlice from "./message.slice";
import legalCaseSlice from "./legalCase.slice";
import preferencesSlice from "./preferences.slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    conversation: conversationSlice,
    message: messageSlice,
    legalCase: legalCaseSlice,
    preferences: preferencesSlice
  }
});

export default store;
