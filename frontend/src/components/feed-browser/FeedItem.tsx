import React from 'react';
import classnames from 'classnames';

import { Item } from '../../api';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    item: Item;
    selected?: boolean,
    onClick?: (evt: OnClickEvent, item: Item) => void;
}

const FeedItem: React.FC<Props> = ({
    item,
    selected = false,
    onClick = (evt: OnClickEvent) => null
}) => {
    return (
        <div
            className={ classnames("FeedBrowser__Item", {
                "FeedBrowser__Item--selected": selected,
            }) }
            onClick={ e => onClick(e, item) }
        >
            <span className="FeedBrowser__Item__title">{ item.title }</span>
            <span className="FeedBrowser__Item__date">{ item.date }</span>
        </div>
    );
}


export default FeedItem;
