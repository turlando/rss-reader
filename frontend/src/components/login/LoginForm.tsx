import React, { useState } from 'react';
import { Form, FormInput, FormSubmit } from '../form';


interface Props {
    handleLogin?: (username: string, password: string) => void;
}


const LoginForm: React.FC<Props> = ({
    handleLogin = (username, password) => null
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Form onSubmit={ () => handleLogin(username, password) }>
            <FormInput
                className="Login__Form__element Login__Form__input"
                type="text"
                name="username"
                placeholder="Username"
                value={ username }
                setValue={ setUsername }
            />

            <FormInput
                className="Login__Form__element Login__Form__input"
                type="password"
                name="password"
                placeholder="Password"
                value={ password }
                setValue={ setPassword }
            />

            <FormSubmit className="Login__Form__element"/>
        </Form>
    );
}


export default LoginForm;
