import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeDomain: "auto",
  classifiedDomain: null,
  activeRights: [],
  activePrecedents: [],
  activeDraft: null, // { title, subject, content, domain }
  drawerOpen: false, // Controls DocumentPreviewDrawer side drawer
  savedCases: [
    {
      id: "case-101",
      title: "Security Deposit Withholding by Landlord",
      domain: "tenant",
      date: "04 Nov 2026",
      status: "Notice Generated",
      amountClaimed: "₹75,000",
      opponent: "Mr. K. Sharma (Landlord)",
      lastAction: "15-Day Statutory Notice Issued"
    },
    {
      id: "case-102",
      title: "Wrongful Salary Withholding (2 Months)",
      domain: "labour",
      date: "28 Oct 2026",
      status: "In Review",
      amountClaimed: "₹1,20,000",
      opponent: "Apex Tech Solutions Pvt Ltd",
      lastAction: "DLSA Panel Counsel Connected"
    },
    {
      id: "case-103",
      title: "Defective Smart TV - Replacement Refused",
      domain: "consumer",
      date: "15 Oct 2026",
      status: "Settled",
      amountClaimed: "₹42,000",
      opponent: "QuickMart E-Commerce Ltd",
      lastAction: "Refund Credited to Bank"
    }
  ]
};

export const legalCaseSlice = createSlice({
  name: "legalCase",
  initialState,
  reducers: {
    setActiveDomain: (state, action) => {
      state.activeDomain = action.payload;
    },
    setClassifiedResult: (state, action) => {
      const { domain, rights, precedents, draftNotice } = action.payload;
      state.classifiedDomain = domain;
      state.activeRights = rights || [];
      state.activePrecedents = precedents || [];
      if (draftNotice) {
        state.activeDraft = draftNotice;
      }
    },
    setActiveDraft: (state, action) => {
      state.activeDraft = action.payload;
    },
    updateActiveDraftContent: (state, action) => {
      if (state.activeDraft) {
        state.activeDraft.content = action.payload;
      }
    },
    setDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
    },
    addSavedCase: (state, action) => {
      state.savedCases.unshift(action.payload);
    }
  }
});

export const {
  setActiveDomain,
  setClassifiedResult,
  setActiveDraft,
  updateActiveDraftContent,
  setDrawerOpen,
  addSavedCase
} = legalCaseSlice.actions;

export default legalCaseSlice.reducer;

