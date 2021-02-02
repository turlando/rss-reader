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
    onClick = (evt: OnClickEvent) => {}
}) => {

    return (
        <div
            className={classnames("Modal__container", {
                "Modal__container--blur": blur
            })}
            onClick={onClick}
        >
            <div
                className="Modal__content"
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
};


export default Modal;
