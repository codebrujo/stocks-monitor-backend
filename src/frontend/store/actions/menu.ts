import { createAction } from 'redux-actions';
import {
    MENU_LOADED,
    MENU_AUTHORIZED,
} from 'frontendRoot/constants';

export const menuLoaded = createAction(MENU_LOADED);
export const menuAuthorized = createAction(MENU_AUTHORIZED);