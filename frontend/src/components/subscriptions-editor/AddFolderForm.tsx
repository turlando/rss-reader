import React, {useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';

import {treeNodeKey, addFolder} from '../../api';
import {selectSubscriptions, fetchSubscriptions} from '../../store/subscriptions-slice';

import Tree from '../tree';


/* Form ***********************************************************************/

const Form: React.FC = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [parent, setParent] = useState<number | undefined>(undefined);
    const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);
    const subscriptions = useSelector(selectSubscriptions);

    // FIXME when having onSubmit in form tag the browser reports:
    // Form submission canceled because the form is not connected
    // Fixing by moving submit logic in button
    // Clean this mess
    return (
        <form >
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

            <SubmitButton onClick={evt => {
                evt.preventDefault();
                addFolder(name, parent)
                    .then(res => dispatch(fetchSubscriptions()));
            }}
            />
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

interface SubmitButtonProps {
    onClick: (e: any) => void
}

const SubmitButton: React.FC<SubmitButtonProps> = ({onClick}) =>
    <input
        className="Login__form__element Login__form__button"
        type="submit"
        name="Log in"
onClick={onClick}
    />;


/******************************************************************************/

export default Form;
