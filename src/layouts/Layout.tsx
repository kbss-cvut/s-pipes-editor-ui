import React from "react";
import { Container, Icon } from "semantic-ui-react";
import { Navbar } from "react-bootstrap";
import NavbarMenu from "@components/NavbarMenu";
import { Outlet } from "react-router-dom";
import Footer from "@components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarMenu />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;
