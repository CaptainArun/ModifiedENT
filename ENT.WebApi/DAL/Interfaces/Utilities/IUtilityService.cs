using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IUtilityService
    {
        Task<string> GetProviderUserId();
        string UpdateGlobalUser(string Email, string userID);
        string GetUserIDofProvider();
        DateTime GetLocalTime(DateTime dateTime);
        string GetUserId(string Email);
        List<SnomedCT> GetAllSnomedCTCodes(string searchKey);
        TreatmentCode GetProcedureCode(string CPTCode);
        DiagnosisCode GetICDCode(string ICDCode);
        DiagnosisCode GetICDCodebyID(int DiagCodeID);
        List<TreatmentCode> GetTreatmentCodesbySearch(string searchKey);
        List<DiagnosisCode> GetAllDiagnosisCodesbySearch(string searchKey);
        List<DischargeCode> GetDischargeCodesbySearch(string searchKey);
        List<Speciality> GetAllSpecialities();
        List<DrugCode> GetAllDrugCodes(string searchKey);
        Task<List<Facility>> GetFacilitiesbyUser();
        List<Facility> GetFacilitiesforUser();
        List<Facility> GetFacilitiesbyProviderId(int providerId);
        List<Facility> GetFacilitiesbyEmployeeId(int employeeId);
        Task<SigningOffModel> ProcedureCareSignOffUpdation(SigningOffModel procedureCareSignOffModel);
        Task<SigningOffModel> UserCheck(SigningOffModel eLabSignOffModel);
        Task<SigningOffModel> TriageSignoffUpdation(SigningOffModel signOffModel);
        Task<SigningOffModel> AudiologySignoff(SigningOffModel signOffModel);
        Task<SigningOffModel> DischargeSignOff(SigningOffModel signOffModel);
        void SendEmail(MessageModel message);
    }
}
