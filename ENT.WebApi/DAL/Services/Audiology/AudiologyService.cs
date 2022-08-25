using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Services
{
    public class AudiologyService : IAudiologyService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        public readonly IGlobalUnitOfWork gUow;

        public AudiologyService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
        }

        ///// <summary>
        ///// Get Case Sheet Records for Audiology
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>PatientCaseSheetModel</returns>
        public List<PatientCaseSheetModel> GetCaseSheetDataForAudiology()
        {
            var patientCaseSheetList = (from visit in this.uow.GenericRepository<PatientVisit>().Table()

                                        join patient in this.uow.GenericRepository<Patient>().Table()
                                        on visit.PatientId equals patient.PatientId

                                        join provider in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                        on visit.ProviderID equals provider.ProviderID

                                        select new
                                        {
                                            visit.PatientId,
                                            patient.PatientFirstName,
                                            patient.PatientMiddleName,
                                            patient.PatientLastName,
                                            visit.ProviderID,
                                            visit.FacilityID,
                                            provider.FirstName,
                                            provider.MiddleName,
                                            provider.LastName,
                                            visit.VisitId,
                                            visit.VisitNo,
                                            visit.VisitDate,
                                            visit.Visittime

                                        }).AsEnumerable().Select(PCSM => new PatientCaseSheetModel
                                        {
                                            PatientId = PCSM.PatientId,
                                            PatientName = PCSM.PatientFirstName + " " + PCSM.PatientMiddleName + " " + PCSM.PatientLastName,
                                            ProviderId = PCSM.ProviderID,
                                            FacilityId = PCSM.FacilityID > 0 ? PCSM.FacilityID.Value : 0,
                                            facilityName = PCSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PCSM.FacilityID).FacilityName : "",
                                            ProviderName = PCSM.FirstName + " " + PCSM.MiddleName + " " + PCSM.LastName,
                                            VisitNo = PCSM.VisitNo,
                                            VisitId = PCSM.VisitId,
                                            VisitDateandTime = PCSM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PCSM.VisitDate.TimeOfDay.ToString()

                                        }).ToList();

            List<PatientCaseSheetModel> patientcaseSheetCollection = new List<PatientCaseSheetModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (patientCaseSheetList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        patientcaseSheetCollection = (from caseData in patientCaseSheetList
                                                      join fac in facList on caseData.FacilityId equals fac.FacilityId
                                                      join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                      on caseData.ProviderId equals prov.ProviderID
                                                      select caseData).ToList();
                    }
                    else
                    {
                        patientcaseSheetCollection = (from caseData in patientCaseSheetList
                                                      join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                      on caseData.ProviderId equals prov.ProviderID
                                                      select caseData).ToList();
                    }
                }
                else
                {
                    patientcaseSheetCollection = (from caseData in patientCaseSheetList
                                                  join fac in facList on caseData.FacilityId equals fac.FacilityId
                                                  select caseData).ToList();
                }
            }
            else
            {
                patientcaseSheetCollection = patientCaseSheetList;
            }

            return patientcaseSheetCollection;
        }


        ///// <summary>
        ///// Get Audiology Request Records for Audiology screen for provider
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AudiologyRequestModel></returns>
        public List<AudiologyRequestModel> GetAudiologyRequestsforAudiology(int ProviderId)
        {
            var audiologyRecords = (from audio in this.uow.GenericRepository<AudiologyRequest>().Table()

                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on audio.VisitID equals visit.VisitId

                                    join pat in this.uow.GenericRepository<Patient>().Table()
                                    on visit.PatientId equals pat.PatientId

                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false).Where(x => x.ProviderID == ProviderId)
                                    on audio.ProviderId equals prov.ProviderID

                                    join provSpec in this.uow.GenericRepository<ProviderSpeciality>().Table()
                                    on prov.ProviderID equals provSpec.ProviderID

                                    where (provSpec.SpecialityDescription.ToLower().Trim() == "audiologist")

                                    select new
                                    {
                                        audio.AudiologyRequestID,
                                        audio.VisitID,
                                        audio.ProviderId,
                                        pat.PatientId,
                                        pat.PatientFirstName,
                                        pat.PatientMiddleName,
                                        pat.PatientLastName,
                                        prov.UserID,
                                        prov.FirstName,
                                        prov.MiddleName,
                                        prov.LastName,
                                        audio.TuningFork,
                                        audio.SpecialTest,
                                        audio.Tympanometry,
                                        audio.OAE,
                                        audio.BERA,
                                        audio.ASSR,
                                        audio.HearingAid,
                                        audio.SpeechTherapy,
                                        audio.TinnitusMasking,
                                        audio.Electrocochleography,
                                        visit.VisitDate,
                                        visit.VisitNo,
                                        visit.FacilityID,
                                        visit.ToConsult

                                    }).AsEnumerable().Select(ARM => new AudiologyRequestModel
                                    {
                                        AudiologyRequestID = ARM.AudiologyRequestID,
                                        VisitID = ARM.VisitID,
                                        VisitNo = ARM.VisitNo,
                                        FacilityId = ARM.FacilityID > 0 ? ARM.FacilityID.Value : 0,
                                        facilityName = ARM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == ARM.FacilityID).FacilityName : "",
                                        ProviderId = ARM.ProviderId,
                                        ProviderName = ARM.FirstName + " " + ARM.MiddleName + " " + ARM.LastName,
                                        PatientName = ARM.PatientFirstName + " " + ARM.PatientMiddleName + " " + ARM.PatientLastName,
                                        TuningFork = ARM.TuningFork,
                                        SpecialTest = ARM.SpecialTest,
                                        Tympanometry = ARM.Tympanometry,
                                        OAE = ARM.OAE,
                                        BERA = ARM.BERA,
                                        ASSR = ARM.ASSR,
                                        HearingAid = ARM.HearingAid,
                                        SpeechTherapy = ARM.SpeechTherapy,
                                        TinnitusMasking = ARM.TinnitusMasking,
                                        Electrocochleography = ARM.Electrocochleography,
                                        VisitDateandTime = ARM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + ARM.VisitDate.TimeOfDay.ToString()

                                    }).ToList();

            List<AudiologyRequestModel> audioRequestCollection = new List<AudiologyRequestModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (audiologyRecords.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        audioRequestCollection = (from audio in audiologyRecords
                                                  join fac in facList on audio.FacilityId equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on audio.ProviderId equals prov.ProviderID
                                                  select audio).ToList();
                    }
                    else
                    {
                        audioRequestCollection = (from audio in audiologyRecords
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on audio.ProviderId equals prov.ProviderID
                                                  select audio).ToList();
                    }
                }
                else
                {
                    audioRequestCollection = (from audio in audiologyRecords
                                              join fac in facList on audio.FacilityId equals fac.FacilityId
                                              select audio).ToList();
                }
            }
            else
            {
                audioRequestCollection = audiologyRecords;
            }

            return audioRequestCollection;
        }

        ///// <summary>
        ///// Get Audiology Request Records for Audiology screen
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AudiologyRequestModel></returns>
        public List<AudiologyRequestModel> GetAllAudiologyRequests()
        {
            var audiologyRecords = (from audio in this.uow.GenericRepository<AudiologyRequest>().Table()

                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on audio.VisitID equals visit.VisitId

                                    join pat in this.uow.GenericRepository<Patient>().Table()
                                    on visit.PatientId equals pat.PatientId

                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                    on audio.ProviderId equals prov.ProviderID

                                    join provSpec in this.uow.GenericRepository<ProviderSpeciality>().Table()
                                    on prov.ProviderID equals provSpec.ProviderID

                                    where (provSpec.SpecialityDescription.ToLower().Trim() == "audiologist")

                                    select new
                                    {
                                        audio.AudiologyRequestID,
                                        audio.VisitID,
                                        audio.ProviderId,
                                        pat.PatientId,
                                        pat.PatientFirstName,
                                        pat.PatientMiddleName,
                                        pat.PatientLastName,
                                        prov.UserID,
                                        prov.FirstName,
                                        prov.MiddleName,
                                        prov.LastName,
                                        audio.TuningFork,
                                        audio.SpecialTest,
                                        audio.Tympanometry,
                                        audio.OAE,
                                        audio.BERA,
                                        audio.ASSR,
                                        audio.HearingAid,
                                        audio.SpeechTherapy,
                                        audio.TinnitusMasking,
                                        audio.Electrocochleography,
                                        visit.VisitDate,
                                        visit.VisitNo,
                                        visit.FacilityID,
                                        visit.ToConsult

                                    }).AsEnumerable().Select(ARM => new AudiologyRequestModel
                                    //GroupBy(obj => new { obj.VisitID }).Select(data => data.OrderByDescending(set => set.VisitDate).FirstOrDefault()).Select(ARM => new AudiologyRequestModel
                                    {
                                        AudiologyRequestID = ARM.AudiologyRequestID,
                                        VisitID = ARM.VisitID,
                                        VisitNo = ARM.VisitNo,
                                        FacilityId = ARM.FacilityID > 0 ? ARM.FacilityID.Value : 0,
                                        facilityName = ARM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == ARM.FacilityID).FacilityName : "",
                                        ProviderId = ARM.ProviderId,
                                        ProviderName = ARM.FirstName + " " + ARM.MiddleName + " " + ARM.LastName,
                                        PatientId = ARM.PatientId,
                                        PatientName = ARM.PatientFirstName + " " + ARM.PatientMiddleName + " " + ARM.PatientLastName,
                                        TuningFork = ARM.TuningFork,
                                        SpecialTest = ARM.SpecialTest,
                                        Tympanometry = ARM.Tympanometry,
                                        OAE = ARM.OAE,
                                        BERA = ARM.BERA,
                                        ASSR = ARM.ASSR,
                                        HearingAid = ARM.HearingAid,
                                        SpeechTherapy = ARM.SpeechTherapy,
                                        TinnitusMasking = ARM.TinnitusMasking,
                                        Electrocochleography = ARM.Electrocochleography,
                                        VisitDateandTime = ARM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + ARM.VisitDate.TimeOfDay.ToString()

                                    }).ToList();

            List<AudiologyRequestModel> audioRequestCollection = new List<AudiologyRequestModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (audiologyRecords.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        audioRequestCollection = (from audio in audiologyRecords
                                                  join fac in facList on audio.FacilityId equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on audio.ProviderId equals prov.ProviderID
                                                  select audio).ToList();
                    }
                    else
                    {
                        audioRequestCollection = (from audio in audiologyRecords
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on audio.ProviderId equals prov.ProviderID
                                                  select audio).ToList();
                    }
                }
                else
                {
                    audioRequestCollection = (from audio in audiologyRecords
                                              join fac in facList on audio.FacilityId equals fac.FacilityId
                                              select audio).ToList();
                }
            }
            else
            {
                audioRequestCollection = audiologyRecords;
            }

            return audioRequestCollection;
        }

        ///// <summary>
        ///// Get Audiology Request Record for for given id
        ///// </summary>
        ///// <param>int audiologyRequestID</param>
        ///// <returns>AudiologyRequestModel for given id</returns>
        public AudiologyRequestModel GetAudiologyRequestbyId(int audiologyRequestID)
        {
            var audiologyRecord = (from audio in this.uow.GenericRepository<AudiologyRequest>().Table().Where(x => x.AudiologyRequestID == audiologyRequestID)

                                   join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                   on audio.VisitID equals visit.VisitId

                                   join pat in this.uow.GenericRepository<Patient>().Table()
                                   on visit.PatientId equals pat.PatientId

                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                   on audio.ProviderId equals prov.ProviderID

                                   join provSpec in this.uow.GenericRepository<ProviderSpeciality>().Table()
                                   on prov.ProviderID equals provSpec.ProviderID

                                   where (provSpec.SpecialityDescription.ToLower().Trim() == "audiologist")

                                   select new
                                   {
                                       audio.AudiologyRequestID,
                                       audio.VisitID,
                                       audio.ProviderId,
                                       pat.PatientId,
                                       pat.PatientFirstName,
                                       pat.PatientMiddleName,
                                       pat.PatientLastName,
                                       prov.UserID,
                                       prov.FirstName,
                                       prov.MiddleName,
                                       prov.LastName,
                                       audio.TuningFork,
                                       audio.SpecialTest,
                                       audio.Tympanometry,
                                       audio.OAE,
                                       audio.BERA,
                                       audio.ASSR,
                                       audio.HearingAid,
                                       audio.SpeechTherapy,
                                       audio.TinnitusMasking,
                                       audio.Electrocochleography,
                                       visit.VisitDate,
                                       visit.VisitNo,
                                       visit.FacilityID,
                                       visit.ToConsult

                                   }).AsEnumerable().Select(ARM => new AudiologyRequestModel
                                   {
                                       AudiologyRequestID = ARM.AudiologyRequestID,
                                       VisitID = ARM.VisitID,
                                       VisitNo = ARM.VisitNo,
                                       FacilityId = ARM.FacilityID > 0 ? ARM.FacilityID.Value : 0,
                                       facilityName = ARM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == ARM.FacilityID).FacilityName : "",
                                       ProviderId = ARM.ProviderId,
                                       ProviderName = ARM.FirstName + " " + ARM.MiddleName + " " + ARM.LastName,
                                       PatientName = ARM.PatientFirstName + " " + ARM.PatientMiddleName + " " + ARM.PatientLastName,
                                       TuningFork = ARM.TuningFork,
                                       SpecialTest = ARM.SpecialTest,
                                       Tympanometry = ARM.Tympanometry,
                                       OAE = ARM.OAE,
                                       BERA = ARM.BERA,
                                       ASSR = ARM.ASSR,
                                       HearingAid = ARM.HearingAid,
                                       SpeechTherapy = ARM.SpeechTherapy,
                                       TinnitusMasking = ARM.TinnitusMasking,
                                       Electrocochleography = ARM.Electrocochleography,
                                       VisitDateandTime = ARM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + ARM.VisitDate.TimeOfDay.ToString()

                                   }).FirstOrDefault();

            return audiologyRecord;
        }


        ///// <summary>
        ///// Add or Update Tuning Fork test data
        ///// </summary>
        ///// <param name>TuningForkTestModel tuningForkTestModel</param>
        ///// <returns>TuningForkTestModel. if Tuning Fork Test added or updated = success. else = failure</returns>
        public TuningForkTestModel AddUpdateTuningForkTest(TuningForkTestModel tuningForkTestModel)
        {
            var forkTest = this.uow.GenericRepository<TuningForkTest>().Table().Where(x => x.VisitID == tuningForkTestModel.VisitID).FirstOrDefault();

            if (forkTest == null)
            {
                forkTest = new TuningForkTest();

                forkTest.VisitID = tuningForkTestModel.VisitID;
                forkTest.WeberLTEar = tuningForkTestModel.WeberLTEar;
                forkTest.WeberRTEar = tuningForkTestModel.WeberRTEar;
                forkTest.RinnersLTEar = tuningForkTestModel.RinnersLTEar;
                forkTest.RinnersRTEar = tuningForkTestModel.RinnersRTEar;
                forkTest.Starttime = tuningForkTestModel.Starttime;// != null ? this.utilService.GetLocalTime(tuningForkTestModel.Starttime.Value) : tuningForkTestModel.Starttime;
                forkTest.Endtime = tuningForkTestModel.Endtime;// != null ? this.utilService.GetLocalTime(tuningForkTestModel.Endtime.Value) : tuningForkTestModel.Endtime;
                forkTest.Totalduration = tuningForkTestModel.Totalduration;
                forkTest.Findings = tuningForkTestModel.Findings;
                forkTest.Nextfollowupdate = tuningForkTestModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(tuningForkTestModel.Nextfollowupdate.Value) : tuningForkTestModel.Nextfollowupdate;
                forkTest.CreatedBy = "User";
                forkTest.Createddate = DateTime.Now;

                this.uow.GenericRepository<TuningForkTest>().Insert(forkTest);
            }
            else
            {
                forkTest.VisitID = tuningForkTestModel.VisitID;
                forkTest.WeberLTEar = tuningForkTestModel.WeberLTEar;
                forkTest.WeberRTEar = tuningForkTestModel.WeberRTEar;
                forkTest.RinnersLTEar = tuningForkTestModel.RinnersLTEar;
                forkTest.RinnersRTEar = tuningForkTestModel.RinnersRTEar;
                forkTest.Starttime = tuningForkTestModel.Starttime;// != null ? this.utilService.GetLocalTime(tuningForkTestModel.Starttime.Value) : tuningForkTestModel.Starttime;
                forkTest.Endtime = tuningForkTestModel.Endtime;// != null ? this.utilService.GetLocalTime(tuningForkTestModel.Endtime.Value) : tuningForkTestModel.Endtime;
                forkTest.Totalduration = tuningForkTestModel.Totalduration;
                forkTest.Findings = tuningForkTestModel.Findings;
                forkTest.Nextfollowupdate = tuningForkTestModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(tuningForkTestModel.Nextfollowupdate.Value) : tuningForkTestModel.Nextfollowupdate;
                forkTest.ModifiedBy = "User";
                forkTest.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<TuningForkTest>().Update(forkTest);
            }
            this.uow.Save();

            return tuningForkTestModel;
        }

        ///// <summary>
        ///// Add or Update Speech therapy special test data
        ///// </summary>
        ///// <param name>SpeechtherapySpecialtestsModel speechtherapySpecialtestsModel</param>
        ///// <returns>SpeechtherapySpecialtestsModel. if Speech therapy special test data is added or updated = success. else = failure</returns>
        public SpeechtherapySpecialtestsModel AddUpdateSpeechtherapySpecialtests(SpeechtherapySpecialtestsModel speechtherapySpecialtestsModel)
        {
            var specialTests = this.uow.GenericRepository<SpeechtherapySpecialtests>().Table().Where(x => x.VisitID == speechtherapySpecialtestsModel.VisitID).FirstOrDefault();

            if (specialTests == null)
            {
                specialTests = new SpeechtherapySpecialtests();

                specialTests.VisitID = speechtherapySpecialtestsModel.VisitID;
                specialTests.ChiefComplaint = speechtherapySpecialtestsModel.ChiefComplaint;
                specialTests.SRTRight = speechtherapySpecialtestsModel.SRTRight;
                specialTests.SRTLeft = speechtherapySpecialtestsModel.SRTLeft;
                specialTests.SDSRight = speechtherapySpecialtestsModel.SDSRight;
                specialTests.SDSLeft = speechtherapySpecialtestsModel.SDSLeft;
                specialTests.SISIRight = speechtherapySpecialtestsModel.SISIRight;
                specialTests.SISILeft = speechtherapySpecialtestsModel.SISILeft;
                specialTests.TDTRight = speechtherapySpecialtestsModel.TDTRight;
                specialTests.TDTLeft = speechtherapySpecialtestsModel.TDTLeft;
                specialTests.ABLBLeft = speechtherapySpecialtestsModel.ABLBLeft;
                specialTests.ABLBRight = speechtherapySpecialtestsModel.ABLBRight;
                specialTests.NotesandInstructions = speechtherapySpecialtestsModel.NotesandInstructions;
                specialTests.Starttime = speechtherapySpecialtestsModel.Starttime;// != null ? this.utilService.GetLocalTime(speechtherapySpecialtestsModel.Starttime.Value) : speechtherapySpecialtestsModel.Starttime;
                specialTests.Endtime = speechtherapySpecialtestsModel.Endtime;// != null ? this.utilService.GetLocalTime(speechtherapySpecialtestsModel.Endtime.Value) : speechtherapySpecialtestsModel.Endtime;
                specialTests.Totalduration = speechtherapySpecialtestsModel.Totalduration;
                specialTests.Nextfollowupdate = speechtherapySpecialtestsModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(speechtherapySpecialtestsModel.Nextfollowupdate.Value) : speechtherapySpecialtestsModel.Nextfollowupdate;
                specialTests.CreatedBy = "User";
                specialTests.Createddate = DateTime.Now;

                this.uow.GenericRepository<SpeechtherapySpecialtests>().Insert(specialTests);
            }
            else
            {
                specialTests.VisitID = speechtherapySpecialtestsModel.VisitID;
                specialTests.ChiefComplaint = speechtherapySpecialtestsModel.ChiefComplaint;
                specialTests.SRTRight = speechtherapySpecialtestsModel.SRTRight;
                specialTests.SRTLeft = speechtherapySpecialtestsModel.SRTLeft;
                specialTests.SDSRight = speechtherapySpecialtestsModel.SDSRight;
                specialTests.SDSLeft = speechtherapySpecialtestsModel.SDSLeft;
                specialTests.SISIRight = speechtherapySpecialtestsModel.SISIRight;
                specialTests.SISILeft = speechtherapySpecialtestsModel.SISILeft;
                specialTests.TDTRight = speechtherapySpecialtestsModel.TDTRight;
                specialTests.TDTLeft = speechtherapySpecialtestsModel.TDTLeft;
                specialTests.ABLBLeft = speechtherapySpecialtestsModel.ABLBLeft;
                specialTests.ABLBRight = speechtherapySpecialtestsModel.ABLBRight;
                specialTests.NotesandInstructions = speechtherapySpecialtestsModel.NotesandInstructions;
                specialTests.Starttime = speechtherapySpecialtestsModel.Starttime;// != null ? this.utilService.GetLocalTime(speechtherapySpecialtestsModel.Starttime.Value) : speechtherapySpecialtestsModel.Starttime;
                specialTests.Endtime = speechtherapySpecialtestsModel.Endtime;// != null ? this.utilService.GetLocalTime(speechtherapySpecialtestsModel.Endtime.Value) : speechtherapySpecialtestsModel.Endtime;
                specialTests.Totalduration = speechtherapySpecialtestsModel.Totalduration;
                specialTests.Nextfollowupdate = speechtherapySpecialtestsModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(speechtherapySpecialtestsModel.Nextfollowupdate.Value) : speechtherapySpecialtestsModel.Nextfollowupdate;
                specialTests.ModifiedBy = "User";
                specialTests.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<SpeechtherapySpecialtests>().Update(specialTests);
            }
            this.uow.Save();

            return speechtherapySpecialtestsModel;
        }

        ///// <summary>
        ///// Add or Update Tympanometry data
        ///// </summary>
        ///// <param name>TympanometryModel tympanometryModel</param>
        ///// <returns>TympanometryModel. if Tympanometry data is added or updated = success. else = failure</returns>
        public TympanometryModel AddUpdateTympanometry(TympanometryModel tympanometryModel)
        {
            var tympanometry = this.uow.GenericRepository<Tympanometry>().Table().Where(x => x.VisitID == tympanometryModel.VisitID).FirstOrDefault();

            if (tympanometry == null)
            {
                tympanometry = new Tympanometry();

                tympanometry.VisitID = tympanometryModel.VisitID;
                tympanometry.ECVRight = tympanometryModel.ECVRight;
                tympanometry.ECVLeft = tympanometryModel.ECVLeft;
                tympanometry.MEPRight = tympanometryModel.MEPRight;
                tympanometry.MEPLeft = tympanometryModel.MEPLeft;
                tympanometry.SCRight = tympanometryModel.SCRight;
                tympanometry.SCLeft = tympanometryModel.SCLeft;
                tympanometry.GradRight = tympanometryModel.GradRight;
                tympanometry.GradLeft = tympanometryModel.GradLeft;
                tympanometry.TWRight = tympanometryModel.TWRight;
                tympanometry.TWLeft = tympanometryModel.TWLeft;
                tympanometry.SpeedRight = tympanometryModel.SpeedRight;
                tympanometry.SpeedLeft = tympanometryModel.SpeedLeft;
                tympanometry.DirectionRight = tympanometryModel.DirectionRight;
                tympanometry.DirectionLeft = tympanometryModel.DirectionLeft;
                tympanometry.NotesandInstructions = tympanometryModel.NotesandInstructions;
                tympanometry.Starttime = tympanometryModel.Starttime;// != null ? this.utilService.GetLocalTime(tympanometryModel.Starttime.Value) : tympanometryModel.Starttime;
                tympanometry.Endtime = tympanometryModel.Endtime;// != null ? this.utilService.GetLocalTime(tympanometryModel.Endtime.Value) : tympanometryModel.Endtime;
                tympanometry.Totalduration = tympanometryModel.Totalduration;
                tympanometry.Nextfollowupdate = tympanometryModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(tympanometryModel.Nextfollowupdate.Value) : tympanometryModel.Nextfollowupdate;
                tympanometry.CreatedBy = "User";
                tympanometry.Createddate = DateTime.Now;

                this.uow.GenericRepository<Tympanometry>().Insert(tympanometry);
            }
            else
            {
                tympanometry.VisitID = tympanometryModel.VisitID;
                tympanometry.ECVRight = tympanometryModel.ECVRight;
                tympanometry.ECVLeft = tympanometryModel.ECVLeft;
                tympanometry.MEPRight = tympanometryModel.MEPRight;
                tympanometry.MEPLeft = tympanometryModel.MEPLeft;
                tympanometry.SCRight = tympanometryModel.SCRight;
                tympanometry.SCLeft = tympanometryModel.SCLeft;
                tympanometry.GradRight = tympanometryModel.GradRight;
                tympanometry.GradLeft = tympanometryModel.GradLeft;
                tympanometry.TWRight = tympanometryModel.TWRight;
                tympanometry.TWLeft = tympanometryModel.TWLeft;
                tympanometry.SpeedRight = tympanometryModel.SpeedRight;
                tympanometry.SpeedLeft = tympanometryModel.SpeedLeft;
                tympanometry.DirectionRight = tympanometryModel.DirectionRight;
                tympanometry.DirectionLeft = tympanometryModel.DirectionLeft;
                tympanometry.NotesandInstructions = tympanometryModel.NotesandInstructions;
                tympanometry.Starttime = tympanometryModel.Starttime;// != null ? this.utilService.GetLocalTime(tympanometryModel.Starttime.Value) : tympanometryModel.Starttime;
                tympanometry.Endtime = tympanometryModel.Endtime;// != null ? this.utilService.GetLocalTime(tympanometryModel.Endtime.Value) : tympanometryModel.Endtime;
                tympanometry.Totalduration = tympanometryModel.Totalduration;
                tympanometry.Nextfollowupdate = tympanometryModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(tympanometryModel.Nextfollowupdate.Value) : tympanometryModel.Nextfollowupdate;
                tympanometry.ModifiedBy = "User";
                tympanometry.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<Tympanometry>().Update(tympanometry);
            }
            this.uow.Save();

            return tympanometryModel;
        }

        ///// <summary>
        ///// Add or Update OAETest data
        ///// </summary>
        ///// <param name>OAETestModel oAETestModel</param>
        ///// <returns>OAETestModel. if OAETest data is added or updated = success. else = failure</returns>
        public OAETestModel AddUpdateOAETestData(OAETestModel oAETestModel)
        {
            var oaeTest = this.uow.GenericRepository<OAETest>().Table().Where(x => x.VisitID == oAETestModel.VisitID).FirstOrDefault();

            if (oaeTest == null)
            {
                oaeTest = new OAETest();

                oaeTest.VisitID = oAETestModel.VisitID;
                oaeTest.LTEar = oAETestModel.LTEar;
                oaeTest.RTEar = oAETestModel.RTEar;
                oaeTest.NotesandInstructions = oAETestModel.NotesandInstructions;
                oaeTest.Starttime = oAETestModel.Starttime;// != null ? this.utilService.GetLocalTime(oAETestModel.Starttime.Value) : oAETestModel.Starttime;
                oaeTest.Endtime = oAETestModel.Endtime;// != null ? this.utilService.GetLocalTime(oAETestModel.Endtime.Value) : oAETestModel.Endtime;
                oaeTest.Totalduration = oAETestModel.Totalduration;
                oaeTest.Nextfollowupdate = oAETestModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(oAETestModel.Nextfollowupdate.Value) : oAETestModel.Nextfollowupdate;
                oaeTest.CreatedBy = "User";
                oaeTest.Createddate = DateTime.Now;

                this.uow.GenericRepository<OAETest>().Insert(oaeTest);
            }
            else
            {
                oaeTest.VisitID = oAETestModel.VisitID;
                oaeTest.LTEar = oAETestModel.LTEar;
                oaeTest.RTEar = oAETestModel.RTEar;
                oaeTest.NotesandInstructions = oAETestModel.NotesandInstructions;
                oaeTest.Starttime = oAETestModel.Starttime;// != null ? this.utilService.GetLocalTime(oAETestModel.Starttime.Value) : oAETestModel.Starttime;
                oaeTest.Endtime = oAETestModel.Endtime;// != null ? this.utilService.GetLocalTime(oAETestModel.Endtime.Value) : oAETestModel.Endtime;
                oaeTest.Totalduration = oAETestModel.Totalduration;
                oaeTest.Nextfollowupdate = oAETestModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(oAETestModel.Nextfollowupdate.Value) : oAETestModel.Nextfollowupdate;
                oaeTest.ModifiedBy = "User";
                oaeTest.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<OAETest>().Update(oaeTest);
            }
            this.uow.Save();

            return oAETestModel;
        }

        ///// <summary>
        ///// Add or Update BERATest data
        ///// </summary>
        ///// <param name>BERATestModel bERATestModel</param>
        ///// <returns>BERATestModel. if BERATest data is added or updated = success. else = failure</returns>
        public BERATestModel AddUpdateBERATestData(BERATestModel bERATestModel)
        {
            var beraTest = this.uow.GenericRepository<BERATest>().Table().Where(x => x.VisitID == bERATestModel.VisitID).FirstOrDefault();

            if (beraTest == null)
            {
                beraTest = new BERATest();

                beraTest.VisitID = bERATestModel.VisitID;
                beraTest.RTEar = bERATestModel.RTEar;
                beraTest.LTEar = bERATestModel.LTEar;
                beraTest.NotesandInstructions = bERATestModel.NotesandInstructions;
                beraTest.Starttime = bERATestModel.Starttime;// != null ? this.utilService.GetLocalTime(bERATestModel.Starttime.Value) : bERATestModel.Starttime;
                beraTest.Endtime = bERATestModel.Endtime;// != null ? this.utilService.GetLocalTime(bERATestModel.Endtime.Value) : bERATestModel.Endtime;
                beraTest.Totalduration = bERATestModel.Totalduration;
                beraTest.Nextfollowupdate = bERATestModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(bERATestModel.Nextfollowupdate.Value) : bERATestModel.Nextfollowupdate;
                beraTest.CreatedBy = "User";
                beraTest.Createddate = DateTime.Now;

                this.uow.GenericRepository<BERATest>().Insert(beraTest);
            }
            else
            {
                beraTest.VisitID = bERATestModel.VisitID;
                beraTest.RTEar = bERATestModel.RTEar;
                beraTest.LTEar = bERATestModel.LTEar;
                beraTest.NotesandInstructions = bERATestModel.NotesandInstructions;
                beraTest.Starttime = bERATestModel.Starttime;// != null ? this.utilService.GetLocalTime(bERATestModel.Starttime.Value) : bERATestModel.Starttime;
                beraTest.Endtime = bERATestModel.Endtime;// != null ? this.utilService.GetLocalTime(bERATestModel.Endtime.Value) : bERATestModel.Endtime;
                beraTest.Totalduration = bERATestModel.Totalduration;
                beraTest.Nextfollowupdate = bERATestModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(bERATestModel.Nextfollowupdate.Value) : bERATestModel.Nextfollowupdate;
                beraTest.ModifiedBy = "User";
                beraTest.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<BERATest>().Update(beraTest);
            }
            this.uow.Save();

            return bERATestModel;
        }

        ///// <summary>
        ///// Add or Update ASSRTest data
        ///// </summary>
        ///// <param name>ASSRTestModel aSSRTestModel</param>
        ///// <returns>ASSRTestModel. if ASSRTest data is added or updated = success. else = failure</returns>
        public ASSRTestModel AddUpdateASSRTestData(ASSRTestModel aSSRTestModel)
        {
            var assrTest = this.uow.GenericRepository<ASSRTest>().Table().Where(x => x.VisitID == aSSRTestModel.VisitID).FirstOrDefault();

            if (assrTest == null)
            {
                assrTest = new ASSRTest();

                assrTest.VisitID = aSSRTestModel.VisitID;
                assrTest.RTEar = aSSRTestModel.RTEar;
                assrTest.LTEar = aSSRTestModel.LTEar;
                assrTest.NotesandInstructions = aSSRTestModel.NotesandInstructions;
                assrTest.Starttime = aSSRTestModel.Starttime;// != null ? this.utilService.GetLocalTime(aSSRTestModel.Starttime.Value) : aSSRTestModel.Starttime;
                assrTest.Endtime = aSSRTestModel.Endtime;// != null ? this.utilService.GetLocalTime(aSSRTestModel.Endtime.Value) : aSSRTestModel.Endtime;
                assrTest.Totalduration = aSSRTestModel.Totalduration;
                assrTest.Nextfollowupdate = aSSRTestModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(aSSRTestModel.Nextfollowupdate.Value) : aSSRTestModel.Nextfollowupdate;
                assrTest.CreatedBy = "User";
                assrTest.Createddate = DateTime.Now;

                this.uow.GenericRepository<ASSRTest>().Insert(assrTest);
            }
            else
            {
                assrTest.VisitID = aSSRTestModel.VisitID;
                assrTest.RTEar = aSSRTestModel.RTEar;
                assrTest.LTEar = aSSRTestModel.LTEar;
                assrTest.NotesandInstructions = aSSRTestModel.NotesandInstructions;
                assrTest.Starttime = aSSRTestModel.Starttime;// != null ? this.utilService.GetLocalTime(aSSRTestModel.Starttime.Value) : aSSRTestModel.Starttime;
                assrTest.Endtime = aSSRTestModel.Endtime;// != null ? this.utilService.GetLocalTime(aSSRTestModel.Endtime.Value) : aSSRTestModel.Endtime;
                assrTest.Totalduration = aSSRTestModel.Totalduration;
                assrTest.Nextfollowupdate = aSSRTestModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(aSSRTestModel.Nextfollowupdate.Value) : aSSRTestModel.Nextfollowupdate;
                assrTest.ModifiedBy = "User";
                assrTest.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<ASSRTest>().Update(assrTest);
            }
            this.uow.Save();

            return aSSRTestModel;
        }

        ///// <summary>
        ///// Add or Update Hearing Aid Trial data
        ///// </summary>
        ///// <param name>HearingAidTrialModel hearingAidTrialModel</param>
        ///// <returns>HearingAidTrialModel. if Hearing Aid Trial is added or updated = success. else = failure</returns>
        public HearingAidTrialModel AddUpdateHearingAidTrialData(HearingAidTrialModel hearingAidTrialModel)
        {
            var hearingAid = this.uow.GenericRepository<HearingAidTrial>().Table().Where(x => x.VisitID == hearingAidTrialModel.VisitID).FirstOrDefault();

            if (hearingAid == null)
            {
                hearingAid = new HearingAidTrial();

                hearingAid.VisitID = hearingAidTrialModel.VisitID;
                hearingAid.RTEar = hearingAidTrialModel.RTEar;
                hearingAid.LTEar = hearingAidTrialModel.LTEar;
                hearingAid.NotesandInstructions = hearingAidTrialModel.NotesandInstructions;
                hearingAid.Starttime = hearingAidTrialModel.Starttime;// != null ? this.utilService.GetLocalTime(hearingAidTrialModel.Starttime.Value) : hearingAidTrialModel.Starttime;
                hearingAid.Endtime = hearingAidTrialModel.Endtime;// != null ? this.utilService.GetLocalTime(hearingAidTrialModel.Endtime.Value) : hearingAidTrialModel.Endtime;
                hearingAid.Totalduration = hearingAidTrialModel.Totalduration;
                hearingAid.Nextfollowupdate = hearingAidTrialModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(hearingAidTrialModel.Nextfollowupdate.Value) : hearingAidTrialModel.Nextfollowupdate;
                hearingAid.CreatedBy = "User";
                hearingAid.Createddate = DateTime.Now;

                this.uow.GenericRepository<HearingAidTrial>().Insert(hearingAid);
            }
            else
            {
                hearingAid.VisitID = hearingAidTrialModel.VisitID;
                hearingAid.RTEar = hearingAidTrialModel.RTEar;
                hearingAid.LTEar = hearingAidTrialModel.LTEar;
                hearingAid.NotesandInstructions = hearingAidTrialModel.NotesandInstructions;
                hearingAid.Starttime = hearingAidTrialModel.Starttime;// != null ? this.utilService.GetLocalTime(hearingAidTrialModel.Starttime.Value) : hearingAidTrialModel.Starttime;
                hearingAid.Endtime = hearingAidTrialModel.Endtime;// != null ? this.utilService.GetLocalTime(hearingAidTrialModel.Endtime.Value) : hearingAidTrialModel.Endtime;
                hearingAid.Totalduration = hearingAidTrialModel.Totalduration;
                hearingAid.Nextfollowupdate = hearingAidTrialModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(hearingAidTrialModel.Nextfollowupdate.Value) : hearingAidTrialModel.Nextfollowupdate;
                hearingAid.ModifiedBy = "User";
                hearingAid.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<HearingAidTrial>().Update(hearingAid);
            }
            this.uow.Save();

            return hearingAidTrialModel;
        }

        ///// <summary>
        ///// Add or Update Tinnitus Masking data
        ///// </summary>
        ///// <param name>TinnitusmaskingModel tinnitusmaskingModel</param>
        ///// <returns>TinnitusmaskingModel. if Tinnitus Masking is added or updated = success. else = failure</returns>
        public TinnitusmaskingModel AddUpdateTinnitusmaskingData(TinnitusmaskingModel tinnitusmaskingModel)
        {
            var tinnitus = this.uow.GenericRepository<Tinnitusmasking>().Table().Where(x => x.VisitID == tinnitusmaskingModel.VisitID).FirstOrDefault();

            if (tinnitus == null)
            {
                tinnitus = new Tinnitusmasking();

                tinnitus.VisitID = tinnitusmaskingModel.VisitID;
                tinnitus.RTEar = tinnitusmaskingModel.RTEar;
                tinnitus.LTEar = tinnitusmaskingModel.LTEar;
                tinnitus.NotesandInstructions = tinnitusmaskingModel.NotesandInstructions;
                tinnitus.Starttime = tinnitusmaskingModel.Starttime;// != null ? this.utilService.GetLocalTime(tinnitusmaskingModel.Starttime.Value) : tinnitusmaskingModel.Starttime;
                tinnitus.Endtime = tinnitusmaskingModel.Endtime;// != null ? this.utilService.GetLocalTime(tinnitusmaskingModel.Endtime.Value) : tinnitusmaskingModel.Endtime;
                tinnitus.Totalduration = tinnitusmaskingModel.Totalduration;
                tinnitus.Nextfollowupdate = tinnitusmaskingModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(tinnitusmaskingModel.Nextfollowupdate.Value) : tinnitusmaskingModel.Nextfollowupdate;
                tinnitus.CreatedBy = "User";
                tinnitus.Createddate = DateTime.Now;

                this.uow.GenericRepository<Tinnitusmasking>().Insert(tinnitus);
            }
            else
            {
                tinnitus.VisitID = tinnitusmaskingModel.VisitID;
                tinnitus.RTEar = tinnitusmaskingModel.RTEar;
                tinnitus.LTEar = tinnitusmaskingModel.LTEar;
                tinnitus.NotesandInstructions = tinnitusmaskingModel.NotesandInstructions;
                tinnitus.Starttime = tinnitusmaskingModel.Starttime;// != null ? this.utilService.GetLocalTime(tinnitusmaskingModel.Starttime.Value) : tinnitusmaskingModel.Starttime;
                tinnitus.Endtime = tinnitusmaskingModel.Endtime;// != null ? this.utilService.GetLocalTime(tinnitusmaskingModel.Endtime.Value) : tinnitusmaskingModel.Endtime;
                tinnitus.Totalduration = tinnitusmaskingModel.Totalduration;
                tinnitus.Nextfollowupdate = tinnitusmaskingModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(tinnitusmaskingModel.Nextfollowupdate.Value) : tinnitusmaskingModel.Nextfollowupdate;
                tinnitus.ModifiedBy = "User";
                tinnitus.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<Tinnitusmasking>().Update(tinnitus);
            }
            this.uow.Save();

            return tinnitusmaskingModel;
        }

        ///// <summary>
        ///// Add or Update Speech Therapy data
        ///// </summary>
        ///// <param name>SpeechTherapyModel speechTherapyModel</param>
        ///// <returns>SpeechTherapyModel. if Speech Therapy is added or updated = success. else = failure</returns>
        public SpeechTherapyModel AddUpdateSpeechTherapyData(SpeechTherapyModel speechTherapyModel)
        {
            var speechTherapy = this.uow.GenericRepository<SpeechTherapy>().Table().Where(x => x.VisitID == speechTherapyModel.VisitID).FirstOrDefault();

            if (speechTherapy == null)
            {
                speechTherapy = new SpeechTherapy();

                speechTherapy.VisitID = speechTherapyModel.VisitID;
                speechTherapy.Findings = speechTherapyModel.Findings;
                speechTherapy.ClinicalNotes = speechTherapyModel.ClinicalNotes;
                speechTherapy.Starttime = speechTherapyModel.Starttime;// != null ? this.utilService.GetLocalTime(speechTherapyModel.Starttime.Value) : speechTherapyModel.Starttime;
                speechTherapy.Endtime = speechTherapyModel.Endtime;// != null ? this.utilService.GetLocalTime(speechTherapyModel.Endtime.Value) : speechTherapyModel.Endtime;
                speechTherapy.Totalduration = speechTherapyModel.Totalduration;
                speechTherapy.Nextfollowupdate = speechTherapyModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(speechTherapyModel.Nextfollowupdate.Value) : speechTherapyModel.Nextfollowupdate;
                speechTherapy.CreatedBy = "User";
                speechTherapy.Createddate = DateTime.Now;

                this.uow.GenericRepository<SpeechTherapy>().Insert(speechTherapy);
            }
            else
            {
                speechTherapy.VisitID = speechTherapyModel.VisitID;
                speechTherapy.Findings = speechTherapyModel.Findings;
                speechTherapy.ClinicalNotes = speechTherapyModel.ClinicalNotes;
                speechTherapy.Starttime = speechTherapyModel.Starttime;// != null ? this.utilService.GetLocalTime(speechTherapyModel.Starttime.Value) : speechTherapyModel.Starttime;
                speechTherapy.Endtime = speechTherapyModel.Endtime;// != null ? this.utilService.GetLocalTime(speechTherapyModel.Endtime.Value) : speechTherapyModel.Endtime;
                speechTherapy.Totalduration = speechTherapyModel.Totalduration;
                speechTherapy.Nextfollowupdate = speechTherapyModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(speechTherapyModel.Nextfollowupdate.Value) : speechTherapyModel.Nextfollowupdate;
                speechTherapy.ModifiedBy = "User";
                speechTherapy.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<SpeechTherapy>().Update(speechTherapy);
            }
            this.uow.Save();

            return speechTherapyModel;
        }

        ///// <summary>
        ///// Add or Update Electrocochleography data
        ///// </summary>
        ///// <param name>ElectrocochleographyModel electrocochleographyModel</param>
        ///// <returns>ElectrocochleographyModel. if Electrocochleography is added or updated = success. else = failure</returns>
        public ElectrocochleographyModel AddUpdateElectrocochleographyData(ElectrocochleographyModel electrocochleographyModel)
        {
            var electrocochleography = this.uow.GenericRepository<Electrocochleography>().Table().Where(x => x.VisitID == electrocochleographyModel.VisitID).FirstOrDefault();

            if (electrocochleography == null)
            {
                electrocochleography = new Electrocochleography();

                electrocochleography.VisitID = electrocochleographyModel.VisitID;
                electrocochleography.LTEar = electrocochleographyModel.LTEar;
                electrocochleography.RTEar = electrocochleographyModel.RTEar;
                electrocochleography.ClinicalNotes = electrocochleographyModel.ClinicalNotes;
                electrocochleography.Starttime = electrocochleographyModel.Starttime;// != null ? this.utilService.GetLocalTime(electrocochleographyModel.Starttime.Value) : electrocochleographyModel.Starttime;
                electrocochleography.Endtime = electrocochleographyModel.Endtime;// != null ? this.utilService.GetLocalTime(electrocochleographyModel.Endtime.Value) : electrocochleographyModel.Endtime;
                electrocochleography.Totalduration = electrocochleographyModel.Totalduration;
                electrocochleography.Nextfollowupdate = electrocochleographyModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(electrocochleographyModel.Nextfollowupdate.Value) : electrocochleographyModel.Nextfollowupdate;
                electrocochleography.CreatedBy = "User";
                electrocochleography.Createddate = DateTime.Now;

                this.uow.GenericRepository<Electrocochleography>().Insert(electrocochleography);
            }
            else
            {
                electrocochleography.VisitID = electrocochleographyModel.VisitID;
                electrocochleography.LTEar = electrocochleographyModel.LTEar;
                electrocochleography.RTEar = electrocochleographyModel.RTEar;
                electrocochleography.ClinicalNotes = electrocochleographyModel.ClinicalNotes;
                electrocochleography.Starttime = electrocochleographyModel.Starttime;// != null ? this.utilService.GetLocalTime(electrocochleographyModel.Starttime.Value) : electrocochleographyModel.Starttime;
                electrocochleography.Endtime = electrocochleographyModel.Endtime;// != null ? this.utilService.GetLocalTime(electrocochleographyModel.Endtime.Value) : electrocochleographyModel.Endtime;
                electrocochleography.Totalduration = electrocochleographyModel.Totalduration;
                electrocochleography.Nextfollowupdate = electrocochleographyModel.Nextfollowupdate != null ? this.utilService.GetLocalTime(electrocochleographyModel.Nextfollowupdate.Value) : electrocochleographyModel.Nextfollowupdate;
                electrocochleography.ModifiedBy = "User";
                electrocochleography.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<Electrocochleography>().Update(electrocochleography);
            }
            this.uow.Save();

            return electrocochleographyModel;
        }




        ///// <summary>
        ///// Get Tuning Fork data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>TuningForkTestModel. if Tuning Fork Test for Given Visit= success. else = failure</returns>
        public TuningForkTestModel GetTuningForkTestDataForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var tuningModel = (from forkTest in this.uow.GenericRepository<TuningForkTest>().Table().Where(x => x.VisitID == VisitID)
                               select forkTest).AsEnumerable().Select(TFTM => new TuningForkTestModel
                               {
                                   TuningForkTestId = TFTM.TuningForkTestId,
                                   VisitID = TFTM.VisitID,
                                   facilityName = fac,
                                   WeberLTEar = TFTM.WeberLTEar,
                                   WeberRTEar = TFTM.WeberRTEar,
                                   RinnersLTEar = TFTM.RinnersLTEar,
                                   RinnersRTEar = TFTM.RinnersRTEar,
                                   Starttime = TFTM.Starttime,
                                   Endtime = TFTM.Endtime,
                                   Totalduration = TFTM.Totalduration,
                                   Findings = TFTM.Findings,
                                   Nextfollowupdate = TFTM.Nextfollowupdate,
                                   SignOffDate = TFTM.SignOffDate,
                                   SignOffStatus = TFTM.SignOffStatus,
                                   SignOffBy = TFTM.SignOffBy,
                                   VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                   recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                               }).FirstOrDefault();

            return tuningModel;
        }

        ///// <summary>
        ///// Get Speech Therapy Special Test data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>SpeechtherapySpecialtestsModel. if Speech Therapy Special Test for Given Visit= success. else = failure</returns>
        public SpeechtherapySpecialtestsModel GetSpeechTherapySpecialTestsForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var specialTestModel = (from speechtherapySpecial in this.uow.GenericRepository<SpeechtherapySpecialtests>().Table().Where(x => x.VisitID == VisitID)
                                    select speechtherapySpecial).AsEnumerable().Select(SSM => new SpeechtherapySpecialtestsModel
                                    {
                                        SpeechTherapySpecialTestId = SSM.SpeechTherapySpecialTestId,
                                        VisitID = SSM.VisitID,
                                        facilityName = fac,
                                        ChiefComplaint = SSM.ChiefComplaint,
                                        SRTRight = SSM.SRTRight,
                                        SRTLeft = SSM.SRTLeft,
                                        SDSRight = SSM.SDSRight,
                                        SDSLeft = SSM.SDSLeft,
                                        SISIRight = SSM.SISIRight,
                                        SISILeft = SSM.SISILeft,
                                        TDTRight = SSM.TDTRight,
                                        TDTLeft = SSM.TDTLeft,
                                        ABLBLeft = SSM.ABLBLeft,
                                        ABLBRight = SSM.ABLBRight,
                                        NotesandInstructions = SSM.NotesandInstructions,
                                        Starttime = SSM.Starttime,
                                        Endtime = SSM.Endtime,
                                        Totalduration = SSM.Totalduration,
                                        Nextfollowupdate = SSM.Nextfollowupdate,
                                        SignOffDate = SSM.SignOffDate,
                                        SignOffStatus = SSM.SignOffStatus,
                                        SignOffBy = SSM.SignOffBy,
                                        VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                        recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                                    }).FirstOrDefault();

            return specialTestModel;
        }

        ///// <summary>
        ///// Get Tympanometry data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>TympanometryModel. if Tympanometry for Given Visit= success. else = failure</returns>
        public TympanometryModel GetTympanometryForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var typanometryModel = (from tympanometry in this.uow.GenericRepository<Tympanometry>().Table().Where(x => x.VisitID == VisitID)
                                    select tympanometry).AsEnumerable().Select(TM => new TympanometryModel
                                    {
                                        TympanogramId = TM.TympanogramId,
                                        VisitID = TM.VisitID,
                                        facilityName = fac,
                                        ECVRight = TM.ECVRight,
                                        ECVLeft = TM.ECVLeft,
                                        MEPRight = TM.MEPRight,
                                        MEPLeft = TM.MEPLeft,
                                        SCRight = TM.SCRight,
                                        SCLeft = TM.SCLeft,
                                        GradRight = TM.GradRight,
                                        GradLeft = TM.GradLeft,
                                        TWRight = TM.TWRight,
                                        TWLeft = TM.TWLeft,
                                        SpeedRight = TM.SpeedRight,
                                        SpeedLeft = TM.SpeedLeft,
                                        DirectionRight = TM.DirectionRight,
                                        DirectionLeft = TM.DirectionLeft,
                                        NotesandInstructions = TM.NotesandInstructions,
                                        Starttime = TM.Starttime,
                                        Endtime = TM.Endtime,
                                        Totalduration = TM.Totalduration,
                                        Nextfollowupdate = TM.Nextfollowupdate,
                                        SignOffDate = TM.SignOffDate,
                                        SignOffStatus = TM.SignOffStatus,
                                        SignOffBy = TM.SignOffBy,
                                        VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                        recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                                    }).FirstOrDefault();
            return typanometryModel;
        }

        ///// <summary>
        ///// Get OAETest data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>OAETestModel. if OAETest for Given Visit= success. else = failure</returns>
        public OAETestModel GetOAETestForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var oaeTestModel = (from oaeTest in this.uow.GenericRepository<OAETest>().Table().Where(x => x.VisitID == VisitID)
                                select oaeTest).AsEnumerable().Select(OM => new OAETestModel
                                {
                                    OAETestId = OM.OAETestId,
                                    VisitID = OM.VisitID,
                                    facilityName = fac,
                                    LTEar = OM.LTEar,
                                    RTEar = OM.RTEar,
                                    NotesandInstructions = OM.NotesandInstructions,
                                    Starttime = OM.Starttime,
                                    Endtime = OM.Endtime,
                                    Totalduration = OM.Totalduration,
                                    Nextfollowupdate = OM.Nextfollowupdate,
                                    SignOffDate = OM.SignOffDate,
                                    SignOffStatus = OM.SignOffStatus,
                                    SignOffBy = OM.SignOffBy,
                                    VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                    recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                                }).FirstOrDefault();

            return oaeTestModel;
        }

        ///// <summary>
        ///// Get BERATest data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>BERATestModel. if BERATest for Given Visit= success. else = failure</returns>
        public BERATestModel GetBERATestForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var beraTestModel = (from beraTest in this.uow.GenericRepository<BERATest>().Table().Where(x => x.VisitID == VisitID)
                                 select beraTest).AsEnumerable().Select(BM => new BERATestModel
                                 {
                                     BERATestId = BM.BERATestId,
                                     VisitID = BM.VisitID,
                                     facilityName = fac,
                                     RTEar = BM.RTEar,
                                     LTEar = BM.LTEar,
                                     NotesandInstructions = BM.NotesandInstructions,
                                     Starttime = BM.Starttime,
                                     Endtime = BM.Endtime,
                                     Totalduration = BM.Totalduration,
                                     Nextfollowupdate = BM.Nextfollowupdate,
                                     SignOffDate = BM.SignOffDate,
                                     SignOffStatus = BM.SignOffStatus,
                                     SignOffBy = BM.SignOffBy,
                                     VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                     recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                                 }).FirstOrDefault();

            return beraTestModel;
        }

        ///// <summary>
        ///// Get ASSRTest data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>ASSRTestModel. if ASSRTest for Given Patient and Visit= success. else = failure</returns>
        public ASSRTestModel GetASSRTestForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var assrTestModel = (from assrTest in this.uow.GenericRepository<ASSRTest>().Table().Where(x => x.VisitID == VisitID)
                                 select assrTest).AsEnumerable().Select(AM => new ASSRTestModel
                                 {
                                     ASSRTestId = AM.ASSRTestId,
                                     VisitID = AM.VisitID,
                                     facilityName = fac,
                                     RTEar = AM.RTEar,
                                     LTEar = AM.LTEar,
                                     NotesandInstructions = AM.NotesandInstructions,
                                     Starttime = AM.Starttime,
                                     Endtime = AM.Endtime,
                                     Totalduration = AM.Totalduration,
                                     Nextfollowupdate = AM.Nextfollowupdate,
                                     SignOffDate = AM.SignOffDate,
                                     SignOffStatus = AM.SignOffStatus,
                                     SignOffBy = AM.SignOffBy,
                                     VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                     recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                                 }).FirstOrDefault();

            return assrTestModel;
        }

        ///// <summary>
        ///// Get Hearing Aid Trial data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>HearingAidTrialModel. if Hearing Aid Trial for Given Visit= success. else = failure</returns>
        public HearingAidTrialModel GetHearingAidTrialDataForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var hearingAidModel = (from hearingAid in this.uow.GenericRepository<HearingAidTrial>().Table().Where(x => x.VisitID == VisitID)
                                   select hearingAid).AsEnumerable().Select(HATM => new HearingAidTrialModel
                                   {
                                       HearingAidTrialId = HATM.HearingAidTrialId,
                                       VisitID = HATM.VisitID,
                                       facilityName = fac,
                                       RTEar = HATM.RTEar,
                                       LTEar = HATM.LTEar,
                                       NotesandInstructions = HATM.NotesandInstructions,
                                       Starttime = HATM.Starttime,
                                       Endtime = HATM.Endtime,
                                       Totalduration = HATM.Totalduration,
                                       Nextfollowupdate = HATM.Nextfollowupdate,
                                       SignOffDate = HATM.SignOffDate,
                                       SignOffStatus = HATM.SignOffStatus,
                                       SignOffBy = HATM.SignOffBy,
                                       VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                       recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                                   }).FirstOrDefault();

            return hearingAidModel;
        }

        ///// <summary>
        ///// Get Tinnitus masking data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>TinnitusmaskingModel. if Tinnitus masking for Given Patient and Visit= success. else = failure</returns>
        public TinnitusmaskingModel GetTinnitusmaskingDataForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var tinnitusMaskingModel = (from tinnitus in this.uow.GenericRepository<Tinnitusmasking>().Table().Where(x => x.VisitID == VisitID)
                                        select tinnitus).AsEnumerable().Select(TmM => new TinnitusmaskingModel
                                        {
                                            TinnitusmaskingId = TmM.TinnitusmaskingId,
                                            VisitID = TmM.VisitID,
                                            facilityName = fac,
                                            RTEar = TmM.RTEar,
                                            LTEar = TmM.LTEar,
                                            NotesandInstructions = TmM.NotesandInstructions,
                                            Starttime = TmM.Starttime,
                                            Endtime = TmM.Endtime,
                                            Totalduration = TmM.Totalduration,
                                            Nextfollowupdate = TmM.Nextfollowupdate,
                                            SignOffDate = TmM.SignOffDate,
                                            SignOffStatus = TmM.SignOffStatus,
                                            SignOffBy = TmM.SignOffBy,
                                            VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                            recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                                        }).FirstOrDefault();

            return tinnitusMaskingModel;
        }

        ///// <summary>
        ///// Get Speech Therapy data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>SpeechTherapyModel. if Speech Therapy for Given Visit= success. else = failure</returns>
        public SpeechTherapyModel GetSpeechTherapyForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var speechTherapyModel = (from speechTherapy in this.uow.GenericRepository<SpeechTherapy>().Table().Where(x => x.VisitID == VisitID)
                                      select speechTherapy).AsEnumerable().Select(STM => new SpeechTherapyModel
                                      {
                                          SpeechTherapyId = STM.SpeechTherapyId,
                                          VisitID = STM.VisitID,
                                          facilityName = fac,
                                          Findings = STM.Findings,
                                          ClinicalNotes = STM.ClinicalNotes,
                                          Starttime = STM.Starttime,
                                          Endtime = STM.Endtime,
                                          Totalduration = STM.Totalduration,
                                          Nextfollowupdate = STM.Nextfollowupdate,
                                          SignOffDate = STM.SignOffDate,
                                          SignOffStatus = STM.SignOffStatus,
                                          SignOffBy = STM.SignOffBy,
                                          VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                          recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                                      }).FirstOrDefault();

            return speechTherapyModel;
        }

        ///// <summary>
        ///// Get Electrocochleography data For particular visit of A Patient
        ///// </summary>
        ///// <param name>(int VisitID)</param>
        ///// <returns>ElectrocochleographyModel. if Electrocochleography for Given Visit= success. else = failure</returns>
        public ElectrocochleographyModel GetElectrocochleographyForPatientVisit(int VisitID)
        {
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).FirstOrDefault();

            var fac = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            var electrocochleoModel = (from electro in this.uow.GenericRepository<Electrocochleography>().Table().Where(x => x.VisitID == VisitID)
                                       select electro).AsEnumerable().Select(EGM => new ElectrocochleographyModel
                                       {
                                           ElectrocochleographyId = EGM.ElectrocochleographyId,
                                           VisitID = EGM.VisitID,
                                           facilityName = fac,
                                           LTEar = EGM.LTEar,
                                           RTEar = EGM.RTEar,
                                           ClinicalNotes = EGM.ClinicalNotes,
                                           Starttime = EGM.Starttime,
                                           Endtime = EGM.Endtime,
                                           Totalduration = EGM.Totalduration,
                                           Nextfollowupdate = EGM.Nextfollowupdate,
                                           SignOffDate = EGM.SignOffDate,
                                           SignOffStatus = EGM.SignOffStatus,
                                           SignOffBy = EGM.SignOffBy,
                                           VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString(),
                                           recordeDuring = this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription

                                       }).FirstOrDefault();

            return electrocochleoModel;
        }

        ///// <summary>
        ///// Get SigningOffModel with status for Audiology
        ///// </summary>
        ///// <param>SigningOffModel signOffModel</param>
        ///// <returns>Task<SigningOffModel>. if SigningOffModel with status for Audiology = success. else = failure</returns>
        public Task<SigningOffModel> SignoffUpdationforAudiology(SigningOffModel signOffModel)
        {
            var signOffdata = this.utilService.AudiologySignoff(signOffModel);

            return signOffdata;
        }

        #region Audiology Search and Count

        ///// <summary>
        ///// Get Patients for Audiology search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForAudiologySearch(string searchKey)
        {
            List<Patient> patients = new List<Patient>();
            var facList = this.utilService.GetFacilitiesforUser();

            if (facList.Count() > 0)
            {
                patients = (from pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                            join patDemo in this.uow.GenericRepository<PatientDemographic>().Table()
                            on pat.PatientId equals patDemo.PatientId
                            join fac in facList on patDemo.FacilityId equals fac.FacilityId
                            where (searchKey == null || (pat.PatientFirstName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.PatientMiddleName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                            || pat.PatientLastName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.MRNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                            select pat).Take(10).ToList();


            }
            else
            {
                patients = (from pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                            join patDemo in this.uow.GenericRepository<PatientDemographic>().Table()
                            on pat.PatientId equals patDemo.PatientId
                            where (searchKey == null || (pat.PatientFirstName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.PatientMiddleName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                            || pat.PatientLastName.ToLower().Trim().Contains(searchKey.ToLower().Trim()) || pat.MRNo.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                            select pat).Take(10).ToList();
            }

            return patients;
        }

        ///// <summary>
        ///// Get Providers For Audiology Search
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for Audiology = success. else = failure</returns>
        public List<ProviderModel> GetAudiologyDoctorsforSearch(string searchKey)
        {
            List<ProviderModel> ProviderList = new List<ProviderModel>();
            var facList = this.utilService.GetFacilitiesforUser();

            var providers = (from prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)

                             where (searchKey == null || (prov.FirstName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                      || prov.MiddleName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                      || prov.LastName.ToLower().Trim().Contains(searchKey.ToLower().Trim())))

                             select new
                             {
                                 prov.ProviderID,
                                 prov.UserID,
                                 prov.FirstName,
                                 prov.MiddleName,
                                 prov.LastName

                             }).AsEnumerable().Select(PM => new ProviderModel
                             {
                                 ProviderID = PM.ProviderID,
                                 UserID = PM.UserID,
                                 ProviderName = PM.FirstName + " " + PM.MiddleName + " " + PM.LastName

                             }).ToList();

            foreach (var prov in providers)
            {
                var provFacilities = this.utilService.GetFacilitiesbyProviderId(prov.ProviderID);
                if (facList.Count() > 0)
                {
                    foreach (var fac in facList)
                    {
                        var record = provFacilities.Where(x => x.FacilityId == fac.FacilityId).FirstOrDefault();
                        if (record != null && !(ProviderList.Contains(prov)))
                        {
                            ProviderList.Add(prov);
                        }
                    }
                }
            }

            return ProviderList.Take(10).ToList();
        }

        ///// <summary>
        ///// Get Audiology Requests by using SearchModel
        ///// </summary>
        ///// <param>(SearchModel searchModel)</param>
        ///// <returns>List<AudiologyRequestModel>. if Collection of AudiologyRequestModel for SearchModel values = success. else = failure</returns>
        public List<AudiologyRequestModel> GetAudiologyRequestsbySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            var audiologyRecords = (from audio in this.uow.GenericRepository<AudiologyRequest>().Table()

                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on audio.VisitID equals visit.VisitId

                                    join pat in this.uow.GenericRepository<Patient>().Table()
                                    on visit.PatientId equals pat.PatientId

                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                    on audio.ProviderId equals prov.ProviderID

                                    //join provSpec in this.uow.GenericRepository<ProviderSpeciality>().Table()
                                    //on prov.ProviderID equals provSpec.ProviderID

                                    where
                                      (Fromdate.Date <= visit.VisitDate.Date
                                            && (Todate.Date >= Fromdate.Date && visit.VisitDate.Date <= Todate.Date)
                                            && (searchModel.PatientId == 0 || visit.PatientId == searchModel.PatientId)
                                            && (searchModel.ProviderId == 0 || audio.ProviderId == searchModel.ProviderId)
                                            && (searchModel.FacilityId == 0 || visit.FacilityID == searchModel.FacilityId)
                                            && ((searchModel.VisitNo == null || searchModel.VisitNo == "") || visit.VisitNo.ToLower().Trim() == searchModel.VisitNo.ToLower().Trim())
                                            )
                                    select new
                                    {
                                        audio.AudiologyRequestID,
                                        audio.VisitID,
                                        audio.ProviderId,
                                        pat.PatientId,
                                        pat.PatientFirstName,
                                        pat.PatientMiddleName,
                                        pat.PatientLastName,
                                        prov.FirstName,
                                        prov.MiddleName,
                                        prov.LastName,
                                        audio.TuningFork,
                                        audio.SpecialTest,
                                        audio.Tympanometry,
                                        audio.OAE,
                                        audio.BERA,
                                        audio.ASSR,
                                        audio.HearingAid,
                                        audio.SpeechTherapy,
                                        audio.TinnitusMasking,
                                        audio.Electrocochleography,
                                        date = audio.ModifiedDate == null ? audio.Createddate.Date : audio.ModifiedDate.Value.Date,
                                        visit.VisitDate,
                                        visit.VisitNo,
                                        visit.FacilityID,
                                        visit.ToConsult

                                    }).AsEnumerable().OrderByDescending(x => x.date).Select(ARM => new AudiologyRequestModel
                                    {
                                        AudiologyRequestID = ARM.AudiologyRequestID,
                                        VisitID = ARM.VisitID,
                                        VisitNo = ARM.VisitNo,
                                        FacilityId = ARM.FacilityID > 0 ? ARM.FacilityID.Value : 0,
                                        facilityName = ARM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == ARM.FacilityID).FacilityName : "",
                                        ProviderId = ARM.ProviderId,
                                        ProviderName = ARM.FirstName + " " + ARM.MiddleName + " " + ARM.LastName,
                                        PatientId = ARM.PatientId,
                                        PatientName = ARM.PatientFirstName + " " + ARM.PatientMiddleName + " " + ARM.PatientLastName,
                                        TuningFork = ARM.TuningFork,
                                        SpecialTest = ARM.SpecialTest,
                                        Tympanometry = ARM.Tympanometry,
                                        OAE = ARM.OAE,
                                        BERA = ARM.BERA,
                                        ASSR = ARM.ASSR,
                                        HearingAid = ARM.HearingAid,
                                        SpeechTherapy = ARM.SpeechTherapy,
                                        TinnitusMasking = ARM.TinnitusMasking,
                                        Electrocochleography = ARM.Electrocochleography,
                                        VisitDateandTime = ARM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + ARM.VisitDate.TimeOfDay.ToString()

                                    }).ToList();

            List<AudiologyRequestModel> audioRequestCollection = new List<AudiologyRequestModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (audiologyRecords.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            audioRequestCollection = (from audio in audiologyRecords
                                                      join fac in facList on audio.FacilityId equals fac.FacilityId
                                                      join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                      on audio.ProviderId equals prov.ProviderID
                                                      select audio).ToList();
                        }
                        else
                        {
                            audioRequestCollection = (from audio in audiologyRecords
                                                      join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                      on audio.ProviderId equals prov.ProviderID
                                                      select audio).ToList();
                        }
                    }
                    else
                    {
                        audioRequestCollection = (from audio in audiologyRecords.Where(x => x.FacilityId == searchModel.FacilityId)
                                                  join fac in facList on audio.FacilityId equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on audio.ProviderId equals prov.ProviderID
                                                  select audio).ToList();
                    }
                }
                else
                {
                    audioRequestCollection = (from audio in audiologyRecords
                                              join fac in facList on audio.FacilityId equals fac.FacilityId
                                              select audio).ToList();
                }
            }
            else
            {
                audioRequestCollection = audiologyRecords;
            }

            return audioRequestCollection;
        }

        ///// <summary>
        ///// Get Counts of Audiology
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> If counts of Audiology = success. else = failure</returns>
        public AudiologyCountModel GetCountsForAudiology()
        {
            List<bool> completed = new List<bool>();
            List<bool> Waiting = new List<bool>();

            AudiologyCountModel countModel = new AudiologyCountModel();

            var audiologyRequests = (from audioReq in GetAllAudiologyRequests()
                                     join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                     on audioReq.VisitID equals vis.VisitId
                                     where (vis.VisitDate.Date == DateTime.Now.Date)
                                     select audioReq).ToList();

            countModel.AudiologyTotalTestCount = audiologyRequests.Count();

            if (audiologyRequests.Count() > 0)
            {
                foreach (var aud in audiologyRequests)
                {
                    if (this.GetAudiologyRecords(aud.VisitID) == true)
                    {
                        completed.Add(true);
                    }
                    else
                    {
                        Waiting.Add(false);
                    }
                }
            }

            countModel.AudiologyCompletedCount = completed.Count();
            countModel.AudiologyWaitingCount = Waiting.Count();

            return countModel;
        }

        ///// <summary>
        ///// Get Visit Number for search
        ///// </summary>
        ///// <param>search Key</param>
        ///// <returns>List<string> If Visit Number table data collection returns = success. else = failure</returns>
        public List<string> GetVisitNumbersbySearch(string searchKey)
        {
            var visNumbers = this.iTenantMasterService.GetVisitNumbersbySearch(searchKey);
            return visNumbers;
        }

        ///// <summary>
        ///// Get Audiology Records for Visit
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>bool. if set of AudiologyDataModel returns for Given VisitId = success. else = failure</returns>
        public bool GetAudiologyRecords(int VisitId)
        {
            bool audiologySignoffStatus = false;
            List<bool> AudTeststatuses = new List<bool>();

            AudiologyDataModel audiologyRecords = new AudiologyDataModel();

            var request = this.uow.GenericRepository<AudiologyRequest>().Table().Where(x => x.VisitID == VisitId).FirstOrDefault();

            audiologyRecords.assrTestData = this.GetASSRTestForPatientVisit(VisitId);
            audiologyRecords.beraTestData = this.GetBERATestForPatientVisit(VisitId);
            audiologyRecords.electrocochleographyData = this.GetElectrocochleographyForPatientVisit(VisitId);
            audiologyRecords.hearingAidData = this.GetHearingAidTrialDataForPatientVisit(VisitId);
            audiologyRecords.oaeTestData = this.GetOAETestForPatientVisit(VisitId);
            audiologyRecords.speechTherapyData = this.GetSpeechTherapyForPatientVisit(VisitId);
            audiologyRecords.speechSpecialTestData = this.GetSpeechTherapySpecialTestsForPatientVisit(VisitId);
            audiologyRecords.tinnitusMaskingData = this.GetTinnitusmaskingDataForPatientVisit(VisitId);
            //audiologyRecords.tuningForkTestData = this.GetTuningForkTestDataForPatientVisit(VisitId);
            //audiologyRecords.tympanometryData = this.GetTympanometryForPatientVisit(VisitId);

            if (request.ASSR == true)
            {
                if (audiologyRecords.assrTestData != null && audiologyRecords.assrTestData.SignOffStatus == true)
                    AudTeststatuses.Add(true);
                else
                    AudTeststatuses.Add(false);
            }
            if (request.BERA == true)
            {
                if (audiologyRecords.beraTestData != null && audiologyRecords.beraTestData.SignOffStatus == true)
                    AudTeststatuses.Add(true);
                else
                    AudTeststatuses.Add(false);
            }
            if (request.Electrocochleography == true)
            {
                if (audiologyRecords.electrocochleographyData != null && audiologyRecords.electrocochleographyData.SignOffStatus == true)
                    AudTeststatuses.Add(true);
                else
                    AudTeststatuses.Add(false);
            }
            if (request.HearingAid == true)
            {
                if (audiologyRecords.hearingAidData != null && audiologyRecords.hearingAidData.SignOffStatus == true)
                    AudTeststatuses.Add(true);
                else
                    AudTeststatuses.Add(false);
            }
            if (request.OAE == true)
            {
                if (audiologyRecords.oaeTestData != null && audiologyRecords.oaeTestData.SignOffStatus == true)
                    AudTeststatuses.Add(true);
                else
                    AudTeststatuses.Add(false);
            }
            if (request.SpeechTherapy == true)
            {
                if (audiologyRecords.speechTherapyData != null && audiologyRecords.speechTherapyData.SignOffStatus == true)
                    AudTeststatuses.Add(true);
                else
                    AudTeststatuses.Add(false);
            }
            if (request.SpecialTest == true)
            {
                if (audiologyRecords.speechSpecialTestData != null && audiologyRecords.speechSpecialTestData.SignOffStatus == true)
                    AudTeststatuses.Add(true);
                else
                    AudTeststatuses.Add(false);
            }
            if (request.TinnitusMasking == true)
            {
                if (audiologyRecords.tinnitusMaskingData != null && audiologyRecords.tinnitusMaskingData.SignOffStatus == true)
                    AudTeststatuses.Add(true);
                else
                    AudTeststatuses.Add(false);
            }
            //if (request.TuningFork == true)
            //{
            //    if (audiologyRecords.tuningForkTestData != null && audiologyRecords.tuningForkTestData.SignOffStatus == true)
            //        AudTeststatuses.Add(true);
            //    else
            //        AudTeststatuses.Add(false);
            //}
            //if (request.Tympanometry == true)
            //{
            //    if (audiologyRecords.tympanometryData != null && audiologyRecords.tympanometryData.SignOffStatus == true)
            //        AudTeststatuses.Add(true);
            //    else
            //        AudTeststatuses.Add(false);
            //}

            if (AudTeststatuses.Where(x => x == false).ToList().Count() == 0)
            {
                audiologySignoffStatus = true;
            }
            else
            {
                audiologySignoffStatus = false;
            }

            return audiologySignoffStatus;
        }

        #endregion

    }
}
