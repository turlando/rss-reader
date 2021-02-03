import React from 'react';
import { useDispatch } from 'react-redux';

import { Mode, setMode } from '../../store/reader-slice';

import Item from './Item';

import './Toolbar.css';


const Toolbar: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <div className="Toolbar">
            <Item onClick={ e => dispatch(setMode(Mode.AddFolder)) }>
                A
            </Item>
            <Item onClick={ e => dispatch(setMode(Mode.AddFeed)) }>
                B
            </Item>
            <Item onClick={ e => dispatch(setMode(Mode.Edit)) }>
                C
            </Item>
            <Item onClick={ e => dispatch(setMode(Mode.Delete)) }>
                D
            </Item>
        </div>
    )
}


export default Toolbar;
