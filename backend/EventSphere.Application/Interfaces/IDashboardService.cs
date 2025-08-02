using System.Collections.Generic;
using System.Threading.Tasks;
using EventSphere.Application.Dtos;

namespace EventSphere.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<IEnumerable<DashboardDto>> GetAllAsync();
        Task<DashboardDto?> GetByIdAsync(int id);
        Task<DashboardDto> CreateAsync(DashboardDto dto);
        Task<DashboardDto?> UpdateAsync(int id, DashboardDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
