import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import { removeFolder, SubscriptionTreeNodeType, removeFeed} from '../../api';
import {Mode, selectMode, setMode} from '../../store/reader-slice';
import {fetchSubscriptions, selectSelectedNode} from '../../store/subscriptions-slice';

import Modal from '../modal';
import {Dialog, DialogText, DialogButtons, DialogButton} from '../dialog';
import SubscriptionsBrowser from '../subscriptions-browser';
import FeedBrowser from '../feed-browser';
import FeedItemViewer from '../feed-item-viewer';
import {AddFolderForm} from '../subscriptions-editor';

import './Reader.css';


const Reader: React.FC = () => {
    const dispatch = useDispatch();
    const mode = useSelector(selectMode);
    const selectedNode = useSelector(selectSelectedNode);

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
                  <Dialog>
                      <DialogText>
                          <p>Are you really sure to remove this?</p>
                      </DialogText>
                      <DialogButtons>
                          <DialogButton
                              text="Remove"
                              onClick={e => {
                                  if (selectedNode?.type === SubscriptionTreeNodeType.Folder)
                                      return removeFolder(selectedNode.id)
                                          .then(() => {
                                              dispatch(fetchSubscriptions())
                                              dispatch(setMode(Mode.Normal))
                                          })
                                  if (selectedNode?.type === SubscriptionTreeNodeType.Feed)
                                      return removeFeed(selectedNode.id)
                                          .then(() => {
                                              dispatch(fetchSubscriptions())
                                              dispatch(setMode(Mode.Normal))
                                          })
                              }}
                              primary />
                          <DialogButton text="Cancel" />
                      </DialogButtons>
                  </Dialog>
                }
              </Modal>
            }

        </div>
    );
};


export default Reader;
