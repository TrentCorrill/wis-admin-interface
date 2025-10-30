# Azure AD Authentication Setup

This guide explains how to configure Azure Active Directory authentication for the WIS Admin Interface.

## Prerequisites

- Azure subscription with Azure Active Directory
- Admin access to Azure AD tenant
- Azure CLI installed (optional, for automation)

## Step 1: Register the Backend API Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure the app:
   - **Name**: `WIS Admin API`
   - **Supported account types**: Accounts in this organizational directory only (Single tenant)
   - **Redirect URI**: Leave blank for now
5. Click **Register**

### Configure the API Application

1. **Copy the Application (client) ID** - you'll need this for backend configuration
2. **Copy the Directory (tenant) ID** - you'll need this for both backend and frontend

### Expose an API

1. Go to **Expose an API** in the left menu
2. Click **Add a scope**
3. Accept the default Application ID URI: `api://<client-id>`
4. Configure the scope:
   - **Scope name**: `access_as_user`
   - **Who can consent**: Admins and users
   - **Admin consent display name**: Access WIS Admin API
   - **Admin consent description**: Allow the application to access WIS Admin API on behalf of the signed-in user
   - **User consent display name**: Access WIS Admin API
   - **User consent description**: Allow the application to access WIS Admin API on your behalf
   - **State**: Enabled
5. Click **Add scope**

## Step 2: Register the Frontend Application

1. In **App registrations**, click **New registration**
2. Configure the app:
   - **Name**: `WIS Admin Frontend`
   - **Supported account types**: Accounts in this organizational directory only (Single tenant)
   - **Redirect URI**:
     - Platform: Single-page application (SPA)
     - URI: `http://localhost:3000` (for local development)
3. Click **Register**

### Configure the Frontend Application

1. **Copy the Application (client) ID** - you'll need this for frontend configuration
2. Go to **Authentication** in the left menu
3. Under **Implicit grant and hybrid flows**, ensure nothing is checked (we're using PKCE)
4. Under **Advanced settings**:
   - **Allow public client flows**: No
   - **Enable the following mobile and desktop flows**: No
5. Click **Save**

### Add API Permissions

1. Go to **API permissions** in the left menu
2. Click **Add a permission**
3. Go to **My APIs** tab
4. Select **WIS Admin API** (the backend app you created)
5. Select **Delegated permissions**
6. Check the `access_as_user` scope
7. Click **Add permissions**
8. Click **Grant admin consent** for your organization (requires admin)

### Add Redirect URIs for Production

When deploying to production:

1. Go to **Authentication**
2. Add additional redirect URIs:
   - `https://admin.wordsinseasonapp.com` (production)
   - Any other environments you need
3. Click **Save**

## Step 3: Configure App Roles (Optional - Recommended)

To restrict access to specific users:

1. Go to the **Frontend** app registration
2. Go to **App roles** in the left menu
3. Click **Create app role**
4. Configure:
   - **Display name**: Admin
   - **Allowed member types**: Users/Groups
   - **Value**: `Admin`
   - **Description**: Administrator access to WIS Admin Interface
5. Click **Apply**

### Assign Users to Roles

1. Go to **Azure Active Directory** > **Enterprise applications**
2. Find **WIS Admin Frontend**
3. Go to **Users and groups**
4. Click **Add user/group**
5. Select users who should have access
6. Assign the **Admin** role
7. Click **Assign**

## Step 4: Configure Backend Environment Variables

Create a `.env` file in the `backend` directory or set these environment variables:

```bash
# Azure Cosmos DB (existing)
AZURE_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your-cosmos-key
AZURE_COSMOS_DATABASE=WIS-Platform

# Azure AD Authentication (new)
AZURE_AD_TENANT_ID=<Directory (tenant) ID from Backend App>
AZURE_AD_CLIENT_ID=<Application (client) ID from Backend App>
AZURE_AD_APP_ID_URI=api://<Backend Application (client) ID>
```

## Step 5: Configure Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api

# Azure AD Configuration
REACT_APP_AZURE_AD_CLIENT_ID=<Application (client) ID from Frontend App>
REACT_APP_AZURE_AD_TENANT_ID=<Directory (tenant) ID>
REACT_APP_REDIRECT_URI=http://localhost:3000
```

For production, update:
```bash
REACT_APP_API_URL=https://your-api-url.azurewebsites.net/api
REACT_APP_REDIRECT_URI=https://admin.wordsinseasonapp.com
```

## Step 6: Test Authentication

1. Start the backend:
   ```bash
   cd backend
   ./gradlew bootRun
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Navigate to `http://localhost:3000`
4. Click **Sign in with Microsoft**
5. Sign in with your Azure AD account
6. You should be redirected to the admin interface

## Troubleshooting

### CORS Errors

Ensure your `application.yml` includes the correct origins:
```yaml
cors:
  allowed-origins: http://localhost:3000,https://admin.wordsinseasonapp.com
```

### Token Validation Errors

- Verify the `AZURE_AD_TENANT_ID` and `AZURE_AD_CLIENT_ID` match in both backend and Azure AD
- Check that the backend `AZURE_AD_APP_ID_URI` matches the exposed API URI
- Ensure admin consent was granted for the frontend app permissions

### User Not Assigned Error

If you configured app roles:
- Go to Azure Portal > Enterprise applications > WIS Admin Frontend > Users and groups
- Verify the user is assigned to the application

### Invalid Redirect URI

- Ensure the redirect URI in the frontend `.env` matches exactly what's configured in Azure AD
- Check both the Authentication section and the MSAL configuration

## Security Best Practices

1. **Never commit `.env` files** - Add them to `.gitignore`
2. **Use Azure Key Vault** in production for sensitive values
3. **Enable Conditional Access** policies for additional security
4. **Review app permissions** regularly
5. **Use app roles** to implement least-privilege access
6. **Monitor sign-ins** via Azure AD sign-in logs
7. **Rotate client secrets** if you add any (though this setup uses client ID only)

## Production Deployment Checklist

- [ ] Configure production redirect URIs in Azure AD
- [ ] Update frontend `.env` with production URLs
- [ ] Configure backend environment variables in Azure App Service
- [ ] Enable HTTPS only in App Service
- [ ] Assign appropriate users to app roles
- [ ] Test authentication flow in production
- [ ] Review CORS configuration
- [ ] Enable Application Insights for monitoring
