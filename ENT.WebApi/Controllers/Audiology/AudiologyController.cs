using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Authorization;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AudiologyController : Controller
    {
        public readonly IAudiologyService iAudiologyService;

        public AudiologyController(IAudiologyService _iAudiologyService)
        {
            iAudiologyService = _iAudiologyService;
        }

        [HttpGet]
        public List<string> GetVisitNumbersbySearch(string searchKey)
        {
            return this.iAudiologyService.GetVisitNumbersbySearch(searchKey);
        }

        [HttpGet]
        public List<PatientCaseSheetModel> GetCaseSheetDataForAudiology()
        {
            return this.iAudiologyService.GetCaseSheetDataForAudiology();
        }

        [HttpGet]
        public List<AudiologyRequestModel> GetAudiologyRequestsforAudiology(int ProviderId)
        {
            return this.iAudiologyService.GetAudiologyRequestsforAudiology(ProviderId);
        }

        [HttpGet]
        public List<AudiologyRequestModel> GetAllAudiologyRequests()
        {
            return this.iAudiologyService.GetAllAudiologyRequests();
        }

        [HttpGet]
        public AudiologyRequestModel GetAudiologyRequestbyId(int audiologyRequestID)
        {
            return this.iAudiologyService.GetAudiologyRequestbyId(audiologyRequestID);
        }

        [HttpPost]
        public TuningForkTestModel AddUpdateTuningForkTest(TuningForkTestModel tuningForkTestModel)
        {
            return this.iAudiologyService.AddUpdateTuningForkTest(tuningForkTestModel);
        }

        [HttpPost]
        public SpeechtherapySpecialtestsModel AddUpdateSpeechtherapySpecialtests(SpeechtherapySpecialtestsModel speechtherapySpecialtestsModel)
        {
            return this.iAudiologyService.AddUpdateSpeechtherapySpecialtests(speechtherapySpecialtestsModel);
        }

        [HttpPost]
        public TympanometryModel AddUpdateTympanometry(TympanometryModel tympanometryModel)
        {
            return this.iAudiologyService.AddUpdateTympanometry(tympanometryModel);
        }

        [HttpPost]
        public OAETestModel AddUpdateOAETestData(OAETestModel oAETestModel)
        {
            return this.iAudiologyService.AddUpdateOAETestData(oAETestModel);
        }

        [HttpPost]
        public BERATestModel AddUpdateBERATestData(BERATestModel bERATestModel)
        {
            return this.iAudiologyService.AddUpdateBERATestData(bERATestModel);
        }

        [HttpPost]
        public ASSRTestModel AddUpdateASSRTestData(ASSRTestModel aSSRTestModel)
        {
            return this.iAudiologyService.AddUpdateASSRTestData(aSSRTestModel);
        }

        [HttpPost]
        public HearingAidTrialModel AddUpdateHearingAidTrialData(HearingAidTrialModel hearingAidTrialModel)
        {
            return this.iAudiologyService.AddUpdateHearingAidTrialData(hearingAidTrialModel);
        }

        [HttpPost]
        public TinnitusmaskingModel AddUpdateTinnitusmaskingData(TinnitusmaskingModel tinnitusmaskingModel)
        {
            return this.iAudiologyService.AddUpdateTinnitusmaskingData(tinnitusmaskingModel);
        }

        [HttpPost]
        public SpeechTherapyModel AddUpdateSpeechTherapyData(SpeechTherapyModel speechTherapyModel)
        {
            return this.iAudiologyService.AddUpdateSpeechTherapyData(speechTherapyModel);
        }

        [HttpPost]
        public ElectrocochleographyModel AddUpdateElectrocochleographyData(ElectrocochleographyModel electrocochleographyModel)
        {
            return this.iAudiologyService.AddUpdateElectrocochleographyData(electrocochleographyModel);
        }



        [HttpGet]
        public TuningForkTestModel GetTuningForkTestDataForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetTuningForkTestDataForPatientVisit(VisitID);
        }

        [HttpGet]
        public SpeechtherapySpecialtestsModel GetSpeechTherapySpecialTestsForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetSpeechTherapySpecialTestsForPatientVisit(VisitID);
        }

        [HttpGet]
        public TympanometryModel GetTympanometryForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetTympanometryForPatientVisit(VisitID);
        }

        [HttpGet]
        public OAETestModel GetOAETestForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetOAETestForPatientVisit(VisitID);
        }

        [HttpGet]
        public BERATestModel GetBERATestForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetBERATestForPatientVisit(VisitID);
        }

        [HttpGet]
        public ASSRTestModel GetASSRTestForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetASSRTestForPatientVisit(VisitID);
        }

        [HttpGet]
        public HearingAidTrialModel GetHearingAidTrialDataForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetHearingAidTrialDataForPatientVisit(VisitID);
        }

        [HttpGet]
        public TinnitusmaskingModel GetTinnitusmaskingDataForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetTinnitusmaskingDataForPatientVisit(VisitID);
        }

        [HttpGet]
        public SpeechTherapyModel GetSpeechTherapyForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetSpeechTherapyForPatientVisit(VisitID);
        }

        [HttpGet]
        public ElectrocochleographyModel GetElectrocochleographyForPatientVisit(int VisitID)
        {
            return this.iAudiologyService.GetElectrocochleographyForPatientVisit(VisitID);
        }

        [HttpPost]
        public Task<SigningOffModel> SignoffUpdationforAudiology(SigningOffModel signOffModel)
        {
            return this.iAudiologyService.SignoffUpdationforAudiology(signOffModel);
        }

        #region Audiology Search and Count

        [HttpGet]
        public List<Patient> GetPatientsForAudiologySearch(string searchKey)
        {
            return this.iAudiologyService.GetPatientsForAudiologySearch(searchKey);
        }

        [HttpGet]
        public List<ProviderModel> GetAudiologyDoctorsforSearch(string searchKey)
        {
            return this.iAudiologyService.GetAudiologyDoctorsforSearch(searchKey);
        }

        [HttpPost]
        public List<AudiologyRequestModel> GetAudiologyRequestsbySearch(SearchModel searchModel)
        {
            return this.iAudiologyService.GetAudiologyRequestsbySearch(searchModel);
        }

        [HttpGet]
        public AudiologyCountModel GetCountsForAudiology()
        {
            return this.iAudiologyService.GetCountsForAudiology();
        }

        #endregion

    }
}