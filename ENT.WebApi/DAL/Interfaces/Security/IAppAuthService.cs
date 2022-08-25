using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
   public interface IAppAuthService
    {
        Task<List<UserModel>> GetUserModels();
        Task<List<Facility>> GetFacilitiesbyUser();
        List<EmployeeNewModel> GetEmployees();

        List<EmployeeModel> GetEmployeeDetails();
        Task<List<EmployeeModel>> GetEmployeeDetailsbyUser();

        List<MenuModel> GetScreenForCurrentUser(string UserId);
        Task<List<string>> GetImageforCurrentUser();

        Task<BaseModel> Authendicate(LoginModel loginModel);

        #region User Registeration

        EmployeeNewModel RegisterStaff(EmployeeNewModel employeeModel);
        ProviderModel RegisterProvider(ProviderModel provData);

        #endregion
    }
}
