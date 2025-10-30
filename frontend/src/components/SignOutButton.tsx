import React from 'react';
import { useMsal } from '@azure/msal-react';

const SignOutButton: React.FC = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup().catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  return (
    <button onClick={handleLogout} className="sign-out-button">
      Sign out
    </button>
  );
};

export default SignOutButton;
