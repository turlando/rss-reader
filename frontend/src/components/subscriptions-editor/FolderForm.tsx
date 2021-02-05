import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {
    SubscriptionTreeFolder, SubscriptionTreeNodeType,
    addFolder, updateFolder
} from '../../api';
import {selectSubscriptions} from '../../store/subscriptions-slice';

import {Form, FormInput, FormSubmit} from '../form';
import Tree, {SelectedNode} from '../tree';


interface Props {
    folder?: SubscriptionTreeFolder
    onDone?: () => void;
}


function selectNode(node: SubscriptionTreeFolder): SelectedNode {
    return {
        type: SubscriptionTreeNodeType.Folder,
        id: node.id,
    }
}


const FolderForm: React.FC<Props> = ({
    folder = undefined,
    onDone = () => null
}) => {
    const [name, setName] = useState(folder?.name || "");
    const [parent, setParent] = useState<number | undefined>(folder?.parentFolderId);
    const [selectedNode, setSelectedNode] =
        useState<SelectedNode | undefined>(folder ? selectNode(folder) : undefined);
    const subscriptions = useSelector(selectSubscriptions);

    return (
        <Form onSubmit={ () => {
            if (folder === undefined)
                return addFolder(name, parent).then(res => onDone());
            return updateFolder(folder.id, name, parent).then(res => onDone());
        } }>
            <FormInput
                type="text"
                name="name"
                placeholder="Name"
                value={ name }
                setValue={ setName }
            />

            <Tree
                className="SubscriptionsEditor__Form__Tree"
                tree={ subscriptions }
                selectedNode={ selectedNode }
                onClick={ (e, f) => {
                    e.stopPropagation();

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
                text={ folder === undefined
                       ? "Add folder"
                       : "Edit folder" }
            />
        </Form>
    );
}


export default FolderForm;
