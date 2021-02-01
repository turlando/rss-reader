import React from 'react';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    onClick?: (evt: OnClickEvent) => void;
}


const Item: React.FC<Props> = ({
    children,
    onClick = (evt: OnClickEvent) => {}
}) => {
    return (
        <div
            className="Toolbar__Item"
            onClick={onClick}
        >
            {children}
        </div>
    );
}


export default Item;
