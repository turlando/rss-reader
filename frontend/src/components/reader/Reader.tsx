import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    SubscriptionTreeNodeType,
    removeFolder, removeFeed
} from '../../api';

import {
    Mode,
    selectMode, setMode
} from '../../store/reader-slice';

import {
    fetchSubscriptions,
    selectSelectedNode, setSelectedNode
} from '../../store/subscriptions-slice';

import {
    setFeed,
    setItems, setSelectedItem
} from '../../store/feed-slice';

import Modal from '../modal';
import { Dialog, DialogText, DialogButtons, DialogButton } from '../dialog';
import SubscriptionsBrowser from '../subscriptions-browser';
import FeedBrowser from '../feed-browser';
import FeedItemViewer from '../feed-item-viewer';
import SubscriptionsEditor, { FolderForm, FeedForm } from '../subscriptions-editor';

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

            { mode !== Mode.Normal
           && <Modal
                  onClick={e => dispatch(setMode(Mode.Normal))}
                  blur={true}
              >

                { mode === Mode.AddFolder
               && <SubscriptionsEditor>
                      <FolderForm onDone={ () => {
                          dispatch(fetchSubscriptions());
                          dispatch(setMode(Mode.Normal));
                      } } />
                  </SubscriptionsEditor>
                }

                { mode === Mode.AddFeed
               && <SubscriptionsEditor>
                      <FeedForm onDone={ () => {
                          dispatch(fetchSubscriptions());
                          dispatch(setMode(Mode.Normal));
                      } } />
                  </SubscriptionsEditor>
                }

                { mode === Mode.Edit
              && selectedNode?.type === SubscriptionTreeNodeType.Folder
              && <SubscriptionsEditor>
                     <FolderForm
                         folder={selectedNode}
                         onDone={ () => {
                             dispatch(fetchSubscriptions());
                             dispatch(setMode(Mode.Normal));
                         } }
                     />
                 </SubscriptionsEditor>
                }

                { mode === Mode.Edit
               && selectedNode?.type === SubscriptionTreeNodeType.Feed
               && <SubscriptionsEditor>
                      <FeedForm
                          feed={selectedNode}
                          onDone={ () => {
                              dispatch(fetchSubscriptions());
                              dispatch(setMode(Mode.Normal));
                          } }
                      />
                  </SubscriptionsEditor>
                }

                { mode === Mode.Delete
               && selectedNode !== undefined
               && <Dialog>

                      <DialogText>
                          { selectedNode.type === SubscriptionTreeNodeType.Folder &&
                            <span>Are you really sure to remove "{selectedNode.name}" and
                            all its children?</span>
                          }
                          { selectedNode.type === SubscriptionTreeNodeType.Feed &&
                            <span>Are you really sure to remove "{selectedNode.title}"?</span>
                          }
                      </DialogText>

                      <DialogButtons>
                          <DialogButton
                              text="Remove"
                              onClick={ e => {
                                  if (selectedNode.type === SubscriptionTreeNodeType.Folder)
                                      return removeFolder(selectedNode.id)
                                          .then(() => {
                                              dispatch(setSelectedNode(undefined));
                                              dispatch(setFeed(undefined));
                                              dispatch(setItems([]));
                                              dispatch(setSelectedItem(undefined));
                                              dispatch(fetchSubscriptions());
                                              dispatch(setMode(Mode.Normal));
                                          })
                                  if (selectedNode.type === SubscriptionTreeNodeType.Feed)
                                      return removeFeed(selectedNode.id)
                                          .then(() => {
                                              dispatch(setSelectedNode(undefined));
                                              dispatch(setFeed(undefined));
                                              dispatch(setItems([]));
                                              dispatch(setSelectedItem(undefined));
                                              dispatch(fetchSubscriptions());
                                              dispatch(setMode(Mode.Normal));
                                          })
                              } }
                              primary
                          />
                          <DialogButton
                              text="Cancel"
                              onClick={ e => {
                                  dispatch(setMode(Mode.Normal));
                              }}
                          />
                      </DialogButtons>
                  </Dialog>
                }
              </Modal>
            }

        </div>
    );
};


export default Reader;
