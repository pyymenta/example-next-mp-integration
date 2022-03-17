import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import useMercadoPago from '../hooks/use-mercado-pago';

export default function Home() {
  const {
    instance,
    initCardForm,
  } = useMercadoPago();
  const [step, setStep] = useState('form');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    instance();
  }, []);

  function handleAmountChange({ target }) {
    const { value } = target;

    setAmount(Number(value));
  }

  function onSubmitCreditCardDeposit(formData, err) {
    console.log({
      formData,
      error: err
    });
  }

  function handleFormSubmit() {
    setStep('confirming');

    initCardForm({
      value: amount,
      onSubmit: onSubmitCreditCardDeposit,
      onError: (err) => {
        console.log(err);

        setStep('form');
      },
    });
  }

  function renderFormStep() {
    return (
      <div style={{ display: step !== 'form' && 'none' }}>
        <input
          type="text"
          id="amount"
          name="amount"
          placeholder="Amount"
          value={amount}
          onChange={handleAmountChange}
        />

        <br />

        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          placeholder="Card Number"
        />

        <br />

        <input
          type="text"
          id="cardholderName"
          name="cardholderName"
          placeholder="Card Holder Name"
        />

        <br />

        <input
          type="text"
          id="cardExpirationMonth"
          name="cardExpirationMonth"
          placeholder="Card Expiration Month"
        />

        <br />

        <input
          type="text"
          id="cardExpirationYear"
          name="cardExpirationYear"
          placeholder="Card Expiration Year"
        />

        <br />

        <input
          type="text"
          id="cardSecurityCode"
          name="cardSecurityCode"
          placeholder="Card Security Code"
        />

        <select
          id="installments"
          aria-label="Installments"
          style={{ display: 'none' }}
        />

        <select
          id="issuer"
          aria-label="Issuers"
          style={{ display: 'none' }}
        />

        <input
          id="identificationType"
          style={{ display: 'none' }}
        />

        <input
          id="identificationNumber"
          style={{ display: 'none' }}
        />

        <br />

        <button id="form-submit" onClick={handleFormSubmit}>
          Continue
        </button>
      </div>
    )
  }

  function renderConfirmingStep() {
    return (
      <div style={{ display: step !== 'confirming' && 'none' }}>
        <p>Transaction value: {amount}</p>

        <button id="form-back" onClick={() => setStep('form')}>
          Back to form
        </button>

        <button id="form-submit" type="submit">
          Confirm
        </button>
      </div>
    )
  }

  return (
    <form id="card-deposit-form">
      { renderFormStep() }
      { renderConfirmingStep() }
    </form>
  );
}
