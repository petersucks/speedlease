import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import Header from '../Header';
import Navigation from '../Navigation';
import Feedback from '../Feedback';
import Footer from '../Footer';

function Layout({ children }) {
  return (
    <div>
      <Header />
      {React.Children.only(children)}
      <Feedback />
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default withStyles(s)(Layout);
