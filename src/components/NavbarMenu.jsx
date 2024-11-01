import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { APP_TITLE } from "@config/env.js";

const NavbarMenu = () => {
  return (
    <Navbar bg="light" expand="lg" style={{ zIndex: 100 }}>
      <Navbar.Brand href="/">{APP_TITLE}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {/*<Nav.Link href="/dynamic">Dynamic - test</Nav.Link>*/}
          <Nav.Link href="/scripts">Scripts</Nav.Link>
          <Nav.Link href="/executions">Executions</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarMenu;
