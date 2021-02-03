import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Mode, setMode } from '../../store/reader-slice';
import { selectSelectedNode } from '../../store/subscriptions-slice';
import { fetchFeedUpdate, selectFeed } from '../../store/feed-slice';

import Item from './Item';
import Icon, { IconName } from '../icon';

import './Toolbar.css';


const Toolbar: React.FC = () => {
    const dispatch = useDispatch();
    const selectedNode = useSelector(selectSelectedNode);
    const activeFeed = useSelector(selectFeed);

    return (
        <div className="Toolbar">
            <Item onClick={ e => {
                dispatch(setMode(Mode.AddFeed))
            } }>
                <Icon icon={IconName.Add} />
            </Item>

            <Item onClick={ e => {
                dispatch(setMode(Mode.AddFolder))
            } }>
                <Icon icon={IconName.FolderOpen} />
            </Item>

            <Item onClick={ e => {
                dispatch(setMode(Mode.Edit))
            } }>
                <Icon icon={IconName.Edit} />
            </Item>

            <Item
                disabled={ selectedNode === undefined }
                onClick={ e => {
                    dispatch(setMode(Mode.Delete))
                } }>
                <Icon icon={IconName.Trash} />
            </Item>

            <Item
                disabled={ activeFeed === undefined }
                onClick={ e => {
                    if (activeFeed === undefined) return;
                    dispatch(fetchFeedUpdate(activeFeed));
                } }>
                <Icon icon={IconName.Refresh} />
            </Item>
        </div>
    )
}


export default Toolbar;
