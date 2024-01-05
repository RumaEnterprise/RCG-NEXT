"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Image,
  Text,
  Center,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useSelector } from "react-redux";
import ReviewTable from "../../../Components/Admin/ReviewTable";
const Review = () => {
  const [reviewData, setReviewData] = useState([]);
  const token = useSelector((store) => store.auth.token);
  const user = useSelector((store) => store.auth.user);
  const getAllReview = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/product/getallreview`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setReviewData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllReview();
  }, []);
  return (
    <Dashboard>
      <Tabs>
        <TabList>
          <Tab>Pending</Tab>
          <Tab>Accepted</Tab>
          <Tab>Rejected</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ReviewTable
              reviewData={reviewData}
              filter={"pending"}
              token={token}
              getAllReview={getAllReview}
            />
          </TabPanel>
          <TabPanel>
            <ReviewTable
              reviewData={reviewData}
              filter={"accept"}
              token={token}
              getAllReview={getAllReview}
            />
          </TabPanel>
          <TabPanel>
            <ReviewTable
              reviewData={reviewData}
              filter={"reject"}
              token={token}
              getAllReview={getAllReview}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Dashboard>
  );
};

export default Review;