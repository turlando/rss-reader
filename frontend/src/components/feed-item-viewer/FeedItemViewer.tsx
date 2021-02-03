import React from 'react';
import { useSelector } from 'react-redux';

import { selectSelectedItem } from '../../store/feed-slice';

import './FeedItemViewer.css';


const FeedItemViewer: React.FC = () => {
    const item = useSelector(selectSelectedItem);

    return (
        <div
            className="FeedItemViewer"
            dangerouslySetInnerHTML={ item && {__html: item.description} }
        />
    );
}


export default FeedItemViewer;
