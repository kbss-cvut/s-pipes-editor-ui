import { Navbar } from "react-bootstrap";
import { Container, Icon } from "semantic-ui-react";
import React from "react";

const Footer = () => {
  return (
    <Navbar className="mt-auto">
      <Container>
        <p className="p-3 ms-auto">
          Made with <Icon name="heart" color="red" />
        </p>
      </Container>
    </Navbar>
  );
};

export default Footer;
