import React, {useState} from 'react';
import classnames from 'classnames';

import { Folder } from '../../api';
import Icon, {IconName} from '../icon';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    folder: Folder;
    selected?: boolean;
    onClick?: (evt: OnClickEvent) => void;
}


const FolderNode: React.FC<Props> = ({
    children,
    folder,
    selected = false,
    onClick = (evt: OnClickEvent) => null
}) => {
    const [open, setOpen] = useState(true);
    const { name } = folder;

    const toggleOpen = (evt: OnClickEvent) => {
        evt.stopPropagation();
        setOpen(!open);
    }

    return (
        <div className="Tree__Folder">
            <div
                className={ classnames("Tree__Node", {
                    "Tree__Node--selected": selected
                }) }
                onClick={ onClick }
            >
                <span
                    className="Tree__Node__icon"
                    onClick={ toggleOpen }
                >
                    { open
                      ? <Icon icon={IconName.CaretDown} />
                      : <Icon icon={IconName.CaretRight} />
                    }
                </span>
                <span className="Tree__Node__icon">
                    <Icon icon={IconName.Folder} />
                </span>
                <span className="Tree__Node__name">{ name }</span>
            </div>

          { children && open &&
            <div className="Tree__Folder__children">
                { children }
            </div>
          }
        </div>
    );
};


export default FolderNode;
