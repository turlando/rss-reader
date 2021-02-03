import React from 'react';
import { useSelector, useDispatch} from 'react-redux';

import {selectItems, setSelectedItem} from '../../store/feed-slice';

import FeedItem from './FeedItem';


const FeedBrowser: React.FC = () => {
    const dispatch = useDispatch();
    const items = useSelector(selectItems);

    return (
        <div className="FeedBrowser">
            { items.map(i =>
                <FeedItem
                    item={i}
                    onClick={(evt, item) => {
                        dispatch(setSelectedItem(item))
                    }}
                />)
            }
        </div>
    );
}


export default FeedBrowser;
