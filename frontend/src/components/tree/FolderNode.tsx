import React from 'react';

import { Folder } from '../../api';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    folder: Folder;
    onClick?: (evt: OnClickEvent) => void;
}


const FolderNode: React.FC<Props> = ({
    children,
    folder,
    onClick = (evt: OnClickEvent) => null
}) => {
    const {id, name} = folder;

    return (
        <div className="Tree__Folder">
            <div
                className="Tree__item"
                onClick={onClick}
            >
                <span className="Tree__item__name">{name}</span>
            </div>

          { children &&
            <div className="Tree__Folder__children">
                {children}
            </div>
          }
        </div>
    );
};


export default FolderNode;
