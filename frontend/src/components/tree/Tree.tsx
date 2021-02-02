import React from 'react';

import {
    SubscriptionTree, SubscriptionTreeNode, SubscriptionTreeNodeType,
    Folder, Feed
} from '../../api';

import FolderNode from './FolderNode';
import FeedNode from './FeedNode';

import './Tree.css';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    tree: SubscriptionTree;
    onFolderClick?: (evt: OnClickEvent, folder: Folder) => void;
    onFeedClick?: (evt: OnClickEvent, feed: Feed) => void;
}


const Tree: React.FC<Props> = ({
    tree,
    onFolderClick = (evt: OnClickEvent, folder: Folder) => null,
    onFeedClick = (evt: OnClickEvent, feed: Feed) => null
}) => {
    const makeNode = nodeMaker(onFolderClick, onFeedClick);

    return (
        <div className="Tree">
            {tree.map(node => makeNode(node))}
        </div>
    );
};


const nodeMaker = (
    onFolderClick: (evt: OnClickEvent, folder: Folder) => void,
    onFeedClick: (evt: OnClickEvent, feed: Feed) => void
) => function fn(node: SubscriptionTreeNode) {
    if (
        node.type === SubscriptionTreeNodeType.Folder
     && node.children.length === 0
    ) {
        return (
            <FolderNode
                key={`folder-${node.id}`}
                folder={node}
                onClick={evt => onFolderClick(evt, node)}
            />
        );
    }

    if (
        node.type === SubscriptionTreeNodeType.Folder
     && node.children.length !== 0
    ) {
        return (
            <FolderNode
                key={`folder-${node.id}`}
                folder={node}
                onClick={evt => onFolderClick(evt, node)}
            >
                {node.children.map(child => fn(child))}
            </FolderNode>
        );
    }

    if (node.type === SubscriptionTreeNodeType.Feed)
        return (
            <FeedNode
                key={`feed-${node.id}`}
                feed={node}
                onClick={evt => onFeedClick(evt, node)}
            />
        );
};


export default Tree;
