import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';

import { ResultType, signup, login, ErrorType } from '../../api';
import { setToken } from '../../store/session-slice';

import SignupForm from './SignupForm';
import Modal from '../modal';

import './Signup.css';


const Signup = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const handleSignup = (
        username: string,
        password: string,
        passwordConfirm: string
    ) => {
        if (password !== passwordConfirm) {
            setError("Password and password confirmation do not match.");
            return;
        }

        signup(username, password)
            .then(user => {
                if (user.result === ResultType.Failure
                 && user.error === ErrorType.Duplicate) {
                    setError("Username already taken");
                    return;
                }

                login(username, password)
                    .then(session => {
                        if (session.result === ResultType.Success) {
                            dispatch(setToken(session.data.token))
                            return;
                        }
                    } )
            } );
    }

    return (
        <div className="Signup__backdrop">
            <Modal>
                <div className="Signup">
                    <SignupForm handleSignup={handleSignup} />

                    { error !== "" &&
                    <div className="Signup__element Signup__error">
                        { error }
                    </div>
                    }

                    <Link
                        className="Signup__login-link"
                        to="/login"
                    >
                        Or login
                    </Link>
                </div>
            </Modal>
        </div>
    );
}


export default Signup;
