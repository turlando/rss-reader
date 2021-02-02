import React from 'react';

import {
    SubscriptionTree, SubscriptionTreeNode, SubscriptionTreeNodeType,
    treeNodeKey
} from '../../api';

import FolderNode from './FolderNode';
import FeedNode from './FeedNode';

import './Tree.css';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    tree: SubscriptionTree;
    selectedNode?: SubscriptionTreeNode;
    onClick?: (evt: OnClickEvent, node: SubscriptionTreeNode) => void;
}


const Tree: React.FC<Props> = ({
    tree,
    selectedNode = undefined,
    onClick = (evt: OnClickEvent, node: SubscriptionTreeNode) => null,
}) => {
    const makeNode = nodeMaker(onClick, selectedNode);

    return (
        <div className="Tree">
            {tree.map(node => makeNode(node))}
        </div>
    );
};


const nodeMaker = (
    onClick: (evt: OnClickEvent, node: SubscriptionTreeNode) => void,
    selectedNode?: SubscriptionTreeNode
) => function fn(node: SubscriptionTreeNode) {
    if (
        node.type === SubscriptionTreeNodeType.Folder
     && node.children.length === 0
    ) {
        return (
            <FolderNode
                key={treeNodeKey(node)}
                folder={node}
                selected={selectedNode?.type === node.type && selectedNode?.id === node.id}
                onClick={evt => onClick(evt, node)}
            />
        );
    }

    if (
        node.type === SubscriptionTreeNodeType.Folder
     && node.children.length !== 0
    ) {
        return (
            <FolderNode
                key={treeNodeKey(node)}
                folder={node}
                selected={selectedNode?.type === node.type && selectedNode?.id === node.id}
                onClick={evt => onClick(evt, node)}
            >
                {node.children.map(child => fn(child))}
            </FolderNode>
        );
    }

    if (node.type === SubscriptionTreeNodeType.Feed)
        return (
            <FeedNode
                key={treeNodeKey(node)}
                feed={node}
                selected={selectedNode?.type === node.type && selectedNode?.id === node.id}
                onClick={evt => onClick(evt, node)}
            />
        );
};


export default Tree;
