"use client";
import React, { useEffect, useState } from "react";
import { Flex, useBreakpointValue } from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loading from "../../../../Components/Loading";
const Chart = () => {
  const [data, setData] = useState([]);
  const token = useSelector((store) => store.auth.token);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/graph`, {
        headers: {
          Authorization: `Barer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  if(data.length<=0){
    return <Loading load={true} />
  }
  return (
    <Flex w="100%" h="500px" align="center" justify="center">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: isSmallScreen ? 0 : 30,
            left: isSmallScreen ? 0 : 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="sold" stroke="#82ca9d" />
          <Line type="monotone" dataKey="return" stroke="#aa9d" />
        </LineChart>
      </ResponsiveContainer>
    </Flex>
  );
};

export default Chart;