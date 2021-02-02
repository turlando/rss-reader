import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {fetchSubscriptions, selectSubscriptions} from '../../store/subscriptions-slice';

import Toolbar from '../toolbar';
import Tree from '../tree';

import './SubscriptionsBrowser.css';


const SubscriptionsBrowser: React.FC = () => {
    const dispatch = useDispatch();
    const subscriptions = useSelector(selectSubscriptions);

    useEffect(() => {
        dispatch(fetchSubscriptions());
    }, []);

    return (
        <div className="SubscriptionsBrowser">
            <div className="SubscriptionsBrowser__Tree">
                <Tree tree={subscriptions}/>
            </div>
            <div className="SubscriptionsBrowser__Toolbar">
                <Toolbar/>
            </div>
        </div>
    );
}


export default SubscriptionsBrowser;
