import { notificationState } from 'interfaces/Notification';
import { IAction } from 'interfaces/Store';
import {
    NOTIFICATIONS_LOAD_START,
    NOTIFICATIONS_LOAD_COMPLETE,
    NOTIFICATIONS_LOAD_FAIL,
    NOTIFICATIONS_ADD_COMPLETE,
    NOTIFICATIONS_ADD_FAIL,
    NOTIFICATIONS_DELETE_COMPLETE,
    NOTIFICATIONS_DELETE_FAIL,
    NOTIFICATIONS_CLEAR,
} from 'frontendRoot/constants';

export const initialState = {
    loading: false,
    entities: [],
};

export default function notificationReducer(state: notificationState = initialState, action: IAction): notificationState {
    switch (action.type) {
        case NOTIFICATIONS_LOAD_START:
            {
                return {
                    ...state,
                    loading: true,
                };
            }
        case NOTIFICATIONS_LOAD_COMPLETE:
            {
                return {
                    loading: false,
                    ...action.payload,
                };
            }
        case NOTIFICATIONS_LOAD_FAIL:
            {
                return {
                    loading: false,
                    entities: [],
                };
            }
        case NOTIFICATIONS_ADD_COMPLETE:
            {
                const { entities } = state;
                const { ticker, highPrice, lowPrice } = action.payload;
                const idx = entities.findIndex(item => item.ticker === ticker);
                if (idx === -1) { //not found in reference array
                    entities.push({ ticker, highPrice, lowPrice });
                } else {
                    entities[idx] = { ticker, highPrice, lowPrice };
                }
                return {
                    ...state,
                    entities,
                    loading: false,
                };
            }
        case NOTIFICATIONS_ADD_FAIL:
            {
                return {
                    ...state,
                    loading: false,
                };
            }
        case NOTIFICATIONS_DELETE_COMPLETE:
            {
                const { entities } = state;
                const { ticker } = action.payload;
                const idx = entities.findIndex(item => item.ticker === ticker);
                if (idx !== -1) {
                    entities.splice(idx, 1);
                }
                return {
                    ...state,
                    entities,
                };
            }
        case NOTIFICATIONS_DELETE_FAIL:
            {
                return {
                    ...state,
                };
            }
        case NOTIFICATIONS_CLEAR:
            {
                return {
                    ...initialState,
                };
            }
        default:
            return state;
    }
}
