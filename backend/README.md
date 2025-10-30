# WIS Admin API

Backend API service for the Words in Season admin interface.

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.1**
- **Azure Cosmos DB** for data access
- **Gradle** for build management

## Getting Started

### Prerequisites

- Java 17 or later
- Azure Cosmos DB account (or use local emulator)

### Environment Variables

Create a `.env` file or set these environment variables:

```bash
# Azure Cosmos DB
AZURE_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your-cosmos-key
AZURE_COSMOS_DATABASE=WIS-Platform

# Azure AD Authentication
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_CLIENT_ID=your-backend-client-id
AZURE_AD_APP_ID_URI=api://your-backend-client-id
```

See [AZURE_AD_SETUP.md](../AZURE_AD_SETUP.md) for detailed Azure AD configuration instructions.

### Running Locally

```bash
# Build the project
./gradlew build

# Run the application
./gradlew bootRun

# Run tests
./gradlew test
```

The API will be available at `http://localhost:8080`.

### Docker

Build and run with Docker:

```bash
# Build image
docker build -t wis-admin-api .

# Run container
docker run -p 8080:8080 \
  -e AZURE_COSMOS_ENDPOINT=your-endpoint \
  -e AZURE_COSMOS_KEY=your-key \
  wis-admin-api
```

## API Endpoints

**All endpoints require Azure AD authentication** via Bearer token in the Authorization header.

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers/search?query={query}` - Search customers
- `GET /api/customers/by-phone/{phone}` - Get customers by phone

### Messages

- `GET /api/messages/customer/{customerId}` - Get all messages for a customer
- `GET /api/messages/customer/{customerId}/range?startDate={start}&endDate={end}` - Get messages by date range
- `GET /api/messages/search?query={query}` - Search messages

### Health

- `GET /actuator/health` - Health check endpoint

## CORS Configuration

CORS is configured to allow requests from:
- http://localhost:3000 (development)
- http://localhost:5173 (Vite development)
- https://admin.wordsinseasonapp.com (production)

Update `application.yml` to modify CORS settings.
