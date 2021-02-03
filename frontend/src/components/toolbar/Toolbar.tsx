import React from 'react';
import { useDispatch } from 'react-redux';

import { Mode, setMode } from '../../store/reader-slice';

import Item from './Item';
import Icon, { IconName } from '../icon';

import './Toolbar.css';


const Toolbar: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <div className="Toolbar">
            <Item onClick={ e => dispatch(setMode(Mode.AddFeed)) }>
                <Icon icon={IconName.Add} />
            </Item>
            <Item onClick={ e => dispatch(setMode(Mode.AddFolder)) }>
                <Icon icon={IconName.FolderOpen} />
            </Item>
            <Item onClick={ e => dispatch(setMode(Mode.Edit)) }>
                <Icon icon={IconName.Edit} />
            </Item>
            <Item onClick={ e => dispatch(setMode(Mode.Delete)) }>
                <Icon icon={IconName.Trash} />
            </Item>
        </div>
    )
}


export default Toolbar;
