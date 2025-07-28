// frontendConfig.cs
// Centralized frontend base URL for backend to use when sending links (e.g., email verification, password reset)

namespace backend.Config
{
    public static class FrontendConfig
    {
        // Update this URL to match your deployed frontend
        public const string FRONTEND_BASE_URL = "http://localhost:3000";
    }
}
