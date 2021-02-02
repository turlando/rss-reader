import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {AppThunk, RootState} from './store';
import {ResultType, SubscriptionTreeFeed, Item, getFeedItems} from '../api';


interface Feed {
    loading: boolean;
    feed?: SubscriptionTreeFeed;
    items: Item[];
    selectedItem?: Item;
}


const initialState: Feed = {
    loading: true,
    feed: undefined,
    items: [],
    selectedItem: undefined,
};


const slice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        setLoading: (state, {payload}: PayloadAction<boolean>) => {
            state.loading = payload;
        },
        setFeed: (state, {payload}: PayloadAction<SubscriptionTreeFeed | undefined>) => {
            state.feed = payload;
        },
        setItems: (state, {payload}: PayloadAction<Item[]>) => {
            state.items = payload;
        },
        setSelectedItem: (state, {payload}: PayloadAction<Item | undefined>) => {
            state.selectedItem = payload;
        },
    }
});


export const fetchFeed = (feed: SubscriptionTreeFeed): AppThunk => dispatch => {
    dispatch(setLoading(true));
    dispatch(setFeed(feed))
    getFeedItems(feed.id)
        .then(items => {
            if (items.result === ResultType.Failure) {
                // TODO: handle error
                console.log("Error while fetching items:", items.error)
            } else {
                dispatch(setItems(items.data))
            }
            dispatch(setLoading(false));
        })
};


export const feedReducer = slice.reducer;

export const selectLoading = (state: RootState) => state.feed.loading;
export const selectFeed = (state: RootState) => state.feed.feed;
export const selectItems = (state: RootState) => state.feed.items;
export const selectSelectedItem = (state: RootState) => state.feed.selectedItem;

export const {setLoading, setFeed, setItems, setSelectedItem} = slice.actions;
