import React from 'react';
import {useSelector} from 'react-redux';

import {selectSelectedItem} from '../../store/feed-slice';


const FeedItemViewer: React.FC = () => {
    const item = useSelector(selectSelectedItem);

    return (
        <div className="FeedItemViewer">
            {item && <p>{item.description}</p>}
        </div>
    );
}


export default FeedItemViewer;
