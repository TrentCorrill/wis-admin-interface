import { Configuration, PopupRequest } from '@azure/msal-browser';

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_AD_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_AD_TENANT_ID || 'common'}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage', // Store tokens in localStorage for persistence
    storeAuthStateInCookie: false,
  },
};

// Add scopes for API access
export const loginRequest: PopupRequest = {
  scopes: [`api://${process.env.REACT_APP_AZURE_AD_CLIENT_ID}/access_as_user`],
};

// Scopes for Microsoft Graph API (optional - for user profile)
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
