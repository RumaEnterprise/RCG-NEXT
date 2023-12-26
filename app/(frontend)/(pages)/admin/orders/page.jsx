"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import { BiRefresh } from "react-icons/bi";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Center,
  Text,
  Select,
  Flex,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  useDisclosure,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  TabPanel,
  TabIndicator,
  TabList,
  Tab,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { IoMdDownload } from "react-icons/io";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import Refresh from "../../../Components/Admin/Refresh";
import Loading from "../../../Components/Loading";
import { capitalizeWords } from "../../../Components/capital";
import { currentDate, currentTime } from "../../../Components/currentDate";
import { initiateCancelOrder } from "../../../Components/Ship";
import { useRouter } from "next/navigation";
const PurchaseAdmin = () => {
  let searchID;
  const orderList = [
    {
      name: "New Orders",
      statusName: "Order received",
    },
    {
      name: "Processing",
      statusName: "processing",
    },
    {
      name: "Packaging",
      statusName: "packaging",
    },
    {
      name: "Shipping",
      statusName: "shipping",
    },
    {
      name: "Delivered",
      statusName: "delivered",
    },
    {
      name: "Cancelled",
      statusName: "cancelled",
    },
  ];
  const [courier, setCourier] = useState({
    courierPartner: "",
    trackingID: "",
  });
  const handleCourier = (e) => {
    const { name, value } = e.target;
    let temp = { ...courier };
    temp[name] = value;
    setCourier(temp);
  };
  const {
    isOpen: isOpenImage,
    onOpen: onOpenImage,
    onClose: onCloseImage,
  } = useDisclosure();
  const {
    isOpen: isOpenShip,
    onOpen: onOpenShip,
    onClose: onCloseShip,
  } = useDisclosure();
  const imageExists = (image_url) => {
    var http = new XMLHttpRequest();

    http.open("HEAD", image_url, false);
    http.send();

    return http.status !== 404;
  };
  const navigate = useRouter();
  const [load, setload] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pageload, setpageload] = useState(false);
  const [status, setStatus] = useState("");
  const [num, setNum] = useState(1);
  const [sku, setSKU] = useState("");
  const [numSKU, setnumSKU] = useState(0);
  const [purchase, setPurchase] = useState([]);
  const [shipdata, setShipdata] = useState({});
  const [sendEmail, setSendEmail] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [searchData, setSearchData] = useState([]);
  const updateCourierDetailsToCustomer = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/email`,
        {
          sendTo: sendEmail[0].user.email,
          subject: `Your courier details for order ID ${sendEmail[0]._id}`,
          body: `Dear ${sendEmail[0].user.name}, This is courier information for order ${sendEmail[0]._id}. Placed on ${sendEmail[0].date} at ${sendEmail[0].time}.Courier By - ${sendEmail[0].status[3].courierPartner} and your tracking ID ${sendEmail[0].status[3].trackingID}. Thank you for choosing us.`,
          attach: false,
          id: sendEmail[0]._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setSendEmail([]);
        toast({
          title: res.data.msg,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((eee) => {
        console.log(eee);
      });
  };
  const sendEmailToCustomer = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/email`,
        {
          sendTo: sendEmail[0].user.email,
          subject: "Your order has been placed",
          body: `Dear ${
            sendEmail[0].user.name
          }, This is confirmation for order ${sendEmail[0]._id}. Placed on ${
            sendEmail[0].date
          } at ${sendEmail[0].time}. Total order value of Rs. ${
            sendEmail[0].price
          } via ${
            sendEmail[0].paymentID === "COD" ? "COD" : "Online Payment"
          }. We will send you courier information after the product is shipped from our end. Thank you for choosing us.`,
          attach: true,
          id: sendEmail[0]._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setSendEmail([]);
        toast({
          title: res.data.msg,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((eee) => {
        console.log(eee);
      });
  };
  const handleEmail = (e, id) => {
    let temp = [...sendEmail];
    if (e.target.checked) {
      temp.push(id);
    } else {
      let newData = temp.filter((res) => res != id);
      temp = newData;
    }
    setSendEmail(temp);
  };
  const token = useSelector((store) => store.auth.token);
  const toast = useToast();
  const refreshPage = () => {
    setRefresh((rev) => !rev);
  };
  const handleImage = (skuID) => {
    setSKU(skuID);
    onOpenImage();
  };
  const handleShipSubmit = () => {
    setload(true);
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let date = d.getDate();
    let fullDate = `${date}/${month}/${year}`;
    let result = shipdata?.stat?.filter((el) => el.status === "shipping");
    let newstatus = shipdata?.stat;
    if (result.length > 0) {
      let newShip = {
        status: "shipping",
        date: fullDate,
        courierPartner: courier.courierPartner,
        trackingID: courier.trackingID,
      };
      newstatus = newstatus.map((el) => {
        if (el.status === "shipping") {
          return newShip;
        } else {
          return el;
        }
      });
    } else {
      newstatus.push({
        status: "shipping",
        date: fullDate,
        courierPartner: courier.courierPartner,
        trackingID: courier.trackingID,
      });
    }
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/update/${shipdata.id}`,
        { status: newstatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (result.length > 0) {
        } else {
          setStatus("shipping");
        }

        toast({
          title: res.data.msg,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setload(false);
        onCloseShip();
        setSendEmail([]);
      });
  };
  const handleCancelOrder = (type, data, id, userData) => {
    if (type == "accept") {
      let trId = transactionIDGenerate();
      if (data.paymentType != "COD") {
        let payload = {
          merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANTID,
          merchantUserId: data.merchantUserId,
          originalTransactionId: data.pruchaseId,
          merchantTransactionId: trId,
          amount: data.price * 100,
          callbackUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/paystatus?trnxID=${trId}`,
        };
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/refund`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {})
          .catch((err) => {
            console.log(err);
          });
      }
    }
    const payload = {
      status: type,
      date: currentDate(),
      time: currentTime(),
    };
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/update/${id}`,
        {
          cancelled: [data, payload],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async () => {
        toast({
          title:
            type == "accept"
              ? "Order Cancel Accepted"
              : "Order Cancel Rejected",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const data = {
          carrier: userData.carrier,
          trackingNumber: userData.trackingNumber,
        };
        await initiateCancelOrder(data);
        refreshPage();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkStatus = (status, pos) => {
    let result = status.filter((el) => el.status === pos);
    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const handleShippingLabel = (data, type) => {
    let path = "";
    if (type == "shipping") {
      path = "downloadInvoice";
    } else {
      path = "downloadCustomerInvoice";
    }
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`, data, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${data._id}.pdf`);
          document.body.appendChild(link);
          link.click();
          toast({
            title: "Downloaded",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleTab = (e) => {
    setSendEmail([]);
    setNum(e + 1);
  };
  const handleSearch = (e) => {
    try {
      let text = e.target.value;
      setSearchBarText(text);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    clearTimeout(searchID);
    searchID = setTimeout(() => {
      if (searchBarText !== "") {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/search?search=${searchBarText}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setSearchData(res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setSearchData([]);
      }
    }, 500);
  }, [searchBarText]);
  useEffect(() => {
    setpageload(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let sortData = res.data.data.sort((a, b) => {
          const dateA = new Date(
            parseInt(a.date.split("/")[2]),
            parseInt(a.date.split("/")[1]),
            parseInt(a.date.split("/")[0])
          );

          const dateB = new Date(
            parseInt(b.date.split("/")[2]),
            parseInt(b.date.split("/")[1]),
            parseInt(b.date.split("/")[0])
          );

          return dateB - dateA;
        });
        setPurchase(sortData);
        setpageload(false);
      });
  }, [status, refresh, num]);
  const setShipAgain = () => {
    setShipdata({ id: sendEmail[0]._id, stat: sendEmail[0].status });
    onOpenShip();
  };
  const transactionIDGenerate = () => {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxxxxxx4xxxyxxx".replace(/[xy]/g, (c) => {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return `RORCG${uuid.toUpperCase()}`;
  };
  const handleStatus = (e, id, stat, el) => {
    if (e.target.value === "shipping") {
      onOpenShip();
      setShipdata({ id, stat });
      setCourier({ courierPartner: el.carrier, trackingID: el.trackingNumber });
    } else {
      setload(true);
      const d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let date = d.getDate();
      let fullDate = `${date}/${month}/${year}`;
      let result = stat.filter((el) => el.status === e.target.value);
      if (result > 0) {
        toast({
          title: "Status already exist",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        stat.push({ status: e.target.value, date: fullDate });

        axios
          .patch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/update/${id}`,
            { status: stat },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setStatus(e.target.value);
            toast({
              title: res.data.msg,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            setload(false);
          });
      }
    }
  };
  if (pageload) {
    return <Loading load={pageload} />;
  }
  const images = [
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${sku}-1.jpg`,
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${sku}-2.jpg`,
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${sku}-3.jpg`,
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${sku}-4.jpg`,
  ];
  return (
    <Dashboard>
      <Modal isOpen={isOpenShip} onClose={onCloseShip}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Courier Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Courier Partner</FormLabel>
            <Select
              mb={"10px"}
              border={"1px solid gray"}
              name="courierPartner"
              value={courier.courierPartner}
              onChange={(e) => handleCourier(e)}
              isDisabled={num == 3}
            >
              <option hidden>Select Courier Partner</option>
              <option value={"delhivery"}>DELHIVERY</option>
              <option value={"ecomExpress"}>ECOM EXPRESS</option>
              <option value={"xpressBees"}>EXPRESSBESS</option>
            </Select>
            <FormLabel>Tracking ID</FormLabel>
            <Input
              isDisabled={num == 3}
              value={courier.trackingID}
              border={"1px solid gray"}
              name="trackingID"
              onChange={(e) => handleCourier(e)}
              placeholder="Enter Tracking ID"
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onCloseShip}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleShipSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenImage} onClose={onCloseImage} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {sku}-{numSKU + 1}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={"10px"} justifyContent={"cenetr"} alignItems={"center"}>
              <Button
                p={"0px 30px"}
                onClick={() => {
                  numSKU === 0 ? setnumSKU(3) : setnumSKU((rev) => rev - 1);
                }}
              >
                <GrPrevious />
              </Button>
              {imageExists(images[numSKU]) === false ? (
                <></>
              ) : (
                <Box>
                  <Image h={"450px"} src={images[numSKU]} />
                </Box>
              )}
              <Button
                p={"0px 30px"}
                onClick={() => {
                  numSKU === 3 ? setnumSKU(0) : setnumSKU((rev) => rev + 1);
                }}
              >
                <GrNext />
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box h={"70px"}>
        <Flex justifyContent={"center"} alignItems={"center"}>
          <Center>
            <Input
              variant={"unstyled"}
              textIndent={"7px"}
              value={searchBarText}
              placeholder="Enter Order ID to search"
              w={"700px"}
              mt={"15px"}
              p={"5px"}
              onChange={(e) => handleSearch(e)}
              shadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
            />
            <Box position={"relative"} ml={"-30px"} mt={"17px"}>
              <Center>
                <FiSearch />
              </Center>
            </Box>
          </Center>
        </Flex>
      </Box>
      <Center>
        <Box
          overflow={"scroll"}
          overflowX={"hidden"}
          ml={"10px"}
          w={"700px"}
          position={"fixed"}
          top={"20%"}
          zIndex={"99999"}
          bgColor={"white"}
          borderRadius={"7px"}
          sx={{
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
          h={"300px"}
          hidden={searchData.length <= 0 || searchBarText == ""}
        >
          {searchData?.map((ele, i) => {
            return (
              <Box
                key={i}
                mb={"10px"}
                p={"5px"}
                cursor={"pointer"}
                onClick={() => navigate.push(`/admin/orders/single/${ele._id}`)}
              >
                <Center>
                  <Text fontSize={"14px"}>
                    {ele._id}({ele._date})
                  </Text>
                </Center>
              </Box>
            );
          })}
        </Box>
      </Center>
      <Flex mb={"10px"} justifyContent={"space-between"}>
        <Refresh refresh={refreshPage} />
        <Flex gap={"7px"} direction={["column", "column", "row", "row"]}>
          <Button
            onClick={updateCourierDetailsToCustomer}
            hidden={num !== 4}
            _hover={{ bgColor: "blue.300" }}
            variant={"unstyled"}
            fontSize={"12px"}
            padding={"10px"}
            bgColor={"blue.300"}
            color={"white"}
            isDisabled={sendEmail.length !== 1}
          >
            Send Courier Details to Customer
          </Button>
          <Button
            fontSize={"12px"}
            onClick={sendEmailToCustomer}
            _hover={{ bgColor: "blue.300" }}
            variant={"unstyled"}
            padding={"10px"}
            bgColor={"blue.300"}
            color={"white"}
            hidden={num == 6}
            isDisabled={sendEmail.length !== 1}
          >
            Send Invoice to Customer
          </Button>
          <Button
            fontSize={"12px"}
            hidden={num !== 4}
            _hover={{ bgColor: "blue.300" }}
            onClick={setShipAgain}
            variant={"unstyled"}
            padding={"10px"}
            bgColor={"blue.300"}
            color={"white"}
            isDisabled={sendEmail.length !== 1}
          >
            update Shipping Information
          </Button>
        </Flex>
      </Flex>
      <Tabs
        defaultIndex={num === 0 ? num : num - 1}
        position="relative"
        variant="unstyled"
        onChange={(e) => handleTab(e)}
      >
        <TabList>
          {orderList.map((el) => {
            return <Tab>{el.name}</Tab>;
          })}
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels>
          {orderList.map((ele) => {
            let temp = [...purchase];
            let newData;
            if (num === 6) {
              newData = temp.filter(
                (el) =>
                  el.cancelled.length === 1 ||
                  el.cancelled[el.cancelled.length - 1]?.status == "accept"
              );
            } else {
              newData = temp.filter(
                (el) =>
                  el.status.length === num &&
                  (el.cancelled.length === 0 ||
                    el.cancelled[el.cancelled.length - 1]?.status == "reject")
              );
            }

            let sortData = newData.sort((a, b) => {
              const dateA = new Date(
                parseInt(a.date.split("/")[2]),
                parseInt(a.date.split("/")[1]),
                parseInt(a.date.split("/")[0])
              );

              const dateB = new Date(
                parseInt(b.date.split("/")[2]),
                parseInt(b.date.split("/")[1]),
                parseInt(b.date.split("/")[0])
              );

              return dateB - dateA;
            });
            return (
              <TabPanel>
                <Box
                  overflow={"scroll"}
                  overflowX="hidden"
                  sx={{
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                  // overflowY="hidden"
                  maxWidth={window.innerWidth}
                  maxHeight={window.innerHeight - 120}
                >
                  <TableContainer>
                    <Table
                      variant="striped"
                      colorScheme="teal"
                      style={{ borderCollapse: "collapse" }}
                    >
                      <Thead bgColor={"gray.200"}>
                        <Tr>
                          <Th style={{ padding: "0.5rem" }}>
                            <Center>Image</Center>
                          </Th>
                          <Th style={{ padding: "0.5rem" }}>
                            <Center>Order Date</Center>
                          </Th>
                          <Th style={{ padding: "0.5rem" }}>
                            <Center>Order ID</Center>
                          </Th>
                          <Th style={{ padding: "0.5rem" }}>
                            <Center>SKU ID</Center>
                          </Th>
                          <Th style={{ padding: "0.5rem" }}>
                            <Center>Quantity</Center>
                          </Th>
                          <Th style={{ padding: "0.5rem" }}>
                            <Center>Payment Type</Center>
                          </Th>
                          <Th style={{ padding: "0.5rem" }}>
                            <Center>Status</Center>
                          </Th>
                          <Th style={{ padding: "0.5rem" }} hidden={num >= 6}>
                            <Center>Change Status</Center>
                          </Th>
                          {num === 4 ? (
                            <Th style={{ padding: "0.5rem" }}>
                              <Center>Delivery Partner</Center>
                            </Th>
                          ) : null}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {sortData?.map((el, i) => {
                          const products = el.products;
                          return (
                            <>
                              {products.map((prod, j) => {
                                return (
                                  <Tr>
                                    <Td style={{ padding: "0.5rem" }}>
                                      <Flex
                                        gap={"4px"}
                                        ml={el.cancelled ? "30px" : ""}
                                      >
                                        <Center>
                                          <Checkbox
                                            hidden={num == 6}
                                            onChange={(e) => {
                                              handleEmail(e, el);
                                            }}
                                            border={"0px solid black"}
                                          />
                                        </Center>
                                        <Box
                                          onClick={() =>
                                            handleImage(prod.skuID)
                                          }
                                          cursor={"pointer"}
                                        >
                                          <Image
                                            h={"50px"}
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image?name=${prod.skuID}-1.jpg`}
                                          />
                                        </Box>
                                      </Flex>
                                    </Td>
                                    <Td style={{ padding: "0.5rem" }}>
                                      <Text>{el.date}</Text>
                                    </Td>
                                    <Td
                                      style={{
                                        padding: "0.5rem",
                                        width: "100px",
                                      }}
                                    >
                                      <Textarea
                                        color={"blue"}
                                        textDecoration={"underline"}
                                        onClick={() =>
                                          navigate.push(
                                            `/admin/orders/single/${el._id}`
                                          )
                                        }
                                        cursor={"pointer"}
                                        ml={
                                          el.cancelled.length > 0 ? "30px" : ""
                                        }
                                        border={"none"}
                                        resize={"none"}
                                        readOnly
                                        w={"150px"}
                                      >
                                        {el._id}
                                      </Textarea>
                                    </Td>
                                    <Td
                                      style={{
                                        padding: "0.5rem",
                                        width: "100px",
                                      }}
                                    >
                                      <Textarea
                                        ml={
                                          el.cancelled.length > 0 ? "30px" : ""
                                        }
                                        border={"none"}
                                        resize={"none"}
                                        readOnly
                                        w={"150px"}
                                      >
                                        {prod.skuID}
                                      </Textarea>
                                    </Td>
                                    <Td style={{ padding: "0.5rem" }}>
                                      <Center
                                        ml={
                                          el.cancelled.length > 0 ? "30px" : ""
                                        }
                                      >
                                        <Text>{prod.quantity}</Text>
                                      </Center>
                                    </Td>
                                    <Td style={{ padding: "0.5rem" }}>
                                      <Center
                                        ml={
                                          el.cancelled.length > 0 ? "30px" : ""
                                        }
                                      >
                                        <Text>
                                          {el.paymentID === "COD"
                                            ? "COD"
                                            : "Online"}
                                        </Text>
                                      </Center>
                                    </Td>
                                    <Td style={{ padding: "0.5rem" }}>
                                      {el.cancelled.length == 1 ? (
                                        <Flex direction={"column"} gap={"5px"}>
                                          <Button
                                            onClick={() =>
                                              handleCancelOrder(
                                                "accept",
                                                el.cancelled[0],
                                                el._id,
                                                el
                                              )
                                            }
                                            colorScheme="blue"
                                          >
                                            Accept
                                          </Button>
                                          <Button
                                            onClick={() =>
                                              handleCancelOrder(
                                                "reject",
                                                el.cancelled[0],
                                                el._id,
                                                el
                                              )
                                            }
                                            colorScheme="red"
                                          >
                                            Reject
                                          </Button>
                                        </Flex>
                                      ) : el.cancelled.length >= 1 ? (
                                        <Text
                                          color={
                                            el.cancelled[
                                              el.cancelled.length - 1
                                            ]?.status == "accept"
                                              ? "green"
                                              : "red"
                                          }
                                        >
                                          {capitalizeWords(
                                            el.cancelled[
                                              el.cancelled.length - 1
                                            ]?.status
                                          )}
                                        </Text>
                                      ) : (
                                        <Text
                                          ml={
                                            el.cancelled.length == 1 &&
                                            el.cancelled[
                                              el.cancelled.length - 1
                                            ].status == "accept"
                                              ? "30px"
                                              : ""
                                          }
                                        >
                                          {el.cancelled.length == 1 &&
                                          el.cancelled[el.cancelled.length - 1]
                                            .status == "accept" &&
                                          j == 0
                                            ? "Cancelled"
                                            : el.cancelled.length == 1 &&
                                              el.cancelled[
                                                el.cancelled.length - 1
                                              ].status == "accept" &&
                                              j != 0
                                            ? "Same Order"
                                            : el.status[el.status.length - 1]
                                                .status}
                                        </Text>
                                      )}
                                    </Td>
                                    <Td
                                      style={{ padding: "0.5rem" }}
                                      hidden={num >= 6}
                                    >
                                      {j === 0 ? (
                                        <Flex gap={"10px"} direction={"column"}>
                                          <Select
                                            isDisabled={
                                              load ||
                                              checkStatus(
                                                el.status,
                                                "delivered"
                                              )
                                            }
                                            onChange={(e) =>
                                              handleStatus(
                                                e,
                                                el._id,
                                                el.status,
                                                el
                                              )
                                            }
                                          >
                                            <option hidden>
                                              {checkStatus(
                                                el.status,
                                                "delivered"
                                              )
                                                ? "Delivered"
                                                : "Update Status"}
                                            </option>
                                            <option
                                              hidden={
                                                checkStatus(
                                                  el.status,
                                                  "processing"
                                                )
                                                  ? "hidden"
                                                  : ""
                                              }
                                              value={"processing"}
                                            >
                                              Processing
                                            </option>
                                            <option
                                              hidden={
                                                checkStatus(
                                                  el.status,
                                                  "packaging"
                                                ) || num !== 2
                                                  ? "hidden"
                                                  : ""
                                              }
                                              value={"packaging"}
                                            >
                                              Packaging
                                            </option>
                                            <option
                                              hidden={
                                                checkStatus(
                                                  el.status,
                                                  "shipping"
                                                ) || num !== 3
                                                  ? "hidden"
                                                  : ""
                                              }
                                              value={"shipping"}
                                            >
                                              Shipping
                                            </option>
                                            <option
                                              hidden={
                                                checkStatus(
                                                  el.status,
                                                  "delivered"
                                                ) || num !== 4
                                                  ? "hidden"
                                                  : ""
                                              }
                                              value={"delivered"}
                                            >
                                              Delivered
                                            </option>
                                          </Select>
                                          <Flex
                                            gap={"5px"}
                                            p={"5px 10px"}
                                            fontSize={"14px"}
                                            pl={"20px"}
                                            hidden={
                                              el.status.length < 4 || num !== 4
                                            }
                                            cursor={"pointer"}
                                            onClick={() =>
                                              handleShippingLabel(
                                                el,
                                                "shipping"
                                              )
                                            }
                                          >
                                            <Center>
                                              <IoMdDownload />
                                            </Center>
                                            <Text>SHIPPING LABEL</Text>
                                          </Flex>
                                          <Flex
                                            gap={"5px"}
                                            p={"5px 10px"}
                                            fontSize={"14px"}
                                            pl={"20px"}
                                            cursor={"pointer"}
                                            onClick={() =>
                                              handleShippingLabel(
                                                el,
                                                "customer"
                                              )
                                            }
                                          >
                                            <Center>
                                              <IoMdDownload />
                                            </Center>{" "}
                                            <Text>INVOICE</Text>
                                          </Flex>
                                        </Flex>
                                      ) : (
                                        <Center>
                                          <Text>Same Order</Text>
                                        </Center>
                                      )}
                                    </Td>
                                    {num === 4 ? (
                                      <Td>{el.status[3].courierPartner}</Td>
                                    ) : null}
                                  </Tr>
                                );
                              })}
                            </>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </Dashboard>
  );
};

export default PurchaseAdmin;