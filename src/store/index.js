import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./reducers/userReducer";
import chatReducer from "./reducers/chatReducer";
import contactReducer from "./reducers/contactReducer";
import messageReducer from "./reducers/messageReducer";

const persistConfig = {
  key: "root",
  version: 1,
  blacklist: ["user", "message", "chat", "contact"],
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  contact: contactReducer,
  message: messageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "user/auth/fulfilled",
          "chat/get-rooms/fulfilled",
          "contact/get-contacts/fulfilled",
          "message/get-messages/fulfilled",
          "contact/find-user/fulfilled",
          "contact/add-contact/fulfilled",
          "user/signin/fulfilled",
          "user/signup/fulfilled",
          "user/auth/rejected",
          "chat/action-room/fulfilled",
        ],
        ignoredPaths: ["payload.config.adapter"],
      },
    }),
});

export const persistor = persistStore(store);
