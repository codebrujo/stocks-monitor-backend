/**
 * Компонент содержит структуру меню и отвечает за отображение компонента-контейнера
 *
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Menu from './components/Menu/Menu';

import StyledAside from './StyledAside';
import { IState } from 'interfaces/Store';
import { SidebarProps } from 'interfaces/Forms';


class Sidebar extends PureComponent<SidebarProps, any> {

    render(){
        return (
            <StyledAside>
                <Menu items={this.props.menuItems} path={this.props.path}/>
            </StyledAside>
        );
    }
}

const mapStateToProps = (state: IState) => (
    {
        menuItems: state.menu.menuItems,
    }
);

export default connect(mapStateToProps, null)(Sidebar);
