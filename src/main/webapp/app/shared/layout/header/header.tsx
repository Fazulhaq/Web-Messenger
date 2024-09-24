import './header.scss';

import React, { useState } from 'react';

import { Navbar, Nav, NavbarToggler, Collapse, NavItem, NavLink } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';

import { AdminMenu, AccountMenu } from '../menus';
import MyLogin from 'app/modules/home/my-login';
import MenuItem from '../menus/menu-item';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOpenAPIEnabled: boolean;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header">
      <LoadingBar className="loading-bar" />
      <Navbar data-cy="navbar" light expand="md" fixed="top" className="bg-light">
        <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
        <Collapse isOpen={menuOpen} navbar>
          <Nav id="header-tabs" className="ms-auto" navbar>
            {props.isAuthenticated && (
              <NavItem>
                <NavLink tag={Link} to="/home" className="d-flex align-items-center">
                  <FontAwesomeIcon icon="home" />
                  <span>Home</span>
                </NavLink>
              </NavItem>
            )}
            {props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}
            {props.isAuthenticated && <AccountMenu isAuthenticated={props.isAuthenticated} />}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
