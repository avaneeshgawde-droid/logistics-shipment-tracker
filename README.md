# Logistics & Shipment Tracking System (`logistics-shipment-tracker`)

An enterprise-grade full-stack Logistics & Package Tracking system built with Java Spring Boot, MySQL, and React (Vite).

---

## 1. Project Name
**logistics-shipment-tracker**

---

## 2. Project Description
The **Logistics & Shipment Tracking System** is a real-time supply chain management application designed to track packages across multi-stage fulfillment networks. It provides transparent package status updates, complete audit history, role-based access control for Administrators and Customers, and responsive dashboards.

---

## 3. Problem Statement
Modern logistics operations require real-time visibility into package locations, status changes, and dispatch workflows. Outdated manual tracking leads to customer uncertainty, delayed status updates, and lack of accountability across distribution hubs. This system provides a centralized REST API and single-page web application to streamline shipment registration, status progression, and tracking queries.

---

## 4. Features
- **Public Package Tracking**: Search shipment progress by Tracking ID without requiring login.
- **Role-Based Access Control**:
  - **Administrator Portal**: Overview metrics, shipment creation, multi-stage status updates, and record deletion.
  - **Customer Portal**: Personal order tracking, shipment booking, and timeline details.
- **Audit History**: Timestamped logs of status transitions and location notes.
- **Interactive UI**: Status timelines, dynamic status badges, toast notifications, search, and tab filtering.
- **Configurable Architecture**: Full environment-variable support for database credentials, JWT secrets, CORS, and API endpoints.

---

## 5. Technology Stack
- **Frontend**: React 19, Vite, CSS (Vanilla CSS Design System)
- **Backend**: Java 17+, Spring Boot 3.x, Maven, Spring Security (JWT Auth), Spring Data JPA
- **Database**: MySQL (Production) / H2 In-Memory (Development fallback)
- **Security**: BCrypt password hashing, stateless JWT authentication, CORS policy filters
- **Deployment Platform**: GitHub (Repository), Vercel (Frontend), Java Cloud Platform (Backend)

---

## 6. System Architecture

```
                               ┌─────────────────────────────┐
                               │     Client Web Browser      │
                               └──────────────┬──────────────┘
                                              │ HTTP / REST API (JWT)
                                              ▼
┌─────────────────────────┐    ┌─────────────────────────────┐
│  Vercel Static Host     │    │   Java Spring Boot Backend   │
│  (React / Vite Single   │───►│  (Security, REST Controllers│
│   Page Application)     │    │   Service Layer, JPA)       │
└─────────────────────────┘    └──────────────┬──────────────┘
                                              │ JDBC
                                              ▼
                               ┌─────────────────────────────┐
                               │       MySQL Database        │
                               └─────────────────────────────┘
```

---

## 7. Backend Setup

### Prerequisites
- Java JDK 17 or higher
- Apache Maven 3.8+

### Setup Instructions
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the Spring Boot application:
   ```bash
   mvn clean compile
   ```
3. Run tests:
   ```bash
   mvn test
   ```
4. Start the backend application locally:
   ```bash
   mvn spring-boot:run
   ```
   The backend server will run at `http://localhost:8080`.

---

## 8. Frontend Setup

### Prerequisites
- Node.js 18+ and `npm`

### Setup Instructions
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start local development server:
   ```bash
   npm run dev
   ```
   The frontend runs at `http://localhost:5173`.

4. Build production bundle:
   ```bash
   npm run build
   ```

---

## 9. Database Setup

### Option A: MySQL (Production / Local DB)
1. Install MySQL Server 8.0+.
2. Create database instance:
   ```sql
   CREATE DATABASE logistics_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Configure environment variables (see Section 10).

### Option B: H2 In-Memory (Default Development Fallback)
If no external MySQL database is provided, the backend defaults to H2 in-memory database with MySQL compatibility mode enabled. H2 console can be accessed at `http://localhost:8080/h2-console`.

