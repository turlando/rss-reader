import React from 'react';

// Icons from https://ionicons.com/
import { ReactComponent as Add } from './add-circle-outline.svg';
import { ReactComponent as CaretDown } from './caret-down-outline.svg';
import { ReactComponent as CaretRight } from './caret-forward-outline.svg';
import { ReactComponent as Edit } from './create-outline.svg';
import { ReactComponent as FolderOpen } from './folder-open-outline.svg';
import { ReactComponent as Folder } from './folder-outline.svg';
import { ReactComponent as LogOut } from './log-out-outline.svg';
import { ReactComponent as Rss } from './logo-rss.svg';
import { ReactComponent as Refresh } from './refresh-outline.svg';
import { ReactComponent as Trash } from './trash-outline.svg';


export enum IconName {
    Add = "add",
    CaretDown = "caret_down",
    CaretRight = "caret_right",
    Edit = "edit",
    FolderOpen = "folder_open",
    Folder = "folder",
    LogOut = "log_out",
    Rss = "rss",
    Refresh = "refresh",
    Trash = "trash",
}


const ICON_NAME_TO_COMPONENT: Record<IconName, React.ReactElement> = {
    [IconName.Add]: <Add title=""/>,
    [IconName.CaretDown]: <CaretDown title=""/>,
    [IconName.CaretRight]: <CaretRight title=""/>,
    [IconName.Edit]: <Edit title=""/>,
    [IconName.FolderOpen]: <FolderOpen title=""/>,
    [IconName.Folder]: <Folder title=""/>,
    [IconName.LogOut]: <LogOut title=""/>,
    [IconName.Rss]: <Rss title=""/>,
    [IconName.Refresh]: <Refresh title=""/>,
    [IconName.Trash]: <Trash title=""/>,
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
