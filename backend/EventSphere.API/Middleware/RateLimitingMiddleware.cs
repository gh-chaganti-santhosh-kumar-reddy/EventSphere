using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System;

namespace backend.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly ConcurrentDictionary<string, (DateTime timestamp, int count)> _requests = new();
        private readonly int _limit = 100; // requests
        private readonly TimeSpan _period = TimeSpan.FromMinutes(1);
        public RateLimitingMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            var key = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var now = DateTime.UtcNow;
            var (timestamp, count) = _requests.GetOrAdd(key, (now, 0));
            if (now - timestamp > _period)
            {
                _requests[key] = (now, 1);
            }
            else if (count >= _limit)
            {
                context.Response.StatusCode = 429;
                await context.Response.WriteAsync("Rate limit exceeded. Try again later.");
                return;
            }
            else
            {
                _requests[key] = (timestamp, count + 1);
            }
            await _next(context);
        }
    }
    public static class RateLimitingMiddlewareExtensions
    {
        public static IApplicationBuilder UseRateLimitingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RateLimitingMiddleware>();
        }
    }
}
