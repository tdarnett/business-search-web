import React, { useState } from 'react';
import styled from 'styled-components';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import theme from '../styles/theme';

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: theme.color.black.lightest,
      color: theme.color.black.light,
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: theme.color.black.lightest,
      },
      '::placeholder': {
        color: theme.color.black.lightest,
      },
    },
    invalid: {
      iconColor: '#C51F1F',
      color: '#C51F1F',
    },
  },
};
const CardError = styled.div`
  color: #c51f1f;
  position: absolute;
  display: flex;
  justify-content: center;
  padding: 0 15px;
  font-size: 13px;
  margin-top: 0px;
  transform: translateY(-15px);
`;

const Form = styled.form`
  animation: fade 200ms ease-out;
`;

const SubmitButton = styled.button`
  display: block;
  font-size: 16px;
  width: calc(100% - 30px);
  height: 40px;
  margin: 40px 15px 0;
  background-color: ${theme.color.secondary};
  box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 0 #ffb9f6;
  border-radius: 4px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 100ms ease-in-out;
  will-change: transform, background-color, box-shadow;

  &:active {
    background-color: ${theme.color.secondaryDark};
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 0 #e298d8;
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
    box-shadow: none;
  }
`;

const FormRow = styled.div`
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  margin-left: 15px;
  margin-right: 15px;
  border-top: 1px solid ${theme.color.secondary};

  &:first-child {
    border-top: none;
  }
`;

const FormRowInput = styled.input`
  font-size: 16px;
  width: 100%;
  padding: 11px 15px 11px 0;
  color: ${theme.color.black.light};
  background-color: transparent;
  animation: 1ms void-animation-out;
  border: none;
  border-style: none;
  &:-webkit-autofill {
    -webkit-text-fill-color: ${theme.color.black.lightest};
    transition: background-color 100000000s;
    animation: 1ms void-animation-out;
  }

  &::placeholder {
    color: ${theme.color.black.lightest};
  }

  &:focus {
    outline: none;
  }
`;

const FormRowLabel = styled.label`
  width: 15%;
  min-width: 70px;
  padding: 11px 0;
  color: ${theme.color.black.light};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FormGroup = styled.fieldset`
  margin: 0 15px 20px;
  padding: 0;
  border-style: none;
  background-color: ${theme.color.white.dark};
  will-change: opacity, transform;
  box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08), inset 0 1px 0 ${theme.color.white.darker};
  border-radius: 4px;
`;
// TODO fix spinner
const Spinner = styled.div`
  font-size: 22px;
  margin: 50px auto;
  text-indent: -9999em;
  width: 11em;
  height: 11em;
  border-radius: 50%;
  background: #ffffff;
  background: -moz-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -webkit-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -o-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -ms-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: linear-gradient(to right, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);

  &:before {
    width: 50%;
    height: 50%;
    background: #ffffff;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
`;

const StyledCardElement = styled(CardElement)`
  width: 100%;
  padding: 11px 15px 11px 0;
`;

const CardField = ({ onChange }) => (
  <FormRow>
    <StyledCardElement options={CARD_OPTIONS} onChange={onChange} />
  </FormRow>
);

const Field = ({ label, id, type, placeholder, required, autoComplete, value, onChange }) => (
  <FormRow>
    <FormRowLabel htmlFor={id}>{label}</FormRowLabel>
    <FormRowInput
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
    />
  </FormRow>
);

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    email: '',
    name: '',
  });

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const payload = await stripe.confirmCardPayment(props.progressConfig.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: billingDetails,
      },
      receipt_email: billingDetails.email,
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      props.setProgressConfig({ step: 2 }); // show the success screen
    }
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Field
          label="Name"
          id="name"
          type="text"
          placeholder="Jane Doe"
          required
          autoComplete="name"
          value={billingDetails.name}
          onChange={(e) => {
            setBillingDetails({ ...billingDetails, name: e.target.value });
          }}
        />
        <Field
          label="Email"
          id="email"
          type="email"
          placeholder="janedoe@gmail.com"
          required
          autoComplete="email"
          value={billingDetails.email}
          onChange={(e) => {
            setBillingDetails({ ...billingDetails, email: e.target.value });
          }}
        />
        <CardField onChange={handleChange} />
      </FormGroup>

      {error && <CardError role="alert">{error}</CardError>}

      <SubmitButton disabled={processing || disabled || succeeded}>
        <span id="button-text">
          {processing
            ? 'Processing...'
            : `Pay ${props.progressConfig.amount.toLocaleString('en', {
                style: 'currency',
                currency: 'CAD',
                currencyDisplay: 'symbol',
                maximumFractionDigits: 2,
              })}`}
        </span>
      </SubmitButton>
    </Form>
  );
};

const StripeCheckout = (props) => {
  return (
    <Elements stripe={props.stripePromise}>
      <CheckoutForm progressConfig={props.progressConfig} setProgressConfig={props.setProgressConfig} />
    </Elements>
  );
};

export default StripeCheckout;
