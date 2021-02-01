import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {ResultType, login} from '../../api';
import {setToken, selectError, setError} from '../../store/session-slice';

import Form from './Form';
import Modal from '../modal';

import './Login.css';


const Login = () => {
    const dispatch = useDispatch();
    const error = useSelector(selectError);

    const handleLogin = (username: string, password: string) => {
        login(username, password).then(session => {
            if (session.result === ResultType.Failure)
                dispatch(setError("Login unsuccessful"))
            else
                dispatch(setToken(session.data.token))
        })
    };

    return (
        <Modal>
            <div className="Login">
                <Form handleLogin={handleLogin}/>

                {
                    error !== undefined &&
                    <div className="Login__error">
                        {error}
                    </div>
                }
            </div>
        </Modal>
    )
}


export default Login;
