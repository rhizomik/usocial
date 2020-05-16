import React, { useReducer } from 'react';
import styled from 'styled-components';
import isEmail from 'validator/lib/isEmail';
import { currentAttestation } from 'usocial';
import { connect } from '../utils/react-context';
import { UserContext, sync, securityParams } from '../app/UserProvider';
import Loading from '../common/Loading';
import Section from '../common/Section';
import DefaultButton from '../common/DefaultButton';
import DefaultInput from '../common/DefaultInput';
import SectionHeader2 from '../common/SectionHeader2';
import { connectEmail } from '../api/connect';

const Instructions = styled.p`
  margin-bottom: 2rem;
`;

const EmailForm = styled.form`
  display: flex;
  margin-bottom: 2rem;

  fieldset {
    padding: 0;
    border: 0;
  }
`;

const EmailInput = styled(DefaultInput)`
  margin-right: 0.5rem;
  width: 400px;
`;

const initialState = {
  email: '',
  isSubmitting: false,
  hasSubmitted: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'email':
      return {
        ...state,
        email: action.value,
      }
    case 'submit':
      return {
        ...state,
        isSubmitting: true,
        hasSubmitted: false,
        error: null,
      }
    case 'success':
      return {
        ...state,
        isSubmitting: false,
        hasSubmitted: true,
        error: null,
      }
    case 'error':
      return {
        ...state,
        isSubmitting: false,
        hasSubmitted: true,
        error: action.value,
      }
    default:
      return state;
  }
}


function ConnectEmail({ user }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function onSubmit(event) {
    event.preventDefault();
    if (!isEmail(state.email)) {
      return;
    }
    dispatch({ type: 'submit' });

    // Make sure we're working with the latest attestations before adding new ones on top
    await sync(user);

    const verified = user.user.verified || [];
    const attested = currentAttestation(verified, securityParams(user));
    const attestedJwt = attested && attested.jwt;
    await connectEmail(state.email, user.user.name, attestedJwt);
    dispatch({ type: 'success' });
  }
  
  return (
    <Section>
      <SectionHeader2>You're about to connect your email address</SectionHeader2>
      <Instructions>
        A verification QR code will be sent to the indicated email address.
      </Instructions>
      <EmailForm onSubmit={onSubmit}>
        <fieldset disabled={state.isSubmitting || state.hasSubmitted}>
          <EmailInput
            type="text"
            placeholder="Email address"
            required="required"
            onChange={event => dispatch({ type: 'email', value: event.target.value})}
            error={!isEmail(state.email)}
          />
          <DefaultButton type="submit">Connect</DefaultButton>
        </fieldset>
      </EmailForm>
      {state.isSubmitting && <Loading text="Submitting" />}
      {state.hasSubmitted && !state.error && (
        <span>Check your email address to complete the connection.</span>
      )}
    </Section>
  );
}

export default connect('user', UserContext.Consumer, ConnectEmail);
