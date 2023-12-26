"use client";
import { Box, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import axios from "axios";
import { useSelector } from "react-redux";

const Log = () => {
  const [userLog, setUserLog] = useState([]);
  const token = useSelector((store) => store.auth.token);
  const toast = useToast();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const serverLog=res.data.logs.split("\n")
        serverLog.pop();
        setUserLog(serverLog);
      })
      .catch((err) => {
        toast({
          title: err.response.data.msg,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, []);
  return (
    <Dashboard>
      <Box>
        {
          userLog.map((el,i)=>(
            <Text mb={"20px"} textAlign={"left"}>{i+1}.{el}</Text>
          ))
        }
      </Box>
    </Dashboard>
  );
};

export default Log;