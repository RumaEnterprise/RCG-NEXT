import axios from "axios";
import * as types from "./ActionTypes";

const getProduct = (payload, toast) => (dispatch) => {
  dispatch({ type: types.BUY_NOW_SUCCESS, payload: [] });
  dispatch({ type: types.GET_PRODUCTS_REQUEST });
  axios
    .get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/product?limit=${
        payload.limit
      }&page=${payload.page || 1}&status=true&sortBy=${
        payload.sortBy.field
      }&order=${payload.sortBy.order}`
    )
    .then((res) => {
      dispatch({ type: types.GET_PRODUCTS_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: types.GET_PRODUCTS_FAILURE });
      toast({
        title: err.response.data.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
};
const updateAppliedCoupon = (payload) => (dispatch) => {
  try {
    dispatch({ type: types.APPLIED_COUPON, payload: payload });
  } catch (error) {
    console.log(error);
  }
};
const searchProduct = (url, payload, toast) => (dispatch) => {
  dispatch({ type: types.GET_PRODUCTS_REQUEST });
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${payload.token}`,
      },
    })
    .then((res) => {
      dispatch({ type: types.GET_PRODUCTS_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: types.GET_PRODUCTS_FAILURE });
      toast({
        title: err.response.data.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
};

const getCart = (token) => (dispatch) => {
  dispatch({ type: types.GET_CART_REQUEST });
  axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      dispatch({ type: types.GET_CART_SUCCESS, payload: res.data.data });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.GET_CART_FAILURE });
    });
};

