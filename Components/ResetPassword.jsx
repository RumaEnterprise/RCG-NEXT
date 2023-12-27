"use client";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  Flex,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

const ResetPassword = ({ onPasswordResetClose, isPasswordResetOpen }) => {
  const [resetEmail, setResetEmail] = useState("");
  const toast=useToast();
  const [check, setCheck] = useState(true);
  const [load, setLoad] = useState(false);
  const emailValidation = new RegExp("[a-z0-9]+@[a-z]+\\.(com|in)");
  const handleCheckEmail = (e) => {
    const email = e.target.value;
    if (email == "") {
      setCheck(true);
    } else if (emailValidation.test(email) === false) {
      setCheck(false);
    } else {
      setCheck(true);
    }
    setResetEmail(email);
  };
  const submitResetLink = () => {
    setLoad(true)
    const data = {
      email: resetEmail,
    };
    const emailPayload = {
      sendTo: resetEmail,
      subject: "Password Reset Request for Rarecombee - Action Required",
      text: `
Dear User,

We recently received a request to reset the password associated with your account at RareCombee. We understand that forgetting passwords can happen to anyone, and we're here to assist you in regaining access to your account.

To initiate the password reset process, please follow the instructions below:

You can directly access the password reset page by clicking on the following link:`,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-your-password?token=`,
      outro: `this reset link will be valid only for 10 minutes.
Once you're on the password reset page, please make sure to choose a strong and unique password to ensure the security of your account.

If you did not initiate this password reset request, or if you have any concerns regarding the security of your account, please contact our customer support team immediately at 033-26511022 or admin@rarecombee.com. We will assist you in resolving any issues promptly.

Thank you for your cooperation in this matter. We apologize for any inconvenience caused and appreciate your trust in our services.

Best regards,
 
RareCombee Team`,
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token`, {
        user: data,
        email: emailPayload,
        username: true,
      })
      .then((res) => {
        toast({
            title: "Password Reset Requested",
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          onPasswordResetClose();
          setLoad(false);
      })
      .catch((err)=>{
        console.log(err);
        toast({
            title: err.response.data.msg,
            status: 'error',
            duration: 2000,
            isClosable: true,
          })
          setLoad(false);
      })
  };
  return (
    <Box>
      <Modal
        isCentered
        isOpen={isPasswordResetOpen}
        onClose={onPasswordResetClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              onChange={(e) => handleCheckEmail(e)}
              placeholder="Enter Registered E-mail ID"
            />
            <Text
              hidden={check}
              mt={"10px"}
              color={"red"}
              fontSize={"13px"}
              fontWeight={"500"}
            >
              * Enter a valid E-mail ID
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
            isLoading={load}
              isDisabled={!check || resetEmail == ""}
              colorScheme="blue"
              mr={3}
              onClick={submitResetLink}
            >
              Send Reset Link
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export { ResetPassword };
