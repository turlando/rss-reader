import {Action, ThunkAction, configureStore} from '@reduxjs/toolkit';

import {sessionReducer, sessionPreloadedState} from './session-slice';
import {readerReducer} from './reader-slice';
import {subscriptionsReducer} from './subscriptions-slice';


export const store = configureStore({
    reducer: {
        session: sessionReducer,
        reader: readerReducer,
        subscriptions: subscriptionsReducer,
    },

    preloadedState: {
        session: sessionPreloadedState
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> =
    ThunkAction<ReturnType,
                RootState,
                unknown,
                Action<string>>;

export default store;
