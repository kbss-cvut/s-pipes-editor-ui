import React from "react";
import { Icon } from "semantic-ui-react";

import Layout from "./Layout";

const NoMatch = () => {
  return (
    <>
      <Icon name="minus circle" size="big" />
      <strong>Page not found!</strong>
    </>
  );
};

export default NoMatch;
