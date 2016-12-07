import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';

import { buildQuery, graphQL } from '../../core/query';
import history from '../../core/history';
import stripeKey from '../../core/stripeKey';

class StripeWidget extends Component {

  constructor(props) {
    super(props);
    this.onToken = this.onToken.bind(this);
  }

  onToken(stripeToken) {
    let criteria = this.props.criteria;
    let body = JSON.stringify({ criteria, stripeToken });
    return fetch('/charge', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body,
      credentials: 'include',
    })
    .then(res => {
      if (res.status !== 200) throw new Error(res.statusText);
      return res.json();
    })
    .then(json => history.push(`/search/${json.id}`))
    .catch(err => console.error(err));
  }

  render() {
    return (
      <StripeCheckout
        name="SpeedLease - 15 Days"
        description="Be the first responder!"
        image="https://stripe.com/img/documentation/checkout/marketplace.png"
        amount={799}
        token={this.onToken}
        allowRememberMe={false}
        stripeKey={stripeKey.public}>

        <a className={this.props.loadingClass}>
          <span className="icon"><i className="fa fa-check"></i></span>
          <span>Save This Search</span>
        </a>

      </StripeCheckout>
    )
  }
}

export default StripeWidget;
