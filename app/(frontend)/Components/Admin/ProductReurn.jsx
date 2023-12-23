import {
  Box,
  TableCaption,
  TableContainer,
  Image,
  Text,
  Center,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { capitalizeWords } from "../capital";

const ProductReurn = ({
  data,
  filter,
  modifyStatus = false,
  token,
  getReturnData,
}) => {
  const updateReturnStatus = (payload, id) => {
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/return/update/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast({
          title: res.data.msg,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        getReturnData();
      })
      .catch((err) => {
        toast({
          title: err.response.data.msg,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };
  const {
    isOpen: isOpenReturn,
    onOpen: onOpenReturn,
    onClose: onCloseReturn,
  } = useDisclosure();
  const selectRef = useRef(null);
  const toast = useToast();
  const [courier, setCourier] = useState("");
  const [id, setID] = useState("");
  const trackingID = useRef();
  const submitCourier = () => {
    const payload = {
      courierPartner: courier,
      trackingID: trackingID.current.value,
      status: "process",
    };
    try {
      updateReturnStatus(payload, id);
      onCloseReturn();
    } catch (error) {
      console.log(error);
    }
  };
  const newData = data?.filter((ele) => ele.status == filter);
  const submitStatusUpdate = (payload, id) => {
    if (payload.status == "process") {
      setID(id);
      onOpenReturn();
      return;
    }
    try {
      updateReturnStatus(payload, id);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box fontSize={"12px"}>
      {filter == "pending" ? (
        <Modal
          isCentered
          isOpen={isOpenReturn}
          onClose={() => {
            selectRef.current.value = "";
            onCloseReturn();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Courier Info</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel fontSize={"14px"}>Courier Partner</FormLabel>
              <Select
                fontSize={"12px"}
                mb={"10px"}
                border={"1px solid gray"}
                name="courierPartner"
                onChange={(e) => setCourier(e.target.value)}
              >
                <option hidden>Select Courier Partner</option>
                <option>DELHIVERY</option>
                <option>EKART LOGISTICS</option>
                <option>SHADOWFAX</option>
                <option>ECOM EXPRESS</option>
                <option>INDIAN POST</option>
                <option>EXPRESSBESS</option>
                <option>BLUEDART</option>
                <option>DTDC</option>
              </Select>
              <FormLabel fontSize={"14px"}>Tracking ID</FormLabel>
              <Input
                fontSize={"12px"}
                border={"1px solid gray"}
                ref={trackingID}
                placeholder="Enter Tracking ID"
              />
            </ModalBody>

            <ModalFooter>
              <Button
                fontSize={"12px"}
                colorScheme="red"
                mr={3}
                onClick={() => {
                  selectRef.current.value = "";
                  onCloseReturn();
                }}
              >
                Close
              </Button>
              <Button
                fontSize={"12px"}
                colorScheme="blue"
                onClick={submitCourier}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}
      <TableContainer>
        <table style={{width:"100%"}}>
          <thead>
            <tr>
              <th>
                <Center>Order ID</Center>
              </th>
              <th>
                <Center>Reason to return</Center>
              </th>
              <th>
                <Center>Date & Time</Center>
              </th>
              {filter !== "pending" ? (
                <th>
                  <Center>Courier Partner</Center>
                </th>
              ) : null}
              {filter !== "pending" ? (
                <th>
                  <Center>Tracking ID</Center>
                </th>
              ) : null}
              <th>
                <Center>Status</Center>
              </th>
              {modifyStatus ? <th></th> : null}
            </tr>
          </thead>
          <tbody>
            {newData.map((ele) => {
              const linkto = `/admin/orders/single/${ele.cartID}`;
              return (
                <tr>
                  <td>
                    <Center>
                      <Link to={linkto} target="_blank">
                        <Text
                          color={"blue"}
                          textDecor={"underline"}
                          _hover={{ color: "green", textDecoration: "none" }}
                        >
                          {ele.cartID}
                        </Text>
                      </Link>
                    </Center>
                  </td>
                  <td>
                    <Center>
                      <Text textAlign={"left"} w={"350px"} whiteSpace={"pre-wrap"}>{ele.reason}</Text>
                    </Center>
                  </td>
                  <td>
                    <Center>
                      <Text>
                        {ele.date} | {ele.time}
                      </Text>
                    </Center>
                  </td>
                  {filter !== "pending" ? (
                    <td>
                      <Center>
                        <Text>{ele.courierPartner}</Text>
                      </Center>
                    </td>
                  ) : null}
                  {filter !== "pending" ? (
                    <td>
                      <Center>
                        <Text>{ele.trackingID}</Text>
                      </Center>
                    </td>
                  ) : null}
                  <td>
                    <Center>
                      <Text
                        fontWeight={"bold"}
                        color={
                          ele.status == "pending"
                            ? "orange"
                            : ele.status == "process"
                            ? "orange"
                            : ele.status == "accept"
                            ? "green"
                            : "red"
                        }
                      >
                        {capitalizeWords(ele.status)}
                      </Text>
                    </Center>
                  </td>
                  {modifyStatus ? (
                    <td>
                      <Center>
                        <Select
                          ref={selectRef}
                          fontSize={"12px"}
                          onChange={(e) => {
                            const pload = { status: e.target.value };
                            submitStatusUpdate(pload, ele._id);
                          }}
                        >
                          <option hidden value="">
                            Change Status
                          </option>
                          <option hidden={filter == "process"} value="process">
                            In Process
                          </option>
                          <option hidden={filter == "pending"} value="accept">
                            Accept
                          </option>
                          <option hidden={filter == "pending"} value="reject">
                            Reject
                          </option>
                        </Select>
                      </Center>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableContainer>
    </Box>
  );
};

export default ProductReurn;
