import React from 'react';
import classnames from 'classnames';

import './Modal.css';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    blur?: boolean;
    onClick?: (evt: OnClickEvent) => void;
}


const Modal: React.FC<Props> = ({
    children,
    blur    = false,
    onClick = (evt: OnClickEvent) => null
}) => {

    const handleClick = (evt: OnClickEvent) => {
        evt.stopPropagation();
        onClick(evt);
    };

    return (
        <div
            className={classnames("Modal__container", {
                "Modal__container--blur": blur
            })}
            onClick={handleClick}
        >
            {children}
        </div>
    )
};


export default Modal;
