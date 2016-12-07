import React from 'react';
import Contact from './Contact';

const title = 'Contact Us';

export default {

  path: '/contact',

  action() {
    return {
      title,
      component: <Contact title={title} />,
    };
  },

};
