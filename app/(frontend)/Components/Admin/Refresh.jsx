import { Box, Button, Center, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiRefresh } from "react-icons/bi";
const Refresh = ({ refresh }) => {
  const [rotationDegree, setRotationDegree] = useState(0);

  const rotateIcon = () => {
    setRotationDegree(rotationDegree + 360);
  };
  const update = () => {
    rotateIcon();
    setTimeout(() => {
      refresh();
    }, 2000);
  };
  return (
    <Center mt={"5px"}>
      <Button
        mt={"5px"}
        shadow={"rgba(0, 0, 0, 0.40) 0px 2px 5px"}
        h={"30px"}
        borderRadius={"10px"}
        onClick={update}
        fontSize={"13px"}
        letterSpacing={"1px"}
        p={"7px"}
      >
        <Center>
          <Box>Refresh</Box>
        </Center>
        <Center
          transform={`rotate(${rotationDegree}deg)`}
          transition={"transform 2s ease"}
        >
          <BiRefresh />
        </Center>
      </Button>
    </Center>
  );
};

export default Refresh;
