using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using ENT.WebApi.Middlewares;

namespace ENT.WebApi.DAL.Services
{

    public class AppAuthService : IAppAuthService
    {
        public readonly IUnitOfWork uow;
        public readonly IGlobalUnitOfWork gUow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        public readonly IHostingEnvironment hostingEnvironment;

        #region Initialize Properties
        public UserManager<AspNetUsers> _userManager { get; } // UserManager is a class and it is used to manage the users 
        public SignInManager<AspNetUsers> _signInManager { get; } // SignInManager is a class and it is used to handle the user's SignIn & SignOut
        public RoleManager<IdentityRole> _roleManager { get; }

        private readonly IConfiguration _configuration;

        private readonly IHttpContextAccessor httpContextAccessor;

        #endregion

        #region Constructor
        public AppAuthService(UserManager<AspNetUsers> userManager, SignInManager<AspNetUsers> signInManager, RoleManager<IdentityRole> roleManager,
            IUnitOfWork _uow, IGlobalUnitOfWork _gUow, IConfiguration configuration, IHttpContextAccessor _httpContextAccessor, IUtilityService _utilService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            uow = _uow;
            gUow = _gUow;
            _configuration = configuration;
            httpContextAccessor = _httpContextAccessor;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
            hostingEnvironment = _hostingEnvironment;
        }
        #endregion

        ///// <summary>
        ///// Authendicate the user with valid credentials
        ///// </summary>
        ///// <param name=login model>login model with username and password</param>
        ///// <returns>basemodel. if model fields with generated token = success. else = failure</returns>
        public async Task<BaseModel> Authendicate(LoginModel loginModel)
        {
            BaseModel result = new BaseModel();
            SignInResult signInResult = await _signInManager.PasswordSignInAsync(loginModel.UserName, loginModel.Password, false, false);

            if (signInResult.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(loginModel.UserName);

                if (user != null && (await _userManager.CheckPasswordAsync(user, loginModel.Password)))
                {

                    var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim("Id", user.Id.ToString())
                };

                    string tokenKey = _configuration["Tokens:Key"];
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Tokens:Key"]));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(_configuration["Tokens:Issuer"],
                      _configuration["Tokens:Issuer"],
                      claims,
                      expires: DateTime.Now.AddMinutes(120),
                      signingCredentials: creds);

                    result.Status = 0;
                    result.StatusMessage = "Successfull";
                    result.Result = new { token = new JwtSecurityTokenHandler().WriteToken(token) };

                }

