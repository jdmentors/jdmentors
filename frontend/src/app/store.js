import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { UserAuthFormReducers } from "../features/forms/UserAuthSlice.js";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const combinedReducers = combineReducers({
    user: UserAuthFormReducers,
})

const persistConfig = {
    key:'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, combinedReducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: ['user.user.image']
            },
        })
)
});

const persistor = persistStore(store);

export {store, persistor};