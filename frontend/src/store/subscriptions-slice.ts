import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AppThunk, RootState } from './store';
import {
    SubscriptionTreeNode, ResultType, SubscriptionTree,
    getSubscriptions
} from '../api';


interface Subscriptions {
    loading: boolean;
    subscriptions: SubscriptionTree;
    selectedNode?: SubscriptionTreeNode;
}


const initialState: Subscriptions = {
    loading: true,
    subscriptions: [],
    selectedNode: undefined,
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
        setSelectedNode: (state, {payload}: PayloadAction<SubscriptionTreeNode | undefined>) => {
            state.selectedNode = payload;
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
export const selectSelectedNode = (state: RootState) => state.subscriptions.selectedNode;

export const {setLoading, setSubscriptions, setSelectedNode} = slice.actions;