                else if (signInResult.IsLockedOut)
                {
                    result.Status = 1;
                    result.StatusMessage = "Locked";

                }
                else
                {
                    result.Status = 2;
                    result.StatusMessage = "Failed";
                }
            }
            else if (signInResult.IsLockedOut)
            {
                result.Status = 1;
                result.StatusMessage = "Locked";

            }
            else
            {
                result.Status = 2;
                result.StatusMessage = "Failed";

                throw new AppExceptions("Email or password is incorrect");
            }
            return result;
        }

        ///// <summary>
        ///// Get the data collection for an active user 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Usermodel>. if collection for active current user = success. else = failure</returns>
        public async Task<List<UserModel>> GetUserModels()
        {
            List<UserModel> users = new List<UserModel>();
            DateTime d = DateTime.Now;//.Date.ToUniversalTime();
            AspNetUsers aspuser = new AspNetUsers();
            try
            {
                aspuser = await _userManager.FindByNameAsync(httpContextAccessor.HttpContext.User.Identity.Name);

                users = await (from U in this.gUow.GlobalGenericRepository<AspNetUsers>().Table().Where(e => e.UserName == aspuser.UserName)
                               join UT in this.gUow.GlobalGenericRepository<UserTenantSetup>().Table()
                               on U.Id equals UT.UserId
                               join T in this.gUow.GlobalGenericRepository<Tenants>().Table()
                               on UT.TenantId equals T.TenantId
                               where T.IsActive == true
                               join C in this.gUow.GlobalGenericRepository<Client>().Table()
                               on T.clientid equals C.ClientID
                               where C.IsActive == true
                               join CS in this.gUow.GlobalGenericRepository<ClientSubscription>().Table()
                               on UT.TenantId equals CS.tenantid
                               where CS.isactive == true && CS.enddate.Date >= d.Date && CS.startdate.Date <= d.Date
                               select new
                               {
                                   U.Id,
                                   U.UserName,
                                   C.ClientName,
                                   C.ClientID,
                                   ClientDisplayName = C.DisplayName,
                                   T.TenantId,
                                   T.TenantName,
                                   TenantDisplayName = T.DisplayName,
                                   T.Tenantdbname,
                                   T.Address1,
                                   T.Address2,
                                   CS.maxusers,
                                   CS.startdate,
                                   CS.enddate,
                                   CS.isactive

                               }).ToAsyncEnumerable().Select(user => new UserModel
                               {
                                   Id = user.Id,
                                   UserName = user.UserName,
                                   ClientId = user.ClientID,
                                   ClientName = user.ClientName,
                                   ClientDisplayName = user.ClientDisplayName,
                                   TenantId = user.TenantId,
                                   TenantName = user.TenantName,
                                   TenantDisplayName = user.TenantDisplayName,
                                   Tenantdbname = user.Tenantdbname,
                                   Address1 = user.Address1,
                                   Address2 = user.Address2,
                                   maxusers = user.maxusers,
                                   StartDate = user.startdate,
                                   EndDate = user.enddate,
                                   isActive = user.isactive

                               }).ToList();
            }
            catch (Exception x)
            {
                string message = x.Message;
            }
            return users;
        }

        ///// <summary>
        ///// Get the Facility collection for an active logged in user 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Facility>. if collection for active current user = success. else = failure</returns>
        public async Task<List<Facility>> GetFacilitiesbyUser()
        {
            List<Facility> facilities = new List<Facility>();

            var user = await _userManager.FindByNameAsync(httpContextAccessor.HttpContext.User.Identity.Name);

            var provData = this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.Id.ToLower().Trim()).FirstOrDefault();
            var EmpData = this.uow.GenericRepository<Employee>().Table().Where(x => x.UserId.ToLower().Trim() == user.Id.ToLower().Trim()).FirstOrDefault();
            if (provData != null && (provData.FacilityId != null && provData.FacilityId != ""))
            {
                //facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                //              join prov in provData
                //              on fac.FacilityId equals prov.FacilityId
                //              select fac).ToList();
                if (provData.FacilityId.Contains(","))
                {
                    string[] facilityIds = provData.FacilityId.Split(',');
                    if (facilityIds.Length > 0)
                    {
                        for (int i = 0; i < facilityIds.Length; i++)
                        {
                            if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                            {
                                var facilityData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FirstOrDefault();

                                if (!facilities.Contains(facilityData))
                                {
                                    facilities.Add(facilityData);
                                }
                            }
                        }
                    }
                }
                else
                {
                    var facData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(provData.FacilityId)).FirstOrDefault();
                    facilities.Add(facData);
                }
            }
            else if (EmpData != null && (EmpData.FacilityId != null && EmpData.FacilityId != ""))
            {
                //facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                //              join emp in this.uow.GenericRepository<Employee>().Table().Where(x => x.UserId.ToLower().Trim() == user.Id.ToLower().Trim()).ToList()
                //              on fac.FacilityId equals emp.FacilityId
                //              select fac).ToList();

                if (EmpData.FacilityId.Contains(","))
                {
                    string[] facilityIds = EmpData.FacilityId.Split(',');
                    if (facilityIds.Length > 0)
                    {
                        for (int i = 0; i < facilityIds.Length; i++)
                        {
                            if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                            {
                                var facilityData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FirstOrDefault();

                                if (!facilities.Contains(facilityData))
                                {
                                    facilities.Add(facilityData);
                                }
                            }
                        }
                    }
                }
                else
                {
                    var facData = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == Convert.ToInt32(EmpData.FacilityId)).FirstOrDefault();
                    facilities.Add(facData);
                }
            }

            return facilities;
        }

        ///// <summary>
        ///// Get all Employee data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Employee>. if collection of Employee data = success. else = failure</returns>
        public List<EmployeeNewModel> GetEmployees()
        {
            List<EmployeeNewModel> emp = new List<EmployeeNewModel>();

            var emply = (from e in this.uow.GenericRepository<Employee>().Table()
                         select e).ToList();

            foreach (var data in emply)
            {
                var fac = (data.FacilityId != null && data.FacilityId != "") ? data.FacilityId : "";
                EmployeeNewModel empModel = new EmployeeNewModel();

                empModel.EmployeeId = data.EmployeeId;
                empModel.UserId = data.UserId;
                empModel.FacilityId = data.FacilityId;
                empModel.RoleId = data.RoleId;
                empModel.RoleDesc = data.RoleId > 0 ? this.uow.GenericRepository<Roles>().Table().FirstOrDefault(x => x.RoleId == data.RoleId).RoleDescription : "";
                empModel.EmployeeDepartment = data.EmployeeDepartment;
                empModel.EmployeeDepartmentDesc = data.EmployeeDepartment > 0 ? this.uow.GenericRepository<Departments>().Table().FirstOrDefault(x => x.DepartmentID == data.EmployeeDepartment).DepartmentDesc : "";
                empModel.EmployeeCategory = data.EmployeeCategory;
                //empModel.EmployeeCategoryDesc = data.EmployeeCategory > 0 ? this.uow.GenericRepository<Category>().Table().FirstOrDefault(x => x.CategoryId == data.EmployeeCategory).CategoryDescription : "";
                empModel.EmployeeUserType = data.EmployeeUserType;
                //empModel.EmployeeUserTypeDesc = data.EmployeeUserType > 0 ? this.uow.GenericRepository<UserType>().Table().FirstOrDefault(x => x.UserTypeId == data.EmployeeUserType).EmployeeUserTypeDescription : "";
                empModel.EmployeeNo = data.EmployeeNo;
                empModel.DOJ = data.DOJ;
                empModel.SchedulerDepartment = data.SchedulerDepartment;
                empModel.SchedulerDepartmentDesc = data.SchedulerDepartment > 0 ? this.uow.GenericRepository<Departments>().Table().FirstOrDefault(x => x.DepartmentID == data.SchedulerDepartment).DepartmentDesc : "";
                empModel.AdditionalInfo = data.AdditionalInfo;
                empModel.EmployeeSalutation = data.EmployeeSalutation;
                empModel.EmployeeSalutationDesc = data.EmployeeSalutation > 0 ? this.uow.GenericRepository<Salutation>().Table().FirstOrDefault(x => x.SalutationID == data.EmployeeSalutation).SalutationDesc : "";
                empModel.EmployeeFirstName = data.EmployeeFirstName;
                empModel.EmployeeMiddleName = data.EmployeeMiddleName;
                empModel.EmployeeLastName = data.EmployeeLastName;
                empModel.EmployeeFullname = data.EmployeeFirstName + " " + data.EmployeeMiddleName + " " + data.EmployeeLastName;
                empModel.Gender = data.Gender;
                empModel.GenderDesc = data.Gender > 0 ? this.uow.GenericRepository<Gender>().Table().FirstOrDefault(x => x.GenderID == data.Gender).GenderDesc : "";
                empModel.EmployeeDOB = data.EmployeeDOB;
                empModel.EmployeeAge = data.EmployeeAge;
                empModel.EmployeeIdentificationtype1 = data.EmployeeIdentificationtype1;
                empModel.EmployeeIdentificationtype1details = data.EmployeeIdentificationtype1details;
                empModel.EmployeeIdentificationtype2 = data.EmployeeIdentificationtype2;
                empModel.EmployeeIdentificationtype2details = data.EmployeeIdentificationtype2details;
                empModel.MaritalStatus = data.MaritalStatus;
                empModel.MothersMaiden = data.MothersMaiden;
                empModel.PreferredLanguage = data.PreferredLanguage;
                empModel.Bloodgroup = data.Bloodgroup;
                empModel.CellNo = data.CellNo;
                empModel.PhoneNo = data.PhoneNo;
                empModel.WhatsAppNo = data.WhatsAppNo;
                empModel.EMail = data.EMail;
                empModel.EmergencySalutation = data.EmergencySalutation;
                empModel.EmergencySalutationDesc = data.EmergencySalutation > 0 ? this.uow.GenericRepository<Salutation>().Table().FirstOrDefault(x => x.SalutationID == data.EmergencySalutation).SalutationDesc : "";
                empModel.EmergencyFirstName = data.EmergencyFirstName;
                empModel.EmergencyLastName = data.EmergencyLastName;
                empModel.EmergencyContactType = data.EmergencyContactType;
                empModel.EmergencyContactTypeDesc = data.EmergencyContactType > 0 ? this.uow.GenericRepository<ContactType>().Table().FirstOrDefault(x => x.ContactTypeId == data.EmergencyContactType).ContactTypeDesc : "";
                empModel.EmergencyContactNo = data.EmergencyContactNo;
                empModel.TelephoneNo = data.TelephoneNo;
                empModel.Fax = data.Fax;
                empModel.RelationshipToEmployee = data.RelationshipToEmployee;
                empModel.RelationshipToEmployeeDesc = data.RelationshipToEmployee > 0 ? this.uow.GenericRepository<Relationshiptopatient>().Table().FirstOrDefault(x => x.RSPId == data.RelationshipToEmployee).RSPDescription : "";
                empModel.FacilityName = fac.Contains(",") ? this.GetFacilitiesforStaff(fac) : (fac != "" ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(fac)).FacilityName) : "");
                empModel.FacilityArray = fac != "" ? this.GetFacilityArray(fac) : new List<int>();
                empModel.IsActive = data.IsActive;
                
                if (!emp.Contains(empModel))
                {
                    emp.Add(empModel);
                }
            }

            return emp;
        }

        ///// <summary>
        ///// Get Facility names
        ///// </summary>
        ///// <param>string FacilityId</param>
        ///// <returns>string. if facility names for given FacilityId = success. else = failure</returns>
        public string GetFacilitiesforStaff(string FacilityId)
        {
            string FacilitiesName = "";
            string[] facilityIds = FacilityId.Split(',');
            if (facilityIds.Length > 0)
            {
                for (int i = 0; i < facilityIds.Length; i++)
                {
                    if (facilityIds[i] != null && facilityIds[i] != "" && Convert.ToInt32(facilityIds[i]) > 0)
                    {
                        if (i + 1 == facilityIds.Length)
                        {
                            if (FacilitiesName == null || FacilitiesName == "")
                            {
                                FacilitiesName = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName;
                            }
                            else
                            {
                                FacilitiesName = FacilitiesName + this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName;
                            }
                        }
                        else
                        {
                            if (FacilitiesName == null || FacilitiesName == "")
                            {
                                FacilitiesName = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName + ", ";
                            }
                            else
                            {
                                FacilitiesName = FacilitiesName + this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(facilityIds[i])).FacilityName + ", ";
                            }
                        }
                    }
                }
            }
            return FacilitiesName;
        }

        ///// <summary>
        ///// Get Facility Array
        ///// </summary>
        ///// <param>string FacilityId</param>
        ///// <returns>List<int>. if facility array for given FacilityId = success. else = failure</returns>
        public List<int> GetFacilityArray(string FacilityId)
        {
            List<int> FacilityArray = new List<int>();
            if (FacilityId.Contains(","))
            {
                string[] facilityIds = FacilityId.Split(',');
                if (facilityIds.Length > 0)
                {
                    for (int i = 0; i < facilityIds.Length; i++)
                    {
                        if (Convert.ToInt32(facilityIds[i]) > 0 && !(FacilityArray.Contains(Convert.ToInt32(facilityIds[i]))))
                        {
                            FacilityArray.Add(Convert.ToInt32(facilityIds[i]));
                        }
                    }
                }
            }
            else
            {
                var facData = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(FacilityId)).FacilityId;
                FacilityArray.Add(facData);
            }
            return FacilityArray;
        }

        ///// <summary>
        ///// Get all Employee data with the modules, screens and action
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<EmployeeModel>. if collection of Employee data with the modules, screens and action = success. else = failure</returns>
        public List<EmployeeModel> GetEmployeeDetails()
        {
            List<EmployeeModel> empList = new List<EmployeeModel>();
            try
            {
                empList = (from emply in this.uow.GenericRepository<Employee>().Table()
                           join usrole in this.uow.GenericRepository<userrole>().Table()
                           on emply.UserId equals usrole.Userid
                           where usrole.Deleted == false
                           join role in this.uow.GenericRepository<Roles>().Table()
                           on usrole.Roleid equals role.RoleId
                           join rspm in this.uow.GenericRepository<RoleScreenPermissionMapping>().Table()
                           on usrole.Roleid equals rspm.RoleId
                           join scr in this.uow.GenericRepository<Screen>().Table()
                           on rspm.ScreenId equals scr.ScreenId
                           join mod in this.uow.GenericRepository<Modules>().Table()
                           on scr.ModuleId equals mod.ModuleId
                           join act in this.uow.GenericRepository<Actions>().Table()
                           on rspm.actionid equals act.id
                           where emply.UserId.ToLower().Trim() == this.utilService.GetUserId(emply.EMail).ToLower().Trim()
                           select new
                           {
                               emply.EmployeeFirstName,
                               emply.EmployeeLastName,
                               emply.EmployeeMiddleName,
                               emply.FacilityId,
                               role.RoleName,
                               mod.ModuleName,
                               scr.ScreenName,
                               act.ActionName

                           }).AsEnumerable().Select(EM => new EmployeeModel
                           {
                               EmployeeFirstName = EM.EmployeeFirstName,
                               EmployeeLastName = EM.EmployeeLastName,
                               EmployeeName = EM.EmployeeFirstName + " " + EM.EmployeeMiddleName + " " + EM.EmployeeLastName,
                               FacilityId = EM.FacilityId,
                               FacilityName = EM.FacilityId.Contains(",") ? this.GetFacilitiesforStaff(EM.FacilityId) : ((EM.FacilityId != "" && EM.FacilityId != null) ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(EM.FacilityId)).FacilityName) : ""),
                               FacilityArray = (EM.FacilityId != ""  && EM.FacilityId != null)? this.GetFacilityArray(EM.FacilityId) : new List<int>(),
                               RoleName = EM.RoleName,
                               ModuleName = EM.ModuleName,
                               ScreenName = EM.ScreenName,
                               ActionName = EM.ActionName

                           }).ToList();
            }
            catch (Exception x)
            {
                string message = x.Message;
            }

            return empList;
        }

        ///// <summary>
        ///// Get all Employee data with the modules, screens and action by UserId
        ///// </summary>
        ///// <param name=UserId>User Id</param>
        ///// <returns>List<EmployeeModel>. if collection of Employee data with the modules, screens and action = success. else = failure</returns>
        public async Task<List<EmployeeModel>> GetEmployeeDetailsbyUser()
        {
            List<EmployeeModel> empList = new List<EmployeeModel>();

            try
            {
                var user = await _userManager.FindByNameAsync(httpContextAccessor.HttpContext.User.Identity.Name);

                empList = (from emply in this.uow.GenericRepository<Employee>().Table().Where(x => x.UserId.ToLower().Trim() == user.Id)
                           join usrole in this.uow.GenericRepository<userrole>().Table()
                           on emply.UserId equals usrole.Userid
                           where usrole.Deleted == false
                           join role in this.uow.GenericRepository<Roles>().Table()
                           on usrole.Roleid equals role.RoleId
                           //where emply.UserId == this.utilService.GetUserId(emply.email)
                           select new
                           {
                               emply.EmployeeFirstName,
                               emply.EmployeeLastName,
                               emply.EmployeeMiddleName,
                               emply.FacilityId,
                               role.RoleName

                           }).AsEnumerable().Select(EM => new EmployeeModel
                           {
                               EmployeeFirstName = EM.EmployeeFirstName,
                               EmployeeLastName = EM.EmployeeLastName,
                               EmployeeMiddleName = EM.EmployeeMiddleName,
                               EmployeeName = EM.EmployeeFirstName + " " + EM.EmployeeMiddleName + " " + EM.EmployeeLastName,
                               FacilityId = EM.FacilityId,
                               FacilityName = EM.FacilityId.Contains(",") ? this.GetFacilitiesforStaff(EM.FacilityId) : ((EM.FacilityId != "" && EM.FacilityId != null) ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(EM.FacilityId)).FacilityName) : ""),
                               FacilityArray = (EM.FacilityId != "" && EM.FacilityId != null) ? this.GetFacilityArray(EM.FacilityId) : new List<int>(),
                               RoleName = EM.RoleName

                           }).ToList();
            }
            catch (Exception x)
            {
                string message = x.Message;
            }

            return empList;
        }

        ///// <summary>
        ///// Get modules, screen with actions for particular User by UserId
        ///// </summary>
        ///// <param name=UserId>User Id</param>
        ///// <returns>List<MenuModel>. if collection of Employee data with the modules, screens and action = success. else = failure</returns>
        public List<MenuModel> GetScreenForCurrentUser(string UserId)
        {
            List<MenuModel> menus = new List<MenuModel>();

            var user = this.uow.GenericRepository<Employee>().Table().Where(x => x.UserId == UserId).FirstOrDefault();

            List<ScreenModel> screens = (from screen in uow.GenericRepository<Screen>().Table().Where(x => x.Deleted == false)
                                         join rcs in uow.GenericRepository<RoleScreenPermissionMapping>().Table()
                                         on screen.ScreenId equals rcs.ScreenId

                                         join role in uow.GenericRepository<Roles>().Table()
                                         on rcs.RoleId equals role.RoleId

                                         join mod in this.uow.GenericRepository<Modules>().Table()
                                         on screen.ModuleId equals mod.ModuleId

                                         join act in uow.GenericRepository<Actions>().Table()
                                         on rcs.actionid equals act.id

                                         join userrole in uow.GenericRepository<userrole>().Table().Where(x => x.Userid == user.UserId)
                                         on role.RoleId equals userrole.Roleid

                                         select new
                                         {
                                             screen.ScreenId,
                                             screen.ScreenName,
                                             screen.ScreenDescription,
                                             screen.ActionURL,
                                             screen.Deleted,
                                             screen.ModuleId,
                                             screen.DisplayOrder,
                                             mod.ModuleName,
                                             act.id,
                                             act.ActionName
                                         }).AsEnumerable().Select(x => new ScreenModel
                                         {
                                             ScreenId = x.ScreenId,
                                             ScreenName = x.ScreenName,
                                             ScreenDescription = x.ScreenDescription,
                                             ActionURL = x.ActionURL,
                                             Deleted = x.Deleted,
                                             ModuleId = x.ModuleId,
                                             DisplayOrder = x.DisplayOrder,
                                             ModuleName = x.ModuleName,
                                             ActionId = x.id,
                                             ActionName = x.ActionName

                                         }).ToList();

            var mods = this.uow.GenericRepository<Modules>().Table().Distinct().ToList();

            foreach (var modl in mods)
            {
                var rootMenu = screens.Where(x => x.ModuleId == modl.ModuleId && x.ModuleName == modl.ModuleName).GroupBy(mdu => new { mdu.ModuleName })
                                .Select(data => data.OrderBy(his => his.ModuleId).FirstOrDefault()).Select(x => new MenuModel
                                {
                                    Id = x.ModuleId.Value,
                                    Title = x.ModuleName,
                                    Url = x.ActionURL
                                }
                    );
                menus.AddRange(rootMenu);
            }


            List<int?> ModuleIds = screens.Where(x => x.ModuleId != null).Select(x => x.ModuleId).Distinct().OrderBy(x => x.Value).ToList();

            foreach (int? module in ModuleIds)
            {
                if (module.HasValue)
                {
                    List<string> screenset = screens.Where(x => x.ModuleId == module).Select(x => x.ScreenName).Distinct().ToList();
                    List<MenuModel> currentChilds = new List<MenuModel>();
                    foreach (string set in screenset)
                    {
                        MenuModel menuModel = new MenuModel();
                        string name = "";
                        string ActIds = "";
                        var child = screens.Where(x => x.ScreenName == set).ToList();
                        for (int i = 0; i < child.Count(); i++)
                        {
                            if (i < child.Count() - 1)
                            {
                                ActIds += child[i].ActionId.ToString() + ", ";
                                name += child[i].ActionName + ", ";
                            }
                            else
                            {
                                ActIds += child[i].ActionId.ToString();
                                name += child[i].ActionName;
                            }
                        }
                        menuModel.Id = screens.Where(x => x.ScreenName == set).Select(x => x.ScreenId).FirstOrDefault();
                        menuModel.Title = screens.Where(x => x.ScreenName == set).Select(x => x.ScreenName).FirstOrDefault();
                        menuModel.Url = screens.Where(x => x.ScreenName == set).Select(x => x.ActionURL).FirstOrDefault();
                        menuModel.ActionIds = ActIds;
                        menuModel.ActionName = name;

                        currentChilds.Add(menuModel);
                    }

                    menus.FirstOrDefault(x => x.Id == module.Value).Items = currentChilds;
                }
            }

            return menus.Distinct().ToList();

        }

        ///// <summary>
        ///// Get image for current User
        ///// </summary>
        ///// <param>Nil</param>
        ///// <returns>List<string>. if image string of Employee or Provider = success. else = failure</returns>
        public async Task<List<string>> GetImageforCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(httpContextAccessor.HttpContext.User.Identity.Name);

            List<string> imageString = new List<string>();
            string modulepath = "";
            string moduleName = "";

            if (string.IsNullOrWhiteSpace(hostingEnvironment.WebRootPath))
            {
                hostingEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            var prov = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.UserID.ToLower().Trim() == user.Id.ToLower().Trim());
            var employee = this.uow.GenericRepository<Employee>().Table().FirstOrDefault(x => x.UserId.ToLower().Trim() == user.Id.ToLower().Trim());

            if (prov != null)
            {
                modulepath = hostingEnvironment.WebRootPath + "\\Documents\\Provider\\" + prov.ProviderID;
                moduleName = "provider";
            }
            else if(employee != null)
            {
                modulepath = hostingEnvironment.WebRootPath + "\\Documents\\Staff\\" + employee.EmployeeId;
                moduleName = "staff";
            }

            if (modulepath != "")
            {
                var fileLoc = this.iTenantMasterService.GetFiles(modulepath);
                if (fileLoc.Count() > 0)
                {
                    imageString.Add(fileLoc.FirstOrDefault().ActualFile);
                    imageString.Add(moduleName);
                }
            }

            return imageString;
        }

        #region User Registeration

        ///// <summary>
        ///// Add or Update Staff Record
        ///// </summary>
        ///// <param>EmployeeNewModel employeeModel</param>
        ///// <returns>EmployeeNewModel. if Staff(Employee) record added or updated = success. else = failure</returns>
        public EmployeeNewModel RegisterStaff(EmployeeNewModel employeeModel)
        {
            var getEmpNoCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                  where common.CommonMasterCode.ToLower().Trim() == "empno"
                                  select common).FirstOrDefault();

            var EmpNoCheck = this.uow.GenericRepository<Employee>().Table()
                            .Where(x => x.EmployeeNo.ToLower().Trim() == getEmpNoCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();
            var empRecord = this.uow.GenericRepository<Employee>().Table().Where(x => x.EmployeeId == employeeModel.EmployeeId).SingleOrDefault();

            if (empRecord == null)
            {
                string myguid = Guid.NewGuid().ToString();
                empRecord = new Employee();

                empRecord.UserId = myguid;
                empRecord.FacilityId = employeeModel.FacilityId;
                empRecord.RoleId = employeeModel.RoleId;
                empRecord.EmployeeDepartment = employeeModel.EmployeeDepartment;
                empRecord.EmployeeCategory = employeeModel.EmployeeCategory;
                empRecord.EmployeeUserType = employeeModel.EmployeeUserType;
                empRecord.EmployeeNo = EmpNoCheck != null ? employeeModel.EmployeeNo : getEmpNoCommon.CommonMasterDesc;
                empRecord.DOJ = employeeModel.DOJ != null ? this.utilService.GetLocalTime(employeeModel.DOJ.Value) : employeeModel.DOJ;
                empRecord.SchedulerDepartment = employeeModel.SchedulerDepartment;
                empRecord.AdditionalInfo = employeeModel.AdditionalInfo;
                empRecord.EmployeeSalutation = employeeModel.EmployeeSalutation;
                empRecord.EmployeeFirstName = employeeModel.EmployeeFirstName;
                empRecord.EmployeeMiddleName = employeeModel.EmployeeMiddleName;
                empRecord.EmployeeLastName = employeeModel.EmployeeLastName;
                empRecord.Gender = employeeModel.Gender;
                empRecord.EmployeeDOB = this.utilService.GetLocalTime(employeeModel.EmployeeDOB);
                empRecord.EmployeeAge = employeeModel.EmployeeAge;
                empRecord.EmployeeIdentificationtype1 = employeeModel.EmployeeIdentificationtype1;
                empRecord.EmployeeIdentificationtype1details = employeeModel.EmployeeIdentificationtype1details;
                empRecord.EmployeeIdentificationtype2 = employeeModel.EmployeeIdentificationtype2;
                empRecord.EmployeeIdentificationtype2details = employeeModel.EmployeeIdentificationtype2details;
                empRecord.MaritalStatus = employeeModel.MaritalStatus;
                empRecord.MothersMaiden = employeeModel.MothersMaiden;
                empRecord.PreferredLanguage = employeeModel.PreferredLanguage;
                empRecord.Bloodgroup = employeeModel.Bloodgroup;
                empRecord.CellNo = employeeModel.CellNo;
                empRecord.PhoneNo = employeeModel.PhoneNo;
                empRecord.WhatsAppNo = employeeModel.WhatsAppNo;
                empRecord.EMail = employeeModel.EMail;
                empRecord.EmergencySalutation = employeeModel.EmergencySalutation;
                empRecord.EmergencyFirstName = employeeModel.EmergencyFirstName;
                empRecord.EmergencyLastName = employeeModel.EmergencyLastName;
                empRecord.EmergencyContactType = employeeModel.EmergencyContactType;
                empRecord.EmergencyContactNo = employeeModel.EmergencyContactNo;
                empRecord.TelephoneNo = employeeModel.TelephoneNo;
                empRecord.Fax = employeeModel.Fax;
                empRecord.RelationshipToEmployee = employeeModel.RelationshipToEmployee;
                empRecord.IsActive = employeeModel.IsActive;
                empRecord.Createddate = DateTime.Now;
                empRecord.CreatedBy = "User";

                this.uow.GenericRepository<Employee>().Insert(empRecord);
                this.uow.Save();

                getEmpNoCommon.CurrentIncNo = empRecord.EmployeeNo;
                this.uow.GenericRepository<CommonMaster>().Update(getEmpNoCommon);
                this.uow.Save();
            }
            employeeModel.EmployeeId = empRecord.EmployeeId;

            if (empRecord.EmployeeId > 0)
            {
                var userRecord = this.gUow.GlobalGenericRepository<AspNetUsers>().Table().FirstOrDefault(x => x.Id.ToLower().Trim() == empRecord.UserId.ToLower().Trim());

                if(userRecord == null)
                {
                    userRecord = new AspNetUsers();

                    userRecord.Id = empRecord.UserId;
                    userRecord.UserName = empRecord.EMail;
                    userRecord.NormalizedUserName = empRecord.EMail.ToUpper();
                    userRecord.Email = empRecord.EMail;
                    userRecord.NormalizedEmail = empRecord.EMail.ToUpper();
                    userRecord.EmailConfirmed = true;
                    userRecord.PhoneNumber = empRecord.CellNo;
                    userRecord.PhoneNumberConfirmed = false;
                    userRecord.TwoFactorEnabled = false;
                    userRecord.LockoutEnabled = true;
                    userRecord.AccessFailedCount = 0;
                    userRecord.CreatedBy = empRecord.EMail;
                    userRecord.CreatedDate = DateTime.Now;
                    userRecord.isActive = false;

                    this.gUow.GlobalGenericRepository<AspNetUsers>().Insert(userRecord);
                    this.gUow.Save();
                }

                var userRoleData = this.uow.GenericRepository<userrole>().Table().FirstOrDefault(x => x.Userid.ToLower().Trim() == empRecord.UserId.ToLower().Trim());
                if (userRoleData == null)
                {
                    userRoleData = new userrole();

                    userRoleData.Userid = empRecord.UserId;
                    userRoleData.Roleid = empRecord.RoleId;
                    userRoleData.Deleted = false;
                    userRoleData.Createddate = DateTime.Now;
                    userRoleData.Createdby = "User";

                    this.uow.GenericRepository<userrole>().Insert(userRoleData);
                }
                else
                {
                    userRoleData.Roleid = empRecord.RoleId;
                    userRoleData.Deleted = false;
                    userRoleData.Createddate = DateTime.Now;
                    userRoleData.Createdby = "User";

                    this.uow.GenericRepository<userrole>().Update(userRoleData);
                }
                this.uow.Save();
            }

            return employeeModel;
        }

        ///// <summary>
        ///// Add or Update a Provider data by checking ProviderId
        ///// </summary>
        ///// <param name=ProviderModel>provData(object of ProviderModel)</param>
        ///// <returns>ProviderModel. if a Provider data added or updated = success. else = failure</returns>
        public ProviderModel RegisterProvider(ProviderModel provData)
        {
            Provider prov = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == provData.ProviderID).SingleOrDefault();

            if (prov == null)
            {
                string myguid = Guid.NewGuid().ToString();

                prov = new Provider();

                prov.UserID = myguid;
                prov.FacilityId = provData.FacilityId;
                prov.RoleId = provData.RoleId;
                prov.FirstName = provData.FirstName;
                prov.MiddleName = provData.MiddleName;
                prov.LastName = provData.LastName;
                prov.NamePrefix = provData.NamePrefix;
                prov.NameSuffix = provData.NameSuffix;
                prov.Title = provData.Title;
                prov.BirthDate = provData.BirthDate != null ? this.utilService.GetLocalTime(provData.BirthDate.Value) : provData.BirthDate;
                prov.Gender = provData.Gender;
                prov.PersonalEmail = provData.PersonalEmail;
                prov.IsActive = provData.IsActive;
                prov.Language = provData.Language;
                prov.PreferredLanguage = provData.PreferredLanguage;
                prov.MotherMaiden = provData.MotherMaiden;
                prov.WebSiteName = provData.WebSiteName;
                prov.CreatedDate = DateTime.Now;
                prov.CreatedBy = "User";

                this.uow.GenericRepository<Provider>().Insert(prov);
            }
            this.uow.Save();
            provData.ProviderID = prov.ProviderID;

            if (prov.ProviderID > 0)
            {
                var userRecord = this.gUow.GlobalGenericRepository<AspNetUsers>().Table().FirstOrDefault(x => x.Id.ToLower().Trim() == prov.UserID.ToLower().Trim());

                if (userRecord == null)
                {
                    userRecord = new AspNetUsers();

                    userRecord.Id = prov.UserID;
                    userRecord.UserName = prov.PersonalEmail;
                    userRecord.NormalizedUserName = prov.PersonalEmail.ToUpper();
                    userRecord.Email = prov.PersonalEmail;
                    userRecord.NormalizedEmail = prov.PersonalEmail.ToUpper();
                    userRecord.EmailConfirmed = true;
                    userRecord.PhoneNumber = this.uow.GenericRepository<ProviderContact>().Table().FirstOrDefault(x => x.ProviderID == prov.ProviderID) != null ?
                                             this.uow.GenericRepository<ProviderContact>().Table().FirstOrDefault(x => x.ProviderID == prov.ProviderID).PhoneNumber : "None";
                    userRecord.PhoneNumberConfirmed = false;
                    userRecord.TwoFactorEnabled = false;
                    userRecord.LockoutEnabled = true;
                    userRecord.AccessFailedCount = 0;
                    userRecord.CreatedBy = prov.PersonalEmail;
                    userRecord.CreatedDate = DateTime.Now;
                    userRecord.isActive = false;

                    this.gUow.GlobalGenericRepository<AspNetUsers>().Insert(userRecord);
                    this.gUow.Save();
                }

                var userRoleData = this.uow.GenericRepository<userrole>().Table().FirstOrDefault(x => x.Userid.ToLower().Trim() == prov.UserID.ToLower().Trim());
                if (userRoleData == null)
                {
                    userRoleData = new userrole();

                    userRoleData.Userid = prov.UserID;
                    userRoleData.Roleid = prov.RoleId;
                    userRoleData.Deleted = false;
                    userRoleData.Createddate = DateTime.Now;
                    userRoleData.Createdby = "User";

                    this.uow.GenericRepository<userrole>().Insert(userRoleData);
                }
                else
                {
                    userRoleData.Roleid = prov.RoleId;
                    userRoleData.Deleted = false;
                    userRoleData.Createddate = DateTime.Now;
                    userRoleData.Createdby = "User";

                    this.uow.GenericRepository<userrole>().Update(userRoleData);
                }
                this.uow.Save();
            }

            return provData;
        }

        #endregion

    }
}
