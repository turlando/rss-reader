import { DeepPartial, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';


interface Session {
    token?: string;
}


const storeToken = (token: string) => {
    localStorage.setItem('token', token)
}

const removeToken = () => {
    localStorage.removeItem('token')
}

const getToken = () => {
    return localStorage.getItem('token') || undefined;
}


const initialState: Session = {
    token: undefined,
};

const preloadedState: DeepPartial<Session> = {
    token: getToken(),
};


const slice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setToken: (state, {payload}: PayloadAction<string>) => {
            state.token = payload;

            // FIXME: side effects should be in a middleware
            storeToken(payload);
        }
    }
});


export const sessionReducer = slice.reducer;
export const sessionPreloadedState = preloadedState;

export const selectToken = (state: RootState) => state.session.token;

export const {setToken} = slice.actions;
