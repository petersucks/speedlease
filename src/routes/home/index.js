import React from 'react';
import Home from './Home';

export default {

  path: '/',

  async action() {
    return {
      title: 'SpeedLease',
      component: <Home />,
    };
  },

};
