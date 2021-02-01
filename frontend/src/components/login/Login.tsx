import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import {ResultType, login} from '../../api';
import {setToken} from '../../store/session-slice';

import Form from './Form';
import Modal from '../modal';

import './Login.css';


const Login = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const handleLogin = (username: string, password: string) => {
        login(username, password).then(session => {
            if (session.result === ResultType.Failure)
                setError("Login unsuccessful")
            else
                dispatch(setToken(session.data.token))
        })
    };

    return (
        <Modal>
            <div className="Login">
                <Form handleLogin={handleLogin}/>

                { error !== "" &&
                  <div className="Login__error">
                      {error}
                  </div>
                }
            </div>
        </Modal>
    )
}


export default Login;
