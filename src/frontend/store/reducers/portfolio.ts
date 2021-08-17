import {
    PORTFOLIO_LOAD_START,
    PORTFOLIO_LOAD_COMPLETE,
    PORTFOLIO_LOAD_FAIL,
    PORTFOLIO_LOAD_SUMMARY_START,
    PORTFOLIO_LOAD_SUMMARY_COMPLETE,
    PORTFOLIO_LOAD_SUMMARY_FAIL,
    PORTFOLIO_ADD_START,
    PORTFOLIO_ADD_COMPLETE,
    PORTFOLIO_ADD_FAIL,
    PORTFOLIO_DELETE_START,
    PORTFOLIO_DELETE_COMPLETE,
    PORTFOLIO_DELETE_FAIL,
    PORTFOLIO_CLEAR,
} from 'frontendRoot/constants';
import { IAction } from 'interfaces/Store';
import { IPortfolio } from 'interfaces/Portfolio';

export const initialState: IPortfolio = {
    loading: false,
    message: '',
    entities: [],
    summary: {
        value: 0,
        gains: 0,
        dayChange: 0,
        rate: 1,
    }
};

export default function portfolioReducer(state: IPortfolio = initialState, action: IAction): IPortfolio {
    switch (action.type) {
        case PORTFOLIO_LOAD_START:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...state,
                    message: '',
                    loading: true,
                };
            }
        case PORTFOLIO_LOAD_COMPLETE:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...state,
                    loading: false,
                    ...action.payload,
                };
            }
        case PORTFOLIO_LOAD_FAIL:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...initialState,
                };
            }
        case PORTFOLIO_LOAD_SUMMARY_START:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return state;
            }
        case PORTFOLIO_LOAD_SUMMARY_COMPLETE:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...state,
                    summary: action.payload,
                    loading: false,
                };
            }
        case PORTFOLIO_LOAD_SUMMARY_FAIL:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...state,
                    summary: initialState.summary,
                    loading: false,
                };
            }
        case PORTFOLIO_ADD_START:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...state,
                };
            }
        case PORTFOLIO_ADD_COMPLETE:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                const { entities } = state;
                const { payload } = action;
                console.log('[portfolioRedicer]: addComplete', payload);
                if (!payload.ticker) {
                    return {
                        ...state
                    };
                }
                const ticker = entities.find(item => item.ticker === payload.ticker);
                if (!ticker) { //add new
                    entities.unshift(payload);
                } else { //change quantity and prices
                    ticker.price = payload.price;
                    ticker.quantity = payload.quantity;
                    ticker.currentPrice = payload.currentPrice;
                }
                return {
                    ...state,
                    entities
                };
            }
        case PORTFOLIO_ADD_FAIL:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...state,
                    ...action.payload
                };
            }
        case PORTFOLIO_DELETE_START:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...state,
                };
            }
        case PORTFOLIO_DELETE_COMPLETE:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                const { payload } = action;
                const entities = state.entities.reduce(
                    (res, current) => {
                        let skip = false;
                        if (current.ticker === payload.ticker) {
                            if (payload.quantity >= current.quantity) {
                                skip = true;
                            } else {
                                current.quantity = current.quantity - payload.quantity;
                            }
                        }
                        if (!skip) { res.push(current); }
                        return res;
                    }, []);
                return {
                    ...state,
                    loading: false,
                    entities,
                };
            }
        case PORTFOLIO_DELETE_FAIL:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...state,
                    ...action.payload
                };
            }
        case PORTFOLIO_CLEAR:
            {
                console.log('[portfolioReducer]', action.type, action.payload);
                return {
                    ...initialState,
                };
            }
        default:
            return state;
    }
}