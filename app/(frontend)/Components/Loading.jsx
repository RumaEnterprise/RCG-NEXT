"use client";
import { Box, Center, CircularProgress,Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Flex, } from '@chakra-ui/react'
import React, { useEffect } from 'react'

const Loading = ({load}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    useEffect(()=>{
        if(load){
            onOpen();
        }
        else{
            onClose();
        }
    },[load])
  return (
    <Box pointerEvents={"none"}>
        <Modal isCentered size={"full"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent  bgColor={"rgba(0, 0, 0, 0.5)"}> 
          <ModalBody>
          <Flex justifyContent="center" alignItems="center" h={window.innerHeight-50}>
              <CircularProgress isIndeterminate color="green.300" />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Loading