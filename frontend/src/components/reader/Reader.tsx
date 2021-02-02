import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Mode, selectMode, setMode} from '../../store/reader-slice';
import { fetchSubscriptions } from '../../store/subscriptions-slice';

import Modal from '../modal';
import SubscriptionsBrowser from '../subscriptions-browser';
import FeedBrowser from '../feed-browser';
import FeedItemViewer from '../feed-item-viewer';
import {AddFolderForm} from '../subscriptions-editor';

import './Reader.css';


const Reader: React.FC = () => {
    const dispatch = useDispatch();
    const mode = useSelector(selectMode);

    return (
        <div className="Reader">

            <div className="Reader__SubscriptionsBrowser">
                <SubscriptionsBrowser/>
            </div>

            <div className="Reader__FeedBrowser">
                <FeedBrowser/>
            </div>

            <div className="Reader__ItemViewer">
                <FeedItemViewer/>
            </div>

            { mode !== Mode.Normal &&
              <Modal
                  onClick={e => dispatch(setMode(Mode.Normal))}
                  blur={true}
              >
                { mode === Mode.AddFolder &&
                  <AddFolderForm onDone={() => {
                      dispatch(fetchSubscriptions());
                      dispatch(setMode(Mode.Normal));
                    }}/>
                }
                { mode === Mode.AddFeed &&
                  <p>Add folder</p>
                }
                { mode === Mode.Edit &&
                  <p>Edit</p>
                }
                { mode === Mode.Delete &&
                  <p>Delete</p>
                }
              </Modal>
            }

        </div>
    );
};


export default Reader;
