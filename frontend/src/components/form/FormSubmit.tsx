import React from 'react';
import classnames from 'classnames';


interface Props {
    className?: string;
    text?: string;
}


const SubmitButton: React.FC<Props> = ({
    className = "",
    text = "",
}) => {
    return (
        <input
            className={ classnames("Form__Submit", {
                [className]: className !== "",
            })}
            type="submit"
            value={ text }
        />
    );
}


export default SubmitButton;
