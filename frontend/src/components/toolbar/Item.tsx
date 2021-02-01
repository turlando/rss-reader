import React from 'react';


const Item: React.FC = ({children}) => {
    return (
        <div className="Toolbar__Item">
            {children}
        </div>
    );
}


export default Item;
