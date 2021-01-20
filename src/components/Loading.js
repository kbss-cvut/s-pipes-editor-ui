import React from 'react';
import { Loader } from 'semantic-ui-react';
import ReactDelayRender from 'react-delay-render';

//TODO try to add graphics!
const Loading = () => <Loader active size="massive" />;

export default ReactDelayRender({ delay: 300 })(Loading);
