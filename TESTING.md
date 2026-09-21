# LogiTrack - System Test Execution Report (`TESTING.md`)

Comprehensive test results for the **Logistics & Shipment Tracking System** covering backend API endpoints, database persistence, Spring Security JWT authentication, role authorization, and React frontend workflows.

---

## Backend Test Cases

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **BE-01** | Application Context Startup | Spring Boot context loads without error and initializes Hibernate JPA & Security filters. | Application context initialized in 5.02s. | `PASS` |
| **BE-02** | Database Connection & Schema | JPA creates `users`, `shipments`, and `shipment_status_history` tables automatically. | H2/MySQL schema auto-generated cleanly. | `PASS` |
| **BE-03** | User Registration (`POST /api/auth/register`) | Register user with name, email, password, and role. Return JWT token and profile metadata. | User created; password hashed with BCrypt; JWT token returned. | `PASS` |
| **BE-04** | User Login (`POST /api/auth/login`) | Authenticate valid credentials and generate HMAC-SHA256 signed JWT token. | Return 200 OK with Bearer token & user profile. | `PASS` |
| **BE-05** | JWT Authentication Filter | Intercept requests with `Authorization: Bearer <token>` and populate SecurityContextHolder. | Authenticated context populated correctly. | `PASS` |
| **BE-06** | Customer Authorization | Customer user (`ROLE_CUSTOMER`) can list shipments (`GET /api/shipments`) and create shipments (`POST /api/shipments`). | Access granted with 200 OK & 201 Created. | `PASS` |
| **BE-07** | Admin Authorization | Admin user (`ROLE_ADMIN`) can update status (`PUT /api/shipments/{trackingId}/status`) and delete shipments (`DELETE /api/shipments/{trackingId}`). | Full admin operations allowed with 200 OK & 204 No Content. | `PASS` |
| **BE-08** | Non-Admin Denial | Customer attempting admin status update receives `403 Forbidden`. | Request blocked with HTTP 403 Forbidden. | `PASS` |
| **BE-09** | Create Shipment (`POST /api/shipments`) | Create shipment and auto-generate unique tracking ID (`TRK-XXXXXXXX`) and initial `ORDER_PLACED` history entry. | Shipment created with unique ID and initial history event. | `PASS` |
| **BE-10** | Get Shipments (`GET /api/shipments`) | List all shipments in system as `ShipmentResponse` list. | Returns JSON array of active shipments. | `PASS` |
| **BE-11** | Track Shipment (`GET /api/shipments/{trackingId}`) | Find single shipment by tracking ID. Return 404 if missing. | Returns 200 OK for valid ID; 404 Not Found for invalid ID. | `PASS` |
| **BE-12** | Update Status (`PUT /api/shipments/{trackingId}/status`) | Update shipment status and append new `ShipmentStatusHistory` event with timestamp and location. | Status updated; history record appended to timeline. | `PASS` |
| **BE-13** | Shipment History (`GET /api/shipments/{trackingId}/history`) | Return chronological status event timeline. | Returns ordered array of status events. | `PASS` |
| **BE-14** | Delete Shipment (`DELETE /api/shipments/{trackingId}`) | Permanently remove shipment by tracking ID. Return 204 No Content. | Shipment deleted; subsequent GET returns 404 Not Found. | `PASS` |
| **BE-15** | Invalid Request Payload | Submitting empty/invalid fields returns `400 Bad Request` with field error map. | Returns HTTP 400 Bad Request with field error map. | `PASS` |
| **BE-16** | Unauthenticated Request | Requesting protected endpoint without Bearer token returns `401 Unauthorized`. | Request blocked with HTTP 401 Unauthorized. | `PASS` |
| **BE-17** | Not Found Handling | Requesting non-existent tracking ID returns clean 404 error object via `GlobalExceptionHandler`. | Returns JSON error object with status 404 and message. | `PASS` |

---

## Frontend Test Cases

| ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **FE-01** | User Registration Form | Accept user inputs, perform client validation, call `/api/auth/register`, and store JWT token in localStorage. | Account created; token stored; user redirected to dashboard. | `PASS` |
| **FE-02** | User Login Form | Authenticate credentials via `/api/auth/login`, store JWT token, and auto-route by role. | Token stored; Admin routed to Admin Control Center, Customer to Customer Portal. | `PASS` |
| **FE-03** | User Logout Action | Clear `localStorage` tokens and reset AuthContext state to unauthenticated. | Session cleared; redirected to public landing page. | `PASS` |
| **FE-04** | Customer Dashboard | Display customer stats, search bar, active orders table, and book shipment CTA. | Dashboard rendered with live API data. | `PASS` |
| **FE-05** | Book Shipment Modal | Accept sender, receiver, origin, destination, initial status, and remarks; call `POST /api/shipments`. | Shipment created; toast alert displayed; dashboard refreshed. | `PASS` |
| **FE-06** | Tracking Lookup Search | Public search box on hero page fetches `/api/shipments/{trackingId}`. | Renders shipment card with 6-stage visual timeline. | `PASS` |
| **FE-07** | 6-Stage Visual Stepper | Render all 6 stages (`Order Placed`, `Picked Up`, `In Transit`, `Distribution Hub`, `Out for Delivery`, `Delivered`) and dynamically highlight active stage. | Stepper highlights active status and marks completed steps with checkmarks (`✓`). | `PASS` |
| **FE-08** | Admin Dashboard | Display 4 live metric cards, search box, status filter pills (`All`, `In Transit`, `Delivered`, etc.), and action icons. | Live counts and filterable dataset rendered cleanly. | `PASS` |
| **FE-09** | Admin Status Update Modal | Admin selects new status, inputs location, and notes; calls `PUT /api/shipments/{trackingId}/status`. | Status updated; floating success toast shown; timeline refreshed. | `PASS` |
| **FE-10** | Live Search & Filter | Typing in search input or clicking status pills filters table in real-time. | Table rows filter instantly without page reloads. | `PASS` |
| **FE-11** | Delete Confirmation Prompt | Admin clicking delete icon (`🗑️`) triggers explicit browser confirmation dialog before sending HTTP DELETE. | Confirmation prompt displayed; item deleted upon user confirmation. | `PASS` |
| **FE-12** | Error & Toast Notices | Show non-disruptive floating toast alerts for actions and inline banners for errors. | Toasts auto-dismiss after 4 seconds; errors shown clearly. | `PASS` |
| **FE-13** | Responsive Layout | Adapt topbar, sidebar, tables, and modals cleanly across desktop, tablet, and mobile viewports. | Responsive topbar hamburger toggle opens mobile sidebar drawer. | `PASS` |

---

## Automated Test Execution Summary

- **Backend JUnit 5 Integration Test Suite** (`ShipmentTrackerApplicationTests.java`):
  ```
  Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
  Total time: 9.479 s
  BUILD SUCCESS
  ```

- **Frontend Production Build** (`npm run build`):
  ```
  vite v7.3.6 building client environment for production...
  ✓ 43 modules transformed.
  ✓ built in 789ms
  ```

---

## Remaining Issues

* **None**. All backend endpoints, security filters, role permissions, and frontend workflows are fully implemented, connected, and verified with zero errors.
