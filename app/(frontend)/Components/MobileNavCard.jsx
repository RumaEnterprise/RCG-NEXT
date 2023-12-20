import { Center, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const MobileNavCard = ({ link, icon:Icon, text, close, seperator = true }) => {
  return (
    <Link href={link}>
      <Flex
        p={"10px"}
        pl={"17px"}
        color={"white"}
        borderBottom={seperator ? "1px solid white" : ""}
        fontSize={"14px"}
        cursor={"pointer"}
        onClick={close}
        marginBottom={2}
        textAlign={"left"}
        gap={"17px"} 
      >
        <Center fontSize={"17px"}>{Icon !== undefined ? <Icon /> : null}</Center>
        <Text>{text}</Text>
      </Flex>
    </Link>
  );
};

export default MobileNavCard;
