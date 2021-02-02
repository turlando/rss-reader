import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {treeNodeKey, addFolder} from '../../api';
import {selectSubscriptions} from '../../store/subscriptions-slice';

import {Form, FormInput, FormSubmit} from '../form';

import Tree from '../tree';


interface Props {
    onDone?: () => void;
}


const AddFolderForm: React.FC<Props> = ({
    onDone = () => null
}) => {
    const [name, setName] = useState("");
    const [parent, setParent] = useState<number | undefined>(undefined);
    const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);
    const subscriptions = useSelector(selectSubscriptions);

    return (
        <Form onSubmit={() => { addFolder(name, parent).then(res => onDone()) }}>
            <FormInput
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                setValue={setName}
            />

            <Tree
                tree={subscriptions}
                selectedNode={selectedNode}
                onClick={(e, f) => {
                    e.stopPropagation();
                    setSelectedNode(treeNodeKey(f));
                    setParent(f.id);
                }}
            />

            <FormSubmit/>
        </Form>
    );

}


export default AddFolderForm;
