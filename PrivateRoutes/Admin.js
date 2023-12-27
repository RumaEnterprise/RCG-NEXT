"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
const AdminPrivateRoute = ({ children }) => {
  let user = useSelector((store) => store.auth.user);
  const navigate = useRouter();
  if (user.administration === "" || user.administration === undefined) {
    navigate.push("/");
  }
  if (window.location.href.includes("rarelog") && user.seeServerLogs) {
    return children;
  } else if (
    (window.location.href.includes("users") && user.addUser) ||
    user.editUser ||
    user.deleteUser ||
    user.addAdminUser
  ) {
    return children;
  } else if (window.location.href.includes("home") && user.modifyHome) {
    return children;
  } else if (
    (window.location.href.includes("coupons") && user.addCoupon) ||
    user.deleteCoupon ||
    user.displayCoupon
  ) {
    return children;
  } else if (window.location.href.includes("orders") && user.modifyOrder) {
    return children;
  } else if (
    (window.location.href.includes("product") && user.addProduct) ||
    user.editProduct ||
    user.displayProduct ||
    user.deleteProduct ||
    user.productStatus
  ) {
    return children;
  } else if (window.location.href.includes("reports") && user.seeReports) {
    return children;
  } else if (window.location.pathname == "/admin") {
    return children;
  } else {
    navigate.push("/");
  }
};

export default AdminPrivateRoute;
