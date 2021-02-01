import React from 'react';

import Toolbar from '../toolbar';

import './SubscriptionsBrowser.css';


const SubscriptionsBrowser: React.FC = () => {
    return (
        <div className="SubscriptionsBrowser">
            <div className="SubscriptionsBrowser__Tree">
                Tree
            </div>
            <div className="SubscriptionsBrowser__Toolbar">
                <Toolbar/>
            </div>
        </div>
    );
}


export default SubscriptionsBrowser;
