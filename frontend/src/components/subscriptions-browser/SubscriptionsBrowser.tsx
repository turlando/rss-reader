import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SubscriptionTreeNodeType } from '../../api';
import { fetchFeed } from '../../store/feed-slice';
import {
    selectSubscriptions, fetchSubscriptions,
    selectSelectedNode, setSelectedNode
} from '../../store/subscriptions-slice';

import Toolbar from '../toolbar';
import Tree from '../tree';

import './SubscriptionsBrowser.css';


const SubscriptionsBrowser: React.FC = () => {
    const dispatch = useDispatch();
    const subscriptions = useSelector(selectSubscriptions);
    const selectedNode = useSelector(selectSelectedNode);

    useEffect(() => {
        dispatch(fetchSubscriptions());
    }, []);

    return (
        <div className="SubscriptionsBrowser">
            <div className="SubscriptionsBrowser__Tree">
                <Tree
                    tree={ subscriptions }
                    selectedNode={ selectedNode }
                    onClick={ (e, f) => {
                        dispatch(setSelectedNode(f));
                        if (f.type === SubscriptionTreeNodeType.Feed)
                            dispatch(fetchFeed(f));
                    } }
                />
            </div>
            <div className="SubscriptionsBrowser__Toolbar">
                <Toolbar/>
            </div>
        </div>
    );
}


export default SubscriptionsBrowser;
