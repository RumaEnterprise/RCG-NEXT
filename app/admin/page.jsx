import React from "react";
import {
  Box,
 
} from "@chakra-ui/react";
import { Dashboard } from "./Dashboard";
import Chart from "./Chart";

const Admin = () => {
  return (
    <Box>
      <Dashboard>
        <Chart />
      </Dashboard>
    </Box>
  );
};

export default Admin;
