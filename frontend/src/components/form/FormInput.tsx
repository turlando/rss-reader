import React from 'react';
import classnames from 'classnames';


interface Props {
    className?: string;
    type?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    value?: string;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
}


const FormInput: React.FC<Props> = ({
    className = "",
    type = "",
    name = "",
    placeholder = "",
    disabled = false,
    value = "",
    setValue = () => null
}) => {
    return (
        <input
            className={ classnames("Form__Input", {
                [className]: className !== "",
            }) }
            type={ type }
            name={ name }
            placeholder={ placeholder }
            disabled={ disabled }
            value={ value }
            onChange={ e => setValue(e.target.value) }
        />
    );
}

export default FormInput;
