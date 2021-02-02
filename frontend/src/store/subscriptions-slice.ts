import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';


interface Subscriptions {
    loading: boolean;
}


const initialState: Subscriptions = {
    loading: true,
};


const slice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {
        setLoading: (state, {payload}: PayloadAction<boolean>) => {
            state.loading= payload;
        }
    }
});


export const subscriptionsReducer = slice.reducer;
export const {setLoading} = slice.actions;
export const selectLoading = (state: RootState) => state.subscriptions.loading;
