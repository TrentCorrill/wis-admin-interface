# WIS Admin Interface

Admin dashboard for Words in Season platform - view customer conversations, manage subscriptions, and monitor system health.

## Architecture

- **Frontend**: React web application (deployed to Azure Static Web Apps)
- **Backend**: Java Spring Boot API service (wis-admin-api)
- **Database**: Azure Cosmos DB (read-only access to customer and message data)

## Features

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

## Development

See individual README files in `frontend/` and `backend/` directories for setup instructions.
