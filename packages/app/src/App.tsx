import React from "react";
import AppScreen from "./navigations";
import { I18nextProvider } from "react-i18next";
import { AppThemeProvider, i18n } from "./providers";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { StateProvider } from "@petfabula/common";

export default function App() {
  return (
    <BottomSheetModalProvider>
      <I18nextProvider i18n={i18n}>
        <StateProvider>
          <AppThemeProvider>
            <AppScreen />
          </AppThemeProvider>
        </StateProvider>
      </I18nextProvider>
    </BottomSheetModalProvider>
  );
}
