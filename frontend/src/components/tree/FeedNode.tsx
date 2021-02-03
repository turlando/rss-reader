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
            className={ classnames("Tree__Node Tree__Feed", {
                "Tree__Node--selected": selected,
            }) }
            onClick={ onClick }
        >
            <span className="Tree__Node__name">{ title }</span>
        </div>
    );
};


export default FeedNode;
