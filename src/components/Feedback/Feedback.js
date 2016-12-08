import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Feedback.css';

function Feedback() {
  return (
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <nav className="columns">
            <a className="column has-text-centered" href="http://bulma.io/documentation/overview/responsiveness/" style={{color:'white !important'}}>
              <span className="icon is-large">
                <i className="fa fa-mobile"></i>
              </span>
              <span className="icon is-large">
                <i className="fa fa-tablet"></i>
              </span>
              <span className="icon is-large">
                <i className="fa fa-desktop"></i>
              </span>
              <p className="title is-4"><strong>Responsive</strong></p>
              <p className="subtitle">Designed for <strong>mobile</strong>-first</p>
            </a>
            <a className="column has-text-centered" href="http://bulma.io/documentation/overview/modular/" style={{color:'white !important'}}>
              <span className="icon is-large">
                <i className="fa fa-cubes"></i>
              </span>
              <p className="title is-4"><strong>Modular</strong></p>
              <p className="subtitle">Just import what you <strong>need</strong></p>
            </a>
            <a className="column has-text-centered" href="http://bulma.io/documentation/grid/columns/" style={{color:'white !important'}}>
              <span className="icon is-large">
                <i className="fa fa-css3"></i>
              </span>
              <p className="title is-4"><strong>Modern</strong></p>
              <p className="subtitle">Built with <strong>Flexbox</strong></p>
            </a>
            <a className="column has-text-centered" href="https://github.com/jgthms/bulma" style={{color:'white !important'}}>
              <span className="icon is-large">
                <i className="fa fa-github"></i>
              </span>
              <p className="title is-4"><strong>Free</strong></p>
              <p className="subtitle">Open source on <strong>GitHub</strong></p>
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}

export default withStyles(s)(Feedback);
