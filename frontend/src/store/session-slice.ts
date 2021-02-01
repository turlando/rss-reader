import { DeepPartial, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';


interface Session {
    token?: string;
    error?: string;
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
    error: undefined,
};

const preloadedState: DeepPartial<Session> = {
    token: getToken(),
    error: undefined,
};


const slice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setToken: (state, {payload}: PayloadAction<string>) => {
            state.token = payload;
            state.error = undefined;

            // FIXME: side effects should be in a middleware
            storeToken(payload);
        },
        setError: (state, {payload}: PayloadAction<string>) => {
            state.token = undefined;
            state.error = payload;

            // FIXME: side effects should be in a middleware
            removeToken();
        }
    }
});


export const selectToken = (state: RootState) => state.session.token;
export const selectError = (state: RootState) => state.session.error;

export const { setToken, setError } = slice.actions;
export const sessionReducer = slice.reducer;
export const sessionPreloadedState = preloadedState;
