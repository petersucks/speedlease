/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';

function Navigation({ className }) {
  return (
    <div className="hero-head">
      <div className="container">
      <nav className="nav" role="navigation">
        <div className="nav-left">
          <Link className="is-brand" to="/">
            <h1 style={{color:'white'}}>SpeedLease</h1>
          </Link>
        </div>
        <span className="nav-toggle">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className="nav-right nav-menu">
          <Link className="nav-item" to="/about">About</Link>
          <Link className="nav-item is-active" to="/search">Search</Link>
        </div>
      </nav>
      </div>
    </div>
  );
}

Navigation.propTypes = {
  className: PropTypes.string,
};

export default withStyles(s)(Navigation);
