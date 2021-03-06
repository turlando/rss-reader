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
                type="text"
                name="username"
                placeholder="Username"
                value={ username }
                setValue={ setUsername }
            />

            <FormInput
                type="password"
                name="password"
                placeholder="Password"
                value={ password }
                setValue={ setPassword }
            />

            <FormSubmit text="Log in" />
        </Form>
    );
}


export default LoginForm;
