import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

const SignInButton: React.FC = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((error) => {
      console.error('Login failed:', error);
    });
  };

  return (
    <button onClick={handleLogin} className="sign-in-button">
      Sign in with Microsoft
    </button>
  );
};

export default SignInButton;
