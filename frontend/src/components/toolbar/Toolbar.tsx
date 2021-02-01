import React from 'react';

import Item from './Item';

import './Toolbar.css';


const Toolbar: React.FC = () => {
    return (
        <div className="Toolbar">
            <Item>A</Item>
            <Item>B</Item>
            <Item>C</Item>
            <Item>D</Item>
            <Item>E</Item>
        </div>
    )
}


export default Toolbar;
