"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { persistedStore, store } from "../Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Top from "./Top";
import Footer from "./Footer";
const Render = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GG_APP_ID || ""}>
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
        <ChakraProvider>
          <Top />
          {children}
          <Footer />
        </ChakraProvider>
      </PersistGate>
    </Provider></GoogleOAuthProvider>
  );
};

export default Render;
