import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './logo-small.png';

function Header() {
  return (
    <section className="hero is-primary">
      <Navigation />
      <div className="hero-head">
        <div className="container">

        </div>
      </div>
    </section>
  );
}

export default withStyles(s)(Header);
