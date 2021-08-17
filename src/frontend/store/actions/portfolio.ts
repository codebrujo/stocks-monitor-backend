import { createAction } from 'redux-actions';
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

export const loadStart = createAction(PORTFOLIO_LOAD_START);
export const loadComplete = createAction(PORTFOLIO_LOAD_COMPLETE);
export const loadFail = createAction(PORTFOLIO_LOAD_FAIL);
export const loadSummaryStart = createAction(PORTFOLIO_LOAD_SUMMARY_START);
export const loadSummaryComplete = createAction(PORTFOLIO_LOAD_SUMMARY_COMPLETE);
export const loadSummaryFail = createAction(PORTFOLIO_LOAD_SUMMARY_FAIL);
export const addStart = createAction(PORTFOLIO_ADD_START);
export const addComplete = createAction(PORTFOLIO_ADD_COMPLETE);
export const addFail = createAction(PORTFOLIO_ADD_FAIL);
export const deleteStart = createAction(PORTFOLIO_DELETE_START);
export const deleteComplete = createAction(PORTFOLIO_DELETE_COMPLETE);
export const deleteFail = createAction(PORTFOLIO_DELETE_FAIL);
export const clearStore = createAction(PORTFOLIO_CLEAR);