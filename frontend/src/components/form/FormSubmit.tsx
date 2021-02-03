import React from 'react';
import classnames from 'classnames';


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
            className={ classnames("Form__Submit", {
                [className]: className !== "",
            })}
            type="submit"
            name={ name }
        />
    );
}


export default SubmitButton;
