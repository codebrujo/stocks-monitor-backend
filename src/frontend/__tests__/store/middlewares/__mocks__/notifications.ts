/**
 * Notifications middleware module
 */
import { Store } from 'redux';
import { Dispatch, AnyAction } from 'redux';
import {
  NOTIFICATIONS_LOAD_START,
  NOTIFICATIONS_ADD_START,
  NOTIFICATIONS_DELETE_START,
} from 'frontendRoot/constants';
import {
  loadComplete,
  addComplete,
  deleteComplete,
} from 'actions/notifications';

import { mockNotifications } from '../../__mocks__';

import { updateNotificationOption } from 'actions/stocks';

export default (store: Store) => (next: Dispatch) => (
  action: AnyAction
): AnyAction => {
  switch (action.type) {
    case NOTIFICATIONS_LOAD_START:
      store.dispatch(loadComplete({ entities: mockNotifications.entities }));
      break;
    case NOTIFICATIONS_ADD_START:
      store.dispatch(addComplete(action.payload));
      store.dispatch(
        updateNotificationOption({ ...action.payload, action: 'add' })
      );
      break;
    case NOTIFICATIONS_DELETE_START:
      store.dispatch(deleteComplete(action.payload));
      store.dispatch(updateNotificationOption(action.payload));
      break;
  }
  return next(action);
};
