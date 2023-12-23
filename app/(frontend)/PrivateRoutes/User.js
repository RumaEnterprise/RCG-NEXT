"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const UserRoute = ({ children }) => {
  let data = useSelector((store) => store.auth.user);
  const navigate = useRouter();
  if (data.administration === undefined) {
    navigate.push("/");
  } else {
    return children;
  }
};

export default UserRoute;
