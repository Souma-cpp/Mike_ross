import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import CitizenDashboardPage from "../pages/CitizenDashboardPage";
import LegalChatPage from "../pages/LegalChatPage";
import DocumentStudioPage from "../pages/DocumentStudioPage";
import ContractScannerPage from "../pages/ContractScannerPage";
import PrecedentFinderPage from "../pages/PrecedentFinderPage";
import LawyerConnectPage from "../pages/LawyerConnectPage";
import CaseManagementPage from "../pages/CaseManagementPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CitizenDashboardPage />} />
        <Route path="/assistant" element={<LegalChatPage />} />
        <Route path="/assistant/:conversationId" element={<LegalChatPage />} />
        <Route path="/drafting" element={<DocumentStudioPage />} />
        <Route path="/contract-intelligence" element={<ContractScannerPage />} />
        <Route path="/precedents" element={<PrecedentFinderPage />} />
        <Route path="/lawyer-connect" element={<LawyerConnectPage />} />
        <Route path="/cases" element={<CaseManagementPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
