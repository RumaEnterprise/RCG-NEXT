"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { persistedStore, store } from "../Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Footer from "../Components/Footer";
import Top from "./Top";
const Render = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
        <ChakraProvider>
          <Top />
          {children}
          <Footer />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
};

export default Render;
