# WIS Admin Interface

Admin dashboard for Words in Season platform - view customer conversations, manage subscriptions, and monitor system health.

## Architecture

- **Frontend**: React web application (deployed to Azure Static Web Apps)
- **Backend**: Java Spring Boot API service (wis-admin-api)
- **Database**: Azure Cosmos DB (read-only access to customer and message data)

## Features

- 🔐 Azure AD authentication with role-based access control
- 📋 Customer list with subscription status
- 💬 View complete conversation history for each customer
- 🔍 Search and filter messages by customer, date, content
- ⚡ Real-time message updates using WebSocket/Server-Sent Events
- 📊 Basic analytics dashboard

## Project Structure

```
wis-admin-interface/
├── frontend/          # React web app
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # Spring Boot API service
    ├── src/
    ├── pom.xml
    └── Dockerfile
```

## Authentication Setup

This application uses Azure Active Directory for authentication. Before running the application, you must configure Azure AD:

**📖 See [AZURE_AD_SETUP.md](./AZURE_AD_SETUP.md) for complete setup instructions**

Quick overview:
1. Register two Azure AD applications (backend API + frontend SPA)
2. Configure API permissions and scopes
3. Set environment variables for both frontend and backend
4. Assign users to access the application

## Development

See individual README files in `frontend/` and `backend/` directories for setup instructions.

**Note**: You must complete the Azure AD setup before running the application locally.
