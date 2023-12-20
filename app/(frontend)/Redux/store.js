import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { Reducer as AppReducer } from "./AppReducer/Reducer";
import { Reducer as AuthReducer } from "./AuthReducer/Reducer";
import { Reducer as ShipReducer } from "./ShipReducer/Reducer";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { encryptTransform } from "./enc";
// import storageSession from 'redux-persist/lib/storage/session'
import storage from "redux-persist/lib/storage";
const persistConfig = {
  transforms: [
    encryptTransform({
      secretKey: process.env.NEXT_PUBLIC_STATE_ENC,
      onError: function (error) {
        console.log(error);
      },
    }),
  ],
  key: "persist-key",
  // storage:storageSession
  storage,
  stateReconciler: (inboundState, originalState) => {
    // Filter out the "popup" property from the "app" reducer
    if (originalState.app) {
      return {
        ...inboundState,
        app: {
          ...inboundState.app,
          popup: originalState.app.popup,
          allLatestProducts: originalState.app.allLatestProducts,
          recomPayload: originalState.app.recomPayload,
        },
      };
    }
    if (originalState.auth) {
      return {
        ...inboundState,
        auth: {
          ...inboundState.auth,
          otp:originalState.auth.otp
        },
      };
    }
    if (originalState.ship) {
      return {
        ...inboundState,
        auth: {
          ...inboundState.ship,
        },
      };
    }
    return inboundState;
  },
};
const RootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  ship: ShipReducer,
});
const persistedReducer = persistReducer(persistConfig, RootReducer);
const store = legacy_createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
const persistedStore = persistStore(store);
export { store };
export { persistedStore };
