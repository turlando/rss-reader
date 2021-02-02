import React from 'react';


interface Props {
    className?: string;
    type?: string;
    name?: string;
    placeholder?: string;
    value?: string;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
}


const FormInput: React.FC<Props> = ({
    className = "",
    type = "",
    name = "",
    placeholder = "",
    value = "",
    setValue = () => null
}) => {
    return (
        <input
            className={className}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
        />
    );
}

export default FormInput;
