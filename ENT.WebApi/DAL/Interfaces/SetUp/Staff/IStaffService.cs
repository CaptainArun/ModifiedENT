using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IStaffService
    {
        #region Master Data

        List<Gender> GetGenderList();
        List<AddressType> GetAddressTypeList();
        List<Language> GetLanguageList();
        List<Salutation> GetSalutationList();
        List<Departments> GetAllDepartments();
        List<IdentificationIdType> GetIdentificationTypeList();
        List<MaritalStatus> GetAllMaritalStatuses();
        List<BloodGroup> GetBloodGroupList();
        List<ContactType> GetContactTypeList();
        List<Relationshiptopatient> GetAllRelations();
        List<State> GetStateList();
        List<Country> GetCountryList();
        List<Roles> GetRoles();
        List<Facility> GetFacilitiesbyEmployeeId(int employeeId);
        List<UserType> GetUserType();
        List<EmpExtracurricularActivitiesType> GetEmpExtracurricularActivitiesType();
        List<Patient> GetPatientsForSearch(string searchKey);
        List<Departments> GetDepartmentsForSearch(string searchKey);
        List<Language> GetLanguagesForSearch(string searchKey);
        List<string> GetEmployeeNumber();

        #endregion

        #region Staff (Employee)

        EmployeeNewModel AddUpdateStaffRecord(EmployeeNewModel employeeModel);
        List<EmployeeNewModel> GetStaffs();
        EmployeeNewModel GetStaffbyId(int employeeId);
        EmployeeNewModel GetStaffbyUserId(string UserId);
        List<Provider> GetProvidersbyFacility(int facilityID);
        List<Employee> GetStaffsbyFacility(int facilityID);

        #endregion

        #region File Access

        List<clsViewFile> GetFile(string Id, string screen);
        List<string> DeleteFile(string path, string fileName);

        #endregion

    }
}
