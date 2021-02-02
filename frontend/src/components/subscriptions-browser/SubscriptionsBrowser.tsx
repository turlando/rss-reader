import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SubscriptionTreeNode } from '../../api';
import {fetchSubscriptions, selectSubscriptions} from '../../store/subscriptions-slice';

import Toolbar from '../toolbar';
import Tree from '../tree';

import './SubscriptionsBrowser.css';


// deduplicate from Tree.tsx
export const nodeId = (node: SubscriptionTreeNode): string => {
    return `${node.type}-${node.id}`;
}


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
                onClick={(e, f) => {setSelectedNode(nodeId(f))}}
            />
            </div>
            <div className="SubscriptionsBrowser__Toolbar">
                <Toolbar/>
            </div>
        </div>
    );
}


export default SubscriptionsBrowser;
