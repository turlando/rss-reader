import React from 'react';


type OnClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface Props {
    title?: string;
    disabled?: boolean;
    onClick?: (evt: OnClickEvent) => void;
}


const Item: React.FC<Props> = ({
    children,
    title = "",
    disabled = false,
    onClick = (evt: OnClickEvent) => {}
}) => {
    return (
        <button
            className="Toolbar__Item"
            title={ title }
            disabled={ disabled }
            onClick={ onClick }
        >
            { children }
        </button>
    );
}


export default Item;
