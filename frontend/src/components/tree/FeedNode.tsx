import React from 'react';
import classnames from 'classnames';

import { Feed } from '../../api';


type OnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

interface Props {
    feed: Feed;
    selected?: boolean;
    onClick?: (evt: OnClickEvent) => void;
}


const FeedNode: React.FC<Props> = ({
    feed,
    selected = false,
    onClick = (evt: OnClickEvent) => null
}) => {
    const { title } = feed;

    return (
        <div
            className={ classnames("Tree__Feed Tree_item", {
                "Tree__item--selected": selected,
            }) }
            onClick={ onClick }
        >
            <span className="Tree__item__name">{ title }</span>
        </div>
    );
};


export default FeedNode;
