import { Navbar } from "react-bootstrap";
import { Container, Icon } from "semantic-ui-react";
import React from "react";

const Footer = () => {
  return (
    <div className="fixed-bottom">
      <Navbar color="dark">
        <Container>
          <p className="p-3 ms-auto">
            Made with <Icon name="heart" color="red" />
          </p>
        </Container>
      </Navbar>
    </div>
  );
};

export default Footer;
