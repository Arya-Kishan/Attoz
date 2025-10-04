import storage from "redux-persist/lib/storage"; // localStorage
import { persistReducer, persistStore } from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
import persistSlice from "./slices/persistSlice";
import postSlice from "./slices/postSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["persist"],
};

const combinedReducers = combineReducers({
  user: userSlice,
  post: postSlice,
  persist: persistSlice,
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch