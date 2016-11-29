/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Register.css';

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = { email: '' };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  submit() {
    console.log('submitting: '+this.state.email);
  }

  render() {
    console.log(this.props.criteria)
    return (
      <Layout>
        <div className="container">
          <h1 className="title is-1">Register</h1>
          <p className="control has-icon">
            <input className="input" type="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
            <i className="fa fa-envelope"></i>
          </p>
          <p className="control has-icon">
            <input className="input" type="password" placeholder="Password" />
            <i className="fa fa-lock"></i>
          </p>
          <p className="control">
            <button className="button is-success" onClick={this.submit}>
              Save
            </button>
          </p>
        </div>
      </Layout>
    );
  }
}

Register.propTypes = { criteria: PropTypes.object };

export default withStyles(s)(Register);
