import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectItems, setSelectedItem, selectSelectedItem } from '../../store/feed-slice';

import FeedItem from './FeedItem';

import './FeedBrowser.css';


const FeedBrowser: React.FC = () => {
    const dispatch = useDispatch();
    const items = useSelector(selectItems);
    const selectedItem = useSelector(selectSelectedItem);

    return (
        <div className="FeedBrowser">
            { items.map(i =>
                  <FeedItem
                      item={ i }
                        selected={ i.id === selectedItem?.id }
                        onClick={ (evt, item) => {
                          dispatch(setSelectedItem(item))
                      } }
                  />)
            }
        </div>
    );
}


export default FeedBrowser;
