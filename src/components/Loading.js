import React from 'react';
import { Loader } from 'semantic-ui-react';
import ReactDelayRender from 'react-delay-render';
import { LoopCircleLoading } from 'react-loadingg';

const Loading = () => <LoopCircleLoading />;

export default ReactDelayRender({ delay: 300 })(Loading);
