import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from 'game/app/store/authSlice/authslice';
import { logApi } from 'game/app/store/services/logsgame/logsgame.api';
import { userApi } from 'game/app/store/services/users/user.api';
import { scoreApi } from 'game/app/store/services/scores/score.api';
import { scoregraphqlApi } from './services/scores/scoregraphql';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: [
        userApi.reducerPath,
        scoreApi.reducerPath,
        logApi.reducerPath,
        scoregraphqlApi.reducerPath,
    ],
};

const rootReducer = combineReducers({
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [scoreApi.reducerPath]: scoreApi.reducer,
    [logApi.reducerPath]: logApi.reducer,
    [scoregraphqlApi.reducerPath]: scoregraphqlApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(
            [userApi.middleware],
            [scoreApi.middleware],
            [logApi.middleware],
            [scoregraphqlApi.middleware],
        ),
});

export const persistor = persistStore(store);
export default store;
