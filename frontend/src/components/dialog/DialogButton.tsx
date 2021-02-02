import React from 'react';
import classnames from 'classnames';


type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface Props {
    text: string;
    onClick?: (evt: OnClickEvent) => void;
    primary?: boolean;
}


const DialogButton: React.FC<Props> = ({
    text,
    onClick = (evt: OnClickEvent) => null,
    primary = false,
}) => {
    return (
        <button
            className={classnames("Dialog__Button", {
                "Dialog__Button--primary": primary
            })}
            onClick={onClick}
        >
            {text}
        </button>
    );
}


export default DialogButton;
