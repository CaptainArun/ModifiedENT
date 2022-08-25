using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ENT.WebApi.DAL.Services
{
    public class DischargeService : IDischargeService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        private readonly IHostingEnvironment hostingEnvironment;

        public DischargeService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
            hostingEnvironment = _hostingEnvironment;
        }

        #region Master Data

        ///// <summary>
        ///// Get Drug Codes for given searchKey
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<DrugCode>. if Collection of DrugCodes for given searchKey = success. else = failure</returns>
        public List<DrugCode> GetDrugCodesforDischarge(string searchKey)
        {
            return this.utilService.GetAllDrugCodes(searchKey);
        }

        ///// <summary>
        ///// Get DiagnosisCodes (ICD codes)
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DiagnosisCode>. if Collection of DiagnosisCode = success. else = failure</returns>
        public List<DiagnosisCode> GetDiagnosisCodesforDischarge(string searchKey)
        {
            return this.utilService.GetAllDiagnosisCodesbySearch(searchKey);
        }

        ///// <summary>
        ///// Get Medication Routes List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationRoute>. if Collection of MedicationRoute = success. else = failure</returns>
        public List<MedicationRoute> GetMedicationRoutesforDischarge()
        {
            var medicationRoutes = this.iTenantMasterService.GetMedicationRouteList();
            return medicationRoutes;
        }

        ///// <summary>
        ///// Get Admission Date and Time
        ///// </summary>
        ///// <param>int admissionId</param>
        ///// <returns>AdmissionsModel. if Collection of AdmissionsModel for PreProcedure = success. else = failure</returns>
        public AdmissionsModel GetAdmissionbyId(int admissionId)
        {
            var admissionRecord = (from admission in this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionID == admissionId)

                                   join pat in this.uow.GenericRepository<Patient>().Table()
                                   on admission.PatientID equals pat.PatientId

                                   select new
                                   {
                                       admission.AdmissionID,
                                       admission.FacilityID,
                                       admission.PatientID,
                                       admission.AdmissionDateTime,
                                       admission.AdmissionNo,
                                       admission.AdmittingPhysician

                                   }).AsEnumerable().OrderByDescending(x => x.AdmissionDateTime).Select(AM => new AdmissionsModel
                                   {
                                       AdmissionID = AM.AdmissionID,
                                       FacilityID = AM.FacilityID,
                                       FacilityName = AM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == AM.FacilityID).FirstOrDefault().FacilityName : "",
                                       PatientID = AM.PatientID,
                                       AdmissionDateTime = AM.AdmissionDateTime,
                                       AdmissionNo = AM.AdmissionNo,
                                       ProviderName = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == AM.AdmittingPhysician).FirstOrDefault().FirstName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == AM.AdmittingPhysician).FirstOrDefault().MiddleName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == AM.AdmittingPhysician).FirstOrDefault().LastName,
                                       AdmissionDateandTime = AM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + AM.AdmissionDateTime.TimeOfDay.ToString()

                                   }).FirstOrDefault();

            return admissionRecord;
        }

        //// <summary>
        ///// Get Urgency Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<UrgencyType>. if Collection of Urgency Types = success. else = failure</returns>
        public List<UrgencyType> GetUrgencyTypesforDischarge()
        {
            var Urgencies = this.iTenantMasterService.GetUrgencyTypeList();
            return Urgencies;
        }

        #endregion

        #region Search and Count

        ///// <summary>
        ///// Get Counts of Discharge
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> If counts of Discharge = success. else = failure</returns>
        public DischargeCountModel GetDischargeCounts()
        {
            DischargeCountModel countModel = new DischargeCountModel();

            var dischargeRecords = this.GetDischargeRecords();

            countModel.TodayPendingDischargeCount = dischargeRecords.Where(x => x.Createddate.Date == DateTime.Now.Date & x.SignOff != true).ToList().Count();
            countModel.TodayCompletedDischargeCount = (from record in dischargeRecords
                                                       where (record.SignOffDate != null
                                                             && record.SignOffDate.Value.Date == DateTime.Now.Date
                                                             && record.SignOff == true)
                                                       select record).ToList().Count();

            return countModel;
        }

        ///// <summary>
        ///// Get Patients for Discharge
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForDischarge(string searchKey)
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
        ///// Get Providers For Discharge
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for Discharge = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforDischarge(string searchKey)
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
        ///// Get Admission Numbers For Discharge Autocomplete
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<string>. if collection of Admission Numbers for Discharge = success. else = failure</returns>
        public List<string> GetAdmissionNumbersbySearch(string searchKey)
        {
            var admNumbers = this.iTenantMasterService.GetAdmissionNumbersbySearch(searchKey);
            return admNumbers;
        }

        ///// <summary>
        ///// Get Discharge Data using SearchModel
        ///// </summary>
        ///// <param>(SearchModel searchModel)</param>
        ///// <returns>List<DischargeSummaryModel>. if Collection of Discharge summary records = success. else = failure</returns>
        public List<DischargeSummaryModel> GetDischargeRecordsbySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            var dischargeSummaryList = (from disc in this.uow.GenericRepository<DischargeSummary>().Table().Where(x => x.IsActive != false)

                                        join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                        on disc.AdmissionNumber equals adm.AdmissionNo

                                        join pat in this.uow.GenericRepository<Patient>().Table()
                                        on adm.PatientID equals pat.PatientId

                                        join preProc in this.uow.GenericRepository<PreProcedure>().Table()
                                        on adm.AdmissionID equals preProc.AdmissionID

                                        where (Fromdate.Date <= disc.Createddate.Date
                                               && (Todate.Date >= Fromdate.Date && disc.Createddate.Date <= Todate.Date)
                                               && (searchModel.PatientId == 0 || adm.PatientID == searchModel.PatientId)
                                               && (searchModel.ProviderId == 0 || adm.AdmittingPhysician == searchModel.ProviderId)
                                               && (searchModel.FacilityId == 0 || adm.FacilityID == searchModel.FacilityId)
                                               && ((searchModel.AdmissionNo == null || searchModel.AdmissionNo == "") || disc.AdmissionNumber.ToLower().Trim() == searchModel.AdmissionNo.ToLower().Trim())
                                               )

                                        select new
                                        {
                                            disc.DischargeSummaryId,
                                            disc.AdmissionNumber,
                                            disc.AdmissionDate,
                                            disc.AdmittingPhysician,
                                            disc.RecommendedProcedure,
                                            disc.PreProcedureDiagnosis,
                                            disc.PlannedProcedure,
                                            disc.Urgency,
                                            disc.AnesthesiaFitnessNotes,
                                            disc.OtherConsults,
                                            disc.PostOperativeDiagnosis,
                                            disc.BloodLossInfo,
                                            disc.Specimens,
                                            disc.PainLevelNotes,
                                            disc.Complications,
                                            disc.ProcedureNotes,
                                            disc.AdditionalInfo,
                                            disc.FollowUpDate,
                                            disc.FollowUpDetails,
                                            disc.SignOff,
                                            disc.SignOffBy,
                                            disc.SignOffDate,
                                            disc.DischargeStatus,
                                            disc.Createddate,
                                            adm.AdmissionID,
                                            adm.FacilityID,
                                            adm.PatientID,
                                            preProc.ProcedureStatus,
                                            pat.PatientFirstName,
                                            pat.PatientMiddleName,
                                            pat.PatientLastName

                                        }).AsEnumerable().Select(DSM => new DischargeSummaryModel
                                        {
                                            DischargeSummaryId = DSM.DischargeSummaryId,
                                            AdmissionNumber = DSM.AdmissionNumber,
                                            AdmissionDate = DSM.AdmissionDate,
                                            AdmittingPhysician = DSM.AdmittingPhysician,
                                            FacilityId = DSM.FacilityID,
                                            facilityName = DSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DSM.FacilityID).FacilityName : "",
                                            RecommendedProcedure = DSM.RecommendedProcedure,
                                            PreProcedureDiagnosis = DSM.PreProcedureDiagnosis,
                                            PlannedProcedure = DSM.PlannedProcedure,
                                            Urgency = DSM.Urgency,
                                            AnesthesiaFitnessNotes = DSM.AnesthesiaFitnessNotes,
                                            OtherConsults = DSM.OtherConsults,
                                            PostOperativeDiagnosis = DSM.PostOperativeDiagnosis,
                                            BloodLossInfo = DSM.BloodLossInfo,
                                            Specimens = DSM.Specimens,
                                            PainLevelNotes = DSM.PainLevelNotes,
                                            Complications = DSM.Complications,
                                            ProcedureNotes = DSM.ProcedureNotes,
                                            AdditionalInfo = DSM.AdditionalInfo,
                                            FollowUpDate = DSM.FollowUpDate,
                                            FollowUpDetails = DSM.FollowUpDetails,
                                            SignOff = DSM.SignOff,
                                            SignOffBy = DSM.SignOffBy,
                                            SignOffDate = DSM.SignOffDate,
                                            DischargeStatus = DSM.DischargeStatus,
                                            Createddate = DSM.Createddate,
                                            procedureStatus = DSM.ProcedureStatus,
                                            admissionId = DSM.AdmissionID,
                                            patientId = DSM.PatientID,
                                            patientName = DSM.PatientFirstName + " " + DSM.PatientMiddleName + " " + DSM.PatientLastName,
                                            medicationRequest = this.GetMedicationRequestForAdmission(DSM.AdmissionID),
                                            elabRequest = this.GetELabRequestforAdmission(DSM.AdmissionID),
                                            DischargeFile = this.GetFile(DSM.DischargeSummaryId.ToString(), "Discharge").Count() > 0 ? this.GetFile(DSM.DischargeSummaryId.ToString(), "Discharge") : new List<clsViewFile>()

                                        }).ToList();

            List<DischargeSummaryModel> dischargeCollection = new List<DischargeSummaryModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (dischargeSummaryList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            dischargeCollection = (from dis in dischargeSummaryList
                                                   join fac in facList on dis.FacilityId equals fac.FacilityId
                                                   join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                   on dis.admissionId equals adm.AdmissionID
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on adm.AdmittingPhysician equals prov.ProviderID
                                                   select dis).ToList();
                        }
                        else
                        {
                            dischargeCollection = (from dis in dischargeSummaryList
                                                   join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                   on dis.admissionId equals adm.AdmissionID
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on adm.AdmittingPhysician equals prov.ProviderID
                                                   select dis).ToList();
                        }
                    }
                    else
                    {
                        dischargeCollection = (from dis in dischargeSummaryList.Where(x => x.FacilityId == searchModel.FacilityId)
                                               join fac in facList on dis.FacilityId equals fac.FacilityId
                                               join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                               on dis.admissionId equals adm.AdmissionID
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on adm.AdmittingPhysician equals prov.ProviderID
                                               select dis).ToList();
                    }
                }
                else
                {
                    dischargeCollection = (from dis in dischargeSummaryList
                                           join fac in facList on dis.FacilityId equals fac.FacilityId
                                           select dis).ToList();
                }
            }
            else
            {
                dischargeCollection = dischargeSummaryList;
            }

            return dischargeCollection;
        }

        #endregion

        #region Discharge Summary

        ///// <summary>
        ///// Get Discharge Summary Grid Data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DischargeSummaryModel>. if list of DischargeSummaryModel = success. else = failure</returns>
        public List<DischargeSummaryModel> GetDischargeRecords()
        {
            var dischargeSummaryList = (from disc in this.uow.GenericRepository<DischargeSummary>().Table().Where(x => x.IsActive != false)

                                        join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                        on disc.AdmissionNumber equals adm.AdmissionNo

                                        join pat in this.uow.GenericRepository<Patient>().Table()
                                        on adm.PatientID equals pat.PatientId

                                        join preProc in this.uow.GenericRepository<PreProcedure>().Table()
                                        on adm.AdmissionID equals preProc.AdmissionID

                                        join postProc in this.uow.GenericRepository<PostProcedureCaseSheet>().Table()
                                        on preProc.PreProcedureID equals postProc.PreProcedureID

                                        select new
                                        {
                                            disc.DischargeSummaryId,
                                            disc.AdmissionNumber,
                                            disc.AdmissionDate,
                                            disc.AdmittingPhysician,
                                            disc.RecommendedProcedure,
                                            disc.PreProcedureDiagnosis,
                                            disc.PlannedProcedure,
                                            disc.Urgency,
                                            disc.AnesthesiaFitnessNotes,
                                            disc.OtherConsults,
                                            disc.PostOperativeDiagnosis,
                                            disc.BloodLossInfo,
                                            disc.Specimens,
                                            disc.PainLevelNotes,
                                            disc.Complications,
                                            disc.ProcedureNotes,
                                            disc.AdditionalInfo,
                                            disc.FollowUpDate,
                                            disc.FollowUpDetails,
                                            disc.SignOff,
                                            disc.SignOffBy,
                                            disc.SignOffDate,
                                            disc.DischargeStatus,
                                            disc.Createddate,
                                            adm.AdmissionID,
                                            adm.FacilityID,
                                            adm.PatientID,
                                            preProc.ProcedureStatus,
                                            pat.PatientFirstName,
                                            pat.PatientMiddleName,
                                            pat.PatientLastName

                                        }).AsEnumerable().Select(DSM => new DischargeSummaryModel
                                        {
                                            DischargeSummaryId = DSM.DischargeSummaryId,
                                            AdmissionNumber = DSM.AdmissionNumber,
                                            AdmissionDate = DSM.AdmissionDate,
                                            AdmittingPhysician = DSM.AdmittingPhysician,
                                            FacilityId = DSM.FacilityID,
                                            facilityName = DSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DSM.FacilityID).FacilityName : "",
                                            RecommendedProcedure = DSM.RecommendedProcedure,
                                            PreProcedureDiagnosis = DSM.PreProcedureDiagnosis,
                                            PlannedProcedure = DSM.PlannedProcedure,
                                            Urgency = DSM.Urgency,
                                            AnesthesiaFitnessNotes = DSM.AnesthesiaFitnessNotes,
                                            OtherConsults = DSM.OtherConsults,
                                            PostOperativeDiagnosis = DSM.PostOperativeDiagnosis,
                                            BloodLossInfo = DSM.BloodLossInfo,
                                            Specimens = DSM.Specimens,
                                            PainLevelNotes = DSM.PainLevelNotes,
                                            Complications = DSM.Complications,
                                            ProcedureNotes = DSM.ProcedureNotes,
                                            AdditionalInfo = DSM.AdditionalInfo,
                                            FollowUpDate = DSM.FollowUpDate,
                                            FollowUpDetails = DSM.FollowUpDetails,
                                            SignOff = DSM.SignOff,
                                            SignOffBy = DSM.SignOffBy,
                                            SignOffDate = DSM.SignOffDate,
                                            DischargeStatus = DSM.DischargeStatus,
                                            procedureStatus = DSM.ProcedureStatus,
                                            admissionId = DSM.AdmissionID,
                                            patientId = DSM.PatientID,
                                            Createddate = DSM.Createddate,
                                            patientName = DSM.PatientFirstName + " " + DSM.PatientMiddleName + " " + DSM.PatientLastName,
                                            medicationRequest = this.GetMedicationRequestForAdmission(DSM.AdmissionID),
                                            elabRequest = this.GetELabRequestforAdmission(DSM.AdmissionID),
                                            DischargeFile = this.GetFile(DSM.DischargeSummaryId.ToString(), "Discharge").Count() > 0 ? this.GetFile(DSM.DischargeSummaryId.ToString(), "Discharge") : new List<clsViewFile>()

                                        }).ToList();

            List<DischargeSummaryModel> dischargeCollection = new List<DischargeSummaryModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (dischargeSummaryList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        dischargeCollection = (from dis in dischargeSummaryList
                                               join fac in facList on dis.FacilityId equals fac.FacilityId
                                               join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                               on dis.admissionId equals adm.AdmissionID
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on adm.AdmittingPhysician equals prov.ProviderID
                                               select dis).ToList();
                    }
                    else
                    {
                        dischargeCollection = (from dis in dischargeSummaryList
                                               join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                               on dis.admissionId equals adm.AdmissionID
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on adm.AdmittingPhysician equals prov.ProviderID
                                               select dis).ToList();
                    }
                }
                else
                {
                    dischargeCollection = (from dis in dischargeSummaryList
                                           join fac in facList on dis.FacilityId equals fac.FacilityId
                                           select dis).ToList();
                }
            }
            else
            {
                dischargeCollection = dischargeSummaryList;
            }

            return dischargeCollection;
        }

        ///// <summary>
        ///// Get Discharge Summary by ID
        ///// </summary>
        ///// <param>int dischargeSummaryId</param>
        ///// <returns>DischargeSummaryModel. if list of DischargeSummaryModel = success. else = failure</returns>
        public DischargeSummaryModel GetDischargeSummaryRecordbyID(int dischargeSummaryId)
        {
            var dischargeSummary = (from disc in this.uow.GenericRepository<DischargeSummary>().Table().Where(x => x.DischargeSummaryId == dischargeSummaryId)

                                    join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                    on disc.AdmissionNumber equals adm.AdmissionNo

                                    join pat in this.uow.GenericRepository<Patient>().Table()
                                    on adm.PatientID equals pat.PatientId

                                    join preProc in this.uow.GenericRepository<PreProcedure>().Table()
                                    on adm.AdmissionID equals preProc.AdmissionID

                                    join postProc in this.uow.GenericRepository<PostProcedureCaseSheet>().Table()
                                    on preProc.PreProcedureID equals postProc.PreProcedureID

                                    select new
                                    {
                                        disc.DischargeSummaryId,
                                        disc.AdmissionNumber,
                                        disc.AdmissionDate,
                                        disc.AdmittingPhysician,
                                        disc.RecommendedProcedure,
                                        disc.PreProcedureDiagnosis,
                                        disc.PlannedProcedure,
                                        disc.Urgency,
                                        disc.AnesthesiaFitnessNotes,
                                        disc.OtherConsults,
                                        disc.PostOperativeDiagnosis,
                                        disc.BloodLossInfo,
                                        disc.Specimens,
                                        disc.PainLevelNotes,
                                        disc.Complications,
                                        disc.ProcedureNotes,
                                        disc.AdditionalInfo,
                                        disc.FollowUpDate,
                                        disc.FollowUpDetails,
                                        disc.SignOff,
                                        disc.SignOffBy,
                                        disc.SignOffDate,
                                        disc.DischargeStatus,
                                        adm.AdmissionID,
                                        adm.FacilityID,
                                        adm.PatientID,
                                        preProc.ProcedureStatus,
                                        pat.PatientFirstName,
                                        pat.PatientMiddleName,
                                        pat.PatientLastName

                                    }).AsEnumerable().Select(DSM => new DischargeSummaryModel
                                    {
                                        DischargeSummaryId = DSM.DischargeSummaryId,
                                        AdmissionNumber = DSM.AdmissionNumber,
                                        AdmissionDate = DSM.AdmissionDate,
                                        AdmittingPhysician = DSM.AdmittingPhysician,
                                        FacilityId = DSM.FacilityID,
                                        facilityName = DSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DSM.FacilityID).FacilityName : "",
                                        RecommendedProcedure = DSM.RecommendedProcedure,
                                        PreProcedureDiagnosis = DSM.PreProcedureDiagnosis,
                                        PlannedProcedure = DSM.PlannedProcedure,
                                        Urgency = DSM.Urgency,
                                        AnesthesiaFitnessNotes = DSM.AnesthesiaFitnessNotes,
                                        OtherConsults = DSM.OtherConsults,
                                        PostOperativeDiagnosis = DSM.PostOperativeDiagnosis,
                                        BloodLossInfo = DSM.BloodLossInfo,
                                        Specimens = DSM.Specimens,
                                        PainLevelNotes = DSM.PainLevelNotes,
                                        Complications = DSM.Complications,
                                        ProcedureNotes = DSM.ProcedureNotes,
                                        AdditionalInfo = DSM.AdditionalInfo,
                                        FollowUpDate = DSM.FollowUpDate,
                                        FollowUpDetails = DSM.FollowUpDetails,
                                        SignOff = DSM.SignOff,
                                        SignOffBy = DSM.SignOffBy,
                                        SignOffDate = DSM.SignOffDate,
                                        DischargeStatus = DSM.DischargeStatus,
                                        procedureStatus = DSM.ProcedureStatus,
                                        admissionId = DSM.AdmissionID,
                                        patientId = DSM.PatientID,
                                        patientName = DSM.PatientFirstName + " " + DSM.PatientMiddleName + " " + DSM.PatientLastName,
                                        medicationRequest = this.GetMedicationRequestForAdmission(DSM.AdmissionID),
                                        elabRequest = this.GetELabRequestforAdmission(DSM.AdmissionID),
                                        DischargeFile = this.GetFile(DSM.DischargeSummaryId.ToString(), "Discharge").Count() > 0 ? this.GetFile(DSM.DischargeSummaryId.ToString(), "Discharge") : new List<clsViewFile>()

                                    }).FirstOrDefault();

            if (dischargeSummary.DischargeFile.Count() > 0)
            {
                //byte[] bytes = System.IO.File.ReadAllBytes(this.GetFile(dischargeSummary.DischargeSummaryId.ToString(), "Discharge").FirstOrDefault().FileUrl);
                //dischargeSummary.DischargeImage = Convert.ToBase64String(bytes);
                dischargeSummary.DischargeImage = dischargeSummary.DischargeFile.FirstOrDefault().ActualFile;
            }

            return dischargeSummary;
        }

        ///// <summary>
        ///// Get Discharge Summary by admission ID
        ///// </summary>
        ///// <param>int admissionID</param>
        ///// <returns>DischargeSummaryModel. if list of DischargeSummaryModel = success. else = failure</returns>
        public DischargeSummaryModel GetDischargeRecordbyAdmissionID(int admissionID)
        {
            var dischargeSummary = (from disc in this.uow.GenericRepository<DischargeSummary>().Table()

                                    join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionID == admissionID & x.IsActive != false)
                                    on disc.AdmissionNumber equals adm.AdmissionNo

                                    join pat in this.uow.GenericRepository<Patient>().Table()
                                    on adm.PatientID equals pat.PatientId

                                    join preProc in this.uow.GenericRepository<PreProcedure>().Table()
                                    on adm.AdmissionID equals preProc.AdmissionID

                                    join postProc in this.uow.GenericRepository<PostProcedureCaseSheet>().Table()
                                    on preProc.PreProcedureID equals postProc.PreProcedureID

                                    select new
                                    {
                                        disc.DischargeSummaryId,
                                        disc.AdmissionNumber,
                                        disc.AdmissionDate,
                                        disc.AdmittingPhysician,
                                        disc.RecommendedProcedure,
                                        disc.PreProcedureDiagnosis,
                                        disc.PlannedProcedure,
                                        disc.Urgency,
                                        disc.AnesthesiaFitnessNotes,
                                        disc.OtherConsults,
                                        disc.PostOperativeDiagnosis,
                                        disc.BloodLossInfo,
                                        disc.Specimens,
                                        disc.PainLevelNotes,
                                        disc.Complications,
                                        disc.ProcedureNotes,
                                        disc.AdditionalInfo,
                                        disc.FollowUpDate,
                                        disc.FollowUpDetails,
                                        disc.SignOff,
                                        disc.SignOffBy,
                                        disc.SignOffDate,
                                        disc.DischargeStatus,
                                        adm.AdmissionID,
                                        adm.FacilityID,
                                        adm.PatientID,
                                        preProc.ProcedureStatus,
                                        pat.PatientFirstName,
                                        pat.PatientMiddleName,
                                        pat.PatientLastName

                                    }).AsEnumerable().Select(DSM => new DischargeSummaryModel
                                    {
                                        DischargeSummaryId = DSM.DischargeSummaryId,
                                        AdmissionNumber = DSM.AdmissionNumber,
                                        AdmissionDate = DSM.AdmissionDate,
                                        AdmittingPhysician = DSM.AdmittingPhysician,
                                        FacilityId = DSM.FacilityID,
                                        facilityName = DSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DSM.FacilityID).FacilityName : "",
                                        RecommendedProcedure = DSM.RecommendedProcedure,
                                        PreProcedureDiagnosis = DSM.PreProcedureDiagnosis,
                                        PlannedProcedure = DSM.PlannedProcedure,
                                        Urgency = DSM.Urgency,
                                        AnesthesiaFitnessNotes = DSM.AnesthesiaFitnessNotes,
                                        OtherConsults = DSM.OtherConsults,
                                        PostOperativeDiagnosis = DSM.PostOperativeDiagnosis,
                                        BloodLossInfo = DSM.BloodLossInfo,
                                        Specimens = DSM.Specimens,
                                        PainLevelNotes = DSM.PainLevelNotes,
                                        Complications = DSM.Complications,
                                        ProcedureNotes = DSM.ProcedureNotes,
                                        AdditionalInfo = DSM.AdditionalInfo,
                                        FollowUpDate = DSM.FollowUpDate,
                                        FollowUpDetails = DSM.FollowUpDetails,
                                        SignOff = DSM.SignOff,
                                        SignOffBy = DSM.SignOffBy,
                                        SignOffDate = DSM.SignOffDate,
                                        DischargeStatus = DSM.DischargeStatus,
                                        procedureStatus = DSM.ProcedureStatus,
                                        admissionId = DSM.AdmissionID,
                                        patientId = DSM.PatientID,
                                        patientName = DSM.PatientFirstName + " " + DSM.PatientMiddleName + " " + DSM.PatientLastName,
                                        medicationRequest = this.GetMedicationRequestForAdmission(DSM.AdmissionID),
                                        elabRequest = this.GetELabRequestforAdmission(DSM.AdmissionID),
                                        DischargeFile = this.GetFile(DSM.DischargeSummaryId.ToString(), "Discharge").Count() > 0 ? this.GetFile(DSM.DischargeSummaryId.ToString(), "Discharge") : new List<clsViewFile>()

                                    }).FirstOrDefault();

            if (dischargeSummary.DischargeFile.Count() > 0)
            {
                //byte[] bytes = System.IO.File.ReadAllBytes(this.GetFile(dischargeSummary.DischargeSummaryId.ToString(), "Discharge").FirstOrDefault().FileUrl);
                //dischargeSummary.DischargeImage = Convert.ToBase64String(bytes);
                dischargeSummary.DischargeImage = dischargeSummary.DischargeFile.FirstOrDefault().ActualFile;
            }

            return dischargeSummary;
        }

        ///// <summary>
        ///// Add or Update Discharge Summary Record
        ///// </summary>
        ///// <param>(DischargeSummaryModel dischargeSummaryModel)</param>
        ///// <returns>DischargeSummaryModel. if Record of Discharge Summary added or Updated = success. else = failure</returns>
        public DischargeSummaryModel AddUpdateDischargeSummaryRecord(DischargeSummaryModel dischargeSummaryModel)
        {
            var dischargeData = this.uow.GenericRepository<DischargeSummary>().Table().Where(x => x.AdmissionNumber.ToLower().Trim() == dischargeSummaryModel.AdmissionNumber.ToLower().Trim()).FirstOrDefault();

            if (dischargeData == null)
            {
                dischargeData = new DischargeSummary();

                dischargeData.AdmissionNumber = dischargeSummaryModel.AdmissionNumber;
                dischargeData.AdmissionDate = this.utilService.GetLocalTime(dischargeSummaryModel.AdmissionDate.Value);
                dischargeData.AdmittingPhysician = dischargeSummaryModel.AdmittingPhysician;
                dischargeData.RecommendedProcedure = dischargeSummaryModel.RecommendedProcedure;
                dischargeData.PreProcedureDiagnosis = dischargeSummaryModel.PreProcedureDiagnosis;
                dischargeData.PlannedProcedure = dischargeSummaryModel.PlannedProcedure;
                dischargeData.Urgency = dischargeSummaryModel.Urgency;
                dischargeData.AnesthesiaFitnessNotes = dischargeSummaryModel.AnesthesiaFitnessNotes;
                dischargeData.OtherConsults = dischargeSummaryModel.OtherConsults;
                dischargeData.PostOperativeDiagnosis = dischargeSummaryModel.PostOperativeDiagnosis;
                dischargeData.BloodLossInfo = dischargeSummaryModel.BloodLossInfo;
                dischargeData.Specimens = dischargeSummaryModel.Specimens;
                dischargeData.PainLevelNotes = dischargeSummaryModel.PainLevelNotes;
                dischargeData.Complications = dischargeSummaryModel.Complications;
                dischargeData.ProcedureNotes = dischargeSummaryModel.ProcedureNotes;
                dischargeData.AdditionalInfo = dischargeSummaryModel.AdditionalInfo;
                dischargeData.FollowUpDate = dischargeSummaryModel.FollowUpDate != null ? this.utilService.GetLocalTime(dischargeSummaryModel.FollowUpDate.Value) : dischargeSummaryModel.FollowUpDate;
                dischargeData.FollowUpDetails = dischargeSummaryModel.FollowUpDetails;
                dischargeData.DischargeStatus = "Pending";
                dischargeData.IsActive = true;
                dischargeData.Createddate = DateTime.Now;
                dischargeData.CreatedBy = "User";

                this.uow.GenericRepository<DischargeSummary>().Insert(dischargeData);
            }
            else
            {
                dischargeData.RecommendedProcedure = dischargeSummaryModel.RecommendedProcedure;
                dischargeData.PreProcedureDiagnosis = dischargeSummaryModel.PreProcedureDiagnosis;
                dischargeData.PlannedProcedure = dischargeSummaryModel.PlannedProcedure;
                dischargeData.Urgency = dischargeSummaryModel.Urgency;
                dischargeData.AnesthesiaFitnessNotes = dischargeSummaryModel.AnesthesiaFitnessNotes;
                dischargeData.OtherConsults = dischargeSummaryModel.OtherConsults;
                dischargeData.PostOperativeDiagnosis = dischargeSummaryModel.PostOperativeDiagnosis;
                dischargeData.BloodLossInfo = dischargeSummaryModel.BloodLossInfo;
                dischargeData.Specimens = dischargeSummaryModel.Specimens;
                dischargeData.PainLevelNotes = dischargeSummaryModel.PainLevelNotes;
                dischargeData.Complications = dischargeSummaryModel.Complications;
                dischargeData.ProcedureNotes = dischargeSummaryModel.ProcedureNotes;
                dischargeData.AdditionalInfo = dischargeSummaryModel.AdditionalInfo;
                dischargeData.FollowUpDate = dischargeSummaryModel.FollowUpDate != null ? this.utilService.GetLocalTime(dischargeSummaryModel.FollowUpDate.Value) : dischargeSummaryModel.FollowUpDate;
                dischargeData.FollowUpDetails = dischargeSummaryModel.FollowUpDetails;
                dischargeData.DischargeStatus = "Pending";
                dischargeData.IsActive = true;
                dischargeData.ModifiedDate = DateTime.Now;
                dischargeData.ModifiedBy = "User";

                this.uow.GenericRepository<DischargeSummary>().Update(dischargeData);
            }
            this.uow.Save();
            dischargeSummaryModel.DischargeSummaryId = dischargeData.DischargeSummaryId;

            var admData = this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionNo.ToLower().Trim() == dischargeData.AdmissionNumber.ToLower().Trim()).FirstOrDefault();

            if (dischargeSummaryModel.medicationRequest != null)
            {
                var medicationRequestData = this.AddUpdateMedicationRequestforDischarge(dischargeSummaryModel.medicationRequest);
                dischargeSummaryModel.medicationRequest = medicationRequestData;
            }

            if (dischargeSummaryModel.elabRequest != null)
            {
                var eLabRequestData = this.AddUpdateELabRequestfromDischarge(dischargeSummaryModel.elabRequest);
                dischargeSummaryModel.elabRequest = eLabRequestData;
            }

            return dischargeSummaryModel;
        }

        #endregion

        #region Patient data

        ///// <summary>
        ///// Get Patient DetailBy Id
        ///// </summary>
        ///// <param>PatientId</param>
        ///// <returns>PatientDemographicModel. if Patient Data for given PatientId = success. else = failure</returns>
        public PatientDemographicModel GetPatientDetailByPatientId(int PatientId)
        {
            PatientDemographicModel demoModel = (from pat in uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                                 join patDemo in uow.GenericRepository<PatientDemographic>().Table()
                                                 on pat.PatientId equals patDemo.PatientId

                                                 select new
                                                 {
                                                     pat.PatientId,
                                                     pat.MRNo,
                                                     pat.PatientFirstName,
                                                     pat.PatientMiddleName,
                                                     pat.PatientLastName,
                                                     pat.PatientDOB,
                                                     pat.PatientAge,
                                                     pat.Gender,
                                                     pat.PrimaryContactNumber,
                                                     pat.PrimaryContactType,
                                                     pat.SecondaryContactNumber,
                                                     pat.SecondaryContactType,
                                                     pat.PatientStatus,
                                                     patDemo.PatientType,
                                                     patDemo.FacilityId,
                                                     patDemo.RegisterationAt,
                                                     patDemo.PatientCategory,
                                                     patDemo.Salutation,
                                                     patDemo.IDTID1,
                                                     patDemo.PatientIdentificationtype1details,
                                                     patDemo.IDTID2,
                                                     patDemo.PatientIdentificationtype2details,
                                                     patDemo.MaritalStatus,
                                                     patDemo.Religion,
                                                     patDemo.Race,
                                                     patDemo.Occupation,
                                                     patDemo.email,
                                                     patDemo.Emergencycontactnumber,
                                                     patDemo.Address1,
                                                     patDemo.Address2,
                                                     patDemo.Village,
                                                     patDemo.Town,
                                                     patDemo.City,
                                                     patDemo.Pincode,
                                                     patDemo.State,
                                                     patDemo.Country,
                                                     patDemo.Bloodgroup,
                                                     patDemo.NKFirstname,
                                                     patDemo.NKSalutation,
                                                     patDemo.NKLastname,
                                                     patDemo.NKPrimarycontactnumber,
                                                     patDemo.NKContactType,
                                                     patDemo.RSPId

                                                 }).AsEnumerable().Select(PDM => new PatientDemographicModel
                                                 {
                                                     PatientId = PDM.PatientId,
                                                     MRNo = PDM.MRNo,
                                                     PatientFirstName = PDM.PatientFirstName,
                                                     PatientMiddleName = PDM.PatientMiddleName,
                                                     PatientLastName = PDM.PatientLastName,
                                                     PatientFullName = PDM.PatientFirstName + " " + PDM.PatientMiddleName + " " + PDM.PatientLastName,
                                                     PatientDOB = PDM.PatientDOB,
                                                     PatientAge = PDM.PatientAge,
                                                     Gender = PDM.Gender,
                                                     PrimaryContactNumber = PDM.PrimaryContactNumber,
                                                     PrimaryContactType = PDM.PrimaryContactType,
                                                     PatientStatus = PDM.PatientStatus,
                                                     SecondaryContactNumber = PDM.SecondaryContactNumber,
                                                     SecondaryContactType = PDM.SecondaryContactType,
                                                     PatientType = PDM.PatientType,
                                                     FacilityId = PDM.FacilityId,
                                                     FacilityName = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == PDM.FacilityId).FirstOrDefault().FacilityName,
                                                     RegisterationAt = PDM.RegisterationAt,
                                                     PatientCategory = PDM.PatientCategory,
                                                     Salutation = PDM.Salutation,
                                                     IDTID1 = PDM.IDTID1,
                                                     PatientIdentificationtype1details = PDM.PatientIdentificationtype1details,
                                                     IDTID2 = PDM.IDTID2,
                                                     PatientIdentificationtype2details = PDM.PatientIdentificationtype2details,
                                                     MaritalStatus = PDM.MaritalStatus,
                                                     Religion = PDM.Religion,
                                                     Race = PDM.Race,
                                                     Occupation = PDM.Occupation,
                                                     email = PDM.email,
                                                     Emergencycontactnumber = PDM.Emergencycontactnumber,
                                                     Address1 = PDM.Address1,
                                                     Address2 = PDM.Address2,
                                                     Village = PDM.Village,
                                                     Town = PDM.Town,
                                                     City = PDM.City,
                                                     Pincode = PDM.Pincode,
                                                     State = PDM.State,
                                                     Country = PDM.Country,
                                                     Bloodgroup = PDM.Bloodgroup,
                                                     NKSalutation = PDM.NKSalutation,
                                                     NKFirstname = PDM.NKFirstname,
                                                     NKLastname = PDM.NKLastname,
                                                     NKPrimarycontactnumber = PDM.NKPrimarycontactnumber,
                                                     NKContactType = PDM.NKContactType,
                                                     RSPId = PDM.RSPId,
                                                     Relationship = PDM.RSPId > 0 ? this.uow.GenericRepository<Relationshiptopatient>().Table().FirstOrDefault(x => x.RSPId == PDM.RSPId).RSPDescription : "",
                                                     Diabetic = this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId) == null ? " " :
                                                                (this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId).IsDiabetic == "N" ? "No" :
                                                                (this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId).IsDiabetic == "Y" ? "Yes" : "Unknown")),
                                                     HighBP = this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId) == null ? " " :
                                                                (this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId).IsBloodPressure == "N" ? "No" :
                                                                (this.uow.GenericRepository<PatientVitals>().Table().LastOrDefault(x => x.PatientId == PDM.PatientId).IsBloodPressure == "Y" ? "Yes" : "Unknown")),
                                                     Gait = this.GetCognitiveforPatient(PDM.PatientId),
                                                     Allergies = this.GetAllergyforPatient(PDM.PatientId)

                                                 }).FirstOrDefault();

            var bills = this.billCalculationforPatient(demoModel.PatientId);

            demoModel.billedAmount = bills[0];
            demoModel.paidAmount = bills[1];
            demoModel.balanceAmount = bills[2];

            return demoModel;
        }

        ///// <summary>
        ///// Get bill details for specific patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<decimal>. if amounts for selected Patient Id = success. else = failure</returns>
        public List<decimal> billCalculationforPatient(int PatientId)
        {
            List<decimal> amounts = new List<decimal>(new decimal[3]);

            var payments = this.GetPaymentParticularsforPatient(PatientId);

            if (payments.Count() > 0)
            {
                foreach (var set in payments)
                {
                    amounts[0] += set.TotalAmount;
                    amounts[1] += set.AmountPaid;
                }
                amounts[2] = amounts[0] - amounts[1];
            }

            return amounts;
        }

        ///// <summary>
        ///// Get All Payment Details
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<CommonPaymentDetailsModel>. if All payment Detail for given patientId = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetPaymentParticularsforPatient(int patientID)
        {
            List<CommonPaymentDetailsModel> paymentParticularCollection = new List<CommonPaymentDetailsModel>();

            var visPaymentDetails = this.GetVisitPaymentDetails().Where(x => x.PatientId == patientID).ToList();

            if (visPaymentDetails.Count() > 0)
            {
                foreach (var data in visPaymentDetails)
                {
                    if (!paymentParticularCollection.Contains(data))
                    {
                        paymentParticularCollection.Add(data);
                    }
                }
            }

            var admPaymentDetails = this.GetAdmissionPaymentDetails().Where(x => x.PatientId == patientID).ToList();

            if (admPaymentDetails.Count() > 0)
            {
                foreach (var set in admPaymentDetails)
                {
                    if (!paymentParticularCollection.Contains(set))
                    {
                        paymentParticularCollection.Add(set);
                    }
                }
            }

            return paymentParticularCollection;
        }

        ///// <summary>
        ///// Get Visit Payment Details for patient Id
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<CommonPaymentDetailsModel>. if All visit payment Detail for given patientId = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetVisitPaymentDetails()
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<VisitPaymentDetails>().Table().Where(x => x.IsActive != false)

                                  join payment in this.uow.GenericRepository<VisitPayment>().Table()
                                  on detail.VisitPaymentID equals payment.VisitPaymentID

                                  join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                  on payment.VisitID equals visit.VisitId

                                  join pat in this.uow.GenericRepository<Patient>().Table()
                                  on visit.PatientId equals pat.PatientId

                                  join prov in this.uow.GenericRepository<Provider>().Table()
                                  on visit.ProviderID equals prov.ProviderID

                                  select new
                                  {
                                      detail.VisitPaymentDetailsID,
                                      detail.VisitPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      detail.Refund,
                                      detail.RefundNotes,
                                      pat.PatientId,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName,
                                      visit.FacilityID,
                                      prov.ProviderID,
                                      prov.FirstName,
                                      prov.MiddleName,
                                      prov.LastName

                                  }).AsEnumerable().Select(CPDM => new CommonPaymentDetailsModel
                                  {
                                      VisitPaymentDetailsID = CPDM.VisitPaymentDetailsID,
                                      FacilityID = CPDM.FacilityID > 0 ? CPDM.FacilityID.Value : 0,
                                      VisitPaymentID = CPDM.VisitPaymentID,
                                      //ReceiptDate = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().ReceiptDate,
                                      //ReceiptTime = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().ReceiptDate.TimeOfDay.ToString(),
                                      //ReceiptNo = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().ReceiptNo.Trim(),
                                      DiscountAmount = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().DiscountAmount,
                                      AmountPaid = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().PaidAmount,
                                      TotalAmount = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().GrandTotal,
                                      //Notes = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == CPDM.VisitPaymentID).FirstOrDefault().Notes,
                                      //SetupMasterID = CPDM.SetupMasterID,
                                      //Charges = CPDM.Charges,
                                      //Refund = CPDM.Refund,
                                      //RefundNotes = CPDM.RefundNotes,
                                      PatientId = CPDM.PatientId,
                                      PatientName = CPDM.PatientFirstName + " " + CPDM.PatientMiddleName + " " + CPDM.PatientLastName,
                                      ProviderId = CPDM.ProviderID,
                                      ProviderName = CPDM.FirstName + " " + CPDM.MiddleName + " " + CPDM.LastName

                                  }).ToList();

            List<CommonPaymentDetailsModel> commonPaymentDetailCollection = new List<CommonPaymentDetailsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (paymentDetails.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        commonPaymentDetailCollection = (from visPay in paymentDetails
                                                         join fac in facList on visPay.FacilityID equals fac.FacilityId
                                                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                         on visPay.ProviderId equals prov.ProviderID
                                                         select visPay).ToList();
                    }
                    else
                    {
                        commonPaymentDetailCollection = (from visPay in paymentDetails
                                                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                         on visPay.ProviderId equals prov.ProviderID
                                                         select visPay).ToList();
                    }
                }
                else
                {
                    commonPaymentDetailCollection = (from visPay in paymentDetails
                                                     join fac in facList on visPay.FacilityID equals fac.FacilityId
                                                     select visPay).ToList();
                }
            }
            else
            {
                commonPaymentDetailCollection = paymentDetails;
            }

            return commonPaymentDetailCollection;
        }

        ///// <summary>
        ///// Get Admission Payment Details
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<CommonPaymentDetailsModel>. if All admission payment Details = success. else = failure</returns>
        public List<CommonPaymentDetailsModel> GetAdmissionPaymentDetails()
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<AdmissionPaymentDetails>().Table().Where(x => x.IsActive != false)

                                  join payment in this.uow.GenericRepository<AdmissionPayment>().Table()
                                  on detail.AdmissionPaymentID equals payment.AdmissionPaymentID

                                  join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                  on payment.AdmissionID equals adm.AdmissionID

                                  join pat in this.uow.GenericRepository<Patient>().Table()
                                  on adm.PatientID equals pat.PatientId

                                  join prov in this.uow.GenericRepository<Provider>().Table()
                                  on adm.AdmittingPhysician equals prov.ProviderID

                                  select new
                                  {
                                      detail.AdmissionPaymentDetailsID,
                                      detail.AdmissionPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      detail.Refund,
                                      detail.RefundNotes,
                                      pat.PatientId,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName,
                                      prov.ProviderID,
                                      prov.FirstName,
                                      prov.MiddleName,
                                      prov.LastName

                                  }).AsEnumerable().Select(CPDM => new CommonPaymentDetailsModel
                                  {
                                      AdmissionPaymentDetailsID = CPDM.AdmissionPaymentDetailsID,
                                      AdmissionPaymentID = CPDM.AdmissionPaymentID,
                                      //ReceiptDate = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().ReceiptDate,
                                      //ReceiptTime = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().ReceiptDate.TimeOfDay.ToString(),
                                      //ReceiptNo = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().ReceiptNo.Trim(),
                                      DiscountAmount = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().DiscountAmount,
                                      AmountPaid = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().PaidAmount,
                                      TotalAmount = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().GrandTotal,
                                      //Notes = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == CPDM.AdmissionPaymentID).FirstOrDefault().Notes,
                                      //SetupMasterID = CPDM.SetupMasterID,
                                      //Charges = CPDM.Charges,
                                      //Refund = CPDM.Refund,
                                      //RefundNotes = CPDM.RefundNotes,
                                      PatientId = CPDM.PatientId,
                                      PatientName = CPDM.PatientFirstName + " " + CPDM.PatientMiddleName + " " + CPDM.PatientLastName,
                                      ProviderId = CPDM.ProviderID,
                                      ProviderName = CPDM.FirstName + " " + CPDM.MiddleName + " " + CPDM.LastName

                                  }).ToList();

            List<CommonPaymentDetailsModel> commonPaymentDetailCollection = new List<CommonPaymentDetailsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (paymentDetails.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        commonPaymentDetailCollection = (from admPay in paymentDetails
                                                         join fac in facList on admPay.FacilityID equals fac.FacilityId
                                                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                         on admPay.ProviderId equals prov.ProviderID
                                                         select admPay).ToList();
                    }
                    else
                    {
                        commonPaymentDetailCollection = (from admPay in paymentDetails
                                                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                         on admPay.ProviderId equals prov.ProviderID
                                                         select admPay).ToList();
                    }
                }
                else
                {
                    commonPaymentDetailCollection = (from admPay in paymentDetails
                                                     join fac in facList on admPay.FacilityID equals fac.FacilityId
                                                     select admPay).ToList();
                }
            }
            else
            {
                commonPaymentDetailCollection = paymentDetails;
            }

            return commonPaymentDetailCollection;
        }


        ///// <summary>
        ///// Get vital data for selected Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>PatientVitals. if vital data for selected Patient Id = success. else = failure</returns>
        public PatientVitals GetPatientVitalsData(int PatientId)
        {
            var vital = this.uow.GenericRepository<PatientVitals>().Table().Where(x => x.PatientId == PatientId).LastOrDefault();
            return vital;
        }

        ///// <summary>
        ///// Get gait status for selected Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>string. if gait status for selected Patient Id = success. else = failure</returns>
        public string GetCognitiveforPatient(int PatientId)
        {
            string message = " ";
            var cognitive = this.uow.GenericRepository<Cognitive>().Table().Where(x => x.PatientID == PatientId).LastOrDefault();

            if (cognitive != null)
            {
                message = cognitive.Gait == null ? " " : (cognitive.Gait.Value == 1 ? "Normal" : "Abnormal");
            }

            return message;
        }

        ///// <summary>
        ///// Get allergy for selected Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>string. if allergy for selected Patient Id = success. else = failure</returns>
        public string GetAllergyforPatient(int PatientId)
        {
            string message = " ";
            var allergies = this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.PatientId == PatientId & x.IsActive != false).LastOrDefault();

            if (allergies != null)
            {
                return allergies.Name;
            }

            return message;
        }

        #endregion

        #region Medication Request => (E - Prescription)

        ///// <summary>
        ///// Add or Update MedicationRequests
        ///// </summary>
        ///// <param>(MedicationRequestsModel medicationRequestsModel)</param>
        ///// <returns>MedicationRequestsModel. if Record of Medication Request added or Updated = success. else = failure</returns>
        public MedicationRequestsModel AddUpdateMedicationRequestforDischarge(MedicationRequestsModel medicationRequestsModel)
        {
            var medicationRequest = this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.AdmissionID == medicationRequestsModel.AdmissionID).FirstOrDefault();

            if (medicationRequest == null)
            {
                medicationRequest = new MedicationRequests();

                medicationRequest.VisitID = 0;
                medicationRequest.AdmissionID = medicationRequestsModel.AdmissionID;
                medicationRequest.TakeRegularMedication = medicationRequestsModel.TakeRegularMedication;
                medicationRequest.IsHoldRegularMedication = medicationRequestsModel.IsHoldRegularMedication;
                medicationRequest.HoldRegularMedicationNotes = medicationRequestsModel.HoldRegularMedicationNotes;
                medicationRequest.IsDiscontinueDrug = medicationRequestsModel.IsDiscontinueDrug;
                medicationRequest.DiscontinueDrugNotes = medicationRequestsModel.DiscontinueDrugNotes;
                medicationRequest.IsPharmacist = medicationRequestsModel.IsPharmacist;
                medicationRequest.PharmacistNotes = medicationRequestsModel.PharmacistNotes;
                medicationRequest.IsRefill = medicationRequestsModel.IsRefill;
                medicationRequest.RefillCount = medicationRequestsModel.RefillCount;
                medicationRequest.RefillDate = medicationRequestsModel.RefillDate != null ? this.utilService.GetLocalTime(medicationRequestsModel.RefillDate.Value) : medicationRequestsModel.RefillDate;
                medicationRequest.RefillNotes = medicationRequestsModel.RefillNotes;
                medicationRequest.MedicationRequestStatus = "Requested";
                medicationRequest.RequestedDate = DateTime.Now;
                medicationRequest.RequestedBy = this.GetAdmissionbyId(medicationRequestsModel.AdmissionID).ProviderName;
                medicationRequest.IsActive = true;
                medicationRequest.Createdby = "User";
                medicationRequest.CreatedDate = DateTime.Now;

                this.uow.GenericRepository<MedicationRequests>().Insert(medicationRequest);
            }
            else
            {
                medicationRequest.TakeRegularMedication = medicationRequestsModel.TakeRegularMedication;
                medicationRequest.IsHoldRegularMedication = medicationRequestsModel.IsHoldRegularMedication;
                medicationRequest.HoldRegularMedicationNotes = medicationRequestsModel.HoldRegularMedicationNotes;
                medicationRequest.IsDiscontinueDrug = medicationRequestsModel.IsDiscontinueDrug;
                medicationRequest.DiscontinueDrugNotes = medicationRequestsModel.DiscontinueDrugNotes;
                medicationRequest.IsPharmacist = medicationRequestsModel.IsPharmacist;
                medicationRequest.PharmacistNotes = medicationRequestsModel.PharmacistNotes;
                medicationRequest.IsRefill = medicationRequestsModel.IsRefill;
                medicationRequest.RefillCount = medicationRequestsModel.RefillCount;
                medicationRequest.RefillDate = medicationRequestsModel.RefillDate != null ? this.utilService.GetLocalTime(medicationRequestsModel.RefillDate.Value) : medicationRequestsModel.RefillDate;
                medicationRequest.RefillNotes = medicationRequestsModel.RefillNotes;
                medicationRequest.IsActive = true;
                medicationRequest.Modifiedby = "User";
                medicationRequest.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<MedicationRequests>().Update(medicationRequest);
            }
            this.uow.Save();
            medicationRequestsModel.MedicationRequestId = medicationRequest.MedicationRequestId;

            if (medicationRequest.MedicationRequestId > 0 && medicationRequestsModel.medicationRequestItems.Count() > 0)
            {
                var requests = this.uow.GenericRepository<MedicationRequestItems>().Table().Where(x => x.MedicationRequestId == medicationRequest.MedicationRequestId).ToList();

                if (requests.Count() < 1)
                {
                    for (int i = 0; i < medicationRequestsModel.medicationRequestItems.Count(); i++)
                    {
                        MedicationRequestItems requestItem = new MedicationRequestItems();

                        requestItem.MedicationRequestId = medicationRequest.MedicationRequestId;
                        requestItem.DrugName = medicationRequestsModel.medicationRequestItems[i].DrugName;
                        requestItem.MedicationRouteCode = medicationRequestsModel.medicationRequestItems[i].MedicationRouteCode;
                        requestItem.ICDCode = medicationRequestsModel.medicationRequestItems[i].ICDCode;
                        requestItem.TotalQuantity = medicationRequestsModel.medicationRequestItems[i].TotalQuantity;
                        requestItem.NoOfDays = medicationRequestsModel.medicationRequestItems[i].NoOfDays;
                        requestItem.Morning = medicationRequestsModel.medicationRequestItems[i].Morning;
                        requestItem.Brunch = medicationRequestsModel.medicationRequestItems[i].Brunch;
                        requestItem.Noon = medicationRequestsModel.medicationRequestItems[i].Noon;
                        requestItem.Evening = medicationRequestsModel.medicationRequestItems[i].Evening;
                        requestItem.Night = medicationRequestsModel.medicationRequestItems[i].Night;
                        requestItem.Before = medicationRequestsModel.medicationRequestItems[i].Before;
                        requestItem.After = medicationRequestsModel.medicationRequestItems[i].After;
                        requestItem.Start = medicationRequestsModel.medicationRequestItems[i].Start;
                        requestItem.Hold = medicationRequestsModel.medicationRequestItems[i].Hold;
                        requestItem.Continued = medicationRequestsModel.medicationRequestItems[i].Continued;
                        requestItem.DisContinue = medicationRequestsModel.medicationRequestItems[i].DisContinue;
                        requestItem.SIG = medicationRequestsModel.medicationRequestItems[i].SIG;
                        requestItem.IsActive = true;
                        requestItem.Createdby = "User";
                        requestItem.CreatedDate = DateTime.Now;

                        this.uow.GenericRepository<MedicationRequestItems>().Insert(requestItem);
                        medicationRequestsModel.medicationRequestItems[i].MedicationRequestId = requestItem.MedicationRequestId;
                    }
                }
                else
                {
                    foreach (var item in requests)
                    {
                        this.uow.GenericRepository<MedicationRequestItems>().Delete(item);
                    }
                    this.uow.Save();

                    for (int i = 0; i < medicationRequestsModel.medicationRequestItems.Count(); i++)
                    {
                        MedicationRequestItems requestItem = new MedicationRequestItems();

                        requestItem.MedicationRequestId = medicationRequest.MedicationRequestId;
                        requestItem.DrugName = medicationRequestsModel.medicationRequestItems[i].DrugName;
                        requestItem.MedicationRouteCode = medicationRequestsModel.medicationRequestItems[i].MedicationRouteCode;
                        requestItem.ICDCode = medicationRequestsModel.medicationRequestItems[i].ICDCode;
                        requestItem.TotalQuantity = medicationRequestsModel.medicationRequestItems[i].TotalQuantity;
                        requestItem.NoOfDays = medicationRequestsModel.medicationRequestItems[i].NoOfDays;
                        requestItem.Morning = medicationRequestsModel.medicationRequestItems[i].Morning;
                        requestItem.Brunch = medicationRequestsModel.medicationRequestItems[i].Brunch;
                        requestItem.Noon = medicationRequestsModel.medicationRequestItems[i].Noon;
                        requestItem.Evening = medicationRequestsModel.medicationRequestItems[i].Evening;
                        requestItem.Night = medicationRequestsModel.medicationRequestItems[i].Night;
                        requestItem.Before = medicationRequestsModel.medicationRequestItems[i].Before;
                        requestItem.After = medicationRequestsModel.medicationRequestItems[i].After;
                        requestItem.Start = medicationRequestsModel.medicationRequestItems[i].Start;
                        requestItem.Hold = medicationRequestsModel.medicationRequestItems[i].Hold;
                        requestItem.Continued = medicationRequestsModel.medicationRequestItems[i].Continued;
                        requestItem.DisContinue = medicationRequestsModel.medicationRequestItems[i].DisContinue;
                        requestItem.SIG = medicationRequestsModel.medicationRequestItems[i].SIG;
                        requestItem.IsActive = true;
                        requestItem.Createdby = "User";
                        requestItem.CreatedDate = DateTime.Now;

                        this.uow.GenericRepository<MedicationRequestItems>().Insert(requestItem);
                        medicationRequestsModel.medicationRequestItems[i].MedicationRequestId = requestItem.MedicationRequestId;
                    }
                }
                this.uow.Save();

                //MedicationRequestItems requestItem = new MedicationRequestItems();
                //for (int i = 0; i < medicationRequestsModel.medicationRequestItems.Count(); i++)
                //{
                //    requestItem = this.uow.GenericRepository<MedicationRequestItems>().Table().FirstOrDefault(x => x.MedicationRequestItemId == medicationRequestsModel.medicationRequestItems[i].MedicationRequestItemId);
                //    if (requestItem == null)
                //    {
                //        requestItem = new MedicationRequestItems();

                //        requestItem.MedicationRequestId = medicationRequest.MedicationRequestId;
                //        requestItem.DrugName = medicationRequestsModel.medicationRequestItems[i].DrugName;
                //        requestItem.MedicationRouteCode = medicationRequestsModel.medicationRequestItems[i].MedicationRouteCode;
                //        requestItem.ICDCode = medicationRequestsModel.medicationRequestItems[i].ICDCode;
                //        requestItem.TotalQuantity = medicationRequestsModel.medicationRequestItems[i].TotalQuantity;
                //        requestItem.NoOfDays = medicationRequestsModel.medicationRequestItems[i].NoOfDays;
                //        requestItem.Morning = medicationRequestsModel.medicationRequestItems[i].Morning;
                //        requestItem.Brunch = medicationRequestsModel.medicationRequestItems[i].Brunch;
                //        requestItem.Noon = medicationRequestsModel.medicationRequestItems[i].Noon;
                //        requestItem.Evening = medicationRequestsModel.medicationRequestItems[i].Evening;
                //        requestItem.Night = medicationRequestsModel.medicationRequestItems[i].Night;
                //        requestItem.Before = medicationRequestsModel.medicationRequestItems[i].Before;
                //        requestItem.After = medicationRequestsModel.medicationRequestItems[i].After;
                //        requestItem.Start = medicationRequestsModel.medicationRequestItems[i].Start;
                //        requestItem.Hold = medicationRequestsModel.medicationRequestItems[i].Hold;
                //        requestItem.Continued = medicationRequestsModel.medicationRequestItems[i].Continued;
                //        requestItem.DisContinue = medicationRequestsModel.medicationRequestItems[i].DisContinue;
                //        requestItem.SIG = medicationRequestsModel.medicationRequestItems[i].SIG;
                //        requestItem.IsActive = true;
                //        requestItem.Createdby = "User";
                //        requestItem.CreatedDate = DateTime.Now;

                //        this.uow.GenericRepository<MedicationRequestItems>().Insert(requestItem);
                //    }
                //    else
                //    {
                //        requestItem.DrugName = medicationRequestsModel.medicationRequestItems[i].DrugName;
                //        requestItem.MedicationRouteCode = medicationRequestsModel.medicationRequestItems[i].MedicationRouteCode;
                //        requestItem.ICDCode = medicationRequestsModel.medicationRequestItems[i].ICDCode;
                //        requestItem.TotalQuantity = medicationRequestsModel.medicationRequestItems[i].TotalQuantity;
                //        requestItem.NoOfDays = medicationRequestsModel.medicationRequestItems[i].NoOfDays;
                //        requestItem.Morning = medicationRequestsModel.medicationRequestItems[i].Morning;
                //        requestItem.Brunch = medicationRequestsModel.medicationRequestItems[i].Brunch;
                //        requestItem.Noon = medicationRequestsModel.medicationRequestItems[i].Noon;
                //        requestItem.Evening = medicationRequestsModel.medicationRequestItems[i].Evening;
                //        requestItem.Night = medicationRequestsModel.medicationRequestItems[i].Night;
                //        requestItem.Before = medicationRequestsModel.medicationRequestItems[i].Before;
                //        requestItem.After = medicationRequestsModel.medicationRequestItems[i].After;
                //        requestItem.Start = medicationRequestsModel.medicationRequestItems[i].Start;
                //        requestItem.Hold = medicationRequestsModel.medicationRequestItems[i].Hold;
                //        requestItem.Continued = medicationRequestsModel.medicationRequestItems[i].Continued;
                //        requestItem.DisContinue = medicationRequestsModel.medicationRequestItems[i].DisContinue;
                //        requestItem.SIG = medicationRequestsModel.medicationRequestItems[i].SIG;
                //        requestItem.IsActive = true;
                //        requestItem.Modifiedby = "User";
                //        requestItem.ModifiedDate = DateTime.Now;

                //        this.uow.GenericRepository<MedicationRequestItems>().Update(requestItem);
                //    }
                //    this.uow.Save();
                //    medicationRequestsModel.medicationRequestItems[i].MedicationRequestId = requestItem.MedicationRequestId;
                //    medicationRequestsModel.medicationRequestItems[i].MedicationRequestItemId = requestItem.MedicationRequestItemId;
                //}
            }

            return medicationRequestsModel;
        }

        ///// <summary>
        ///// Get Medication Requests for Admission
        ///// </summary>
        ///// <param>int AdmissionId</param>
        ///// <returns>MedicationRequestsModel. if Medication Request for selected Admission Id = success. else = failure</returns>
        public MedicationRequestsModel GetMedicationRequestForAdmission(int admissionId)
        {
            var medicationRequest = (from medRequest in this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.AdmissionID == admissionId)

                                     join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                     on medRequest.AdmissionID equals adm.AdmissionID

                                     join pat in this.uow.GenericRepository<Patient>().Table()
                                     on adm.PatientID equals pat.PatientId

                                     join prov in this.uow.GenericRepository<Provider>().Table()
                                     on adm.AdmittingPhysician equals prov.ProviderID

                                     select new
                                     {
                                         medRequest.MedicationRequestId,
                                         medRequest.AdmissionID,
                                         medRequest.VisitID,
                                         medRequest.TakeRegularMedication,
                                         medRequest.IsHoldRegularMedication,
                                         medRequest.HoldRegularMedicationNotes,
                                         medRequest.IsDiscontinueDrug,
                                         medRequest.DiscontinueDrugNotes,
                                         medRequest.IsPharmacist,
                                         medRequest.PharmacistNotes,
                                         medRequest.IsRefill,
                                         medRequest.RefillCount,
                                         medRequest.RefillDate,
                                         medRequest.RefillNotes,
                                         medRequest.MedicationRequestStatus,
                                         medRequest.RequestedDate,
                                         medRequest.RequestedBy,
                                         adm.AdmissionDateTime,
                                         adm.FacilityID,
                                         adm.AdmittingPhysician,
                                         pat.PatientId,
                                         pat.PatientFirstName,
                                         pat.PatientMiddleName,
                                         pat.PatientLastName,
                                         prov.FirstName,
                                         prov.MiddleName,
                                         prov.LastName

                                     }).AsEnumerable().Select(MRM => new MedicationRequestsModel
                                     {
                                         MedicationRequestId = MRM.MedicationRequestId,
                                         AdmissionID = MRM.AdmissionID,
                                         PatientId = MRM.PatientId,
                                         PatientName = MRM.PatientFirstName + " " + MRM.PatientMiddleName + " " + MRM.PatientLastName,
                                         VisitID = MRM.VisitID,
                                         FacilityId = MRM.FacilityID,
                                         facilityName = MRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == MRM.FacilityID).FacilityName : "",
                                         TakeRegularMedication = MRM.TakeRegularMedication,
                                         IsHoldRegularMedication = MRM.IsHoldRegularMedication,
                                         HoldRegularMedicationNotes = MRM.HoldRegularMedicationNotes,
                                         IsDiscontinueDrug = MRM.IsDiscontinueDrug,
                                         DiscontinueDrugNotes = MRM.DiscontinueDrugNotes,
                                         IsPharmacist = MRM.IsPharmacist,
                                         PharmacistNotes = MRM.PharmacistNotes,
                                         IsRefill = MRM.IsRefill,
                                         RefillCount = MRM.RefillCount,
                                         RefillDate = MRM.RefillDate,
                                         RefillNotes = MRM.RefillNotes,
                                         MedicationRequestStatus = MRM.MedicationRequestStatus,
                                         RequestedDate = MRM.RequestedDate,
                                         RequestedBy = MRM.RequestedBy,
                                         AdmissionDateandTime = MRM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + MRM.AdmissionDateTime.TimeOfDay.ToString(),
                                         medicationRequestItems = this.GetMedicationRequestItems(MRM.MedicationRequestId),
                                         providerId = MRM.AdmittingPhysician,
                                         RequestingPhysician = MRM.FirstName + " " + MRM.MiddleName + " " + MRM.LastName

                                     }).FirstOrDefault();

            return medicationRequest;
        }

        ///// <summary>
        ///// Get Medication Request Items for Medication Request
        ///// </summary>
        ///// <param>int MedicationRequestId</param>
        ///// <returns>List<MedicationRequestItemsModel>. if Medication Request Items for given MedicationRequest Id = success. else = failure</returns>
        public List<MedicationRequestItemsModel> GetMedicationRequestItems(int medicationRequestId)
        {
            var requestItems = (from reqItem in this.uow.GenericRepository<MedicationRequestItems>().Table().Where(x => x.MedicationRequestId == medicationRequestId)

                                join route in this.uow.GenericRepository<MedicationRoute>().Table()
                                on reqItem.MedicationRouteCode equals route.RouteCode

                                select new
                                {
                                    reqItem.MedicationRequestItemId,
                                    reqItem.MedicationRequestId,
                                    reqItem.DrugName,
                                    reqItem.MedicationRouteCode,
                                    reqItem.ICDCode,
                                    reqItem.TotalQuantity,
                                    reqItem.NoOfDays,
                                    reqItem.Morning,
                                    reqItem.Brunch,
                                    reqItem.Noon,
                                    reqItem.Evening,
                                    reqItem.Night,
                                    reqItem.Before,
                                    reqItem.After,
                                    reqItem.Start,
                                    reqItem.Hold,
                                    reqItem.Continued,
                                    reqItem.DisContinue,
                                    reqItem.SIG,
                                    route.RouteDescription

                                }).AsEnumerable().OrderBy(x => x.MedicationRequestItemId).Select(MRIM => new MedicationRequestItemsModel
                                {
                                    MedicationRequestItemId = MRIM.MedicationRequestItemId,
                                    MedicationRequestId = MRIM.MedicationRequestId,
                                    DrugName = MRIM.DrugName,
                                    MedicationRouteCode = MRIM.MedicationRouteCode,
                                    MedicationRouteDesc = MRIM.RouteDescription,
                                    ICDCode = MRIM.ICDCode,
                                    TotalQuantity = MRIM.TotalQuantity,
                                    NoOfDays = MRIM.NoOfDays,
                                    Morning = MRIM.Morning,
                                    Brunch = MRIM.Brunch,
                                    Noon = MRIM.Noon,
                                    Evening = MRIM.Evening,
                                    Night = MRIM.Night,
                                    Before = MRIM.Before,
                                    After = MRIM.After,
                                    Start = MRIM.Start,
                                    Hold = MRIM.Hold,
                                    Continued = MRIM.Continued,
                                    DisContinue = MRIM.DisContinue,
                                    SIG = MRIM.SIG

                                }).ToList();

            return requestItems;
        }

        ///// <summary>
        ///// Delete Medication Request by Id
        ///// </summary>
        ///// <param>int medicationRequestId</param>
        ///// <returns>MedicationRequests. if Medication Request Deleted for given medication request Id = success. else = failure</returns>
        public MedicationRequests CancelMedicationRequestFromDischarge(int medicationRequestId)
        {
            var medRequest = this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.MedicationRequestId == medicationRequestId).FirstOrDefault();

            if (medRequest != null)
            {
                medRequest.IsActive = false;
                medRequest.MedicationRequestStatus = "Cancelled";
                this.uow.GenericRepository<MedicationRequests>().Update(medRequest);

                this.uow.Save();
            }

            return medRequest;
        }

        #endregion

        #region e Lab Request - Discharge

        ///// <summary>
        ///// Get eLab Setup Masters by Search from Discharge
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<eLabSetupMasterModel>. if eLab Setup Masters = success. else = failure</returns>
        public List<eLabSetupMasterModel> GetELabSetupMastersbySearchfromDischarge(string searchKey)
        {
            var eLabSetupMasterList = (from eLabSetup in this.uow.GenericRepository<eLabSetupMaster>().Table().Where(x => x.IsActive != false)

                                       join depart in this.uow.GenericRepository<Departments>().Table()
                                        on eLabSetup.DepartmentID equals depart.DepartmentID

                                       join eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)
                                       on eLabSetup.LabMasterID equals eLab.LabMasterID

                                       select new
                                       {
                                           eLabSetup.SetupMasterID,
                                           eLabSetup.DepartmentID,
                                           eLabSetup.LabMasterID,
                                           eLabSetup.LabSubMasterID,
                                           eLabSetup.Status,
                                           eLabSetup.OrderNo,
                                           eLabSetup.Charges,
                                           LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                           depart.DepartmentDesc

                                       }).AsEnumerable().Select(eLSM => new eLabSetupMasterModel
                                       {
                                           SetupMasterID = eLSM.SetupMasterID,
                                           DepartmentID = eLSM.DepartmentID,
                                           DepartmentDesc = eLSM.DepartmentDesc,
                                           LabMasterID = eLSM.LabMasterID,
                                           LabMasterDesc = eLSM.LabMasterDesc,
                                           LabSubMasterID = eLSM.LabSubMasterID,
                                           LabSubMasterDesc = eLSM.LabSubMasterID > 0 ? this.GetELabSubMasterRecord(eLSM.LabSubMasterID.Value).LabSubMasterDesc : "",
                                           Status = eLSM.Status,
                                           OrderNo = eLSM.OrderNo,
                                           Charges = eLSM.Charges,
                                           setupMasterDesc = eLSM.LabSubMasterID > 0 ? (eLSM.LabMasterDesc + " - " + this.GetELabSubMasterRecord(eLSM.LabSubMasterID.Value).LabSubMasterDesc) : eLSM.LabMasterDesc

                                       }).ToList();

            var setupMasterData = (from data in eLabSetupMasterList
                                   where (searchKey == null ||
                                        (data.setupMasterDesc.ToLower().Trim().Contains(searchKey.ToLower().Trim()))
                                        )
                                   select data).ToList();

            return setupMasterData;
        }

        ///// <summary>
        ///// Get eLab Sub master record by ID
        ///// </summary>
        ///// <param>int eLabSubMasterId</param>
        ///// <returns>eLabSubMasterModel. if eLab Sub record for given eLabMaster ID = success. else = failure</returns>
        public eLabSubMasterModel GetELabSubMasterRecord(int eLabSubMasterId)
        {
            var eLabSubRecord = (from eLabSub in this.uow.GenericRepository<eLabSubMaster>().Table().Where(x => x.LabSubMasterID == eLabSubMasterId)

                                 join eLab in this.uow.GenericRepository<eLabMaster>().Table().Where(x => x.IsActive != false)
                                 on eLabSub.LabMasterId equals eLab.LabMasterID

                                 join depart in this.uow.GenericRepository<Departments>().Table()
                                 on eLabSub.DepartmentID equals depart.DepartmentID

                                 select new
                                 {
                                     eLabSub.LabSubMasterID,
                                     eLabSub.DepartmentID,
                                     eLabSub.LabMasterId,
                                     LabMasterDesc = eLab.MasterLabType + " - " + eLab.LabTypeDesc,
                                     eLabSub.SubMasterLabCode,
                                     eLabSub.SubMasterLabType,
                                     eLabSub.SubMasterLabTypeDesc,
                                     eLabSub.IsActive,
                                     eLabSub.Status,
                                     eLabSub.OrderNo,
                                     eLabSub.Units,
                                     eLabSub.NormalRange,
                                     depart.DepartmentDesc

                                 }).AsEnumerable().OrderBy(x => x.OrderNo).Select(eLSM => new eLabSubMasterModel
                                 {
                                     LabSubMasterID = eLSM.LabSubMasterID,
                                     LabMasterId = eLSM.LabMasterId,
                                     LabMasterDesc = eLSM.LabMasterDesc,
                                     DepartmentID = eLSM.DepartmentID,
                                     DepartmentDesc = eLSM.DepartmentDesc,
                                     SubMasterLabCode = eLSM.SubMasterLabCode,
                                     SubMasterLabType = eLSM.SubMasterLabType,
                                     SubMasterLabTypeDesc = eLSM.SubMasterLabTypeDesc,
                                     IsActive = eLSM.IsActive,
                                     Status = eLSM.Status,
                                     OrderNo = eLSM.OrderNo,
                                     Units = eLSM.Units,
                                     NormalRange = eLSM.NormalRange,
                                     LabSubMasterDesc = (eLSM.SubMasterLabTypeDesc != null && eLSM.SubMasterLabTypeDesc != "") ? eLSM.SubMasterLabType + " - " + eLSM.SubMasterLabTypeDesc : eLSM.SubMasterLabType

                                 }).FirstOrDefault();

            return eLabSubRecord;
        }

        ///// <summary>
        ///// Add or Update e Lab Requests
        ///// </summary>
        ///// <param>(eLabRequestModel elabRequestModel)</param>
        ///// <returns>eLabRequestModel. if Record of eLab Request added or Updated = success. else = failure</returns>
        public eLabRequestModel AddUpdateELabRequestfromDischarge(eLabRequestModel elabRequest)
        {
            var elabRequestData = this.uow.GenericRepository<eLabRequest>().Table().Where(x => x.AdmissionID == elabRequest.AdmissionID).FirstOrDefault();

            if (elabRequestData == null)
            {
                elabRequestData = new eLabRequest();

                elabRequestData.AdmissionID = elabRequest.AdmissionID;
                elabRequestData.VisitID = 0;
                elabRequestData.RequestedDate = DateTime.Now;
                elabRequestData.RequestedBy = elabRequest.RequestedBy;
                elabRequestData.LabOrderStatus = "Requested";
                elabRequestData.IsActive = true;
                elabRequestData.Createddate = DateTime.Now;
                elabRequestData.CreatedBy = "User";

                this.uow.GenericRepository<eLabRequest>().Insert(elabRequestData);
            }
            else
            {
                //elabRequestData.RequestedDate = DateTime.Now;
                elabRequestData.RequestedBy = elabRequest.RequestedBy;
                elabRequestData.IsActive = true;
                elabRequestData.ModifiedDate = DateTime.Now;
                elabRequestData.ModifiedBy = "User";

                this.uow.GenericRepository<eLabRequest>().Update(elabRequestData);
            }
            this.uow.Save();
            elabRequest.LabRequestID = elabRequestData.LabRequestID;

            if (elabRequestData.LabRequestID > 0 && elabRequest.labRequestItems.Count() > 0)
            {
                var labRequestItemRecords = this.uow.GenericRepository<eLabRequestItems>().Table().Where(x => x.LabRequestID == elabRequestData.LabRequestID).ToList();

                if (labRequestItemRecords.Count() == 0)
                {
                    foreach (var data in elabRequest.labRequestItems)
                    {
                        eLabRequestItems requestItem = new eLabRequestItems();

                        requestItem.LabRequestID = elabRequestData.LabRequestID;
                        requestItem.SetupMasterID = data.SetupMasterID;
                        requestItem.UrgencyCode = data.UrgencyCode;
                        requestItem.LabOnDate = data.LabOnDate;
                        requestItem.LabNotes = data.LabNotes;
                        requestItem.IsActive = true;
                        requestItem.Createddate = DateTime.Now;
                        requestItem.CreatedBy = "User";

                        this.uow.GenericRepository<eLabRequestItems>().Insert(requestItem);
                    }
                }
                else
                {
                    foreach (var set in labRequestItemRecords)
                    {
                        this.uow.GenericRepository<eLabRequestItems>().Delete(set);
                    }
                    this.uow.Save();

                    foreach (var data in elabRequest.labRequestItems)
                    {
                        eLabRequestItems requestItem = new eLabRequestItems();

                        requestItem.LabRequestID = elabRequestData.LabRequestID;
                        requestItem.SetupMasterID = data.SetupMasterID;
                        requestItem.UrgencyCode = data.UrgencyCode;
                        requestItem.LabOnDate = data.LabOnDate;
                        requestItem.LabNotes = data.LabNotes;
                        requestItem.IsActive = true;
                        requestItem.Createddate = DateTime.Now;
                        requestItem.CreatedBy = "User";

                        this.uow.GenericRepository<eLabRequestItems>().Insert(requestItem);
                    }
                }
                this.uow.Save();

                //eLabRequestItems requestItem = new eLabRequestItems();

                //foreach (var data in elabRequest.labRequestItems)
                //{
                //    requestItem = this.uow.GenericRepository<eLabRequestItems>().Table().FirstOrDefault(x => x.LabRequestItemsID == data.LabRequestItemsID);

                //    if (requestItem == null)
                //    {
                //        requestItem = new eLabRequestItems();

                //        requestItem.LabRequestID = elabRequestData.LabRequestID;
                //        requestItem.SetupMasterID = data.SetupMasterID;
                //        requestItem.UrgencyCode = data.UrgencyCode;
                //        requestItem.LabOnDate = data.LabOnDate;
                //        requestItem.LabNotes = data.LabNotes;
                //        requestItem.IsActive = true;
                //        requestItem.Createddate = DateTime.Now;
                //        requestItem.CreatedBy = "User";

                //        this.uow.GenericRepository<eLabRequestItems>().Insert(requestItem);
                //    }
                //    else
                //    {
                //        requestItem.SetupMasterID = data.SetupMasterID;
                //        requestItem.UrgencyCode = data.UrgencyCode;
                //        requestItem.LabOnDate = data.LabOnDate;
                //        requestItem.LabNotes = data.LabNotes;
                //        requestItem.IsActive = true;
                //        requestItem.ModifiedDate = DateTime.Now;
                //        requestItem.ModifiedBy = "User";

                //        this.uow.GenericRepository<eLabRequestItems>().Update(requestItem);
                //    }
                //    this.uow.Save();
                //    data.LabRequestID = requestItem.LabRequestID;
                //    data.LabRequestItemsID = requestItem.LabRequestItemsID;
                //}
            }

            return elabRequest;
        }

        ///// <summary>
        ///// Get e Lab Request for Admission
        ///// </summary>
        ///// <param>int admissionId</param>
        ///// <returns>eLabRequestModel. if Record of eLab Request for given AdmissionId = success. else = failure</returns>
        public eLabRequestModel GetELabRequestforAdmission(int admissionId)
        {
            var elabRequest = (from eLabReq in this.uow.GenericRepository<eLabRequest>().Table().
                                Where(x => x.IsActive != false & x.AdmissionID == admissionId)

                               join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                               on eLabReq.AdmissionID equals adm.AdmissionID

                               join pat in this.uow.GenericRepository<Patient>().Table()
                               on adm.PatientID equals pat.PatientId

                               join prov in this.uow.GenericRepository<Provider>().Table()
                               on adm.AdmittingPhysician equals prov.ProviderID

                               select new
                               {
                                   eLabReq.LabRequestID,
                                   eLabReq.AdmissionID,
                                   eLabReq.LabOrderStatus,
                                   eLabReq.RequestedDate,
                                   eLabReq.RequestedBy,
                                   adm.AdmissionNo,
                                   adm.AdmissionDateTime,
                                   adm.PatientID,
                                   adm.FacilityID,
                                   adm.AdmittingPhysician,
                                   pat.PatientFirstName,
                                   pat.PatientMiddleName,
                                   pat.PatientLastName,
                                   prov.FirstName,
                                   prov.MiddleName,
                                   prov.LastName

                               }).AsEnumerable().Select(eLRM => new eLabRequestModel
                               {
                                   LabRequestID = eLRM.LabRequestID,
                                   AdmissionID = eLRM.AdmissionID,
                                   FacilityId = eLRM.FacilityID,
                                   facilityName = eLRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == eLRM.FacilityID).FacilityName : "",
                                   LabOrderStatus = eLRM.LabOrderStatus,
                                   RequestedDate = eLRM.RequestedDate,
                                   RequestedBy = eLRM.RequestedBy,
                                   AdmissionDateandTime = eLRM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + eLRM.AdmissionDateTime.TimeOfDay.ToString(),
                                   AdmissionNo = eLRM.AdmissionNo,
                                   patientId = eLRM.PatientID,
                                   patientName = eLRM.PatientFirstName + " " + eLRM.PatientMiddleName + " " + eLRM.PatientLastName,
                                   providerId = eLRM.AdmittingPhysician,
                                   RequestingPhysician = eLRM.FirstName + " " + eLRM.MiddleName + " " + eLRM.LastName,
                                   labRequestItems = this.GetELabRequestItems(eLRM.LabRequestID)

                               }).FirstOrDefault();

            return elabRequest;
        }

        ///// <summary>
        ///// Get e Lab Requests by Id
        ///// </summary>
        ///// <param>int labRequestId</param>
        ///// <returns>eLabRequestModel. if Record of eLab Request for given Id = success. else = failure</returns>
        public eLabRequestModel GetELabRequestbyIdfromDischarge(int labRequestId)
        {
            var elabRequest = (from eLabReq in this.uow.GenericRepository<eLabRequest>().Table().Where(x => x.LabRequestID == labRequestId)

                               join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                on eLabReq.AdmissionID equals adm.AdmissionID

                               join pat in this.uow.GenericRepository<Patient>().Table()
                               on adm.PatientID equals pat.PatientId

                               join prov in this.uow.GenericRepository<Provider>().Table()
                               on adm.AdmittingPhysician equals prov.ProviderID

                               select new
                               {
                                   eLabReq.LabRequestID,
                                   eLabReq.AdmissionID,
                                   eLabReq.LabOrderStatus,
                                   eLabReq.RequestedDate,
                                   eLabReq.RequestedBy,
                                   adm.AdmissionNo,
                                   adm.AdmissionDateTime,
                                   adm.PatientID,
                                   adm.FacilityID,
                                   adm.AdmittingPhysician,
                                   pat.PatientFirstName,
                                   pat.PatientMiddleName,
                                   pat.PatientLastName,
                                   prov.FirstName,
                                   prov.MiddleName,
                                   prov.LastName

                               }).AsEnumerable().Select(eLRM => new eLabRequestModel
                               {
                                   LabRequestID = eLRM.LabRequestID,
                                   AdmissionID = eLRM.AdmissionID,
                                   FacilityId = eLRM.FacilityID,
                                   facilityName = eLRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == eLRM.FacilityID).FacilityName : "",
                                   LabOrderStatus = eLRM.LabOrderStatus,
                                   RequestedDate = eLRM.RequestedDate,
                                   RequestedBy = eLRM.RequestedBy,
                                   AdmissionDateandTime = eLRM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + eLRM.AdmissionDateTime.TimeOfDay.ToString(),
                                   AdmissionNo = eLRM.AdmissionNo,
                                   patientId = eLRM.PatientID,
                                   patientName = eLRM.PatientFirstName + " " + eLRM.PatientMiddleName + " " + eLRM.PatientLastName,
                                   providerId = eLRM.AdmittingPhysician,
                                   RequestingPhysician = eLRM.FirstName + " " + eLRM.MiddleName + " " + eLRM.LastName,
                                   labRequestItems = this.GetELabRequestItems(eLRM.LabRequestID)

                               }).FirstOrDefault();

            return elabRequest;
        }

        ///// <summary>
        ///// Get e Lab Request Items by Request Id
        ///// </summary>
        ///// <param>int labRequestId</param>
        ///// <returns>List<eLabRequestItemsModel>. if Records of eLab Request Items for given Id = success. else = failure</returns>
        public List<eLabRequestItemsModel> GetELabRequestItems(int labRequestId)
        {
            var requestItems = (from item in this.uow.GenericRepository<eLabRequestItems>().Table().Where(x => x.LabRequestID == labRequestId)

                                join urg in this.uow.GenericRepository<UrgencyType>().Table()
                                on item.UrgencyCode equals urg.UrgencyTypeCode

                                select new
                                {
                                    item.LabRequestItemsID,
                                    item.LabRequestID,
                                    item.SetupMasterID,
                                    item.UrgencyCode,
                                    item.LabOnDate,
                                    item.LabNotes,
                                    urg.UrgencyTypeDescription

                                }).AsEnumerable().OrderBy(x => x.LabRequestItemsID).Select(eLRI => new eLabRequestItemsModel
                                {
                                    LabRequestItemsID = eLRI.LabRequestItemsID,
                                    LabRequestID = eLRI.LabRequestID,
                                    SetupMasterID = eLRI.SetupMasterID,
                                    setupMasterDesc = eLRI.SetupMasterID > 0 ?
                                                    (this.GetELabSetupMastersbySearchfromDischarge(null).FirstOrDefault(x => x.SetupMasterID == eLRI.SetupMasterID) != null ?
                                                    this.GetELabSetupMastersbySearchfromDischarge(null).FirstOrDefault(x => x.SetupMasterID == eLRI.SetupMasterID).setupMasterDesc : "") : "",
                                    UrgencyCode = eLRI.UrgencyCode,
                                    LabOnDate = eLRI.LabOnDate,
                                    LabNotes = eLRI.LabNotes,
                                    urgencyDescription = eLRI.UrgencyTypeDescription

                                }).ToList();

            return requestItems;
        }

        #endregion

        #region File Access

        ///// <summary>
        ///// Get File
        ///// </summary>
        ///// <param>(string Id, string screen)</param>
        ///// <returns>List<string>. if filepath = success. else = failure</returns>
        public List<clsViewFile> GetFile(string Id, string screen)
        {
            string moduleName = "";
            if (string.IsNullOrWhiteSpace(hostingEnvironment.WebRootPath))
            {
                hostingEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            //if (hostingEnvironment.WebRootPath != null)
            moduleName = hostingEnvironment.WebRootPath + "\\Documents\\" + screen + "\\" + Id;

            var fileLoc = this.iTenantMasterService.GetFiles(moduleName);

            return fileLoc;
        }

        ///// <summary>
        ///// Delete
        ///// </summary>
        ///// <param>(string path, string fileName)</param>
        ///// <returns>List<string>. if filepath = success. else = failure</returns>
        public List<string> DeleteFile(string path, string fileName)
        {
            var fileStatus = this.iTenantMasterService.DeleteFile(path, fileName);

            return fileStatus;
        }

        #endregion

        #region SignOff

        ///// <summary>
        ///// Get SigningOffModel with status for Discharge
        ///// </summary>
        ///// <param>SigningOffModel signOffModel</param>
        ///// <returns>Task<SigningOffModel>. if SigningOffModel with status for Discharge = success. else = failure</returns>
        public Task<SigningOffModel> SignoffUpdationforDischarge(SigningOffModel signOffModel)
        {
            var signOffdata = this.utilService.DischargeSignOff(signOffModel);

            return signOffdata;
        }

        #endregion

    }
}
