import React, {useState} from 'react';
import {selectError} from '../../store/session-slice';


/* Form ***********************************************************************/

interface FormProps {
    handleLogin: (username: string, password: string) => void;
}


const Form: React.FC<FormProps> = ({handleLogin}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form onSubmit={(evt) => {
            evt.preventDefault();
            handleLogin(username, password);
        }}>
            <Input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                setValue={setUsername}
            />

            <Input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                setValue={setPassword}
            />

            <SubmitButton/>
        </form>
    );
}


/* Input **********************************************************************/

interface InputProps {
    type: "text" | "password";
    name: string;
    placeholder: string
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Input: React.FC<InputProps> = ({
    type,
    name,
    placeholder,
    value,
    setValue
}) => {
    return (
        <input
            className="Login__form__element Login__form__input"
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
        />
    );
}


/* SubmitButton ***************************************************************/

const SubmitButton: React.FC = () =>
    <input
        className="Login__form__element Login__form__button"
        type="submit"
        name="Log in"
    />;


/******************************************************************************/

export default Form;
