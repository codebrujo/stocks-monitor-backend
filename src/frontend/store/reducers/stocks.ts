import {
    STOCKS_LOAD_START,
    STOCKS_LOAD_COMPLETE,
    STOCKS_LOAD_FAIL,
    STOCKS_UPDATE_NOTIFICATION,
    STOCKS_CLEAR,
} from 'frontendRoot/constants';

import { IStock } from 'interfaces/Stock';
import { IAction } from 'interfaces/Store';

export const initialState: IStock = {
    loading: false,
    entities: [],
    message: ''
};

export default function stocksReducer(state: IStock = initialState, action: IAction): IStock {
    switch (action.type) {
        case STOCKS_LOAD_START:
            {
                console.log('[stocksReducer]', action.type, action.payload);
                return {
                    ...state,
                    message: '',
                    loading: true,
                };
            }
        case STOCKS_LOAD_COMPLETE:
            {
                console.log('[stocksReducer]', action.type, action.payload);
                const entities = {};
                Object.assign(entities, state.entities, action.payload);
                return {
                    loading: false,
                    ...action.payload,
                };
            }
        case STOCKS_LOAD_FAIL:
            {
                console.log('[stocksReducer]', action.type, action.payload);
                return {
                    ...initialState,
                    ...action.payload
                };
            }
        case STOCKS_UPDATE_NOTIFICATION:
            {
                console.log('[stocksReducer]', action.type, action.payload);
                const { payload } = action;
                const entities = [];
                Object.assign(entities, state.entities);
                const ref = entities.find(item => item.ticker === payload.ticker);
                if (typeof ref === 'undefined') {
                    return {
                        ...state,
                    };
                } else {
                    ref.notification = payload.action === 'add' ? true : false;
                    return {
                        ...state,
                        entities
                    };
                }
            }
        case STOCKS_CLEAR:
            {
                return {
                    ...initialState,
                };
            }
        default:
            return state;
    }
}