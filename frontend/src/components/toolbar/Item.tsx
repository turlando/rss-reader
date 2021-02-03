import React from 'react';


type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface Props {
    onClick?: (evt: OnClickEvent) => void;
}


const Item: React.FC<Props> = ({
    children,
    onClick = (evt: OnClickEvent) => {}
}) => {
    return (
        <button
            className="Toolbar__Item"
            onClick={ onClick }
        >
            { children }
        </button>
    );
}


export default Item;
