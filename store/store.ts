"use client"; 

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";

// 1️⃣ Combine reducers (for scalability)
const rootReducer = combineReducers({
  auth: authReducer,
});

// 2️⃣ Configure persistence (only works on the client)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist 'auth'
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3️⃣ Create Redux store (disable serializable check for Persist)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 4️⃣ Create Redux Persistor
export const persistor = persistStore(store);

// 5️⃣ Define TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
