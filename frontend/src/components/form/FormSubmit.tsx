import React from 'react';


interface Props {
    className?: string;
    name?: string;
}


const SubmitButton: React.FC<Props> = ({
    className = "",
    name = ""

}) => {
    return (
        <input
            className={className}
            type="submit"
            name={name}
        />
    );
}


export default SubmitButton;
