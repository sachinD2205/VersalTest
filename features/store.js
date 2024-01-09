import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./userSlice";
import labelSlice from "./labelSlice";
// import isPasswordChangedSlice from "./isPasswordChangedSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
// /*, isPasswordChanged:  isPasswordChangedSlice.reducer */
const rootReducer = combineReducers({ user: userSlice.reducer, labels: labelSlice.reducer });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);