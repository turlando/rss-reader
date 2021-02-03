import React from 'react';


type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface Props {
    disabled?: boolean;
    onClick?: (evt: OnClickEvent) => void;
}


const Item: React.FC<Props> = ({
    children,
    disabled = false,
    onClick = (evt: OnClickEvent) => {}
}) => {
    return (
        <button
            className="Toolbar__Item"
            disabled={disabled}
            onClick={ onClick }
        >
            { children }
        </button>
    );
}


export default Item;
