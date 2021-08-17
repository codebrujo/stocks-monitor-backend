import { MENU_LOADED, MENU_AUTHORIZED, AUTHORIZED_MENU } from 'frontendRoot/constants';
import { IMenu } from 'interfaces/Menu';
import { IAction } from 'interfaces/Store';

export const initialState = {
    menuItems: [{
            label: 'Вход',
            href: '/login',
        },
        {
            label: 'Регистрация',
            href: '/register',
        },
    ]
};

export default function menuReducer(state: IMenu = initialState, action: IAction): IMenu {
    switch (action.type) {
        case MENU_LOADED:
            {
                return {
                    ...initialState,
                };
            }
        case MENU_AUTHORIZED:
            {
                return {
                    ...AUTHORIZED_MENU,
                };
            }
        default:
            return state;
    }
}
