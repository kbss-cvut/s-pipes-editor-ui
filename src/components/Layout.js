import React from 'react';
import { Container, Icon } from 'semantic-ui-react';

import {Nav, Navbar} from "react-bootstrap";
import NavbarMenu from './NavbarMenu'

const Layout = ({ children }) => {
  return (
      <div>
        <NavbarMenu />

        <Container>
            {children}
        </Container>

          <div className="fixed-bottom">
              <Navbar color="dark">
                  <Container>
                      <p className="pull-right">
                        Made with <Icon name="heart" color="red" /> by Petr Jordan
                      </p>
                  </Container>
              </Navbar>
          </div>
      </div>
  );
};

export default Layout;