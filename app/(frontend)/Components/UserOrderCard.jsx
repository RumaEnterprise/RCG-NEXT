import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { getPurchase, singleOrder } from "../Redux/AppReducer/Action";
import { useDispatch, useSelector } from "react-redux";
import { currentDate, currentTime } from "./currentDate";
import Loading from "./Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
const UserOrderCard = ({ el }) => {
  const returnRef = useRef();
  const [returnProduct, setReturnProduct] = useState({});
  const [oldReturn, setOldReturn] = useState([]);
  const [load, setLoad] = useState(false);
  const onreturnopen = (data) => {
    setReturnProduct(data);
    onReturnOpen();
  };
  const onreturnexit = () => {
    setReturnProduct({});
    onReturnClose();
  };
  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onClose: onCancelClose,
  } = useDisclosure();
  const {
    isOpen: isReturnOpen,
    onOpen: onReturnOpen,
    onClose: onReturnClose,
  } = useDisclosure();
  const [cancelOrder, setCancelOrder] = useState({});
  const navigate = useRouter();
  const token = useSelector((store) => store.auth.token);
  const toast = useToast();
  const dispatch = useDispatch();
  const handleSingleOrder = (product) => {
    dispatch(singleOrder(product));
    navigate.push("/orderDetails");
  };
  const openCancelAlert = (ele) => {
    onCancelOpen();
    setCancelOrder(ele);
  };
  const closeCancelAlert = () => {
    setCancelOrder({});
    onCancelClose();
  };
  const handleCancelOrder = (el) => {
    const payload={
      status:"Requested",
      date:currentDate(),
      time:currentTime(),
      paymentType:el.paymentID!=="COD"?"online":"COD",
      merchantUserId:el.user._id,
      pruchaseId:el.trnxID||"",
      amount:el.price
    }
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/purchase/update/${el._id}`,
        {
          cancelled: [payload],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        dispatch(getPurchase(token));
        toast({
          title: "Order Cancel Requested",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err)=>{
        console.log(err)
      })
  };
  function isTodaySameAsGivenDatePlusTwoDays(dateString, increase) {
    dateString = dateString.split("/");
    const temp = dateString[0];
    dateString[0] = dateString[1];
    dateString[1] = temp;
    dateString = dateString.join("/");
    const inputDate = new Date(dateString);
    if (isNaN(inputDate)) {
      throw new Error("Invalid date format");
    }
    const today = new Date();
    inputDate.setDate(inputDate.getDate() + increase);
    return (
      inputDate.getDate() === today.getDate() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getFullYear() === today.getFullYear()
    );
  }
  const handleShippingLabel = (data) => {
    try {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/downloadCustomerInvoice`,
          data,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
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
  const returnSubmit = () => {
    const payload = {
      cartID: returnProduct,
      reason: returnRef.current.value,
      date: currentDate(),
      time: currentTime(),
    };
    try {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/return/create`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          dispatch(getPurchase(token));
          toast({
            title: res.data.msg,
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: err.response.data.msg,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setLoad(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/return/single/${el._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoad(false);
        setOldReturn(res.data.data);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      });
  }, []);
  const check24HoursPassed = (inputDateTime) => {
    // Convert the input date-time to a Date object
    inputDateTime = inputDateTime.split("/");
    let temp = inputDateTime[0];
    inputDateTime[0] = inputDateTime[1];
    inputDateTime[1] = temp;
    inputDateTime = inputDateTime.join("/");
    const inputDate = new Date(inputDateTime);

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - inputDate;

    // Check if 24 hours have passed
    const hoursInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (timeDifference >= hoursInMilliseconds) {
      return true;
    } else {
      return false;
    }
  };
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let options = [
    {
      name: "Track Package",
      link: "/orders/track",
    },
    {
      name: "Cancel Order",
      link: "",
    },
    {
      name: "View Order",
      link: "/orders/single",
    },
  ];
  let date = el.date.split("/");
  let tempdate = `${months[date[1] - 1]} ${date[0]}, ${date[2]}`;
  if (load) {
    return <Loading load={load} />;
  }
  return (
    <Box mt={"30px"} border={"1px solid #c0ccc5"} borderRadius={"10px"}>
      <AlertDialog isCentered isOpen={isCancelOpen} onClose={closeCancelAlert}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel Order
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => handleCancelOrder(cancelOrder)}>
                Yes
              </Button>
              <Button onClick={closeCancelAlert} ml={3}>
                No
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal
        closeOnOverlayClick={false}
        isCentered
        isOpen={isReturnOpen}
        onClose={onreturnexit}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reason to return product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              ref={returnRef}
              placeholder="Type Here"
              minH={"150px"}
              resize={"none"}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" onClick={() => returnSubmit()}>
              Process Return
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex
        direction={["column", "column", "column", "row"]}
        justifyContent={"space-between"}
        bgColor={"#c0ccc5"}
        p={"10px"}
        gap={["20px", "20px", "20px", "10px"]}
        borderTopLeftRadius={"10px"}
        borderTopRightRadius={"10px"}
      >
        <Flex
          gap={["10px", "10px", "10px", "50px"]}
          direction={["column", "column", "column", "row"]}
        >
          <Flex
            direction={["row", "row", "row", "column"]}
            justifyContent={"space-between"}
          >
            <Text fontWeight={"bold"}>ORDER PLACED</Text>
            <Text>{tempdate}</Text>
          </Flex>
          <Flex
            direction={["row", "row", "row", "column"]}
            justifyContent={"space-between"}
          >
            <Text fontWeight={"bold"}>TOTAL</Text>
            <Text textAlign={"left"}>
              Rs. {el.price.toFixed(2)}(
              {el.paymentID === "COD" ? "COD" : "PREPAID"})
            </Text>
          </Flex>
          <Flex
            direction={["row", "row", "row", "column"]}
            justifyContent={"space-between"}
          >
            <Text fontWeight={"bold"}>SHIP TO</Text>
            <Text textAlign={"left"}>
              {el.user.shippingAddress.address}, {el.user.shippingAddress.city}{" "}
              - {el.user.shippingAddress.postalCode},{" "}
              {el.user.shippingAddress.state}
            </Text>
          </Flex>
        </Flex>
        <Flex
          direction={["column", "column", "row", "column"]}
          justifyContent={"space-between"}
        >
          <Flex gap={"10px"}>
            <Text>ORDER ID</Text>
            <Text fontWeight={"bold"} letterSpacing={"1px"} color={"green"}>
              {el._id}
            </Text>
          </Flex>
          <Flex gap={"10px"} justifyContent={["", "", "end", "end"]}>
            <Text
              _hover={{ color: "blue" }}
              cursor={"pointer"}
              onClick={() => handleSingleOrder(el)}
            >
              View order details
            </Text>
            <Box borderLeft={"2px solid gray"}></Box>
            <Text
              _hover={{ color: "blue" }}
              cursor={"pointer"}
              onClick={() => handleShippingLabel(el)}
            >
              Invoice
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        p={"10px"}
        justifyContent={"space-between"}
        direction={["column", "column", "row", "row"]}
      >
        <Box>
          <Text
            p={"10px"}
            fontWeight={"bold"}
            fontSize={"20px"}
            color={
              oldReturn.length > 0 && oldReturn[0].status == "pending"
                ? "orange"
                : oldReturn.length > 0 && oldReturn[0].status == "process"
                ? "orange"
                : oldReturn.length > 0 && oldReturn[0].status == "accept"
                ? "green"
                : oldReturn.length > 0 && oldReturn[0].status == "reject"
                ? "red"
                : el.cancelled.length == 1
                ? "orange"
                : el.cancelled[el.cancelled.length - 1]?.status == "accept"
                ? "red"
                : el.status.length <= 4
                ? "black"
                : "green"
            }
          >
            {oldReturn.length > 0 && oldReturn[0].status == "pending"
              ? "Waiting to approve return"
              : oldReturn.length > 0 && oldReturn[0].status == "process"
              ? "Return in process"
              : oldReturn.length > 0 && oldReturn[0].status == "accept"
              ? "Return Accepted"
              : oldReturn.length > 0 && oldReturn[0].status == "reject"
              ? "Return Rejected"
              : el.cancelled.length == 1
              ? "Cancel in process"
              : el.cancelled[el.cancelled.length - 1]?.status == "accept"
              ? "Cancelled"
              : el.status.length <= 4
              ? "Arriving Soon"
              : "Delivered"}
          </Text>
          <Flex>
            <Image
              h={"100px"}
              src={`${process.env.REACT_APP_BACKEND_URL}/image?name=${el.products[0].skuID}-1.jpg`}
            />
            <Center>
              <Text>{el.products[0].title}</Text>
            </Center>
          </Flex>
          {el.products.length > 1 ? (
            <Text color={"green"} fontWeight={"600"}>
              +{el.products.length - 1} Items more
            </Text>
          ) : null}
        </Box>
        <Box w={["100%", "100%", "25%", "25%"]}>
          <Flex
            fontSize={"16px"}
            direction={["row", "row", "column", "column"]}
            justifyContent={"space-between"}
            h={"80%"}
          >
            {options.map((ele, i) => {
              if (ele.name === "Cancel Order") {
                if (el.status.length >= 5) {
                  let hide = isTodaySameAsGivenDatePlusTwoDays(
                    el.status[4].date,
                    2
                  );
                  if (
                    oldReturn[0]?.status == "pending" ||
                    oldReturn.length >= 1
                  ) {
                    hide = true;
                  }
                  return (
                    <Box
                      key={i}
                      onClick={() => onreturnopen(el._id)}
                      cursor={"pointer"}
                      fontWeight={"bold"}
                      hidden={hide}
                      borderRadius={"10px"}
                      _hover={{
                        bgColor: "blue.800",
                        border: "none",
                        color: "white",
                      }}
                      border={"1px solid gray"}
                      p={"5px"}
                    >
                      <Center>Return</Center>
                    </Box>
                  );
                }
                return (
                  <Box
                    key={i}
                    onClick={() => openCancelAlert(el)}
                    cursor={"pointer"}
                    fontWeight={"bold"}
                    hidden={
                      check24HoursPassed(`${el.date} ${el.time}`) ||
                      el.cancelled.length == 1 ||
                      el.cancelled[el.cancelled.length - 1]?.status ==
                        "accept" ||
                      el.status.length > 2
                    }
                    borderRadius={"10px"}
                    _hover={{
                      bgColor: "blue.800",
                      border: "none",
                      color: "white",
                    }}
                    border={"1px solid gray"}
                    p={"5px"}
                  >
                    <Center>{ele.name}</Center>
                  </Box>
                );
              } else {
                return (
                  <Link href={`${ele.link}/${el._id}`||""} key={i}>
                    <Box
                      p={"5px"}
                      cursor={"pointer"}
                      fontWeight={"bold"}
                      borderRadius={"10px"}
                      _hover={{
                        bgColor: "blue.800",
                        border: "none",
                        color: "white",
                      }}
                      border={"1px solid gray"}
                    >
                      <Center>{ele.name}</Center>
                    </Box>
                  </Link>
                );
              }
            })}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserOrderCard;
