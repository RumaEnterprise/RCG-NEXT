"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { persistedStore, store } from "../Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import Footer from "../Components/Footer";
import Nav from "../Components/Nav";

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
