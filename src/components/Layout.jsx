import React from "react";
import { Container, Icon } from "semantic-ui-react";

import { Nav, Navbar } from "react-bootstrap";
import NavbarMenu from "./NavbarMenu";

import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div>
      <NavbarMenu />
      <Container>
        <Outlet />
      </Container>
      <div className="fixed-bottom">
        <Navbar color="dark">
          <Container>
            <p className="pull-right">
              Made with <Icon name="heart" color="red" />
            </p>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};

export default Layout;
