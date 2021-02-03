import React from 'react';

import {
    SubscriptionTree, SubscriptionTreeNode, SubscriptionTreeNodeType
} from '../../api';

import FolderNode from './FolderNode';
import FeedNode from './FeedNode';

import './Tree.css';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    tree: SubscriptionTree;
    selectedNode?: SelectedNode;
    onClick?: (evt: OnClickEvent, node: SubscriptionTreeNode) => void;
}

export interface SelectedNode {
    type: SubscriptionTreeNodeType;
    id?: number;
}


function isSelected(
    node: SubscriptionTreeNode,
    selectedNode?: SelectedNode
) {
    if (selectedNode === undefined)
        return false;
    return node.type === selectedNode.type && node.id === selectedNode.id;
}


const treeNodeKey = (node: SubscriptionTreeNode): string =>
    `${node.type}-${node.id}`;


const Tree: React.FC<Props> = ({
    tree,
    selectedNode = undefined,
    onClick = (evt: OnClickEvent, node: SubscriptionTreeNode) => null,
}) => {
    const makeNode = nodeMaker(onClick, selectedNode);

    return (
        <div className="Tree">
            { tree.map(node => makeNode(node)) }
        </div>
    );
};


const nodeMaker = (
    onClick: (evt: OnClickEvent, node: SubscriptionTreeNode) => void,
    selectedNode?: SelectedNode
) => function fn(node: SubscriptionTreeNode) {
    if (
        node.type === SubscriptionTreeNodeType.Folder
     && node.children.length === 0
    ) {
        return (
            <FolderNode
                key={ treeNodeKey(node) }
                folder={ node }
                selected={ isSelected(node, selectedNode) }
                onClick={ evt => onClick(evt, node) }
            />
        );
    }

    if (
        node.type === SubscriptionTreeNodeType.Folder
     && node.children.length !== 0
    ) {
        return (
            <FolderNode
                key={ treeNodeKey(node) }
                folder={ node }
                selected={ isSelected(node, selectedNode) }
                onClick={ evt => onClick(evt, node) }
            >
                { node.children.map(child => fn(child)) }
            </FolderNode>
        );
    }

    if (node.type === SubscriptionTreeNodeType.Feed)
        return (
            <FeedNode
                key={ treeNodeKey(node) }
                feed={ node }
                selected={ isSelected(node, selectedNode) }
                onClick={ evt => onClick(evt, node) }
            />
        );
};


export default Tree;
