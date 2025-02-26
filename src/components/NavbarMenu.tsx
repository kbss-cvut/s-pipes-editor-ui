import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { APP_TITLE } from "@config/env.ts";

const NavbarMenu = () => {
  return (
    <Navbar bg="light" expand="lg" style={{ zIndex: 100 }}>
      <Container>
        <Navbar.Brand href="/">{APP_TITLE}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/scripts">Scripts</Nav.Link>
            <Nav.Link href="/executions">Executions</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMenu;
