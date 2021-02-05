import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
    SubscriptionTreeFeed, SubscriptionTreeNodeType,
    addFeed, updateFeed
} from '../../api';
import { selectSubscriptions } from '../../store/subscriptions-slice';

import { Form, FormInput, FormSubmit } from '../form';
import Tree, { SelectedNode } from '../tree';


interface Props {
    feed?: SubscriptionTreeFeed;
    onDone?: () => void;
}


function selectNode(node: SubscriptionTreeFeed): SelectedNode {
    return {
        type: SubscriptionTreeNodeType.Folder,
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
        useState<SelectedNode | undefined>(feed ? selectNode(feed) : undefined);
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
                disabled={ feed !== undefined }
                value={ url }
                setValue={ setUrl }
            />

            <Tree
                className="SubscriptionsEditor__Form__Tree"
                tree={ subscriptions }
                selectedNode={ selectedNode }
                onClick={ (e, f) => {
                    e.stopPropagation();

                    if (f.type === SubscriptionTreeNodeType.Feed)
                        return;

                    if (f.id === selectedNode?.id) {
                        setSelectedNode(undefined);
                        setParent(undefined);
                    } else {
                        setSelectedNode(f);
                        setParent(f.id);
                    }
                } }
            />

            <FormSubmit
                text={ feed === undefined
                       ? "Add feed"
                       : "Edit feed" }
            />
        </Form>
    );
}


export default FeedForm;
