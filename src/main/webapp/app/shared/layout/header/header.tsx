import './header.scss';

import React, { useState } from 'react';

import { Navbar, Nav, NavbarToggler, Collapse, NavItem, NavLink } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';

import { AdminMenu, AccountMenu } from '../menus';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/config/store';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOpenAPIEnabled: boolean;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const account = useAppSelector(state => state.authentication.account);
  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header p-0 m-0">
      <LoadingBar className="loading-bar" />
      <Navbar data-cy="navbar" light expand="md" fixed="top" style={{ backgroundColor: '#87CEFA' }}>
        {props.isAuthenticated && (
          <span className="w-100 text-black ms-2" style={{ fontSize: '1.35rem', fontWeight: 'bold' }}>
            {account.firstName} {account.lastName}
          </span>
        )}
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
            {props.isAuthenticated && props.isAdmin && (
              <NavItem>
                <NavLink tag={Link} to="/admin/user-management" className="d-flex align-items-center">
                  <FontAwesomeIcon icon="users" />
                  <span>Management</span>
                </NavLink>
              </NavItem>
            )}
            {props.isAuthenticated && <AccountMenu isAuthenticated={props.isAuthenticated} />}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
