using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IProviderSetUpService
    {
        #region Master for Provider
        List<Speciality> GetAllSpecialities();
        List<Roles> GetAllRoles();
        List<DiagnosisCode> GetAllDiagnosisCodes(string searchKey, int ProviderID);
        List<TreatmentCode> GetAllTreatmentCodes(string searchKey, int ProviderID);
        List<Facility> GetAllFacilitiesforProvider();
        List<Facility> GetFacilitiesbyProviderId(int providerId);
        List<Gender> GetGenderListforProvider();
        List<AddressType> GetAddressTypeListforProvider();
        List<Country> GetCountryListforProvider();
        List<State> GetStateListforProvider();
        List<Language> GetLanguageListforProvider();

        #endregion

        #region Provider

        List<ProviderModel> GetAllProviders();
        ProviderModel GetProviderById(int ProviderId);
        ProviderModel AddUpdateProvider(ProviderModel provData);

        List<ProviderDiagnosisCodeModel> GetICDCodesforProvider(string searchKey, int ProviderId);
        IEnumerable<ProviderDiagnosisCodeModel> AddUpdateDiagnosisCodes(IEnumerable<ProviderDiagnosisCodeModel> provDiagData);

        List<ProviderTreatmentCodeModel> GetCPTCodesforProvider(string searchKey, int ProviderId);
        IEnumerable<ProviderTreatmentCodeModel> AddUpdateCPTCodes(IEnumerable<ProviderTreatmentCodeModel> provCPTData);

        List<ProviderSpecialityModel> GetProviderSpecialities(int ProviderId);
        ProviderSpecialityModel AddUpdateProviderSpeciality(ProviderSpecialityModel SpecialityData);
        ProviderSpecialityModel GetProviderSpecialityByID(int ProvSpecialityId);

        List<ProviderVacationModel> GetProviderVacationDetails(int ProviderId);
        ProviderVacationModel AddUpdateVacationDetails(ProviderVacationModel VacationData);
        ProviderVacationModel GetVacationDetailforProvider(int ProVacationId);

        List<ProviderScheduleModel> GetProviderScheduleDetails(int ProviderId, int facilityID);
        ProviderScheduleModel AddUpdateSchedules(ProviderScheduleModel ScheduleData);
        ProviderScheduleModel GetProviderSchedules(int ProviderId, int facilityID);

        List<ProviderModel> SearchProvider(int ProviderId, int SpecialityId);
        ProviderCountModel ProviderCount();

        #endregion

        #region File Access

        List<clsViewFile> GetFile(string Id, string screen);
        List<string> DeleteFile(string path, string fileName);

        #endregion

    }
}
