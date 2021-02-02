import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {AppThunk, RootState} from './store';
import {ResultType, SubscriptionTree, getSubscriptions} from '../api';


interface Subscriptions {
    loading: boolean;
    subscriptions: SubscriptionTree;
}


const initialState: Subscriptions = {
    loading: true,
    subscriptions: [],
};


const slice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {
        setLoading: (state, {payload}: PayloadAction<boolean>) => {
            state.loading = payload;
        },
        setSubscriptions: (state, {payload}: PayloadAction<SubscriptionTree>) => {
            state.subscriptions = payload;
        },
    }
});


export const fetchSubscriptions = (): AppThunk => dispatch => {
    dispatch(setLoading(true));
    getSubscriptions()
        .then(subscriptions => {
            if (subscriptions.result === ResultType.Failure) {
                // TODO: handle error
                console.log("Error while fetching subscriptions:", subscriptions.error)
            } else {
                dispatch(setSubscriptions(subscriptions.data))
            }
            dispatch(setLoading(false));
        })
};


export const subscriptionsReducer = slice.reducer;

export const selectLoading = (state: RootState) => state.subscriptions.loading;
export const selectSubscriptions = (state: RootState) => state.subscriptions.subscriptions;

export const {setLoading, setSubscriptions} = slice.actions;