const getUser = (payload, toast) => (dispatch) => {
  dispatch({ type: types.BUY_NOW_SUCCESS, payload: [] });
  dispatch({ type: types.GET_PRODUCTS_REQUEST });
  axios
    .get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?limit=${payload.limit}&page=${payload.page}&search=${payload.text}`
    )
    .then((res) => {
      dispatch({ type: types.GET_PRODUCTS_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: types.GET_PRODUCTS_FAILURE });
      toast({
        title: err.response.data.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
};

const deleteProduct = (payload, toast, token) => (dispatch) => {
  dispatch({ type: types.DELETE_PRODUCT_REQUEST });
  axios
    .delete(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/product/delete?sku=${payload.products.join(",")}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      dispatch({ type: types.DELETE_PRODUCT_SUCCESS });
      toast({
        title: res.data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    })
    .catch((err) => {
      dispatch({ type: types.DELETE_PRODUCT_FAILURE });
      toast({
        title: err.response.data.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
};
const updateProduct = (payload, toast, skuID, token) => (dispatch) => {
  dispatch({ type: types.UPDATE_PRODUCT_REQUEST });
  axios
    .patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/update/${skuID}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      dispatch({ type: types.UPDATE_PRODUCT_SUCCESS });
      toast({
        title: res.data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    })
    .catch((err) => {
      dispatch({ type: types.UPDATE_PRODUCT_FAILURE });
      toast({
        title: err.response.data.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
};
const getHomeData = (token) => (dispatch) => {
  dispatch({ type: types.GET_HOME_REQUEST });
  axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`)
    .then((res) => {
      dispatch({ type: types.GET_HOME_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.GET_HOME_FAILURE });
    });
};
const getWish = (token) => (dispatch) => {
  dispatch({ type: types.GET_WISH_REQUEST });
  axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wish`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      dispatch({ type: types.GET_WISH_SUCCESS, payload: res.data.data });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.GET_WISH_FAILURE });
    });
};
const wipeWish = () => (dispatch) => {
  dispatch({ type: types.WIPE_WISH_SUCCESS });
};
const buyNow = (payload) => (dispatch) => {
  dispatch({ type: types.BUY_NOW_REQUEST });
  dispatch({ type: types.BUY_NOW_SUCCESS, payload });
};
const setURL = (payload) => (dispatch) => {
  dispatch({ type: types.OLDURL, payload: payload });
};
const allLatestProduct = (payload) => (dispatch) => {
  try {
    dispatch({ type: types.ALL_LATEST_PRODUCT_SUCCESS, payload: payload });
  } catch (error) {
    console.log(error);
  }
};

const loginState = (toast, token) => (dispatch) => {
  if (token !== "") {
    dispatch({ type: types.LOGIN_OPEN });
    setTimeout(() => {
      dispatch({ type: types.LOGIN_OPEN });
    }, 2000);

    toast({
      title: "Please Login",
      status: "info",
      duration: 1000,
      isClosable: true,
    });
  }
};
const SignupOpen = (toast) => (dispatch) => {
  dispatch({ type: types.LOGIN_OPEN });
};

const getPurchase = (token) => (dispatch) => {
  try {
    dispatch({ type: types.GET_PURCHASE_REQUEST });
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/purchase/orderbyuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let sortData = res.data.data.sort((a, b) => {
          const dateA = new Date(
            parseInt(a.date.split("/")[2]),
            parseInt(a.date.split("/")[1]),
            parseInt(a.date.split("/")[0])
          );

          const dateB = new Date(
            parseInt(b.date.split("/")[2]),
            parseInt(b.date.split("/")[1]),
            parseInt(b.date.split("/")[0])
          );

          return dateB - dateA;
        });
        dispatch({ type: types.GET_PURCHASE_SUCCESS, payload: sortData });
      })
      .catch((err) => {
        dispatch({ type: types.GET_PURCHASE_FAILURE });
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
const singleOrder = (payload) => (dispatch) => {
  try {
    dispatch({ type: types.GET_SINGLEORDER_SUCCESS, payload });
  } catch (error) {
    console.log(error);
  }
};
const setDiscount = (payload) => (dispatch) => {
  if (payload === "") {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/discount`)
      .then((res) => {
        dispatch({ type: types.GET_DISCOUNT_SUCCESS, payload: res.data });
      });
  }
};
const getAllCoupon = (payload) => (dispatch) => {
  try {
    dispatch({ type: types.GET_ALLCOUPON_REQUEST });
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon`, {
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      })
      .then((res) => {
        let result = [];
        res.data.data.map((ele) => {
          axios
            .get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/usedcoupon/getcouponcount?coupon=${ele.code}`,
              {
                headers: {
                  Authorization: `Bearer ${payload.token}`,
                },
              }
            )
            .then((response) => {
              ele.usedCount = response.data.data.count;
              result.push(ele);
              if (res.data.data.length == result.length) {
                result.sort((a, b) => {
                  // Convert the start dates to Date objects for comparison
                  const dateA = new Date(a.startDate);
                  const dateB = new Date(b.startDate);
              
                  // Compare the dates
                  return dateB - dateA;
              });
                dispatch({
                  type: types.GET_ALLCOUPON_SUCCESS,
                  payload: result,
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: types.GET_ALLCOUPON_FAILURE });
      });
  } catch (error) {
    console.log(error);
  }
};
const randomProduct = (payload) => (dispatch) => {
  try {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product?category=${
          payload.type
        }&page=${1}&limit=4&random=true`
      )
      .then((res) => {
        const data = {};
        data[payload.type] = res.data;
        dispatch({ type: types.GET_RANDOM_PRODUCT, payload: data });
      });
  } catch (error) {}
};
const recomendedCoupon = (payload) => (dispatch) => {
  dispatch({ type: types.RECOMENDED_COUPON, payload: payload });
};
const clearRecomendedCoupon = () => (dispatch) => {
  dispatch({ type: types.CLEAR_RECOMENDED_COUPON });
};
const magnifierOn = () => (dispatch) => {
  dispatch({ type: types.MAGNIFIER_ON });
};
const magnifierOff = () => (dispatch) => {
  dispatch({ type: types.MAGNIFIER_OFF });
};
const popoup = (payload) => (dispatch) => {
  dispatch({ type: types.POPUP, payload: payload });
};
const updateLikesDislikes = (payload) => (dispatch) => {
  let sku = payload.skuID;
  delete payload.skuID;
  axios
    .patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/updateLikeDislike/${sku}`,
      payload
    )
    .then(() => {
      dispatch({ type: types.GET_USER_PRODUCT, payload: payload.data });
    })
    .catch((err) => {
      console.log(err);
    });
};
const userGetProduct = (payload) => (dispatch) => {
  try {
    dispatch({ type: types.GET_PRODUCTS_REQUEST });
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product?${payload.filter}`)
      .then((res) => {
        dispatch({ type: types.GET_USER_PRODUCT_SUCCESS, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};
export {
  updateAppliedCoupon,
  clearRecomendedCoupon,
  getCart,
  recomendedCoupon,
  popoup,
  getUser,
  setURL,
  userGetProduct,
  updateLikesDislikes,
  magnifierOn,
  magnifierOff,
  searchProduct,
  randomProduct,
  getAllCoupon,
  setDiscount,
  getProduct,
  singleOrder,
  getPurchase,
  deleteProduct,
  updateProduct,
  getHomeData,
  getWish,
  wipeWish,
  buyNow,
  allLatestProduct,
  loginState,
  SignupOpen,
};
