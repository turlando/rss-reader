import React, { useState } from 'react';
import { Form, FormInput, FormSubmit } from '../form';


interface Props {
    handleSignup?: (
        username: string,
        password: string,
        passwordConfirm: string
    ) => void;
}


const SignupForm: React.FC<Props> = ({
    handleSignup = (username, password, passwordConfirm) => null
}) => {
    const [username, setUsername]               = useState("");
    const [password, setPassword]               = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    return (
        <Form onSubmit={ () => handleSignup(username, password, passwordConfirm) }>
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

            <FormInput
                type="password"
                name="password"
                placeholder="Confirm password"
                value={ passwordConfirm }
                setValue={ setPasswordConfirm }
            />

            <FormSubmit text="Sign up"/>
        </Form>
    );
}


export default SignupForm;
