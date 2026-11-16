import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import LegalDisclaimerBanner from "../common/LegalDisclaimerBanner";
import EmergencyHelplineModal from "../common/EmergencyHelplineModal";

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F4F6F8]">
      {/* 1. Bar Council Compliance Banner */}
      <LegalDisclaimerBanner />

      {/* 2. Top Header Navigation */}
      <Navbar />

      {/* 3. Main Workspace Shell (Sidebar + Page Content) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F4F6F8]">
          <Outlet />
        </main>
      </div>

      {/* 4. Global Modals */}
      <EmergencyHelplineModal />
    </div>
  );
}

