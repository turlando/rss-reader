import React from 'react';

import {Item} from '../../api';


interface Props {
    item: Item;
}

const FeedItem: React.FC<Props> = ({item}) => {
    return (
        <div className="FeedBrowser__Item">
            <span className="FeedBrowser__Item__title">{item.title}</span>
            <span className="FeedBrowser__Item__date">{item.date}</span>
        </div>
    );
}


export default FeedItem;
