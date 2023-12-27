import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React from "react";
const CustomAlert = ({
  isUserAddAlertOpen,
  onUserAddAlertClose,
  heading,
  btnbgColor,
  btnName,
  btnCall,
}) => {
  return (
    <AlertDialog
    onOverlayClick={false}
      isOpen={isUserAddAlertOpen}
      onClose={onUserAddAlertClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {heading}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can not undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onUserAddAlertClose}>Cancel</Button>
            <Button colorScheme={btnbgColor} onClick={btnCall} ml={3}>
              {btnName}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CustomAlert;