---

## 10. Environment Variables

### Backend Environment Variables

| Variable Name | Default Value | Description |
|---|---|---|
| `PORT` / `SERVER_PORT` | `8080` | Backend HTTP port |
| `SPRING_DATASOURCE_URL` | `jdbc:h2:mem:logistics_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL` | JDBC Connection URL |
| `SPRING_DATASOURCE_USERNAME` | `sa` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | *(empty)* | Database password |
| `SPRING_DATASOURCE_DRIVER_CLASS_NAME` | `org.h2.Driver` | JDBC driver class name (`com.mysql.cj.jdbc.Driver` for MySQL) |
| `SPRING_JPA_DATABASE_PLATFORM` | `org.hibernate.dialect.H2Dialect` | Hibernate dialect (`org.hibernate.dialect.MySQLDialect` for MySQL) |
| `JWT_SECRET` | *(64-byte default key)* | Base64-encoded HS256 JWT signing secret |
| `JWT_EXPIRATION_MS` | `86400000` | JWT expiration token lifetime in milliseconds (24h) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000,http://localhost:8080` | Comma-separated list of allowed CORS origins |

### Frontend Environment Variables

| Variable Name | Default Value | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | Configurable Spring Boot REST API Base URL |

> [!CAUTION]
> `VITE_*` variables are embedded into client-side JS bundles. Never store MySQL passwords, JWT signing keys, or server credentials in `VITE_*` variables.

---

## 11. API Documentation

### Public Endpoints
- `GET /api/health` — Health check endpoint.
- `GET /api/shipments/{trackingId}` — Fetch public shipment tracking details.
- `GET /api/shipments/{trackingId}/history` — Fetch status history log for a shipment.
- `POST /api/auth/login` — User authentication returning JWT token.
- `POST /api/auth/register` — Register a new Customer or Admin account.

### Protected Customer & Admin Endpoints (Requires `Authorization: Bearer <token>`)
- `GET /api/shipments` — List authorized user shipments.
- `POST /api/shipments` — Create a new shipment order.

### Admin-Only Endpoints (Requires Admin Role)
- `PUT /api/shipments/{trackingId}/status` — Update shipment status and current location.
- `DELETE /api/shipments/{trackingId}` — Delete a shipment record.

---

## 12. Local Development Instructions

To run the complete full-stack project locally:

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
4. **Demo Accounts**:
   - Use the **Quick Demo Access** buttons on the Login page to evaluate Admin and Customer portals.

---

## 13. Deployment Instructions

### Part A: Deploy Frontend to Vercel
1. Push project repository to GitHub: `logistics-shipment-tracker`.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Select the `logistics-shipment-tracker` repository.
4. Configure Deployment Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Configure Environment Variables in Vercel Dashboard:
   - `VITE_API_URL`: `<your-deployed-spring-boot-backend-url>` (e.g. `https://your-backend.up.railway.app`)
6. Click **Deploy**.

### Part B: Deploy Backend to Cloud Platform
1. Choose a Java 17+ capable cloud host (e.g. Render, Railway, Fly.io, Heroku, AWS Elastic Beanstalk).
2. Set Environment Variables on the backend host:
   - `PORT`: `8080`
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<host>:3306/<database>?useSSL=true`
   - `SPRING_DATASOURCE_USERNAME`: `<db-user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<db-password>`
   - `SPRING_DATASOURCE_DRIVER_CLASS_NAME`: `com.mysql.cj.jdbc.Driver`
   - `SPRING_JPA_DATABASE_PLATFORM`: `org.hibernate.dialect.MySQLDialect`
   - `JWT_SECRET`: `<generated-secure-random-base64-secret>`
   - `CORS_ALLOWED_ORIGINS`: `https://<your-vercel-app-name>.vercel.app,http://localhost:5173`
3. Deploy the `backend/` Maven application.

---
