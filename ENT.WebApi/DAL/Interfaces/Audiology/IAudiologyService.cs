using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IAudiologyService
    {
        List<string> GetVisitNumbersbySearch(string searchKey);

        List<PatientCaseSheetModel> GetCaseSheetDataForAudiology();
        List<AudiologyRequestModel> GetAudiologyRequestsforAudiology(int ProviderId);
        List<AudiologyRequestModel> GetAllAudiologyRequests();
        AudiologyRequestModel GetAudiologyRequestbyId(int audiologyRequestID);


        TuningForkTestModel AddUpdateTuningForkTest(TuningForkTestModel tuningForkTestModel);
        SpeechtherapySpecialtestsModel AddUpdateSpeechtherapySpecialtests(SpeechtherapySpecialtestsModel speechtherapySpecialtestsModel);
        TympanometryModel AddUpdateTympanometry(TympanometryModel tympanometryModel);
        OAETestModel AddUpdateOAETestData(OAETestModel oAETestModel);
        BERATestModel AddUpdateBERATestData(BERATestModel bERATestModel);
        ASSRTestModel AddUpdateASSRTestData(ASSRTestModel aSSRTestModel);
        HearingAidTrialModel AddUpdateHearingAidTrialData(HearingAidTrialModel hearingAidTrialModel);
        TinnitusmaskingModel AddUpdateTinnitusmaskingData(TinnitusmaskingModel tinnitusmaskingModel);
        SpeechTherapyModel AddUpdateSpeechTherapyData(SpeechTherapyModel speechTherapyModel);
        ElectrocochleographyModel AddUpdateElectrocochleographyData(ElectrocochleographyModel electrocochleographyModel);



        TuningForkTestModel GetTuningForkTestDataForPatientVisit(int VisitID);
        SpeechtherapySpecialtestsModel GetSpeechTherapySpecialTestsForPatientVisit(int VisitID);
        TympanometryModel GetTympanometryForPatientVisit(int VisitID);
        OAETestModel GetOAETestForPatientVisit(int VisitID);
        BERATestModel GetBERATestForPatientVisit(int VisitID);
        ASSRTestModel GetASSRTestForPatientVisit(int VisitID);
        HearingAidTrialModel GetHearingAidTrialDataForPatientVisit(int VisitID);
        TinnitusmaskingModel GetTinnitusmaskingDataForPatientVisit(int VisitID);
        SpeechTherapyModel GetSpeechTherapyForPatientVisit(int VisitID);
        ElectrocochleographyModel GetElectrocochleographyForPatientVisit(int VisitID);

        Task<SigningOffModel> SignoffUpdationforAudiology(SigningOffModel signOffModel);

        #region Audiology Search and Count

        List<Patient> GetPatientsForAudiologySearch(string searchKey);
        List<ProviderModel> GetAudiologyDoctorsforSearch(string searchKey);
        List<AudiologyRequestModel> GetAudiologyRequestsbySearch(SearchModel searchModel);
        AudiologyCountModel GetCountsForAudiology();

        #endregion
    }
}
