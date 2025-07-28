using EventSphere.Domain.Entities;
using backend.Dtos;
using backend.Data;
using backend.Helpers;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using backend.Config;
 
namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        public UserService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
 
        public async Task<bool> VerifyEmailAsync(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);
            if (user == null || user.IsEmailVerified)
                return false;
            if (user.EmailVerificationTokenExpiry < DateTime.UtcNow)
                return false;
            user.IsEmailVerified = true;
            user.EmailVerificationToken = null;
            user.EmailVerificationTokenExpiry = null;
            await _context.SaveChangesAsync();
            return true;
        }
 
        public async Task<User> RegisterAsync(UserRegisterDto dto)
        {
            // Validate username
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.Name.Length < 3)
                throw new ArgumentException("Invalid name. Must be at least 3 characters.");
            // Validate email
            if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
                throw new ArgumentException("Invalid email address.");
            // Check if user already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                if (existingUser.IsEmailVerified)
                    throw new Exception("Email already registered. Please Login.");
                // Resend verification email for unverified user
                existingUser.EmailVerificationToken = Guid.NewGuid().ToString();
                existingUser.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);
                await _context.SaveChangesAsync();
                var resendVerificationUrl = $"{FrontendConfig.FRONTEND_BASE_URL}/verify_email?token={existingUser.EmailVerificationToken}";
                var resendSubject = "Verify your email address";
                var resendBody = $@"
                <div style='font-family:Arial,sans-serif;'>
                <h2 style='color:#0070f3;'>Greetings from EventSphere!</h2>
                <p>Hi {existingUser.Name},</p>
                <p>Thank you for registering with <strong>EventSphere</strong>.</p>
                <p>To complete your registration, please verify your email address by clicking the button below:</p>
                <p style='margin:20px 0;'>
                    <a href='{resendVerificationUrl}' style='background:#0070f3;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;'>Verify Email</a>
                </p>
                <p>If you did not sign up for EventSphere, please ignore this email.</p>
                <br>
                <p style='font-size:12px;color:#888;'>Best regards,<br>EventSphere Team</p>
                </div>
                ";
                var resendEmailSender = new SmtpEmailSender(_config);
                await resendEmailSender.SendEmailAsync(existingUser.Email, resendSubject, resendBody);
                throw new Exception("A verification email has been resent. Please check your inbox.");
            }
 
            // Password requirements
            var password = dto.Password;
            if (password.Length < 8)
                throw new ArgumentException("Password must be at least 8 characters.");
            if (!password.Any(char.IsUpper))
                throw new ArgumentException("Password must contain at least one uppercase letter.");
            if (!password.Any(char.IsLower))
                throw new ArgumentException("Password must contain at least one lowercase letter.");
            if (!password.Any(char.IsDigit))
                throw new ArgumentException("Password must contain at least one digit.");
            if (!password.Any(c => !char.IsLetterOrDigit(c)))
                throw new ArgumentException("Password must contain at least one special character.");
 
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password), // Store hashed password
                Role = UserRole.User,
                IsEmailVerified = false,
                EmailVerificationToken = Guid.NewGuid().ToString(),
                // EmailVerificationTokenExpiry sets the expiration time for the verification link (24 hours from registration)
                EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
            };
 
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
 
            // Send verification email
            var verificationUrl = $"{FrontendConfig.FRONTEND_BASE_URL}/verify_email?token={user.EmailVerificationToken}";
            var subject = "Verify your email address";
            var body = $@"
            <div style='font-family:Arial,sans-serif;'>
            <h2 style='color:#0070f3;'>Greetings from EventSphere!</h2>
            <p>Hi {user.Name},</p>
            <p>Thank you for registering with <strong>EventSphere</strong>.</p>
            <p>To complete your registration, please verify your email address by clicking the button below:</p>
            <p style='margin:20px 0;'>
                <a href='{verificationUrl}' style='background:#0070f3;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;'>Verify Email</a>
            </p>
            <p>If you did not sign up for EventSphere, please ignore this email.</p>
            <br>
            <p style='font-size:12px;color:#888;'>Best regards,<br>EventSphere Team</p>
            </div>
            ";
            var emailSender = new SmtpEmailSender(_config);
            await emailSender.SendEmailAsync(user.Email, subject, body);
 
            // Registration successful
            return user;
        }
 
        public async Task<User?> LoginAsync(UserLoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
                throw new Exception("Email or Password is incorrect.");
            if (!user.IsEmailVerified)
                throw new Exception("Email not verified. Please check your inbox for the verification link.");
 
            // Generate JWT token
            var jwtKey = _config["Jwt:Key"] ?? "supersecretkey";
            var jwtHelper = new backend.Helpers.JwtHelper(jwtKey);
            var token = jwtHelper.GenerateToken(user);
 
            // Return token and user
            return new User {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                IsEmailVerified = user.IsEmailVerified,
                ProfileImage = user.ProfileImage,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                EmailVerificationToken = token // Use this property to pass token for now
            };
        }
 
        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
 
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }
 
        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
 
        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
 
        // Demo: Preferences and notification settings are stored as JSON in ProfileImage and Phone fields, respectively.
        // In production, use dedicated fields or related tables.
 
        public async Task<object> GetPreferencesAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");
            if (string.IsNullOrEmpty(user.ProfileImage)) return new { };
            return JsonSerializer.Deserialize<object>(user.ProfileImage)!;
        }
 
        public async Task<bool> SetPreferencesAsync(int userId, object preferences)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");
            user.ProfileImage = JsonSerializer.Serialize(preferences);
            await _context.SaveChangesAsync();
            return true;
        }
 
        public async Task<object> GetNotificationSettingsAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");
            if (string.IsNullOrEmpty(user.Phone)) return new { };
            return JsonSerializer.Deserialize<object>(user.Phone)!;
        }
 
        public async Task<bool> UpdateNotificationSettingsAsync(int userId, object settings)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");
            user.Phone = JsonSerializer.Serialize(settings);
            await _context.SaveChangesAsync();
            return true;
        }
 
        // Forgot Password: Request password reset
        public async Task<bool> RequestPasswordResetAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !user.IsEmailVerified)
                return false;
            user.PasswordResetToken = Guid.NewGuid().ToString();
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1); // 1 hour expiry
            await _context.SaveChangesAsync();
            var resetUrl = $"{FrontendConfig.FRONTEND_BASE_URL}/password_reset?token={user.PasswordResetToken}";
            var subject = "Reset your password";
            var body = $@"
            <div style='font-family:Arial,sans-serif;'>
            <h2 style='color:#0070f3;'>EventSphere Password Reset</h2>
            <p>Hi {user.Name},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <p style='margin:20px 0;'>
                <a href='{resetUrl}' style='background:#0070f3;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;'>Reset Password</a>
            </p>
            <p>If you did not request this, you can ignore this email.</p>
            <br>
            <p style='font-size:12px;color:#888;'>Best regards,<br>EventSphere Team</p>
            </div>
            ";
            var emailSender = new SmtpEmailSender(_config);
            await emailSender.SendEmailAsync(user.Email, subject, body);
            return true;
        }
 
        // Forgot Password: Reset password
        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token);
            if (user == null || user.PasswordResetTokenExpiry < DateTime.UtcNow)
                return false;
            // Password requirements
            if (newPassword.Length < 8 ||
                !newPassword.Any(char.IsUpper) ||
                !newPassword.Any(char.IsLower) ||
                !newPassword.Any(char.IsDigit) ||
                !newPassword.Any(c => !char.IsLetterOrDigit(c)))
                throw new ArgumentException("Password does not meet requirements.");
            user.PasswordHash = HashPassword(newPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}