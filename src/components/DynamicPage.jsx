import React from "react";
import { Header } from "semantic-ui-react";

const DynamicPage = () => {
  return (
    <>
      <Header as="h2">Dynamic Page</Header>
      <p>This page was loaded asynchronously!!!</p>
    </>
  );
};

export default DynamicPage;
