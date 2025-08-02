using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EventSphere.Application.Dtos;
using EventSphere.Application.Interfaces;

namespace EventSphere.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private static readonly List<DashboardDto> _dashboards = new();
        private static int _nextId = 1;

        public Task<IEnumerable<DashboardDto>> GetAllAsync()
            => Task.FromResult(_dashboards.AsEnumerable());

        public Task<DashboardDto?> GetByIdAsync(int id)
            => Task.FromResult(_dashboards.FirstOrDefault(d => d.Id == id));

        public Task<DashboardDto> CreateAsync(DashboardDto dto)
        {
            dto.Id = _nextId++;
            _dashboards.Add(dto);
            return Task.FromResult(dto);
        }

        public Task<DashboardDto?> UpdateAsync(int id, DashboardDto dto)
        {
            var existing = _dashboards.FirstOrDefault(d => d.Id == id);
            if (existing == null) return Task.FromResult<DashboardDto?>(null);
            existing.Title = dto.Title;
            existing.Description = dto.Description;
            return Task.FromResult<DashboardDto?>(existing);
        }

        public Task<bool> DeleteAsync(int id)
        {
            var existing = _dashboards.FirstOrDefault(d => d.Id == id);
            if (existing == null) return Task.FromResult(false);
            _dashboards.Remove(existing);
            return Task.FromResult(true);
        }
    }
}
