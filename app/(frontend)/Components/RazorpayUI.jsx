import {
  Button,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  useDisclosure,
  Flex,
  Image,
} from "@chakra-ui/react";
import online from "../Resources/online.png";
import cod from "../Resources/cod.png";
import React from "react";
import swal from "sweetalert";
import RCG_logo from "../Resources/RCG_logo.png";
import { useDispatch, useSelector } from "react-redux";
import { userUpdate } from "../Redux/AuthReducer/Action";
import axios from "axios";
import { useRouter } from "next/navigation";
const RazorpayUI = ({ price, ship, products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useRouter();
  const disablePayment = () => {
    toast({
      title: "Payment is not available yet",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };
  const transactionIDGenerate = () => {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxxxxxx4xxxyxxx".replace(/[xy]/g, (c) => {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return `RCG${uuid.toUpperCase()}`;
  };
  const token = useSelector((store) => store.auth.token);
  const toast = useToast();
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const handleOnline = () => {
    let payload = {
      shippingAddress: ship,
    };
    dispatch(userUpdate(payload, token, toast));
    const trID = transactionIDGenerate();
    const pload = {
      merchantId: `${process.env.NEXT_PUBLIC_PHONEPE_MERCHANTID}`,
      merchantTransactionId: trID,
      merchantUserId: user._id,
      amount: Number(price * 100).toFixed(0),
      redirectUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/ordersuccess/${trID}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/paystatus?trnxID=${trID}`,
      mobileNumber: ship.phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/pay`, pload)
      .then((res) => {
        window.open(res.data.response.data.instrumentResponse.redirectInfo.url);
      })
      .catch((err) => {
        console.log(err.response.data.msg.message);
        toast({
          title: "Error in payment gateway",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };
  const handleCOD = () => {
    let payload = {
      shippingAddress: ship,
    };
    dispatch(userUpdate(payload, token, toast));
    setTimeout(() => {
      navigate.push(`/ordersuccess`);
    }, 2000);
  };

  const handlePayment = () => {
    if (
      ship.fname === "" ||
      ship.address === "" ||
      ship.lname === "" ||
      ship.phone === "" ||
      ship.postalCode === "" ||
      ship.state === "" ||
      ship.city === ""
    ) {
      toast({
        title: "Shipping data is missing",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      onOpen();
    }
  };
  return (
    <Box>
      <Modal
        size={"sm"}
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose Payment Method</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justifyContent={"space-between"}>
              <Box
                onClick={handleCOD}
                // onClick={disablePayment}
                cursor={"pointer"}
                borderRight={"2px solid gray"}
                pr={"14px"}
              >
                <Image h={"150px"} src={cod.src} />
              </Box>
              <Box
                onClick={handleOnline}
                // onClick={disablePayment}
                cursor={"pointer"}
              >
                <Image h={"150px"} src={online.src} />
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        variant={"unstyled"}
        bgColor={"Highlight"}
        mt={"10px"}
        color={"white"}
        w={"full"}
        onClick={() => handlePayment()}
      >
        Proceed to Payment
      </Button>
      {ship.fname === "" ||
      ship.address === "" ||
      ship.lname === "" ||
      ship.phone === "" ||
      ship.postalCode === "" ||
      ship.state === "" ||
      ship.city === "" ? (
        <Text color={"red"} mt={"10px"}>
          * Shipping Information is missing
        </Text>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default RazorpayUI;
