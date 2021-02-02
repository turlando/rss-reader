import React from 'react';

import {SubscriptionTree, SubscriptionTreeNode, SubscriptionTreeNodeType} from '../../api';

import FolderNode from './FolderNode';
import FeedNode from './FeedNode';

import './Tree.css';


interface Props {
    tree: SubscriptionTree;
}


const Tree: React.FC<Props> = ({tree}) => {
    return (
        <div className="Tree">
            {tree.map(node => makeNode(node))}
        </div>
    );
};


const makeNode = (node: SubscriptionTreeNode) => {
    if (node.type === SubscriptionTreeNodeType.Folder && node.children.length === 0)
        return <FolderNode key={`folder-${node.id}`} folder={node}/>;

    if (node.type === SubscriptionTreeNodeType.Folder && node.children.length !== 0)
        return (
            <FolderNode key={`folder-${node.id}`} folder={node}>
                {node.children.map(child => makeNode(child))}
            </FolderNode>
        );

    if (node.type === SubscriptionTreeNodeType.Feed)
        return <FeedNode key={`feed-${node.id}`} feed={node}/>;
};


export default Tree;
