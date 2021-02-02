import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';


export enum Mode {
    Normal = "normal",
    AddFolder = "add_folder",
    AddFeed = "add_feed",
    Edit = "edit",
    Delete = "delete",
}


interface Reader {
    mode: Mode;
}


const initialState: Reader = {
    mode: Mode.Normal,
};


const slice = createSlice({
    name: 'reader',
    initialState,
    reducers: {
        setMode: (state, {payload}: PayloadAction<Mode>) => {
            state.mode = payload;
        }
    }
});


export const readerReducer = slice.reducer;
export const {setMode} = slice.actions;
export const selectMode = (state: RootState) => state.reader.mode;
