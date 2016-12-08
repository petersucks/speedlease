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

      <div className="hero-body">
        <div className="container">
          <div className="columns is-vcentered">

            <div className="column">
              <p className="title is-1">Beat the competition.</p>
              <p className="subtitle">Be the <b><i>first to know</i></b> about new openings.</p>
            </div>

            <div className="column">
              <div className="box">
                <article className="media">
                  <div className="media-left">
                    <figure className="image is-64x64">
                      <img src="http://placehold.it/128x128" alt="Image" />
                    </figure>
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <p>
                        <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
                        <br />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
                      </p>
                    </div>
                    <nav className="level">
                      <div className="level-left">
                        <a className="level-item">
                          <span className="icon is-small"><i className="fa fa-reply"></i></span>
                        </a>
                        <a className="level-item">
                          <span className="icon is-small"><i className="fa fa-retweet"></i></span>
                        </a>
                        <a className="level-item">
                          <span className="icon is-small"><i className="fa fa-heart"></i></span>
                        </a>
                      </div>
                    </nav>
                  </div>
                </article>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="hero-foot">
        <div className="container">
          <nav className="tabs is-boxed">
            <ul>
              <li className="is-active">
                <a href="/documentation/overview/start/">Overview</a>
              </li>
              <li>
                <a href="http://bulma.io/documentation/modifiers/syntax">Settings</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

    </section>
    
  );
}

export default withStyles(s)(Header);
