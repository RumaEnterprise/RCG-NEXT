import { Box } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import UserOrderCard from "./UserOrderCard";

const UserCancel = () => {
  const purchase = useSelector((store) => store.app.purchase);
  let cancelProduct = purchase.filter(({ cancelled }) => cancelled.length==1 || cancelled[cancelled.length-1]?.status=="accept");
  return (
    <Box>
      {cancelProduct.map((el, i) => {
        return (
          <Box key={i}>
            <UserOrderCard el={el} />
          </Box>
        );
      })}
    </Box>
  );
};

export default UserCancel;
