import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import { addFolder, SubscriptionTreeNode, addFeed} from '../../api';
import {selectSubscriptions} from '../../store/subscriptions-slice';

import {Form, FormInput, FormSubmit} from '../form';

import Tree from '../tree';


interface Props {
    onDone?: () => void;
}


const AddFeedForm: React.FC<Props> = ({
    onDone = () => null
}) => {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [parent, setParent] = useState<number | undefined>(undefined);
    const [selectedNode, setSelectedNode] = useState<SubscriptionTreeNode| undefined>(undefined);
    const subscriptions = useSelector(selectSubscriptions);

    return (
        <Form onSubmit={() => { addFeed(url, name, parent).then(res => onDone()) }}>
            <FormInput
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                setValue={setName}
            />

            <FormInput
                type="text"
                name="url"
                placeholder="URL"
                value={url}
                setValue={setUrl}
            />

            <Tree
                tree={subscriptions}
                selectedNode={selectedNode}
                onClick={(e, f) => {
                    e.stopPropagation();
                    setSelectedNode(f);
                    setParent(f.id);
                }}
            />

            <FormSubmit/>
        </Form>
    );

}


export default AddFeedForm;
