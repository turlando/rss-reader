import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SubscriptionTreeNode, treeNodeKey, SubscriptionTreeNodeType } from '../../api';
import {fetchSubscriptions, selectSubscriptions} from '../../store/subscriptions-slice';

import Toolbar from '../toolbar';
import Tree from '../tree';

import './SubscriptionsBrowser.css';
import { fetchFeed } from '../../store/feed-slice';


const SubscriptionsBrowser: React.FC = () => {
    const dispatch = useDispatch();
    const subscriptions = useSelector(selectSubscriptions);
    const [selectedNode, setSelectedNode]= useState<string | undefined>(undefined);

    useEffect(() => {
        dispatch(fetchSubscriptions());
    }, []);

    return (
        <div className="SubscriptionsBrowser">
            <div className="SubscriptionsBrowser__Tree">
            <Tree
                tree={subscriptions}
                selectedNode={selectedNode}
                onClick={(e, f) => {
                    setSelectedNode(treeNodeKey(f))
                    if (f.type === SubscriptionTreeNodeType.Feed)
                        dispatch(fetchFeed(f))
                }}
            />
            </div>
            <div className="SubscriptionsBrowser__Toolbar">
                <Toolbar/>
            </div>
        </div>
    );
}


export default SubscriptionsBrowser;
