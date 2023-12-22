import * as types from "./ActionTypes";
const initialState = {
  products: [],
  home: [],
  wish: [],
  buy: [],
  coupons: [],
  purchase: [],
  cart: [],
  appliedCoupon: { couponCode: "", price: 0 },
  filterProduct: {},
  loginForm: false,
  allLatestProducts: [],
  singleOrder: {},
  oldURL: "",
  randomProduct: [],
  user: [],
  recomPayload: {},
  popup: true,
  userProduct: [],
  magnifier: false,
  discount: "",
  isCartLoading: false,
  isCouponLoading: false,
  isProductLoading: false,
  isProductUpdateLoading: false,
  isHomeLoading: false,
  isDeleteProductLoading: false,
  isDiscountLoading: false,
  isPurchseLoading: false,
  isPurchaseError: false,
  isError: false,
};

export const Reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.GET_PRODUCTS_REQUEST: {
      return { ...state, products: [], isProductLoading: true, isError: false };
    }
    case types.APPLIED_COUPON: {
      return { ...state,appliedCoupon:payload  };
    }
    case types.GET_PRODUCTS_SUCCESS: {
      return {
        ...state,
        isProductLoading: false,
        products: payload,
        isError: false,
      };
    }
    case types.GET_PRODUCTS_FAILURE: {
      return { ...state, isProductLoading: false, products: [], isError: true };
    }
    case types.GET_CART_REQUEST: {
      return { ...state, isCartLoading: true, cart: [], isError: false };
    }
    case types.GET_CART_SUCCESS: {
      return { ...state, isCartLoading: false, cart: payload, isError: false };
    }
    case types.GET_CART_FAILURE: {
      return { ...state, isCartLoading: false, cart: [], isError: true };
    }

    case types.DELETE_PRODUCT_REQUEST: {
      return { ...state, isDeleteProduct: true };
    }

    case types.DELETE_PRODUCT_SUCCESS: {
      return { ...state, isDeleteProduct: false };
    }
    case types.DELETE_PRODUCT_FAILURE: {
      return { ...state, isError: true };
    }

    case types.UPDATE_DISCOUNT_REQUEST: {
      return { ...state, isDiscountLoading: true };
    }
    case types.UPDATE_DISCOUNT_SUCCESS: {
      return { ...state, isDiscountLoading: false };
    }
    case types.UPDATE_DISCOUNT_FAILURE: {
      return { ...state, isError: true };
    }

    case types.GET_HOME_REQUEST: {
      return {
        ...state,
        products: [],
        home: [],
        isHomeLoading: true,
        isError: false,
      };
    }
    case types.GET_HOME_SUCCESS: {
      return {
        ...state,
        isHomeLoading: false,
        home: payload,
        isError: false,
      };
    }
    case types.GET_HOME_FAILURE: {
      return {
        ...state,
        products: [],
        home: [],
        isProductLoading: false,
        isError: true,
      };
    }

    case types.UPDATE_PRODUCT_REQUEST: {
      return {
        ...state,
        products: [],
        isProductUpdateLoading: true,
        isError: false,
      };
    }
    case types.UPDATE_PRODUCT_SUCCESS: {
      return {
        ...state,
        isProductUpdateLoading: false,
        isError: false,
      };
    }
    case types.UPDATE_PRODUCT_FAILURE: {
      return {
        ...state,
        isProductUpdateLoading: false,
        products: [],
        isError: true,
      };
    }

    case types.GET_WISH_REQUEST: {
      return {
        ...state,
        wish: [],
        isCartLoading: true,
        isError: false,
      };
    }
    case types.GET_WISH_SUCCESS: {
      return {
        ...state,
        isCartLoading: false,
        wish: payload,
        isError: false,
      };
    }
    case types.GET_WISH_FAILURE: {
      return {
        ...state,
        isCartLoading: false,
        wish: [],
        isError: true,
      };
    }

    case types.WIPE_WISH_SUCCESS: {
      return {
        ...state,
        wish: [],
      };
    }

    case types.BUY_NOW_REQUEST: {
      return {
        ...state,
        buy: [],
      };
    }
    case types.BUY_NOW_SUCCESS: {
      return {
        ...state,
        buy: payload,
      };
    }

    case types.ALL_LATEST_PRODUCT_SUCCESS: {
      return {
        ...state,
        allLatestProducts: [...state.allLatestProducts, ...payload],
      };
    }

    case types.LOGIN_OPEN: {
      return {
        ...state,
        loginForm: !state.loginForm,
      };
    }

    case types.ALL_PRODUCTFILTER_SUCCESS: {
      return {
        ...state,
        filterProduct: payload,
      };
    }
    case types.GET_PURCHASE_REQUEST: {
      return {
        ...state,
        isPurchseLoading: true,
        purchase: [],
      };
    }
    case types.GET_PURCHASE_SUCCESS: {
      return {
        ...state,
        isPurchseLoading: false,
        purchase: payload,
      };
    }
    case types.GET_PURCHASE_FAILURE: {
      return {
        ...state,
        isPurchseLoading: false,
        isPurchseError: true,
        purchase: [],
      };
    }
    case types.GET_SINGLEORDER_SUCCESS: {
      return {
        ...state,
        singleOrder: payload,
      };
    }
    case types.GET_DISCOUNT_SUCCESS: {
      return {
        ...state,
        discount: payload,
      };
    }
    case types.GET_ALLCOUPON_REQUEST: {
      return {
        ...state,
        isCouponLoading: true,
      };
    }
    case types.GET_ALLCOUPON_SUCCESS: {
      return {
        ...state,
        isCouponLoading: false,
        coupons: payload,
      };
    }
    case types.GET_ALLCOUPON_FAILURE: {
      return {
        ...state,
        isCouponLoading: false,
        isError: true,
      };
    }
    case types.GET_RANDOM_PRODUCT: {
      return {
        ...state,
        randomProduct: { ...state.randomProduct, ...payload },
      };
    }
    case types.MAGNIFIER_ON: {
      return {
        ...state,
        magnifier: true,
      };
    }
    case types.MAGNIFIER_OFF: {
      return {
        ...state,
        magnifier: false,
      };
    }
    case types.GET_USER_PRODUCT_REQUEST: {
      return {
        ...state,
        isProductLoading:true
      };
    }
    case types.GET_USER_PRODUCT_SUCCESS: {
      return {
        ...state,
        userProduct: payload,
        isProductLoading:false
      };
    }
    case types.OLDURL: {
      return {
        ...state,
        oldURL: payload,
      };
    }
    case types.RECOMENDED_COUPON: {
      return {
        ...state,
        recomPayload: { ...state.recomPayload, ...payload },
      };
    }
    case types.CLEAR_RECOMENDED_COUPON: {
      return {
        ...state,
        recomPayload: {},
      };
    }
    case types.POPUP: {
      return {
        ...state,
        popup: true,
      };
    }
    default:
      return state;
  }
};
