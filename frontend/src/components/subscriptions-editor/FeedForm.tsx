import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
    SubscriptionTreeFeed, SubscriptionTreeNodeType,
    addFeed, updateFeed
} from '../../api';
import { selectSubscriptions } from '../../store/subscriptions-slice';

import { Form, FormInput, FormSubmit } from '../form';
import Tree, {SelectedNode} from '../tree';


interface Props {
    feed?: SubscriptionTreeFeed;
    onDone?: () => void;
}


function selectFolder(node: SubscriptionTreeFeed): SelectedNode {
    return {
        type: SubscriptionTreeNodeType.Feed,
        id: node.folderId,
    }
}


const FeedForm: React.FC<Props> = ({
    feed = undefined,
    onDone = () => null
}) => {
    const [name, setName] = useState(feed?.title || "");
    const [url, setUrl] = useState(feed?.url || "");
    const [parent, setParent] = useState<number | undefined>(feed?.folderId);
    const [selectedNode, setSelectedNode] =
        useState<SelectedNode | undefined>(feed ? selectFolder(feed) : undefined);
    const subscriptions = useSelector(selectSubscriptions);

    return (
        <Form onSubmit={ () => {
            if (feed === undefined)
                return addFeed(url, name, parent).then(res => onDone())
            return updateFeed(feed.id, name, parent).then(res => onDone())
        } }>
            <FormInput
                type="text"
                name="name"
                placeholder="Name"
                value={ name }
                setValue={ setName }
            />

            <FormInput
                type="text"
                name="url"
                placeholder="URL"
                value={ url }
                setValue={ setUrl }
            />

            <Tree
                tree={ subscriptions }
                selectedNode={ selectedNode }
                onClick={ (e, f) => {
                    e.stopPropagation();
                    setSelectedNode(f);
                    setParent(f.id);
                } }
            />

            <FormSubmit/>
        </Form>
    );
}


export default FeedForm;
