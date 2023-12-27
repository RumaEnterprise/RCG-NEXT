import React from "react";
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
  useToast,
} from "@chakra-ui/react";
import { capitalizeWords } from "../capital";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../app/(frontend)/Redux/AppReducer/Action";
const ReviewTable = ({ reviewData, filter, token, getAllReview }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const updatedReview = (e, data, id) => {
    try {
      const newstatus = e.target.value;
      const skuID = data.skuID;
      const newData = data.productReview.map((ele) => {
        if (ele._id == id) {
          ele.status = newstatus;
        }
        return ele;
      });
      dispatch(updateProduct({ productReview: newData }, toast, skuID, token));
      getAllReview();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <Center>Image</Center>
            </Th>
            <Th>
              <Center ml={"-10px"}>SKU</Center>
            </Th>
            <Th>
              <Center ml={"-10px"}>Name</Center>
            </Th>
            <Th>
              <Center ml={"-20px"}>Review</Center>
            </Th>
            <Th>
              <Center ml={"-10px"}>Date</Center>
            </Th>
            <Th>
              <Center ml={"-10px"}>Status</Center>
            </Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {reviewData?.map((ele) => {
            return (
              <>
                {ele.productReview.map((el,i) => {
                  if (el.status !== filter) {
                    return null;
                  }
                  return (
                    <Tr fontSize={"13px"} key={i}>
                      <Td>
                        <Center>
                          <Image
                            minH={"70px"}
                            w={"80px"}
                            src={`${process.env.REACT_APP_BACKEND_URL}/image?name=${ele.skuID}-1.jpg`}
                          />
                        </Center>
                      </Td>
                      <Td>
                        <Text>{ele.skuID}</Text>
                      </Td>
                      <Td>
                        <Text>{capitalizeWords(el.username)}</Text>
                      </Td>
                      <Td>
                        <Flex direction={"column"} w={"200px"}>
                          <Text>Title: {el.title}</Text>
                          <Text
                            m={"0px"}
                            p={"0px"}
                            mt={"5px"}
                            whiteSpace={"pre-wrap"}
                          >
                            Review: {el.review}
                          </Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Text>{el.date}</Text>
                      </Td>
                      <Td>
                        <Text
                          color={
                            el.status == "pending"
                              ? "orange"
                              : el.status == "accept"
                              ? "green"
                              : "red"
                          }
                        >
                          {capitalizeWords(el.status)}
                        </Text>
                      </Td>
                      {el.status !== "pending" ? null : (
                        <Td>
                          <Select
                            onChange={(e) => updatedReview(e, ele, el._id)}
                          >
                            <option hidden>Change Status</option>
                            <option value={"accept"}>Accept</option>
                            <option value={"reject"}>Reject</option>
                          </Select>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
              </>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ReviewTable;
