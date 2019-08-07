import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import { createSubscription } from '../../../requests/billing';

export default class Checkout extends React.Component {
  onToken = (token) => {
    console.log(this.props);
    token.plan = this.props.plan
    token.trialDays = this.props.trialDays
    token.subType = this.props.subType
    this.props.setLoading(true);
    createSubscription(token).then(response=>{
      this.props.setLoading(false);
      this.props.setProfile();
    })
  }

  render() {
    return (
      <StripeCheckout
        stripeKey="pk_test_oSJOsGVnmCQfVN05k3uln7WC"
        token={this.onToken}
      >
      <button className="plan-btn">{this.props.text}</button>
      </StripeCheckout>
    )
  }
}