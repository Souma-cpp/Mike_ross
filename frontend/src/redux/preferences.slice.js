import { createSlice } from "@reduxjs/toolkit";
import { CONSTITUTIONAL_LANGUAGES } from "../data/constitutionalLanguages.data";

const initialLang = CONSTITUTIONAL_LANGUAGES[0];

const initialState = {
  language: "en", // code
  languageMeta: initialLang,
  helplineModalOpen: false,
  languageModalOpen: false,
  disclaimerDismissed: false
};

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const code = action.payload;
      state.language = code;
      const found = CONSTITUTIONAL_LANGUAGES.find((l) => l.code === code);
      state.languageMeta = found || initialLang;
    },
    setHelplineModalOpen: (state, action) => {
      state.helplineModalOpen = action.payload;
    },
    setLanguageModalOpen: (state, action) => {
      state.languageModalOpen = action.payload;
    },
    dismissDisclaimer: (state) => {
      state.disclaimerDismissed = true;
    }
  }
});

export const {
  setLanguage,
  setHelplineModalOpen,
  setLanguageModalOpen,
  dismissDisclaimer
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
