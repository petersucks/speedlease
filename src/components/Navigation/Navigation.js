import React, { PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import logoUrl from '../../public/sl.png';

function Navigation({ className }) {
  return (
    <div className="hero-head">
      <div className="container">
      <nav className="nav" role="navigation">
        <div className="nav-left">
          <Link className="nav-item is-brand" to="/">
            <img src={logoUrl} />
          </Link>
        </div>
        <span className="nav-toggle">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className="nav-right nav-menu">
          <a className="nav-item" href="https://github.com/">
            <span className="is-icon">
              <i className="fa fa-github"></i>
            </span>
          </a>
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
