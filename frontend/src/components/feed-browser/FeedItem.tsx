import React from 'react';

import {Item} from '../../api';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    item: Item;
    onClick: (evt: OnClickEvent, item: Item) => void;
}

const FeedItem: React.FC<Props> = ({item, onClick}) => {
    return (
        <div
            className="FeedBrowser__Item"
            onClick={e => onClick(e, item)}
        >
            <span className="FeedBrowser__Item__title">{item.title}</span>
            <span className="FeedBrowser__Item__date">{item.date}</span>
        </div>
    );
}


export default FeedItem;
