using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace backend.Helpers
{
    public class SmtpEmailSender
    {
        private readonly IConfiguration _config;
        public SmtpEmailSender(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpHost = _config["Smtp:Host"];
            var smtpPort = int.Parse(_config["Smtp:Port"] ?? "587");
            var smtpUser = _config["Smtp:User"];
            var smtpPass = _config["Smtp:Pass"];
            var from = _config["Smtp:From"] ?? "noreply@example.com";

            var message = new MailMessage(from, to, subject ?? string.Empty, body ?? string.Empty) { IsBodyHtml = true };
            using (var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            })
            {
                await client.SendMailAsync(message);
            }
        }
    }
}
