/**
 * Компонент формирует и отображает главное меню системы
 *
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import StyledList from './StyledList';
import { MenuProps } from 'interfaces/Forms';

export default class Menu extends Component<MenuProps, any> {
    constructor(props: MenuProps){
        super(props);
    }

    render() {
        return (
            <StyledList data-testid="MainMenu">
                {this.props.items.map((item) => <li key={`menuitem_${item.href}`} className={item.href === this.props.path ? 'selected-item' : 'normal-item'}>
                    <Link to={item.href}>
                        {item.label}
                    </Link>
                </li>)}
            </StyledList>
        );
    }
}
