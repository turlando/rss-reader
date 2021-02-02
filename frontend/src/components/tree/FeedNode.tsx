import React from 'react';

import {Feed} from '../../api';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    feed: Feed;
    onClick?: (evt: OnClickEvent) => void;
}


const FeedNode: React.FC<Props> = ({
    feed,
    onClick = (evt: OnClickEvent) => null
}) => {
    const {title} = feed;

    return (
        <div className="Tree__Feed Tree_item">
          <span className="Tree__item__name">{title}</span>
        </div>
    );
};


export default FeedNode;
