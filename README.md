# Task Board

A full-stack task management application containing both the frontend UI and backend API.

## Project Structure

This repository is a monorepo containing two main projects:
- **`task-board-ui`**: The frontend application built with Angular 21.
- **`task-board-api`**: The backend REST API built with .NET 10.

---

## Setup Instructions

### 1. API Setup (`task-board-api`)

**Prerequisites:**
- .NET 10 SDK
- SQL Server (or any configured database in appsettings)

**Steps:**
1. Navigate to the API folder:
   ```bash
   cd task-board-api
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Update the database connection string in `appsettings.Development.json` if necessary.
4. Run database migrations (if using Entity Framework Core):
   ```bash
   dotnet build
   # Run migrations command if applicable
   ```
5. Run the API:
   ```bash
   cd TaskBoard.API
   dotnet run
   ```
   The API will typically be available at `http://localhost:5000` or `https://localhost:5001`. Swagger documentation is available at `/swagger`.

### 2. UI Setup (`task-board-ui`)

**Prerequisites:**
- Node.js (v18+)
- Angular CLI

**Steps:**
1. Navigate to the UI folder:
   ```bash
   cd task-board-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`.

---

## API Details

The backend is built using **.NET 10** following **Clean Architecture** principles.
- **TaskBoard.Core**: Contains domain entities, interfaces, and core business logic.
- **TaskBoard.Infrastructure**: Handles data access, database context, and external services.
- **TaskBoard.API**: The presentation layer containing the REST controllers and Swagger configuration.
- **TaskBoard.Tests**: Contains unit and integration tests.

### Key Features
- **Validation**: Uses FluentValidation for request validation.
- **Logging**: Implemented using Serilog with MSSqlServer sink for database logging.
- **Documentation**: Swagger/OpenAPI generated documentation.

---

## Design Decisions

### Frontend (UI)
- **Framework**: Angular 21 utilizing Standalone Components for a modern, module-less architecture.
- **State Management**: Reactive state management pattern using NgRx SignalStore (e.g., `TaskStore`).
- **Styling**: TailwindCSS for utility-first, responsive, and rapid UI development.
- **Components**: Angular Material for accessible, foundational UI components.
- **Charts**: Chart.js for rendering task usage and statistics charts.

### Backend (API)
- **Architecture**: Clean Architecture. Separation of concerns ensuring that the core domain is independent of frameworks and UI.
- **Logging**: Centralized structured logging to the database via Serilog to facilitate easy debugging and auditing of task operations.

---

## What is Completed / Not Completed

### ✅ Completed
- Project scaffolding and structure setup for UI (Angular) and API (.NET).
- Task Board UI: Task editing dialog, Assignee mapping, Create Task form, and Task status cards.
- Chart visualizations for task statuses.
- API endpoints for Task CRUD operations.
- Backend database logging integration (Serilog).
- Unit and integration tests for API and some shared Angular services.

### ⏳ Not Completed
- (Add any specific pending features, like Authentication/Authorization if not done)
- Advanced filtering and search functionalities on the board.
- CI/CD pipeline setup (GitHub Actions, etc.).
- Production deployment configuration.
- Form control validation for some fields and some cosmetic bugs in UI.
- CSRF token validation.
