import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from '../utils/react-context';
import { UserContext } from '../app/UserProvider';
import Section from '../common/Section';
import DefaultButton from '../common/DefaultButton';
import SectionHeader2 from '../common/SectionHeader2';
import { connectFacebook } from '../api/connect';

function generateState() {
  const state = Math.random();
  window.sessionStorage.setItem('state', state);
  return state;
}

function validateState(state) {
  if (!state) {
    return false;
  }
  const storageState = window.sessionStorage.getItem('state');
  return state === storageState;
}

function requestCode() {
  const state = generateState();
  const facebookUrl = new URL('https://www.facebook.com/v3.2/dialog/oauth');
  facebookUrl.searchParams.set('client_id', process.env.REACT_APP_FACEBOOK_CLIENT_ID);
  facebookUrl.searchParams.set('redirect_uri', `${process.env.REACT_APP_CLIENT || 'http://localhost:3000'}/dashboard/connect/facebook`);
  facebookUrl.searchParams.set('state', state);
  
  window.location.href = facebookUrl.toString();
  console.info(facebookUrl.toString())
}

async function handleCallback(facebookCode, facebookState, uportPush) {
  if (!validateState(facebookState)) {
    throw new Error('State doesn\'t match');
  }

  return connectFacebook(facebookCode, uportPush);
}

function clearQueryParams() {
  window.history.replaceState(null, null, window.location.pathname);
}

function ConnectFacebook({ location, history, user }) {
  const urlParams = new URLSearchParams(location.search);
  const urlCode = urlParams.get('code');
  const urlState = urlParams.get('state');

  if (urlCode) {
    clearQueryParams();
    return <CallbackView user={user} facebookCode={urlCode} facebookState={urlState} />;
  }

  return <DefaultView />;
}

const Instructions = styled.p`
  margin-bottom: 2rem;
`;

function DefaultView() {
  return (
    <Section>
      <SectionHeader2>You're about to connect your Facebook account</SectionHeader2>
      <Instructions>
        You will be sent to Facebook to grant uSocial permission to read over your basic data.
        The attestation you will be sent will contain your Facebook ID.
      </Instructions>
      <Instructions>
        Your personal information is never stored on our attestation servers.
      </Instructions>
      <DefaultButton type="submit" onClick={requestCode}>Connect</DefaultButton>
    </Section>
  );
}

function CallbackView({ user, facebookCode, facebookState }) {
  const [success, setSuccess] = useState(false);

  const pushData = {
    did: user.user.did,
    pushToken: user.user.pushToken,
    publicEncKey: user.user.publicEncKey,
  };

  useEffect(() => {
    (async () => {
      await handleCallback(facebookCode, facebookState, pushData);
      setSuccess(true);
    })();
  }, []);

  return (
    <Section>
      <SectionHeader2>We're attesting your Facebook information</SectionHeader2>
      {!success && 'Hold tight! Your identity with Facebook is being verified...'}
      {success && 'Success! Your uPort attestation should show up on your mobile uPort app in few seconds.'}
    </Section>
  );
}

const connected = connect('user', UserContext.Consumer, ConnectFacebook);
const routered = withRouter(connected);

export default routered;