import React from 'react';

interface Props {
    onSubmit?: () => void;
}


const Form: React.FC<Props> = ({
    children,
    onSubmit = () => null
}) => {
    return (
        <form onSubmit={e => {
            e.preventDefault();
            onSubmit();
        }}>
            {children}
        </form>
    );
}


export default Form;
