import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react';
import star from "../Resources/star.png";
import { capitalizeWords } from './capital';
const ReviewCard = ({data}) => {
  const {username,rate,title,review}=data;
  return (
    <Box>
            
            <Flex gap={"5px"} mt={"10px"}>
              <Box
                p={"5px"}
                bgColor={"green"}
                color={"white"}
                h={"27px"}
                w={"50px"}
                borderRadius={"5px"}
              >
                <Flex gap={"4px"}>
                  <Text fontSize={"12px"} textAlign={"left"}>
                    {rate.toFixed(1)}
                  </Text>
                  <Image h={"15px"} src={star} />
                </Flex>
              </Box>
              <Box fontWeight={"600"}>{title}</Box>
            </Flex>
            <Text mb={"10px"} fontSize={"15px"} mt={"5px"}>
              {review}
            </Text>
            {/* <Flex gap={"5px"}>
              <Image
                border={"1px solid gray"}
                h={["50px", "50px", "70px", "100px"]}
                src={Tie2}
              />
              <Image
                border={"1px solid gray"}
                h={["50px", "50px", "70px", "100px"]}
                src={Tie2}
              />
              <Image
                border={"1px solid gray"}
                h={["50px", "50px", "70px", "100px"]}
                src={Tie2}
              />
              <Image
                border={"1px solid gray"}
                h={["50px", "50px", "70px", "100px"]}
                src={Tie2}
              />
            </Flex> */}
            <Text
              mt={"10px"}
              fw={"500"}
              fontSize={"14px"}
              fontFamily={"sans-serif,roboto,arial"}
              color={"#878787"}
            >
              Review By {capitalizeWords(username)}
            </Text>
          </Box>
  )
}

export default ReviewCard