import React from 'react';

import { ReactComponent as Add } from './add-circle-outline.svg';
import { ReactComponent as CaretDown } from './caret-down-outline.svg';
import { ReactComponent as CaretRight } from './caret-forward-outline.svg';
import { ReactComponent as Edit } from './create-outline.svg';
import { ReactComponent as FolderOpen } from './folder-open-outline.svg';
import { ReactComponent as Folder } from './folder-outline.svg';
import { ReactComponent as Rss } from './logo-rss.svg';
import { ReactComponent as Trash } from './trash-outline.svg';


// Icon from https://ionicons.com/


export enum IconName {
    Add = "add",
    CaretDown = "caret_down",
    CaretRight = "caret_right",
    Edit = "edit",
    FolderOpen = "folder_open",
    Folder = "folder",
    Rss = "rss",
    Trash = "trash",
}


const ICON_NAME_TO_COMPONENT: Record<IconName, React.ReactElement> = {
    [IconName.Add]: <Add/>,
    [IconName.CaretDown]: <CaretDown/>,
    [IconName.CaretRight]: <CaretRight/>,
    [IconName.Edit]: <Edit/>,
    [IconName.FolderOpen]: <FolderOpen/>,
    [IconName.Folder]: <Folder/>,
    [IconName.Rss]: <Rss/>,
    [IconName.Trash]: <Trash/>,
};


interface Props {
    icon: IconName;
}


const Icon: React.FC<Props> = ({icon}) => {
    return (
        ICON_NAME_TO_COMPONENT[icon]
    );
}


export default Icon;
