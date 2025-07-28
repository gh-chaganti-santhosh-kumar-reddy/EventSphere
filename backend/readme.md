# Digital Event Management Backend

## Overview
This is the backend for the Digital Event Management system, built with ASP.NET Core and Entity Framework Core. It provides authentication, user management, email verification, and password reset features.

## Features
- User registration and login (JWT authentication)
- Email verification on registration
- Password hashing and validation
- Forgot password and password reset via email
- User profile and notification settings
- Entity Framework Core migrations

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
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/auth/verify-email?token=...` — Verify email address
- `POST /api/auth/forgot-password` — Request password reset email
- `POST /api/auth/reset-password` — Reset password with token

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

## Folder Structure

## Detailed Folder Structure

```
backend/
│   appsettings.Development.json
│   backend.sln
│   NuGet.Config
│   obj/
│   bin/
│   project.csproj
│   project.http
│   Properties/
│   readme.md
│
├── EventSphere.API/
│   ├── appsettings.json
│   ├── Controllers/
│   │   ├── AdminController.cs
│   │   ├── AuthController.cs
│   │   ├── DashboardController.cs
│   │   ├── EventsController.cs
│   │   └── NotificationsController.cs
│   └── Program.cs
│
├── EventSphere.Application/
│   ├── Dtos/
│   │   ├── Auth/
│   │   │   ├── ForgotPasswordDto.cs
│   │   │   ├── ResetPasswordDto.cs
│   │   │   ├── UserLoginDto.cs
│   │   │   └── UserRegisterDto.cs
│   │   ├── Events/
│   │   │   ├── CreateEventDto.cs
│   │   │   └── EditEventDto.cs
│   │   └── Notifications/
│   │       └── NotificationDto.cs
│   ├── Interfaces/
│   │   ├── IAdminService.cs
│   │   ├── IDashboardService.cs
│   │   ├── IEventService.cs
│   │   ├── INotificationService.cs
│   │   └── IUserService.cs
│   ├── Mappers/
│   │   ├── AutoProfileMapper.cs
│   │   ├── EventMapper.cs
│   │   └── UserMapper.cs
│   ├── Services/
│   │   ├── AdminService.cs
│   │   ├── DashboardService.cs
│   │   ├── EventService.cs
│   │   ├── NotificationService.cs
│   │   └── UserService.cs
│   └── Validators/
│
├── EventSphere.Domain/
│   └── Entities/
│       ├── Event.cs
│       ├── EventFaqs.cs
│       ├── EventMedia.cs
│       ├── EventOccurrences.cs
│       ├── EventSpeaker.cs
│       ├── Notification.cs
│       ├── Registration.cs
│       ├── Ticket.cs
│       └── User.cs
│
├── EventSphere.Infrastructure/
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   ├── AppDbContextFactory.cs
│   │   └── Migrations/
│   └── Helpers/
│       ├── JwtHelper.cs
│       └── SmtpEmailSender.cs
│
├── EventSphere.Tests/
│   ├── Controllers/
│   │   ├── AdminControllerTests.cs
│   │   ├── AuthControllerTests.cs
│   │   ├── DashboardControllerTests.cs
│   │   ├── EventsControllerTests.cs
│   │   └── NotificationsControllerTests.cs
│   ├── Dtos/
│   │   ├── Auth/
│   │   │   ├── ForgotPasswordDtoTests.cs
│   │   │   ├── ResetPasswordDtoTests.cs
│   │   │   ├── UserLoginDtoTests.cs
│   │   │   └── UserRegisterDtoTests.cs
│   │   ├── Events/
│   │   │   ├── CreateEventDtoTests.cs
│   │   │   └── EditEventDtoTests.cs
│   │   └── Notifications/
│   │       └── NotificationDtoTests.cs
│   ├── Entities/
│   │   ├── EventFaqsTests.cs
│   │   ├── EventMediaTests.cs
│   │   ├── EventOccurrencesTests.cs
│   │   ├── EventSpeakerTests.cs
│   │   ├── EventTests.cs
│   │   ├── NotificationTests.cs
│   │   ├── RegistrationTests.cs
│   │   ├── TicketTests.cs
│   │   └── UserTests.cs
│   ├── Helpers/
│   │   ├── JwtHelperTests.cs
│   │   └── SmtpEmailSenderTests.cs
│   ├── Interfaces/
│   │   ├── IUserRepositoryTests.cs
│   │   └── IUserServiceTests.cs
│   ├── Mappers/
│   │   ├── AutoProfileMapperTests.cs
│   │   └── EventMapperTests.cs
│   ├── ProgramTests.cs
│   └── Services/
│       ├── AdminServiceTests.cs
│       ├── DashboardServiceTests.cs
│       ├── EventServiceTests.cs
│       ├── NotificationServiceTests.cs
│       └── UserServiceTests.cs
│
└── ... (other solution/project files)
```
- `obj/` — Build object files and intermediate outputs.
- `appsettings.json` / `appsettings.Development.json` — Configuration files for database, SMTP, JWT, etc.
- `project.csproj` — Project file for .NET build and dependencies.
- `Program.cs` — Main entry point for the backend application.

## License
MIT
