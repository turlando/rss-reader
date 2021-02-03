import React from 'react';
import './Form.css';

interface Props {
    onSubmit?: () => void;
}


const Form: React.FC<Props> = ({
    children,
    onSubmit = () => null
}) => {
    return (
        <form
            className="Form"
            onSubmit={ e => {
                e.preventDefault();
                onSubmit();
            } }>
            { children }
        </form>
    );
}


export default Form;
