import axios from "axios";
import * as types from "./ActionTypes";
import { setUpRecaptha, verifyOTP } from "../../Components/Firebase/function";
export const signin =
  (payload, toast, onClose, navigate, setLoad) => (dispatch) => {
    if (payload.loginType === "manual") {
      dispatch({ type: types.SIGNIN_REQUEST });
    } else {
      setLoad(true);
    }
    return axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signin`, payload)
      .then((res) => {
        dispatch({ type: types.SIGNIN_SUCCESS, payload: res.data });
        if (payload.loginType !== "manual") {
          setLoad(false);
        }
        toast({
          title: res.data.msg,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        if (res.data.user.administration) {
          onClose();
          navigate.push("/admin");
        } else {
          onClose();
        }
      })
      .catch((err) => {
        dispatch({ type: types.SIGNIN_FAILURE });
        setLoad(false);
        toast({
          title: err.response.data.msg,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };
export const signup = (payload, toast) => (dispatch) => {
  dispatch({ type: types.SIGNUP_REQUEST });
  return axios
    .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, payload)
    .then((res) => {
      dispatch({ type: types.SIGNUP_SUCCESS });
      toast({
        title: res.data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    })
    .catch((err) => {
      dispatch({ type: types.SIGNUP_FAILURE });
      toast({
        title: err.response.data.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
};
export const logout = (toast, navigate) => (dispatch) => {
  try {
    dispatch({ type: types.SIGNOUT_REQUEST });
    dispatch({ type: types.SIGNOUT_SUCCESS });
    toast({
      title: "Account Logout",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate.push("/");
  } catch (error) {
    dispatch({ type: types.SIGNOUT_FAILURE });
  }
};

export const userUpdate = (payload, token, toast) => (dispatch) => {
  dispatch({ type: types.USER_UPDATE_REQUEST });
  return axios
    .patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      dispatch({ type: types.USER_UPDATE_SUCCESS, payload });
      toast({
        title: res.data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    })
    .catch((err) => {
      dispatch({ type: types.USER_UPDATE_FAILURE });
      toast({
        title: err.response.data.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
};

export const localBill = (payload) => (dispatch) => {
  dispatch({ type: types.USER_UPDATE_SUCCESS, payload });
};

export const sendOTP = (phoneNumber) =>async(dispatch)=>{
  try {
    dispatch({ type: types.GET_OTP_REQUEST });
    const data=await setUpRecaptha(phoneNumber);
    dispatch({ type: types.GET_OTP_SUCCESS, payload: data });
  } catch (error) {
    console.error('Error sending OTP:', error);
    dispatch({ type: types.GET_OTP_FAILURE });
  }
}
