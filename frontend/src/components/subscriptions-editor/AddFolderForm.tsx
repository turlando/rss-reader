import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {treeNodeKey, addFolder} from '../../api';
import {selectSubscriptions} from '../../store/subscriptions-slice';

import Tree from '../tree';


/* Form ***********************************************************************/

interface Props {
    onDone?: () => void;
}

const Form: React.FC<Props> = ({
    onDone = () => null
}) => {
    const [name, setName] = useState("");
    const [parent, setParent] = useState<number | undefined>(undefined);
    const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);
    const subscriptions = useSelector(selectSubscriptions);

    return (
        <form onSubmit={evt => {
            evt.preventDefault();
            addFolder(name, parent)
                .then(res => onDone());
        }}>
            <Input type="text"
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

            <SubmitButton/>
        </form>
    );
}


/* Input **********************************************************************/

// TODO: deduplicate from Form.tsx
interface InputProps {
    type: "text" | "password";
    name: string;
    placeholder: string
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Input: React.FC<InputProps> = ({
    type,
    name,
    placeholder,
    value,
    setValue
}) => {
    return (
        <input
            className="Login__form__element Login__form__input"
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
        />
    );
}


/* SubmitButton ***************************************************************/

const SubmitButton: React.FC = () =>
    <input
        className="Login__form__element Login__form__button"
        type="submit"
        name="Log in"
    />;


/******************************************************************************/

export default Form;
