import React from 'react';

import SubscriptionsBrowser from '../subscriptions-browser';

import './Reader.css';


const Reader: React.FC = () => {
    return (
        <div className="Reader">

            <div className="Reader__SubscriptionsBrowser">
                <SubscriptionsBrowser/>
            </div>

            <div className="Reader__FeedBrowser">
                FeedBrowser
            </div>

            <div className="Reader__ItemViewer">
                ItemViewer
            </div>
        </div>
    );
};


export default Reader;
