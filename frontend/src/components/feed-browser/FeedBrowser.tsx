import React from 'react';
import {useSelector} from 'react-redux';

import {selectItems} from '../../store/feed-slice';

import FeedItem from './FeedItem';


const FeedBrowser: React.FC = () => {
    const items = useSelector(selectItems);

    return (
        <div className="FeedBrowser">
            {items.map(i => <FeedItem item={i}/>)}
        </div>
    );
}


export default FeedBrowser;
