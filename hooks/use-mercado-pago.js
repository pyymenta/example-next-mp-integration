import { useEffect, useState } from 'react';
import getConfig from 'next/config';

// const SDK_URL = 'https://sdk.mercadopago.com/js/v2';
const SDK_URL = '/js/v2/index.js';


const { publicRuntimeConfig } = getConfig();

const useMercadoPago = () => {
  const publicKey = publicRuntimeConfig.publicKeyMercadoPago;
  const [mercadoPago, setMercadoPago] = useState();
  const [cardForm, setCardForm] = useState();
  const [error, setError] = useState(false);

  function initCardForm({
    value,
    onError,
    onSubmit,
  }) {
    if (!mercadoPago) return;

    if (cardForm) {
      cardForm.unmount();
    }

    const newCardForm = mercadoPago.cardForm({
      amount: Number(value).toFixed(2),
      form: {
        id: 'card-deposit-form',
        cardholderName: {
          id: 'cardholderName',
        },
        cardNumber: {
          id: 'cardNumber',
        },
        cardExpirationMonth: {
          id: 'cardExpirationMonth',
        },
        cardExpirationYear: {
          id: 'cardExpirationYear',
        },
        securityCode: {
          id: 'cardSecurityCode',
        },
        installments: {
          id: 'installments',
        },
        identificationType: {
          id: 'identificationType',
        },
        identificationNumber: {
          id: 'identificationNumber',
        },
        issuer: {
          id: 'issuer',
        },
      },
      callbacks: {
        onFormMounted: (err) => {
          if (err) {
            if (onError) {
              onError(err);
            }
          }
        },
        onSubmit: (event) => {
          event.preventDefault();

          if (onSubmit) {
            console.log({
              formCardData: newCardForm.getCardFormData(),
            });

            onSubmit(newCardForm.getCardFormData(), null);
          }
        },
        onCardTokenReceived: (err) => {
          if (err) {
            if (onSubmit) {
              onSubmit(null, err);
            }
          }
        },
      },
    });

    setCardForm(newCardForm);
  }

  function instance() {
    if (mercadoPago) return;

    const script = document.createElement('script');
    script.src = SDK_URL;

    script.addEventListener('load', () => {
      if (window.MercadoPago && publicKey) {
        setMercadoPago(new window.MercadoPago(publicKey, {
          locale: 'pt-BR',
        }));
      } else {
        setError('An error occurred during the initialization of the MercadoPago module');
      }
    });

    script.addEventListener('error', () => {
      setError('An error occurred during the loading of the MercadoPago SDK script');
    });

    document.body.appendChild(script);
  }

  useEffect(() => (() => {
    const script = document.querySelector(`script[src="${SDK_URL}"]`);
    const iFrame = document.body.querySelector('iframe[src*="mercadolibre"]');

    if (iFrame) {
      document.body.removeChild(iFrame);
    }

    if (script) {
      document.body.removeChild(script);
    }
  }), []);

  return {
    ...mercadoPago,
    instance,
    initCardForm,
    error,
  };
};

export default useMercadoPago;
