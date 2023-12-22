"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { persistedStore, store } from "../Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Footer from "../Components/Footer";
import Top from "./Top";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Provider store={store}>
            <PersistGate persistor={persistedStore}>
              <ChakraProvider>
                <Top />
                {children}
                <Footer />
              </ChakraProvider>
            </PersistGate>
          </Provider>
      </body>
    </html>
  );
}
