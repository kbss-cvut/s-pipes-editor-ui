import React from "react";
import { Container } from "@mui/material";
import NavbarMenu from "../components/Navbar/NavbarMenu.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer.jsx";

const Layout = () => {
  return (
    <div>
      <NavbarMenu />
      <Container maxWidth="lg">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;
