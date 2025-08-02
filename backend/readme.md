# Digital Event Management Backend

## Overview
This is the backend for the Digital Event Management system, built with ASP.NET Core and Entity Framework Core. It provides authentication, user management, email verification, and password reset features.

## Features
- User registration and login (JWT authentication)
- Email verification on registration
- Password hashing and validation
- Forgot password and password reset via email
- User profile management (edit profile, change password, delete account)
- Profile image upload and retrieval
- Entity Framework Core migrations
- Secure modals and confirmation flows for sensitive actions
- Improved backend validation and error messaging

## Setup
1. Install .NET 8 SDK and SQL Server (or update connection string for your DB).
2. Restore dependencies:
   ```sh
   dotnet restore backend/project.csproj
   ```
3. Apply migrations:
   ```sh
   dotnet ef database update --project backend/project.csproj
   ```
4. Run the backend:
   ```sh
   dotnet run --project backend/project.csproj
   ```

## API Endpoints

### AuthController
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/auth/verify-email` — Verify email address
- `POST /api/auth/forgot-password` — Request password reset email
- `POST /api/auth/reset-password` — Reset password with token

### EventsController
- `GET /api/events/upcoming` — Get upcoming events
- `GET /api/events` — Get all events
- `GET /api/events/{id}` — Get event by ID
- `POST /api/events` — Create event
- `PUT /api/events/{id}` — Update event
- `DELETE /api/events/{id}` — Delete event

### UsersController
- `GET /api/users/{id}` — Get user by ID
- `DELETE /api/users/{id}` — Delete user

## Migrations
Use Entity Framework Core migrations to update the database schema:
```sh
# Add a migration
 dotnet ef migrations add MigrationName --project backend/project.csproj
# Apply migrations
 dotnet ef database update --project backend/project.csproj
```

## Configuration
- Update `appsettings.json` and `appsettings.Development.json` for DB connection, SMTP settings, and JWT key.


```

## Detailed Folder Structure

```text
backend/
├── appsettings.Development.json
├── appsettings.json
├── backend.sln
├── NuGet.Config
├── package.json
├── package-lock.json
├── project.csproj
├── project.http
├── FrontendConfig.cs
├── insert_test_user.sql
├── obj/
├── bin/
├── Properties/
├── readme.md
├── Migrations/
├── wwwroot/
│
├── EventSphere.API/
│   ├── appsettings.json
│   ├── Controllers/
│   │   ├── AdminController.cs
│   │   ├── AuthController.cs
│   │   ├── BookmarksController.cs
│   │   ├── DashboardController.cs
│   │   ├── EventsController.cs
│   │   ├── NotificationsController.cs
│   │   ├── RegistrationsController.cs
│   │   ├── TicketsController.cs
│   │   └── UsersController.cs
│   ├── Middleware/
│   │   ├── CustomMiddleware.cs
│   │   ├── ErrorHandlingMiddleware.cs
│   │   ├── JwtMiddleware.cs
│   │   ├── LoggingMiddleware.cs
│   │   ├── PerformanceLoggingMiddleware.cs
│   │   ├── RateLimitingMiddleware.cs
│   │   ├── RequestValidationMiddleware.cs
│   │   └── ResponseFormattingMiddleware.cs
│   └── Program.cs
│
├── EventSphere.Application/
│   ├── Dtos/
│   │   ├── ApiResponse.cs
│   │   ├── DashboardDto.cs
│   │   ├── UpcomingEventDto.cs
│   │   ├── Auth/
│   │   │   ├── ForgotPasswordDto.cs
│   │   │   ├── ResetPasswordDto.cs
│   │   │   ├── UpdateUserProfileDto.cs
│   │   │   ├── UserDetailsDto.cs
│   │   │   ├── UserLoginDto.cs
│   │   │   └── UserRegisterDto.cs
│   │   ├── Events/
│   │   │   ├── CreateEventDto.cs
│   │   │   └── EditEventDto.cs
│   │   └── Notifications/
│   │       └── NotificationDto.cs
│   ├── Helpers/
│   │   └── ConfigHelper.cs
│   ├── Interfaces/
│   │   ├── IAdminService.cs
│   │   ├── IDashboardService.cs
│   │   ├── IEventService.cs
│   │   ├── INotificationService.cs
│   │   └── IUserService.cs
│   ├── Mappers/
│   │   ├── EventMapper.cs
│   │   └── UserMapper.cs
│   ├── Repositories/
│   │   ├── IAuthRepository.cs
│   │   └── IEventRepository.cs
│   └── Services/
│       ├── AdminService.cs
│       ├── DashboardService.cs
│       ├── EventService.cs
│       ├── FileService.cs
│       ├── NotificationService.cs
│       └── UserService.cs
│
├── EventSphere.Domain/
│   ├── Entities/
│   │   ├── Event.cs
│   │   ├── EventFaqs.cs
│   │   ├── EventMedia.cs
│   │   ├── EventOccurrences.cs
│   │   ├── EventSpeaker.cs
│   │   ├── Notification.cs
│   │   ├── Registration.cs
│   │   ├── Ticket.cs
│   │   └── User.cs
│   └── Enums/
│       ├── EmailTemplateEnums.cs
│       ├── EventEnums.cs
│       ├── EventInvitationEnums.cs
│       ├── EventMediaEnums.cs
│       ├── NotificationEnums.cs
│       ├── PaymentEnums.cs
│       ├── RegistrationEnums.cs
│       ├── TicketEnums.cs
│       └── UserEnums.cs
│
├── EventSphere.Infrastructure/
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   ├── AppDbContextFactory.cs
│   │   └── Migrations/
│   ├── Helpers/
│   │   ├── JwtHelper.cs
│   │   └── SmtpEmailSender.cs
│   └── Repositories/
│
├── EventSphere.Tests/
│   ├── Controllers/
│   ├── Dtos/
│   ├── Entities/
│   ├── Helpers/
│   ├── Interfaces/
│   ├── Mappers/
│   ├── ProgramTests.cs
│   └── Services/
│
└── wwwroot/
    └── uploads/
        ├── covers/
        ├── profile/
        └── videos/
```
- `obj/` — Build object files and intermediate outputs.
- `appsettings.json` / `appsettings.Development.json` — Configuration files for database, SMTP, JWT, etc.
- `project.csproj` — Project file for .NET build and dependencies.
- `Program.cs` — Main entry point for the backend application.

## License
MIT
