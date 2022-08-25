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
    public class AdmissionService : IAdmissionService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;

        public AdmissionService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master Data

        ///// <summary>
        ///// Get All TreatmentCodes (CPT codes)
        ///// </summary>
        ///// <param>SearchKey</param>
        ///// <returns>List<TreatmentCode>. if Collection of TreatmentCode for given searchKey = success. else = failure</returns>
        public List<TreatmentCode> GetTreatmentCodes(string searchKey)
        {
            var cptCodes = this.utilService.GetTreatmentCodesbySearch(searchKey);
            return cptCodes;
        }

        ///// <summary>
        ///// Get All Diagnosis Codes (ICD codes)
        ///// </summary>
        ///// <param>SearchKey</param>
        ///// <returns>List<DiagnosisCode>. if Collection of DiagnosisCode for given searchKey = success. else = failure</returns>
        public List<DiagnosisCode> GetDiagnosisCodes(string searchKey)
        {
            var icdCodes = this.utilService.GetAllDiagnosisCodesbySearch(searchKey);
            return icdCodes;
        }

        ///// <summary>
        ///// Get All Specialities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Speciality>. if Collection of Speciality = success. else = failure</returns>
        public List<TenantSpeciality> GetSpecialities()
        {
            var specialities = this.iTenantMasterService.GetTenantSpecialityList();
            return specialities;
        }

        ///// <summary>
        ///// Get All PatientArrivalConditions
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientArrivalCondition>. if Collection of PatientArrivalCondition = success. else = failure</returns>
        public List<PatientArrivalCondition> GetPatientArrivalConditions()
        {
            var conditions = this.iTenantMasterService.GetPatientArrivalConditions();
            return conditions;
        }

        ///// <summary>
        ///// Get All Provider names
        ///// </summary>
        ///// <param>int FacilityId</param>
        ///// <returns>List<string>. if Collection of Provider Names for given FacilityID = success. else = failure</returns>
        public List<string> GetProviderNamesForAdmission(int facilityId)
        {
            List<Provider> providerList = new List<Provider>();
            List<string> providerNames = new List<string>();
            if (facilityId == 0)
            {
                providerList = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false).ToList();
            }
            else
            {
                var provData = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false & x.FacilityId != null & x.FacilityId != "").ToList();

                if (provData.Count() > 0)
                {
                    foreach (var data in provData)
                    {
                        if (data.FacilityId.Contains(","))
                        {
                            if (data.FacilityId.Split(',').Length > 0)
                            {
                                string[] facilityIds = data.FacilityId.Split(',');
                                if (facilityIds.Length > 0)
                                {
                                    for (int i = 0; i < facilityIds.Length; i++)
                                    {
                                        if (facilityIds[i] != null && facilityIds[i] != "" && (Convert.ToInt32(facilityIds[i]) == facilityId))
                                        {
                                            if (!providerList.Contains(data))
                                            {
                                                providerList.Add(data);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (Convert.ToInt32(data.FacilityId) == facilityId)
                            {
                                providerList.Add(data);
                            }
                        }
                    }
                }
            }

            foreach (var prov in providerList)
            {
                string name = " ";

                name = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName;
                if (!providerNames.Contains(name))
                {
                    providerNames.Add(name);
                }
            }
            return providerNames;
        }

        ///// <summary>
        ///// Get providers by facilityID
        ///// </summary>
        ///// <param>int facilityID</param>
        ///// <returns>List<Provider>. if Collection of provider for given FacilityID = success. else = failure</returns>
        public List<Provider> GetProvidersbyFacility(int facilityID)
        {
            List<Provider> providers = new List<Provider>();

            if (facilityID == 0)
            {
                providers = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false).ToList();
            }
            else
            {
                var provData = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false & (x.FacilityId != null & x.FacilityId != "")).ToList();

                if (provData.Count() > 0)
                {
                    foreach (var data in provData)
                    {
                        if (data.FacilityId.Contains(","))
                        {
                            if (data.FacilityId.Split(',').Length > 0)
                            {
                                string[] facilityIds = data.FacilityId.Split(',');
                                if (facilityIds.Length > 0)
                                {
                                    for (int i = 0; i < facilityIds.Length; i++)
                                    {
                                        if (facilityIds[i] != null && facilityIds[i] != "" && (Convert.ToInt32(facilityIds[i]) == facilityID))
                                        {
                                            if (!providers.Contains(data))
                                            {
                                                providers.Add(data);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (Convert.ToInt32(data.FacilityId) == facilityID)
                            {
                                providers.Add(data);
                            }
                        }
                    }
                }
            }

            return providers;
        }

        ///// <summary>
        ///// Get facilities for Admissions
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Facility>. if Collection of facilities = success. else = failure</returns>
        public List<Facility> GetFacilitiesforAdmissions()
        {
            var facList = this.utilService.GetFacilitiesforUser();
            var facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                              join record in facList
                              on fac.FacilityId equals record.FacilityId
                              select fac).ToList();
            return facilities;
        }

        ///// <summary>
        ///// Get All Providers For Admission
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Provider>. if Collection of Provider = success. else = failure</returns>
        public List<Provider> GetAllProvidersForAdmission()
        {
            List<Provider> ProviderList = new List<Provider>();
            var facList = this.utilService.GetFacilitiesforUser();
            var providers = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false).ToList();
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
                            if (!ProviderList.Contains(prov))
                            {
                                ProviderList.Add(prov);
                            }
                        }
                    }
                }
            }

            return ProviderList;
        }

        ///// <summary>
        ///// Get Providers For Admission
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for PreProcedure = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforAdmission(string searchKey)
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

        //// <summary>
        ///// Get All Procedure Type for Admission
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProcedureType>. if Collection of Procedure Type for Admission = success. else = failure</returns>
        public List<ProcedureType> GetProcedureTypesforAdmission()
        {
            var procedureTypes = this.iTenantMasterService.GetAllProcedureTypes();

            return procedureTypes;
        }

        //// <summary>
        ///// Get All Procedures for Admission by search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<Procedures>. if Collection of Procedures for Admission by searchKey = success. else = failure</returns>
        public List<Procedures> GetProceduresforAdmission(string searchKey)
        {
            var procedures = this.iTenantMasterService.GetAllProcedures(searchKey);

            return procedures;
        }

        //// <summary>
        ///// Get Urgency Types Admission
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<UrgencyType>. if Collection of Urgency Types for Admission = success. else = failure</returns>
        public List<UrgencyType> GetUrgencyTypesforAdmission()
        {
            var Urgencies = this.iTenantMasterService.GetUrgencyTypeList();
            return Urgencies;
        }

        //// <summary>
        ///// Get All AdmissionTypes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionType>. if Collection of Admission Types = success. else = failure</returns>
        public List<AdmissionType> GetAdmissionTypesforAdmission()
        {
            var admissionTypes = this.iTenantMasterService.GetAllAdmissionTypes();

            return admissionTypes;
        }

        //// <summary>
        ///// Get All AdmissionStatus
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionStatus>. if Collection of Admission Status = success. else = failure</returns>
        public List<AdmissionStatus> GetAdmissionStatusesforAdmission()
        {
            var admissionStatuses = this.iTenantMasterService.GetAllAdmissionStatus();

            return admissionStatuses;
        }

        //// <summary>
        ///// Get All Patient Arrival by values
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientArrivalBy>. if Collection of Patient Arrival By = success. else = failure</returns>
        public List<PatientArrivalBy> GetPatientArrivalbyValues()
        {
            var arrivalbyValues = this.iTenantMasterService.GetPatientArrivalbyValues();

            return arrivalbyValues;
        }

        ///// <summary>
        ///// Get Admission Number
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<string>. if Admission Number = success. else = failure</returns>
        public List<string> GetAdmissionNumber()
        {
            List<string> admNumbers = new List<string>();

            var ADMNo = this.iTenantMasterService.GetAdmissionNo();

            admNumbers.Add(ADMNo);

            return admNumbers;
        }

        //// <summary>
        ///// Get Visit Number for search
        ///// </summary>
        ///// <param>search Key</param>
        ///// <returns>List<string>. if collection of Visit number = success. else = failure</returns>
        public List<string> GetVisitNumbersbySearch(string searchKey)
        {
            var visitNumbers = this.iTenantMasterService.GetVisitNumbersbySearch(searchKey);
            return visitNumbers;
        }

        ///// <summary> 
        ///// Get All Payment Types for Admission
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PaymentType>. if Collection of Payment Types = success. else = failure</returns>
        public List<PaymentType> GetPaymentTypeListforAdmission()
        {
            var paymentTypes = this.iTenantMasterService.GetAllPaymentTypes();

            return paymentTypes;
        }

        ///// <summary>
        ///// Get Admission Number for search
        ///// </summary>
        ///// <param>search Key</param>
        ///// <returns>List<string> If Admission Number table data collection returns = success. else = failure</returns>
        public List<string> GetAdmissionNumbersbySearch(string searchKey)
        {
            var admNumbers = this.iTenantMasterService.GetAdmissionNumbersbySearch(searchKey);
            return admNumbers;
        }

        #endregion

        #region Procedure Requests for Admission

        ///// <summary>
        ///// Get Procedure Request for Admission
        ///// </summary>
        ///// <param>Nil</param>
        ///// <returns>List<ProcedureRequestModel>. if collection of ProcedureRequestModel for Admission = success. else = failure</returns>
        public List<ProcedureRequestModel> GetProcedureRequestsforAdmission()
        {
            var procedureRequests = (from procRqst in this.uow.GenericRepository<ProcedureRequest>().Table().Where(x => x.ProcedureRequestStatus.ToLower().Trim() == "requested")

                                     join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                     on procRqst.VisitID equals visit.VisitId

                                     join pat in this.uow.GenericRepository<Patient>().Table()
                                     on visit.PatientId equals pat.PatientId

                                     join procType in this.uow.GenericRepository<ProcedureType>().Table()
                                     on procRqst.ProcedureType equals procType.ProcedureTypeID

                                     join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                     on procRqst.AdmittingPhysician equals prov.ProviderID

                                     join urgency in this.uow.GenericRepository<UrgencyType>().Table()
                                     on procRqst.UrgencyID equals urgency.UrgencyTypeId

                                     join admType in this.uow.GenericRepository<AdmissionType>().Table()
                                     on procRqst.AdmissionType equals admType.AdmissionTypeID

                                     join procedure in this.uow.GenericRepository<Procedures>().Table()
                                     on procRqst.ProcedureName equals procedure.ProcedureID

                                     select new
                                     {
                                         procRqst.ProcedureRequestId,
                                         procRqst.VisitID,
                                         pat.PatientId,
                                         pat.PatientFirstName,
                                         pat.PatientMiddleName,
                                         pat.PatientLastName,
                                         procRqst.ProcedureRequestedDate,
                                         procRqst.ProcedureType,
                                         procRqst.AdmittingPhysician,
                                         procRqst.ApproximateDuration,
                                         procRqst.UrgencyID,
                                         procRqst.PreProcedureDiagnosis,
                                         procRqst.ICDCode,
                                         procRqst.PlannedProcedure,
                                         procRqst.ProcedureName,
                                         procRqst.CPTCode,
                                         procRqst.AnesthesiaFitnessRequired,
                                         procRqst.AnesthesiaFitnessRequiredDesc,
                                         procRqst.BloodRequired,
                                         procRqst.BloodRequiredDesc,
                                         procRqst.ContinueMedication,
                                         procRqst.StopMedication,
                                         procRqst.SpecialPreparation,
                                         procRqst.SpecialPreparationNotes,
                                         procRqst.DietInstructions,
                                         procRqst.DietInstructionsNotes,
                                         procRqst.OtherInstructions,
                                         procRqst.OtherInstructionsNotes,
                                         procRqst.Cardiology,
                                         procRqst.Nephrology,
                                         procRqst.Neurology,
                                         procRqst.OtherConsults,
                                         procRqst.OtherConsultsNotes,
                                         procRqst.AdmissionType,
                                         procRqst.PatientExpectedStay,
                                         procRqst.InstructionToPatient,
                                         procRqst.AdditionalInfo,
                                         procRqst.ProcedureRequestStatus,
                                         procRqst.AdmissionStatus,
                                         date = procRqst.ModifiedDate == null ? procRqst.Createddate : procRqst.ModifiedDate,
                                         visit.VisitDate,
                                         visit.VisitNo,
                                         visit.FacilityID,
                                         procType.ProcedureTypeDesc,
                                         providerName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName,
                                         urgency.UrgencyTypeDescription,
                                         admType.AdmissionTypeDesc,
                                         procedure.ProcedureDesc

                                     }).AsEnumerable().OrderByDescending(x => x.date).Select(PRM => new ProcedureRequestModel
                                     {
                                         ProcedureRequestId = PRM.ProcedureRequestId,
                                         VisitID = PRM.VisitID,
                                         VisitNo = PRM.VisitNo,
                                         FacilityId = PRM.FacilityID > 0 ? PRM.FacilityID.Value : 0,
                                         facilityName = PRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PRM.FacilityID).FacilityName : "",
                                         PatientId = PRM.PatientId,
                                         PatientName = PRM.PatientFirstName + " " + PRM.PatientMiddleName + " " + PRM.PatientLastName,
                                         ProcedureRequestedDate = PRM.ProcedureRequestedDate,
                                         ProcedureReqTime = PRM.ProcedureRequestedDate.ToString("hh:mm tt"),
                                         ProcedureType = PRM.ProcedureType,
                                         ProcedureTypeName = PRM.ProcedureTypeDesc,
                                         AdmittingPhysician = PRM.AdmittingPhysician,
                                         AdmittingPhysicianName = PRM.providerName,
                                         ApproximateDuration = PRM.ApproximateDuration,
                                         UrgencyID = PRM.UrgencyID,
                                         UrgencyType = PRM.UrgencyTypeDescription,
                                         PreProcedureDiagnosis = PRM.PreProcedureDiagnosis,
                                         ICDCode = PRM.ICDCode,
                                         PlannedProcedure = PRM.PlannedProcedure,
                                         ProcedureName = PRM.ProcedureName,
                                         ProcedureNameDesc = PRM.ProcedureDesc,
                                         CPTCode = PRM.CPTCode,
                                         AnesthesiaFitnessRequired = PRM.AnesthesiaFitnessRequired,
                                         AnesthesiaFitnessRequiredDesc = PRM.AnesthesiaFitnessRequiredDesc,
                                         BloodRequired = PRM.BloodRequired,
                                         BloodRequiredDesc = PRM.BloodRequiredDesc,
                                         ContinueMedication = PRM.ContinueMedication,
                                         StopMedication = PRM.StopMedication,
                                         SpecialPreparation = PRM.SpecialPreparation,
                                         SpecialPreparationNotes = PRM.SpecialPreparationNotes,
                                         DietInstructions = PRM.DietInstructions,
                                         DietInstructionsNotes = PRM.DietInstructionsNotes,
                                         OtherInstructions = PRM.OtherInstructions,
                                         OtherInstructionsNotes = PRM.OtherInstructionsNotes,
                                         Cardiology = PRM.Cardiology,
                                         Nephrology = PRM.Nephrology,
                                         Neurology = PRM.Neurology,
                                         OtherConsults = PRM.OtherConsults,
                                         OtherConsultsNotes = PRM.OtherConsultsNotes,
                                         AdmissionType = PRM.AdmissionType,
                                         AdmissionTypeName = PRM.AdmissionTypeDesc,
                                         PatientExpectedStay = PRM.PatientExpectedStay,
                                         InstructionToPatient = PRM.InstructionToPatient,
                                         AdditionalInfo = PRM.AdditionalInfo,
                                         ProcedureRequestStatus = PRM.ProcedureRequestStatus,
                                         AdmissionStatus = PRM.AdmissionStatus,
                                         AdmissionStatusDesc = PRM.AdmissionStatus > 0 ? this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == PRM.AdmissionStatus).AdmissionStatusDesc : "",
                                         VisitDateandTime = PRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PRM.VisitDate.TimeOfDay.ToString()

                                     }).ToList();

            List<ProcedureRequestModel> procReqCollection = new List<ProcedureRequestModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (procedureRequests.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        procReqCollection = (from proc in procedureRequests
                                             join fac in facList on proc.FacilityId equals fac.FacilityId
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on proc.AdmittingPhysician equals prov.ProviderID
                                             select proc).ToList();
                    }
                    else
                    {
                        procReqCollection = (from proc in procedureRequests
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on proc.AdmittingPhysician equals prov.ProviderID
                                             select proc).ToList();
                    }
                }
                else
                {
                    procReqCollection = (from proc in procedureRequests
                                         join fac in facList on proc.FacilityId equals fac.FacilityId
                                         select proc).ToList();

                }
            }
            else
            {
                procReqCollection = procedureRequests;
            }
            return procReqCollection;
        }

        ///// <summary>
        ///// Get Procedure Request for Admission By search 
        ///// </summary>
        ///// <param>Nil</param>
        ///// <returns>List<ProcedureRequestModel>. if collection of ProcedureRequestModel for Admission = success. else = failure</returns>
        public List<ProcedureRequestModel> GetProcedureRequestsforAdmissionBySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            var procedureRequests = (from procRqst in this.uow.GenericRepository<ProcedureRequest>().Table().Where(x => x.ProcedureRequestStatus.ToLower().Trim() == "requested")

                                     join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                     on procRqst.VisitID equals visit.VisitId

                                     join pat in this.uow.GenericRepository<Patient>().Table()
                                     on visit.PatientId equals pat.PatientId

                                     join procType in this.uow.GenericRepository<ProcedureType>().Table()
                                     on procRqst.ProcedureType equals procType.ProcedureTypeID

                                     join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                     on procRqst.AdmittingPhysician equals prov.ProviderID

                                     join urgency in this.uow.GenericRepository<UrgencyType>().Table()
                                     on procRqst.UrgencyID equals urgency.UrgencyTypeId

                                     join admType in this.uow.GenericRepository<AdmissionType>().Table()
                                     on procRqst.AdmissionType equals admType.AdmissionTypeID

                                     join procedure in this.uow.GenericRepository<Procedures>().Table()
                                     on procRqst.ProcedureName equals procedure.ProcedureID

                                     where
                                  (Fromdate.Date <= procRqst.ProcedureRequestedDate.Date
                                        && (Todate.Date >= Fromdate.Date && procRqst.ProcedureRequestedDate.Date <= Todate.Date)
                                        && (searchModel.PatientId == 0 || visit.PatientId == searchModel.PatientId)
                                        && (searchModel.ProviderId == 0 || procRqst.AdmittingPhysician == searchModel.ProviderId)
                                        && (searchModel.FacilityId == 0 || visit.FacilityID == searchModel.FacilityId)
                                        && ((searchModel.VisitNo == null || searchModel.VisitNo == "") || visit.VisitNo.ToLower().Trim() == searchModel.VisitNo.ToLower().Trim())
                                        )

                                     select new
                                     {
                                         procRqst.ProcedureRequestId,
                                         procRqst.VisitID,
                                         pat.PatientId,
                                         pat.PatientFirstName,
                                         pat.PatientMiddleName,
                                         pat.PatientLastName,
                                         procRqst.ProcedureRequestedDate,
                                         procRqst.ProcedureType,
                                         procRqst.AdmittingPhysician,
                                         procRqst.ApproximateDuration,
                                         procRqst.UrgencyID,
                                         procRqst.PreProcedureDiagnosis,
                                         procRqst.ICDCode,
                                         procRqst.PlannedProcedure,
                                         procRqst.ProcedureName,
                                         procRqst.CPTCode,
                                         procRqst.AnesthesiaFitnessRequired,
                                         procRqst.AnesthesiaFitnessRequiredDesc,
                                         procRqst.BloodRequired,
                                         procRqst.BloodRequiredDesc,
                                         procRqst.ContinueMedication,
                                         procRqst.StopMedication,
                                         procRqst.SpecialPreparation,
                                         procRqst.SpecialPreparationNotes,
                                         procRqst.DietInstructions,
                                         procRqst.DietInstructionsNotes,
                                         procRqst.OtherInstructions,
                                         procRqst.OtherInstructionsNotes,
                                         procRqst.Cardiology,
                                         procRqst.Nephrology,
                                         procRqst.Neurology,
                                         procRqst.OtherConsults,
                                         procRqst.OtherConsultsNotes,
                                         procRqst.AdmissionType,
                                         procRqst.PatientExpectedStay,
                                         procRqst.InstructionToPatient,
                                         procRqst.AdditionalInfo,
                                         procRqst.ProcedureRequestStatus,
                                         procRqst.AdmissionStatus,
                                         date = procRqst.ModifiedDate == null ? procRqst.Createddate : procRqst.ModifiedDate,
                                         visit.VisitDate,
                                         visit.VisitNo,
                                         visit.FacilityID,
                                         procType.ProcedureTypeDesc,
                                         providerName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName,
                                         urgency.UrgencyTypeDescription,
                                         admType.AdmissionTypeDesc,
                                         procedure.ProcedureDesc

                                     }).AsEnumerable().OrderByDescending(x => x.date).Select(PRM => new ProcedureRequestModel
                                     {
                                         ProcedureRequestId = PRM.ProcedureRequestId,
                                         VisitID = PRM.VisitID,
                                         VisitNo = PRM.VisitNo,
                                         FacilityId = PRM.FacilityID > 0 ? PRM.FacilityID.Value : 0,
                                         facilityName = PRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PRM.FacilityID).FacilityName : "",
                                         PatientId = PRM.PatientId,
                                         PatientName = PRM.PatientFirstName + " " + PRM.PatientMiddleName + " " + PRM.PatientLastName,
                                         ProcedureRequestedDate = PRM.ProcedureRequestedDate,
                                         ProcedureReqTime = PRM.ProcedureRequestedDate.ToString("hh:mm tt"),
                                         ProcedureType = PRM.ProcedureType,
                                         ProcedureTypeName = PRM.ProcedureTypeDesc,
                                         AdmittingPhysician = PRM.AdmittingPhysician,
                                         AdmittingPhysicianName = PRM.providerName,
                                         ApproximateDuration = PRM.ApproximateDuration,
                                         UrgencyID = PRM.UrgencyID,
                                         UrgencyType = PRM.UrgencyTypeDescription,
                                         PreProcedureDiagnosis = PRM.PreProcedureDiagnosis,
                                         ICDCode = PRM.ICDCode,
                                         PlannedProcedure = PRM.PlannedProcedure,
                                         ProcedureName = PRM.ProcedureName,
                                         ProcedureNameDesc = PRM.ProcedureDesc,
                                         CPTCode = PRM.CPTCode,
                                         AnesthesiaFitnessRequired = PRM.AnesthesiaFitnessRequired,
                                         AnesthesiaFitnessRequiredDesc = PRM.AnesthesiaFitnessRequiredDesc,
                                         BloodRequired = PRM.BloodRequired,
                                         BloodRequiredDesc = PRM.BloodRequiredDesc,
                                         ContinueMedication = PRM.ContinueMedication,
                                         StopMedication = PRM.StopMedication,
                                         SpecialPreparation = PRM.SpecialPreparation,
                                         SpecialPreparationNotes = PRM.SpecialPreparationNotes,
                                         DietInstructions = PRM.DietInstructions,
                                         DietInstructionsNotes = PRM.DietInstructionsNotes,
                                         OtherInstructions = PRM.OtherInstructions,
                                         OtherInstructionsNotes = PRM.OtherInstructionsNotes,
                                         Cardiology = PRM.Cardiology,
                                         Nephrology = PRM.Nephrology,
                                         Neurology = PRM.Neurology,
                                         OtherConsults = PRM.OtherConsults,
                                         OtherConsultsNotes = PRM.OtherConsultsNotes,
                                         AdmissionType = PRM.AdmissionType,
                                         AdmissionTypeName = PRM.AdmissionTypeDesc,
                                         PatientExpectedStay = PRM.PatientExpectedStay,
                                         InstructionToPatient = PRM.InstructionToPatient,
                                         AdditionalInfo = PRM.AdditionalInfo,
                                         ProcedureRequestStatus = PRM.ProcedureRequestStatus,
                                         AdmissionStatus = PRM.AdmissionStatus,
                                         AdmissionStatusDesc = PRM.AdmissionStatus > 0 ? this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == PRM.AdmissionStatus).AdmissionStatusDesc : "",
                                         VisitDateandTime = PRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PRM.VisitDate.TimeOfDay.ToString()

                                     }).ToList();

            List<ProcedureRequestModel> procReqCollection = new List<ProcedureRequestModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (procedureRequests.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        procReqCollection = (from proc in procedureRequests
                                             join fac in facList on proc.FacilityId equals fac.FacilityId
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on proc.AdmittingPhysician equals prov.ProviderID
                                             select proc).ToList();
                    }
                    else
                    {
                        procReqCollection = (from proc in procedureRequests
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on proc.AdmittingPhysician equals prov.ProviderID
                                             select proc).ToList();
                    }
                }
                else
                {
                    procReqCollection = (from proc in procedureRequests
                                         join fac in facList on proc.FacilityId equals fac.FacilityId
                                         select proc).ToList();

                }
            }
            else
            {
                procReqCollection = procedureRequests;
            }
            return procReqCollection;
        }

        ///// <summary>
        ///// Get Counts of Procedure Requests
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> If counts of Procedure Requests = success. else = failure</returns>
        public AdmissionCountModel GetProcedureRequestCounts()
        {
            AdmissionCountModel procCountModel = new AdmissionCountModel();
            var procedureRequest = this.GetProcedureRequestsforAdmission().Where(x => x.ProcedureRequestedDate.Date == DateTime.Now.Date).ToList();

            procCountModel.TodayProcedureRequestCount = procedureRequest.Count();

            return procCountModel;
        }

        ///// <summary>
        ///// Get Procedure Request for Patient
        ///// </summary>
        ///// <param>(int patientId)</param>
        ///// <returns>List<ProcedureRequestModel>. if collection of ProcedureRequestModel for Patient = success. else = failure</returns>
        public List<ProcedureRequestModel> GetProcedureRequestsforPatient(int patientId)
        {
            var procedureRequests = (from procRqst in this.uow.GenericRepository<ProcedureRequest>().Table().Where(x => x.ProcedureRequestStatus.ToLower().Trim() == "requested")

                                     join visit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.PatientId == patientId)
                                     on procRqst.VisitID equals visit.VisitId

                                     join pat in this.uow.GenericRepository<Patient>().Table()
                                     on visit.PatientId equals pat.PatientId

                                     join procType in this.uow.GenericRepository<ProcedureType>().Table()
                                     on procRqst.ProcedureType equals procType.ProcedureTypeID

                                     join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                     on procRqst.AdmittingPhysician equals prov.ProviderID

                                     join urgency in this.uow.GenericRepository<UrgencyType>().Table()
                                     on procRqst.UrgencyID equals urgency.UrgencyTypeId

                                     join admType in this.uow.GenericRepository<AdmissionType>().Table()
                                     on procRqst.AdmissionType equals admType.AdmissionTypeID

                                     join procedure in this.uow.GenericRepository<Procedures>().Table()
                                     on procRqst.ProcedureName equals procedure.ProcedureID

                                     select new
                                     {
                                         procRqst.ProcedureRequestId,
                                         procRqst.VisitID,
                                         pat.PatientId,
                                         procRqst.ProcedureRequestedDate,
                                         procRqst.ProcedureType,
                                         procRqst.AdmittingPhysician,
                                         procRqst.ApproximateDuration,
                                         procRqst.UrgencyID,
                                         procRqst.PreProcedureDiagnosis,
                                         procRqst.ICDCode,
                                         procRqst.PlannedProcedure,
                                         procRqst.ProcedureName,
                                         procRqst.CPTCode,
                                         procRqst.AnesthesiaFitnessRequired,
                                         procRqst.AnesthesiaFitnessRequiredDesc,
                                         procRqst.BloodRequired,
                                         procRqst.BloodRequiredDesc,
                                         procRqst.ContinueMedication,
                                         procRqst.StopMedication,
                                         procRqst.SpecialPreparation,
                                         procRqst.SpecialPreparationNotes,
                                         procRqst.DietInstructions,
                                         procRqst.DietInstructionsNotes,
                                         procRqst.OtherInstructions,
                                         procRqst.OtherInstructionsNotes,
                                         procRqst.Cardiology,
                                         procRqst.Nephrology,
                                         procRqst.Neurology,
                                         procRqst.OtherConsults,
                                         procRqst.OtherConsultsNotes,
                                         procRqst.AdmissionType,
                                         procRqst.PatientExpectedStay,
                                         procRqst.InstructionToPatient,
                                         procRqst.AdditionalInfo,
                                         procRqst.ProcedureRequestStatus,
                                         procRqst.AdmissionStatus,
                                         date = procRqst.ModifiedDate == null ? procRqst.Createddate : procRqst.ModifiedDate,
                                         visit.VisitDate,
                                         visit.VisitNo,
                                         visit.FacilityID,
                                         procType.ProcedureTypeDesc,
                                         providerName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName,
                                         urgency.UrgencyTypeDescription,
                                         admType.AdmissionTypeDesc,
                                         procedure.ProcedureDesc

                                     }).AsEnumerable().OrderByDescending(x => x.date).Select(PRM => new ProcedureRequestModel
                                     {
                                         ProcedureRequestId = PRM.ProcedureRequestId,
                                         VisitID = PRM.VisitID,
                                         VisitNo = PRM.VisitNo,
                                         FacilityId = PRM.FacilityID > 0 ? PRM.FacilityID.Value : 0,
                                         facilityName = PRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PRM.FacilityID).FacilityName : "",
                                         PatientId = PRM.PatientId,
                                         ProcedureRequestedDate = PRM.ProcedureRequestedDate,
                                         ProcedureReqTime = PRM.ProcedureRequestedDate.ToString("hh:mm tt"),
                                         ProcedureType = PRM.ProcedureType,
                                         ProcedureTypeName = PRM.ProcedureTypeDesc,
                                         AdmittingPhysician = PRM.AdmittingPhysician,
                                         AdmittingPhysicianName = PRM.providerName,
                                         ApproximateDuration = PRM.ApproximateDuration,
                                         UrgencyID = PRM.UrgencyID,
                                         UrgencyType = PRM.UrgencyTypeDescription,
                                         PreProcedureDiagnosis = PRM.PreProcedureDiagnosis,
                                         ICDCode = PRM.ICDCode,
                                         PlannedProcedure = PRM.PlannedProcedure,
                                         ProcedureName = PRM.ProcedureName,
                                         ProcedureNameDesc = PRM.ProcedureDesc,
                                         CPTCode = PRM.CPTCode,
                                         AnesthesiaFitnessRequired = PRM.AnesthesiaFitnessRequired,
                                         AnesthesiaFitnessRequiredDesc = PRM.AnesthesiaFitnessRequiredDesc,
                                         BloodRequired = PRM.BloodRequired,
                                         BloodRequiredDesc = PRM.BloodRequiredDesc,
                                         ContinueMedication = PRM.ContinueMedication,
                                         StopMedication = PRM.StopMedication,
                                         SpecialPreparation = PRM.SpecialPreparation,
                                         SpecialPreparationNotes = PRM.SpecialPreparationNotes,
                                         DietInstructions = PRM.DietInstructions,
                                         DietInstructionsNotes = PRM.DietInstructionsNotes,
                                         OtherInstructions = PRM.OtherInstructions,
                                         OtherInstructionsNotes = PRM.OtherInstructionsNotes,
                                         Cardiology = PRM.Cardiology,
                                         Nephrology = PRM.Nephrology,
                                         Neurology = PRM.Neurology,
                                         OtherConsults = PRM.OtherConsults,
                                         OtherConsultsNotes = PRM.OtherConsultsNotes,
                                         AdmissionType = PRM.AdmissionType,
                                         AdmissionTypeName = PRM.AdmissionTypeDesc,
                                         PatientExpectedStay = PRM.PatientExpectedStay,
                                         InstructionToPatient = PRM.InstructionToPatient,
                                         AdditionalInfo = PRM.AdditionalInfo,
                                         ProcedureRequestStatus = PRM.ProcedureRequestStatus,
                                         AdmissionStatus = PRM.AdmissionStatus,
                                         AdmissionStatusDesc = PRM.AdmissionStatus > 0 ? this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == PRM.AdmissionStatus).AdmissionStatusDesc : "",
                                         VisitDateandTime = PRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PRM.VisitDate.TimeOfDay.ToString()

                                     }).ToList();

            List<ProcedureRequestModel> procReqCollection = new List<ProcedureRequestModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (procedureRequests.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        procReqCollection = (from proc in procedureRequests
                                             join fac in facList on proc.FacilityId equals fac.FacilityId
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on proc.AdmittingPhysician equals prov.ProviderID
                                             select proc).ToList();
                    }
                    else
                    {
                        procReqCollection = (from proc in procedureRequests
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on proc.AdmittingPhysician equals prov.ProviderID
                                             select proc).ToList();
                    }
                }
                else
                {
                    procReqCollection = (from proc in procedureRequests
                                         join fac in facList on proc.FacilityId equals fac.FacilityId
                                         select proc).ToList();
                }
            }
            else
            {
                procReqCollection = procedureRequests;
            }
            return procReqCollection;
        }

        ///// <summary>
        ///// Get Procedure Request by Id
        ///// </summary>
        ///// <param>(int procedureRequestId)</param>
        ///// <returns>ProcedureRequestModel. if set of ProcedureRequestModel for given procedureRequestId = success. else = failure</returns>
        public ProcedureRequestModel GetProcedureRequestbyId(int procedureRequestId)
        {
            var procedureRequest = (from procRqst in this.uow.GenericRepository<ProcedureRequest>().Table().Where(x => x.ProcedureRequestId == procedureRequestId)

                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on procRqst.VisitID equals visit.VisitId

                                    join pat in this.uow.GenericRepository<Patient>().Table()
                                    on visit.PatientId equals pat.PatientId

                                    join procType in this.uow.GenericRepository<ProcedureType>().Table()
                                    on procRqst.ProcedureType equals procType.ProcedureTypeID

                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                    on procRqst.AdmittingPhysician equals prov.ProviderID

                                    join urgency in this.uow.GenericRepository<UrgencyType>().Table()
                                    on procRqst.UrgencyID equals urgency.UrgencyTypeId

                                    join admType in this.uow.GenericRepository<AdmissionType>().Table()
                                    on procRqst.AdmissionType equals admType.AdmissionTypeID

                                    join procedure in this.uow.GenericRepository<Procedures>().Table()
                                    on procRqst.ProcedureName equals procedure.ProcedureID

                                    select new
                                    {
                                        procRqst.ProcedureRequestId,
                                        procRqst.VisitID,
                                        pat.PatientId,
                                        procRqst.ProcedureRequestedDate,
                                        procRqst.ProcedureType,
                                        procRqst.AdmittingPhysician,
                                        procRqst.ApproximateDuration,
                                        procRqst.UrgencyID,
                                        procRqst.PreProcedureDiagnosis,
                                        procRqst.ICDCode,
                                        procRqst.PlannedProcedure,
                                        procRqst.ProcedureName,
                                        procRqst.CPTCode,
                                        procRqst.AnesthesiaFitnessRequired,
                                        procRqst.AnesthesiaFitnessRequiredDesc,
                                        procRqst.BloodRequired,
                                        procRqst.BloodRequiredDesc,
                                        procRqst.ContinueMedication,
                                        procRqst.StopMedication,
                                        procRqst.SpecialPreparation,
                                        procRqst.SpecialPreparationNotes,
                                        procRqst.DietInstructions,
                                        procRqst.DietInstructionsNotes,
                                        procRqst.OtherInstructions,
                                        procRqst.OtherInstructionsNotes,
                                        procRqst.Cardiology,
                                        procRqst.Nephrology,
                                        procRqst.Neurology,
                                        procRqst.OtherConsults,
                                        procRqst.OtherConsultsNotes,
                                        procRqst.AdmissionType,
                                        procRqst.PatientExpectedStay,
                                        procRqst.InstructionToPatient,
                                        procRqst.AdditionalInfo,
                                        procRqst.ProcedureRequestStatus,
                                        procRqst.AdmissionStatus,
                                        date = procRqst.ModifiedDate == null ? procRqst.Createddate : procRqst.ModifiedDate,
                                        visit.VisitDate,
                                        visit.VisitNo,
                                        visit.FacilityID,
                                        procType.ProcedureTypeDesc,
                                        providerName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName,
                                        urgency.UrgencyTypeDescription,
                                        admType.AdmissionTypeDesc,
                                        procedure.ProcedureDesc

                                    }).AsEnumerable().Select(PRM => new ProcedureRequestModel
                                    {
                                        ProcedureRequestId = PRM.ProcedureRequestId,
                                        VisitID = PRM.VisitID,
                                        VisitNo = PRM.VisitNo,
                                        FacilityId = PRM.FacilityID > 0 ? PRM.FacilityID.Value : 0,
                                        facilityName = PRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PRM.FacilityID).FacilityName : "",
                                        PatientId = PRM.PatientId,
                                        ProcedureRequestedDate = PRM.ProcedureRequestedDate,
                                        ProcedureReqTime = PRM.ProcedureRequestedDate.ToString("hh:mm tt"),
                                        ProcedureType = PRM.ProcedureType,
                                        ProcedureTypeName = PRM.ProcedureTypeDesc,
                                        AdmittingPhysician = PRM.AdmittingPhysician,
                                        AdmittingPhysicianName = PRM.providerName,
                                        ApproximateDuration = PRM.ApproximateDuration,
                                        UrgencyID = PRM.UrgencyID,
                                        UrgencyType = PRM.UrgencyTypeDescription,
                                        PreProcedureDiagnosis = PRM.PreProcedureDiagnosis,
                                        ICDCode = PRM.ICDCode,
                                        PlannedProcedure = PRM.PlannedProcedure,
                                        ProcedureName = PRM.ProcedureName,
                                        ProcedureNameDesc = PRM.ProcedureDesc,
                                        CPTCode = PRM.CPTCode,
                                        AnesthesiaFitnessRequired = PRM.AnesthesiaFitnessRequired,
                                        AnesthesiaFitnessRequiredDesc = PRM.AnesthesiaFitnessRequiredDesc,
                                        BloodRequired = PRM.BloodRequired,
                                        BloodRequiredDesc = PRM.BloodRequiredDesc,
                                        ContinueMedication = PRM.ContinueMedication,
                                        StopMedication = PRM.StopMedication,
                                        SpecialPreparation = PRM.SpecialPreparation,
                                        SpecialPreparationNotes = PRM.SpecialPreparationNotes,
                                        DietInstructions = PRM.DietInstructions,
                                        DietInstructionsNotes = PRM.DietInstructionsNotes,
                                        OtherInstructions = PRM.OtherInstructions,
                                        OtherInstructionsNotes = PRM.OtherInstructionsNotes,
                                        Cardiology = PRM.Cardiology,
                                        Nephrology = PRM.Nephrology,
                                        Neurology = PRM.Neurology,
                                        OtherConsults = PRM.OtherConsults,
                                        OtherConsultsNotes = PRM.OtherConsultsNotes,
                                        AdmissionType = PRM.AdmissionType,
                                        AdmissionTypeName = PRM.AdmissionTypeDesc,
                                        PatientExpectedStay = PRM.PatientExpectedStay,
                                        InstructionToPatient = PRM.InstructionToPatient,
                                        AdditionalInfo = PRM.AdditionalInfo,
                                        ProcedureRequestStatus = PRM.ProcedureRequestStatus,
                                        AdmissionStatus = PRM.AdmissionStatus,
                                        AdmissionStatusDesc = PRM.AdmissionStatus > 0 ? this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == PRM.AdmissionStatus).AdmissionStatusDesc : "",
                                        VisitDateandTime = PRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PRM.VisitDate.TimeOfDay.ToString()

                                    }).FirstOrDefault();

            return procedureRequest;
        }

        ///// <summary>
        ///// Confirm Procedure Request status
        ///// </summary>
        ///// <param>(int procedureRequestId)</param>
        ///// <returns>ProcedureRequest. if record of ProcedureRequest by ID = success. else = failure</returns>
        public ProcedureRequest ConfirmProcedureStatus(int procedureRequestId)
        {
            var procedureRequest = this.uow.GenericRepository<ProcedureRequest>().Table().Where(x => x.ProcedureRequestId == procedureRequestId).SingleOrDefault();

            if (procedureRequest != null)
            {
                procedureRequest.ProcedureRequestStatus = "Confirmed";

                this.uow.GenericRepository<ProcedureRequest>().Update(procedureRequest);

                this.uow.Save();
            }

            return procedureRequest;
        }

        #endregion

        #region Admissions

        ///// <summary>
        ///// Add or Update Admission
        ///// </summary>
        ///// <param>(AdmissionsModel admissionsModel)</param>
        ///// <returns>AdmissionsModel. if set of AdmissionsModel data saved in DB = success. else = failure</returns>
        public AdmissionsModel AddUpdateAdmissions(AdmissionsModel admissionsModel)
        {
            var admission = this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionNo == admissionsModel.AdmissionNo).FirstOrDefault();

            var procedureRequest = (from request in this.uow.GenericRepository<ProcedureRequest>().Table().Where(x => x.IsActive != false)

                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on request.VisitID equals visit.VisitId

                                    join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == admissionsModel.PatientID)
                                    on visit.PatientId equals pat.PatientId

                                    select request).FirstOrDefault();

            var getADMCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                where common.CommonMasterCode.ToLower().Trim() == "admno"
                                select common).FirstOrDefault();

            var admCheck = this.uow.GenericRepository<Admissions>().Table()
                            .Where(x => x.AdmissionNo.ToLower().Trim() == getADMCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            if (admission == null)
            {
                admission = new Admissions();

                admission.PatientID = admissionsModel.PatientID;
                admission.FacilityID = admissionsModel.FacilityID;
                admission.AdmissionDateTime = this.utilService.GetLocalTime(admissionsModel.AdmissionDateTime);
                admission.ProcedureRequestId = procedureRequest != null ? procedureRequest.ProcedureRequestId : 0;
                admission.AdmissionNo = admCheck != null ? admissionsModel.AdmissionNo : getADMCommon.CommonMasterDesc;
                admission.AdmissionOrigin = admissionsModel.AdmissionOrigin;
                admission.AdmissionType = admissionsModel.AdmissionType;
                admission.AdmittingPhysician = admissionsModel.AdmittingPhysician;
                admission.SpecialityID = admissionsModel.SpecialityID;
                admission.AdmittingReason = admissionsModel.AdmittingReason;
                admission.PreProcedureDiagnosis = admissionsModel.PreProcedureDiagnosis;
                admission.ICDCode = admissionsModel.ICDCode;
                admission.ProcedureType = admissionsModel.ProcedureType;
                admission.PlannedProcedure = admissionsModel.PlannedProcedure;
                admission.ProcedureName = admissionsModel.ProcedureName;
                admission.CPTCode = admissionsModel.CPTCode;
                admission.UrgencyID = admissionsModel.UrgencyID;
                admission.PatientArrivalCondition = admissionsModel.PatientArrivalCondition;
                admission.PatientArrivalBy = admissionsModel.PatientArrivalBy;
                admission.PatientExpectedStay = admissionsModel.PatientExpectedStay;
                admission.AnesthesiaFitnessRequired = admissionsModel.AnesthesiaFitnessRequired;
                admission.AnesthesiaFitnessRequiredDesc = admissionsModel.AnesthesiaFitnessRequiredDesc;
                admission.BloodRequired = admissionsModel.BloodRequired;
                admission.BloodRequiredDesc = admissionsModel.BloodRequiredDesc;
                admission.ContinueMedication = admissionsModel.ContinueMedication;
                admission.InitialAdmissionStatus = admissionsModel.InitialAdmissionStatus;
                admission.InstructionToPatient = admissionsModel.InstructionToPatient;
                admission.AccompaniedBy = admissionsModel.AccompaniedBy;
                admission.WardAndBed = admissionsModel.WardAndBed;
                admission.AdditionalInfo = admissionsModel.AdditionalInfo;
                admission.IsActive = true;
                admission.Createddate = DateTime.Now;
                admission.CreatedBy = "User";

                this.uow.GenericRepository<Admissions>().Insert(admission);

                this.uow.Save();

                getADMCommon.CurrentIncNo = admission.AdmissionNo;
                this.uow.GenericRepository<CommonMaster>().Update(getADMCommon);
                this.uow.Save();
            }
            else
            {
                admission.AdmissionDateTime = this.utilService.GetLocalTime(admissionsModel.AdmissionDateTime);
                admission.ProcedureRequestId = procedureRequest != null ? procedureRequest.ProcedureRequestId : 0;
                admission.AdmissionOrigin = admissionsModel.AdmissionOrigin;
                admission.AdmissionType = admissionsModel.AdmissionType;
                admission.AdmittingPhysician = admissionsModel.AdmittingPhysician;
                admission.SpecialityID = admissionsModel.SpecialityID;
                admission.AdmittingReason = admissionsModel.AdmittingReason;
                admission.PreProcedureDiagnosis = admissionsModel.PreProcedureDiagnosis;
                admission.ICDCode = admissionsModel.ICDCode;
                admission.ProcedureType = admissionsModel.ProcedureType;
                admission.PlannedProcedure = admissionsModel.PlannedProcedure;
                admission.ProcedureName = admissionsModel.ProcedureName;
                admission.CPTCode = admissionsModel.CPTCode;
                admission.UrgencyID = admissionsModel.UrgencyID;
                admission.PatientArrivalCondition = admissionsModel.PatientArrivalCondition;
                admission.PatientArrivalBy = admissionsModel.PatientArrivalBy;
                admission.PatientExpectedStay = admissionsModel.PatientExpectedStay;
                admission.AnesthesiaFitnessRequired = admissionsModel.AnesthesiaFitnessRequired;
                admission.AnesthesiaFitnessRequiredDesc = admissionsModel.AnesthesiaFitnessRequiredDesc;
                admission.BloodRequired = admissionsModel.BloodRequired;
                admission.BloodRequiredDesc = admissionsModel.BloodRequiredDesc;
                admission.ContinueMedication = admissionsModel.ContinueMedication;
                admission.InitialAdmissionStatus = admissionsModel.InitialAdmissionStatus;
                admission.InstructionToPatient = admissionsModel.InstructionToPatient;
                admission.AccompaniedBy = admissionsModel.AccompaniedBy;
                admission.WardAndBed = admissionsModel.WardAndBed;
                admission.AdditionalInfo = admissionsModel.AdditionalInfo;
                admission.IsActive = true;
                admission.ModifiedDate = DateTime.Now;
                admission.ModifiedBy = "User";

                this.uow.GenericRepository<Admissions>().Update(admission);
                this.uow.Save();
            }

            admissionsModel.AdmissionID = admission.AdmissionID;

            if (admissionsModel.AdmissionID > 0)
            {
                PreProcedureModel preProcedure = new PreProcedureModel();

                preProcedure.AdmissionID = admissionsModel.AdmissionID;
                preProcedure.ProcedureDate = DateTime.Now;
                preProcedure.ScheduleApprovedBy = admissionsModel.AdmittingPhysician;
                preProcedure.ProcedureStatus = "Admitted";
                preProcedure.CancelReason = "";

                this.AddPreProcedure(preProcedure);
            }

            return admissionsModel;
        }

        ///// <summary>
        ///// Add or Update Pre Procedure Record after admission
        ///// </summary>
        ///// <param>PreProcedureModel preProcedureModel</param>
        ///// <returns>PreProcedureModel. if PreProcedureModel with ID after add or update = success. else = failure</returns>
        public PreProcedureModel AddPreProcedure(PreProcedureModel preProcedureModel)
        {
            var preProcedureRecord = this.uow.GenericRepository<PreProcedure>().Table().Where(x => x.AdmissionID == preProcedureModel.AdmissionID).FirstOrDefault();

            if (preProcedureRecord == null)
            {
                preProcedureRecord = new PreProcedure();

                preProcedureRecord.AdmissionID = preProcedureModel.AdmissionID;
                preProcedureRecord.ProcedureDate = preProcedureModel.ProcedureDate;
                preProcedureRecord.ScheduleApprovedBy = preProcedureModel.ScheduleApprovedBy;
                preProcedureRecord.ProcedureStatus = preProcedureModel.ProcedureStatus;
                preProcedureRecord.CancelReason = preProcedureModel.CancelReason;
                preProcedureRecord.Createddate = DateTime.Now;
                preProcedureRecord.CreatedBy = "User";

                this.uow.GenericRepository<PreProcedure>().Insert(preProcedureRecord);
            }
            else
            {
                preProcedureRecord.ProcedureDate = this.utilService.GetLocalTime(preProcedureModel.ProcedureDate);
                preProcedureRecord.ScheduleApprovedBy = preProcedureModel.ScheduleApprovedBy;
                preProcedureRecord.ProcedureStatus = preProcedureModel.ProcedureStatus;
                preProcedureRecord.CancelReason = preProcedureModel.CancelReason;
                preProcedureRecord.ModifiedDate = DateTime.Now;
                preProcedureRecord.ModifiedBy = "User";

                this.uow.GenericRepository<PreProcedure>().Update(preProcedureRecord);
            }
            this.uow.Save();
            preProcedureModel.PreProcedureID = preProcedureRecord.PreProcedureID;

            return preProcedureModel;
        }

        ///// <summary>
        ///// Get All Admissions
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionsModel>. if Collection of Admissions = success. else = failure</returns>
        public List<AdmissionsModel> GetAllAdmissions()
        {
            var admissionList = (from admission in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on admission.PatientID equals pat.PatientId
                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                 on admission.AdmittingPhysician equals prov.ProviderID

                                 select new
                                 {
                                     admission.AdmissionID,
                                     admission.FacilityID,
                                     admission.PatientID,
                                     admission.ProcedureRequestId,
                                     admission.AdmissionDateTime,
                                     admission.AdmissionNo,
                                     admission.AdmissionOrigin,
                                     admission.AdmissionType,
                                     admission.AdmittingPhysician,
                                     admission.SpecialityID,
                                     admission.AdmittingReason,
                                     admission.PreProcedureDiagnosis,
                                     admission.ICDCode,
                                     admission.ProcedureType,
                                     admission.PlannedProcedure,
                                     admission.ProcedureName,
                                     admission.CPTCode,
                                     admission.UrgencyID,
                                     admission.PatientArrivalCondition,
                                     admission.PatientArrivalBy,
                                     admission.PatientExpectedStay,
                                     admission.AnesthesiaFitnessRequired,
                                     admission.AnesthesiaFitnessRequiredDesc,
                                     admission.BloodRequired,
                                     admission.BloodRequiredDesc,
                                     admission.ContinueMedication,
                                     admission.InitialAdmissionStatus,
                                     admission.InstructionToPatient,
                                     admission.AccompaniedBy,
                                     admission.WardAndBed,
                                     admission.AdditionalInfo,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     pat.PrimaryContactNumber,
                                     pat.MRNo,
                                     prov.FirstName,
                                     prov.MiddleName,
                                     prov.LastName

                                 }).AsEnumerable().OrderByDescending(x => x.AdmissionDateTime).Select(AM => new AdmissionsModel
                                 {
                                     AdmissionID = AM.AdmissionID,
                                     FacilityID = AM.FacilityID,
                                     FacilityName = AM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == AM.FacilityID).FirstOrDefault().FacilityName : "",
                                     PatientID = AM.PatientID,
                                     ProcedureRequestId = AM.ProcedureRequestId,
                                     procedureRequestData = this.GetProcedureRequestbyId(AM.ProcedureRequestId),
                                     PatientName = AM.PatientFirstName + " " + AM.PatientMiddleName + " " + AM.PatientLastName,
                                     PatientContactNumber = AM.PrimaryContactNumber,
                                     MRNumber = AM.MRNo,
                                     AdmissionDateTime = AM.AdmissionDateTime,
                                     AdmissionNo = AM.AdmissionNo,
                                     AdmissionOrigin = AM.AdmissionOrigin,
                                     AdmissionType = AM.AdmissionType,
                                     admissionTypeDesc = AM.AdmissionType > 0 ? this.uow.GenericRepository<AdmissionType>().Table().FirstOrDefault(x => x.AdmissionTypeID == AM.AdmissionType).AdmissionTypeDesc : "",
                                     AdmittingPhysician = AM.AdmittingPhysician,
                                     ProviderName = AM.FirstName + " " + AM.MiddleName + " " + AM.LastName,
                                     SpecialityID = AM.SpecialityID,
                                     specialityName = AM.SpecialityID > 0 ? this.uow.GenericRepository<TenantSpeciality>().Table().FirstOrDefault(x => x.TenantSpecialityID == AM.SpecialityID).TenantSpecialityDescription : "",
                                     AdmittingReason = AM.AdmittingReason,
                                     PreProcedureDiagnosis = AM.PreProcedureDiagnosis,
                                     ICDCode = AM.ICDCode,
                                     ProcedureType = AM.ProcedureType,
                                     ProcedureTypeDesc = AM.ProcedureType > 0 ? this.uow.GenericRepository<ProcedureType>().Table().FirstOrDefault(x => x.ProcedureTypeID == AM.ProcedureType).ProcedureTypeDesc : "",
                                     PlannedProcedure = AM.PlannedProcedure,
                                     ProcedureName = AM.ProcedureName,
                                     ProcedureDesc = (AM.ProcedureName != 0 && AM.ProcedureName != null) ? this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == AM.ProcedureName).ProcedureDesc : "",
                                     CPTCode = AM.CPTCode,
                                     UrgencyID = AM.UrgencyID,
                                     UrgencyType = AM.UrgencyID > 0 ? this.uow.GenericRepository<UrgencyType>().Table().FirstOrDefault(x => x.UrgencyTypeId == AM.UrgencyID).UrgencyTypeDescription : "",
                                     PatientArrivalCondition = AM.PatientArrivalCondition,
                                     arrivalCondition = AM.PatientArrivalCondition > 0 ? this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == AM.PatientArrivalCondition).PatientArrivalconditionDescription : "",
                                     PatientArrivalBy = AM.PatientArrivalBy,
                                     arrivalby = AM.PatientArrivalBy > 0 ? this.uow.GenericRepository<PatientArrivalBy>().Table().FirstOrDefault(x => x.PABID == AM.PatientArrivalBy).PABDesc : "",
                                     PatientExpectedStay = AM.PatientExpectedStay,
                                     AnesthesiaFitnessRequired = AM.AnesthesiaFitnessRequired,
                                     AnesthesiaFitnessRequiredDesc = AM.AnesthesiaFitnessRequiredDesc,
                                     BloodRequired = AM.BloodRequired,
                                     BloodRequiredDesc = AM.BloodRequiredDesc,
                                     ContinueMedication = AM.ContinueMedication,
                                     InitialAdmissionStatus = AM.InitialAdmissionStatus,
                                     admissionStatusDesc = AM.InitialAdmissionStatus > 0 ? this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == AM.InitialAdmissionStatus).AdmissionStatusDesc : "",
                                     InstructionToPatient = AM.InstructionToPatient,
                                     AccompaniedBy = AM.AccompaniedBy,
                                     WardAndBed = AM.WardAndBed,
                                     AdditionalInfo = AM.AdditionalInfo,
                                     AmountPaid = this.uow.GenericRepository<AdmissionPayment>().Table().FirstOrDefault(x=>x.AdmissionID == AM.AdmissionID) != null ? 
                                                  this.uow.GenericRepository<AdmissionPayment>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID).PaidAmount : 0

                                 }).ToList();

            List<AdmissionsModel> admissionsCollection = new List<AdmissionsModel>();

            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (admissionList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        admissionsCollection = (from adm in admissionList
                                                join fac in facList on adm.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select adm).ToList();
                    }
                    else
                    {
                        admissionsCollection = (from adm in admissionList
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select adm).ToList();
                    }
                }
                else
                {
                    admissionsCollection = (from adm in admissionList
                                            join fac in facList on adm.FacilityID equals fac.FacilityId
                                            select adm).ToList();
                }
            }
            else
            {
                admissionsCollection = admissionList;
            }
            return admissionsCollection;
        }

        ///// <summary>
        ///// Get All Admissions for a Patient 
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<AdmissionsModel>. if Collection of Admissions for given PatientId= success. else = failure</returns>
        public List<AdmissionsModel> GetAllAdmissionsForPatient(int PatientId)
        {
            var admissionList = (from admission in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false & x.PatientID == PatientId)
                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on admission.PatientID equals pat.PatientId
                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                 on admission.AdmittingPhysician equals prov.ProviderID

                                 select new
                                 {
                                     admission.AdmissionID,
                                     admission.FacilityID,
                                     admission.PatientID,
                                     admission.ProcedureRequestId,
                                     admission.AdmissionDateTime,
                                     admission.AdmissionNo,
                                     admission.AdmissionOrigin,
                                     admission.AdmissionType,
                                     admission.AdmittingPhysician,
                                     admission.SpecialityID,
                                     admission.AdmittingReason,
                                     admission.PreProcedureDiagnosis,
                                     admission.ICDCode,
                                     admission.ProcedureType,
                                     admission.PlannedProcedure,
                                     admission.ProcedureName,
                                     admission.CPTCode,
                                     admission.UrgencyID,
                                     admission.PatientArrivalCondition,
                                     admission.PatientArrivalBy,
                                     admission.PatientExpectedStay,
                                     admission.AnesthesiaFitnessRequired,
                                     admission.AnesthesiaFitnessRequiredDesc,
                                     admission.BloodRequired,
                                     admission.BloodRequiredDesc,
                                     admission.ContinueMedication,
                                     admission.InitialAdmissionStatus,
                                     admission.InstructionToPatient,
                                     admission.AccompaniedBy,
                                     admission.WardAndBed,
                                     admission.AdditionalInfo,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     pat.PrimaryContactNumber,
                                     pat.MRNo,
                                     prov.FirstName,
                                     prov.MiddleName,
                                     prov.LastName

                                 }).AsEnumerable().OrderByDescending(x => x.AdmissionDateTime).Select(AM => new AdmissionsModel
                                 {
                                     AdmissionID = AM.AdmissionID,
                                     FacilityID = AM.FacilityID,
                                     FacilityName = AM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == AM.FacilityID).FirstOrDefault().FacilityName : "",
                                     PatientID = AM.PatientID,
                                     ProcedureRequestId = AM.ProcedureRequestId,
                                     procedureRequestData = this.GetProcedureRequestbyId(AM.ProcedureRequestId),
                                     PatientName = AM.PatientFirstName + " " + AM.PatientMiddleName + " " + AM.PatientLastName,
                                     PatientContactNumber = AM.PrimaryContactNumber,
                                     MRNumber = AM.MRNo,
                                     AdmissionDateTime = AM.AdmissionDateTime,
                                     AdmissionNo = AM.AdmissionNo,
                                     AdmissionOrigin = AM.AdmissionOrigin,
                                     AdmissionType = AM.AdmissionType,
                                     admissionTypeDesc = AM.AdmissionType > 0 ? this.uow.GenericRepository<AdmissionType>().Table().FirstOrDefault(x => x.AdmissionTypeID == AM.AdmissionType).AdmissionTypeDesc : "",
                                     AdmittingPhysician = AM.AdmittingPhysician,
                                     ProviderName = AM.FirstName + " " + AM.MiddleName + " " + AM.LastName,
                                     SpecialityID = AM.SpecialityID,
                                     specialityName = AM.SpecialityID > 0 ? this.uow.GenericRepository<TenantSpeciality>().Table().FirstOrDefault(x => x.TenantSpecialityID == AM.SpecialityID).TenantSpecialityDescription : "",
                                     AdmittingReason = AM.AdmittingReason,
                                     PreProcedureDiagnosis = AM.PreProcedureDiagnosis,
                                     ICDCode = AM.ICDCode,
                                     ProcedureType = AM.ProcedureType,
                                     ProcedureTypeDesc = AM.ProcedureType > 0 ? this.uow.GenericRepository<ProcedureType>().Table().FirstOrDefault(x => x.ProcedureTypeID == AM.ProcedureType).ProcedureTypeDesc : "",
                                     PlannedProcedure = AM.PlannedProcedure,
                                     ProcedureName = AM.ProcedureName,
                                     ProcedureDesc = (AM.ProcedureName != 0 && AM.ProcedureName != null) ? this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == AM.ProcedureName).ProcedureDesc : "",
                                     CPTCode = AM.CPTCode,
                                     UrgencyID = AM.UrgencyID,
                                     UrgencyType = AM.UrgencyID > 0 ? this.uow.GenericRepository<UrgencyType>().Table().FirstOrDefault(x => x.UrgencyTypeId == AM.UrgencyID).UrgencyTypeDescription : "",
                                     PatientArrivalCondition = AM.PatientArrivalCondition,
                                     arrivalCondition = AM.PatientArrivalCondition > 0 ? this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == AM.PatientArrivalCondition).PatientArrivalconditionDescription : "",
                                     PatientArrivalBy = AM.PatientArrivalBy,
                                     arrivalby = AM.PatientArrivalBy > 0 ? this.uow.GenericRepository<PatientArrivalBy>().Table().FirstOrDefault(x => x.PABID == AM.PatientArrivalBy).PABDesc : "",
                                     PatientExpectedStay = AM.PatientExpectedStay,
                                     AnesthesiaFitnessRequired = AM.AnesthesiaFitnessRequired,
                                     AnesthesiaFitnessRequiredDesc = AM.AnesthesiaFitnessRequiredDesc,
                                     BloodRequired = AM.BloodRequired,
                                     BloodRequiredDesc = AM.BloodRequiredDesc,
                                     ContinueMedication = AM.ContinueMedication,
                                     InitialAdmissionStatus = AM.InitialAdmissionStatus,
                                     admissionStatusDesc = AM.InitialAdmissionStatus > 0 ? this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == AM.InitialAdmissionStatus).AdmissionStatusDesc : "",
                                     InstructionToPatient = AM.InstructionToPatient,
                                     AccompaniedBy = AM.AccompaniedBy,
                                     WardAndBed = AM.WardAndBed,
                                     AdditionalInfo = AM.AdditionalInfo,
                                     AmountPaid = this.uow.GenericRepository<AdmissionPayment>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID) != null ?
                                                  this.uow.GenericRepository<AdmissionPayment>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID).PaidAmount : 0

                                 }).ToList();
            List<AdmissionsModel> admissionsCollection = new List<AdmissionsModel>();

            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();
            if (admissionList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        admissionsCollection = (from adm in admissionList
                                                join fac in facList on adm.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select adm).ToList();
                    }
                    else
                    {
                        admissionsCollection = (from adm in admissionList
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select adm).ToList();
                    }
                }
                else
                {
                    admissionsCollection = (from adm in admissionList
                                            join fac in facList on adm.FacilityID equals fac.FacilityId
                                            select adm).ToList();
                }
            }
            else
            {
                admissionsCollection = admissionList;
            }
            return admissionsCollection;
        }

        ///// <summary>
        ///// Get Admission detail by ID
        ///// </summary>
        ///// <param>int admissionID</param>
        ///// <returns>AdmissionsModel. if Admission for given ID = success. else = failure</returns>
        public AdmissionsModel GetAdmissionDetailByID(int admissionID)
        {
            var admissionData = (from admission in this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionID == admissionID)
                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on admission.PatientID equals pat.PatientId
                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                 on admission.AdmittingPhysician equals prov.ProviderID

                                 select new
                                 {
                                     admission.AdmissionID,
                                     admission.FacilityID,
                                     admission.PatientID,
                                     admission.ProcedureRequestId,
                                     admission.AdmissionDateTime,
                                     admission.AdmissionNo,
                                     admission.AdmissionOrigin,
                                     admission.AdmissionType,
                                     admission.AdmittingPhysician,
                                     admission.SpecialityID,
                                     admission.AdmittingReason,
                                     admission.PreProcedureDiagnosis,
                                     admission.ICDCode,
                                     admission.ProcedureType,
                                     admission.PlannedProcedure,
                                     admission.ProcedureName,
                                     admission.CPTCode,
                                     admission.UrgencyID,
                                     admission.PatientArrivalCondition,
                                     admission.PatientArrivalBy,
                                     admission.PatientExpectedStay,
                                     admission.AnesthesiaFitnessRequired,
                                     admission.AnesthesiaFitnessRequiredDesc,
                                     admission.BloodRequired,
                                     admission.BloodRequiredDesc,
                                     admission.ContinueMedication,
                                     admission.InitialAdmissionStatus,
                                     admission.InstructionToPatient,
                                     admission.AccompaniedBy,
                                     admission.WardAndBed,
                                     admission.AdditionalInfo,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     pat.PrimaryContactNumber,
                                     pat.MRNo,
                                     prov.FirstName,
                                     prov.MiddleName,
                                     prov.LastName

                                 }).AsEnumerable().Select(AM => new AdmissionsModel
                                 {
                                     AdmissionID = AM.AdmissionID,
                                     FacilityID = AM.FacilityID,
                                     FacilityName = AM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == AM.FacilityID).FirstOrDefault().FacilityName : "",
                                     PatientID = AM.PatientID,
                                     ProcedureRequestId = AM.ProcedureRequestId,
                                     procedureRequestData = this.GetProcedureRequestbyId(AM.ProcedureRequestId),
                                     PatientName = AM.PatientFirstName + " " + AM.PatientMiddleName + " " + AM.PatientLastName,
                                     PatientContactNumber = AM.PrimaryContactNumber,
                                     MRNumber = AM.MRNo,
                                     AdmissionDateTime = AM.AdmissionDateTime,
                                     AdmissionNo = AM.AdmissionNo,
                                     AdmissionOrigin = AM.AdmissionOrigin,
                                     AdmissionType = AM.AdmissionType,
                                     admissionTypeDesc = AM.AdmissionType > 0 ? this.uow.GenericRepository<AdmissionType>().Table().FirstOrDefault(x => x.AdmissionTypeID == AM.AdmissionType).AdmissionTypeDesc : "",
                                     AdmittingPhysician = AM.AdmittingPhysician,
                                     ProviderName = AM.FirstName + " " + AM.MiddleName + " " + AM.LastName,
                                     SpecialityID = AM.SpecialityID,
                                     specialityName = AM.SpecialityID > 0 ? this.uow.GenericRepository<TenantSpeciality>().Table().FirstOrDefault(x => x.TenantSpecialityID == AM.SpecialityID).TenantSpecialityDescription : "",
                                     AdmittingReason = AM.AdmittingReason,
                                     PreProcedureDiagnosis = AM.PreProcedureDiagnosis,
                                     ICDCode = AM.ICDCode,
                                     ProcedureType = AM.ProcedureType,
                                     ProcedureTypeDesc = AM.ProcedureType > 0 ? this.uow.GenericRepository<ProcedureType>().Table().FirstOrDefault(x => x.ProcedureTypeID == AM.ProcedureType).ProcedureTypeDesc : "",
                                     PlannedProcedure = AM.PlannedProcedure,
                                     ProcedureName = AM.ProcedureName,
                                     ProcedureDesc = (AM.ProcedureName != 0 && AM.ProcedureName != null) ? this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == AM.ProcedureName).ProcedureDesc : "",
                                     CPTCode = AM.CPTCode,
                                     UrgencyID = AM.UrgencyID,
                                     UrgencyType = AM.UrgencyID > 0 ? this.uow.GenericRepository<UrgencyType>().Table().FirstOrDefault(x => x.UrgencyTypeId == AM.UrgencyID).UrgencyTypeDescription : "",
                                     PatientArrivalCondition = AM.PatientArrivalCondition,
                                     arrivalCondition = AM.PatientArrivalCondition > 0 ? this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == AM.PatientArrivalCondition).PatientArrivalconditionDescription : "",
                                     PatientArrivalBy = AM.PatientArrivalBy,
                                     arrivalby = AM.PatientArrivalBy > 0 ? this.uow.GenericRepository<PatientArrivalBy>().Table().FirstOrDefault(x => x.PABID == AM.PatientArrivalBy).PABDesc : "",
                                     PatientExpectedStay = AM.PatientExpectedStay,
                                     AnesthesiaFitnessRequired = AM.AnesthesiaFitnessRequired,
                                     AnesthesiaFitnessRequiredDesc = AM.AnesthesiaFitnessRequiredDesc,
                                     BloodRequired = AM.BloodRequired,
                                     BloodRequiredDesc = AM.BloodRequiredDesc,
                                     ContinueMedication = AM.ContinueMedication,
                                     InitialAdmissionStatus = AM.InitialAdmissionStatus,
                                     admissionStatusDesc = AM.InitialAdmissionStatus > 0 ? this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == AM.InitialAdmissionStatus).AdmissionStatusDesc : "",
                                     InstructionToPatient = AM.InstructionToPatient,
                                     AccompaniedBy = AM.AccompaniedBy,
                                     WardAndBed = AM.WardAndBed,
                                     AdditionalInfo = AM.AdditionalInfo,

                                 }).FirstOrDefault();

            return admissionData;
        }

        ///// <summary>
        ///// Delete Admission Rercord by ID
        ///// </summary>
        ///// <param>int admissionID</param>
        ///// <returns>Admissions. if Admission deleted for given ID = success. else = failure</returns>
        public Admissions DeleteAdmissionRecord(int admissionID)
        {
            var admission = this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionID == admissionID).SingleOrDefault();

            if (admission != null)
            {
                admission.IsActive = false;
                this.uow.GenericRepository<Admissions>().Update(admission);
                this.uow.Save();
            }
            return admission;
        }

        #endregion

        #region Admission Search and Count

        ///// <summary>
        ///// Get Counts of Admission 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> If counts of Admissions = success. else = failure</returns>
        public AdmissionCountModel GetAdmissionCounts()
        {
            AdmissionCountModel admissionCountModel = new AdmissionCountModel();
            var admissions = this.GetAllAdmissions().Where(x => x.AdmissionDateTime.Date == DateTime.Now.Date).ToList();

            admissionCountModel.TodayAdmissionCount = admissions.Count();
            admissionCountModel.GeneralAdmissionCount = admissions.Where(x => x.AdmissionOrigin.ToLower().Trim() == "general").ToList().Count();
            admissionCountModel.EmergencyAdmissionCount = admissions.Where(x => x.AdmissionOrigin.ToLower().Trim() == "emergency").ToList().Count();

            return admissionCountModel;
        }

        ///// <summary>
        ///// Get Admissions by using SearchModel
        ///// </summary>
        ///// <param>(SearchModel searchModel)</param>
        ///// <returns>List<AdmissionsModel>. if Collection of AdmissionsModel = success. else = failure</returns>
        public List<AdmissionsModel> GetAdmissionsBySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            var admissionList = (from admission in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on admission.PatientID equals pat.PatientId
                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                 on admission.AdmittingPhysician equals prov.ProviderID

                                 where
                                   (Fromdate.Date <= admission.AdmissionDateTime.Date
                                         && (Todate.Date >= Fromdate.Date && admission.AdmissionDateTime.Date <= Todate.Date)
                                         && (searchModel.PatientId == 0 || admission.PatientID == searchModel.PatientId)
                                         && (searchModel.ProviderId == 0 || admission.AdmittingPhysician == searchModel.ProviderId)
                                         //&& (searchModel.SpecialityId == 0 || admission.SpecialityID == searchModel.SpecialityId)
                                         && (searchModel.FacilityId == 0 || admission.FacilityID == searchModel.FacilityId)
                                         && ((searchModel.AdmissionNo == null || searchModel.AdmissionNo == "") || admission.AdmissionNo.ToLower().Trim() == searchModel.AdmissionNo.ToLower().Trim())
                                         )
                                 select new
                                 {
                                     admission.AdmissionID,
                                     admission.FacilityID,
                                     admission.PatientID,
                                     admission.ProcedureRequestId,
                                     admission.AdmissionDateTime,
                                     admission.AdmissionNo,
                                     admission.AdmissionOrigin,
                                     admission.AdmissionType,
                                     admission.AdmittingPhysician,
                                     admission.SpecialityID,
                                     admission.AdmittingReason,
                                     admission.PreProcedureDiagnosis,
                                     admission.ICDCode,
                                     admission.ProcedureType,
                                     admission.PlannedProcedure,
                                     admission.ProcedureName,
                                     admission.CPTCode,
                                     admission.UrgencyID,
                                     admission.PatientArrivalCondition,
                                     admission.PatientArrivalBy,
                                     admission.PatientExpectedStay,
                                     admission.AnesthesiaFitnessRequired,
                                     admission.AnesthesiaFitnessRequiredDesc,
                                     admission.BloodRequired,
                                     admission.BloodRequiredDesc,
                                     admission.ContinueMedication,
                                     admission.InitialAdmissionStatus,
                                     admission.InstructionToPatient,
                                     admission.AccompaniedBy,
                                     admission.WardAndBed,
                                     admission.AdditionalInfo,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     pat.PrimaryContactNumber,
                                     pat.MRNo,
                                     prov.FirstName,
                                     prov.MiddleName,
                                     prov.LastName

                                 }).AsEnumerable().OrderByDescending(x => x.AdmissionDateTime).Select(AM => new AdmissionsModel
                                 {
                                     AdmissionID = AM.AdmissionID,
                                     FacilityID = AM.FacilityID,
                                     FacilityName = AM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == AM.FacilityID).FirstOrDefault().FacilityName : "",
                                     PatientID = AM.PatientID,
                                     ProcedureRequestId = AM.ProcedureRequestId,
                                     procedureRequestData = this.GetProcedureRequestbyId(AM.ProcedureRequestId),
                                     PatientName = AM.PatientFirstName + " " + AM.PatientMiddleName + " " + AM.PatientLastName,
                                     PatientContactNumber = AM.PrimaryContactNumber,
                                     MRNumber = AM.MRNo,
                                     AdmissionDateTime = AM.AdmissionDateTime,
                                     AdmissionNo = AM.AdmissionNo,
                                     AdmissionOrigin = AM.AdmissionOrigin,
                                     AdmissionType = AM.AdmissionType,
                                     admissionTypeDesc = AM.AdmissionType > 0 ? this.uow.GenericRepository<AdmissionType>().Table().FirstOrDefault(x => x.AdmissionTypeID == AM.AdmissionType).AdmissionTypeDesc : "",
                                     AdmittingPhysician = AM.AdmittingPhysician,
                                     ProviderName = AM.FirstName + " " + AM.MiddleName + " " + AM.LastName,
                                     SpecialityID = AM.SpecialityID,
                                     specialityName = AM.SpecialityID > 0 ? this.uow.GenericRepository<TenantSpeciality>().Table().FirstOrDefault(x => x.TenantSpecialityID == AM.SpecialityID).TenantSpecialityDescription : "",
                                     AdmittingReason = AM.AdmittingReason,
                                     PreProcedureDiagnosis = AM.PreProcedureDiagnosis,
                                     ICDCode = AM.ICDCode,
                                     ProcedureType = AM.ProcedureType,
                                     ProcedureTypeDesc = AM.ProcedureType > 0 ? this.uow.GenericRepository<ProcedureType>().Table().FirstOrDefault(x => x.ProcedureTypeID == AM.ProcedureType).ProcedureTypeDesc : "",
                                     PlannedProcedure = AM.PlannedProcedure,
                                     ProcedureName = AM.ProcedureName,
                                     ProcedureDesc = (AM.ProcedureName != 0 && AM.ProcedureName != null) ? this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == AM.ProcedureName).ProcedureDesc : "",
                                     CPTCode = AM.CPTCode,
                                     UrgencyID = AM.UrgencyID,
                                     UrgencyType = AM.UrgencyID > 0 ? this.uow.GenericRepository<UrgencyType>().Table().FirstOrDefault(x => x.UrgencyTypeId == AM.UrgencyID).UrgencyTypeDescription : "",
                                     PatientArrivalCondition = AM.PatientArrivalCondition,
                                     arrivalCondition = AM.PatientArrivalCondition > 0 ? this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == AM.PatientArrivalCondition).PatientArrivalconditionDescription : "",
                                     PatientArrivalBy = AM.PatientArrivalBy,
                                     arrivalby = AM.PatientArrivalBy > 0 ? this.uow.GenericRepository<PatientArrivalBy>().Table().FirstOrDefault(x => x.PABID == AM.PatientArrivalBy).PABDesc : "",
                                     PatientExpectedStay = AM.PatientExpectedStay,
                                     AnesthesiaFitnessRequired = AM.AnesthesiaFitnessRequired,
                                     AnesthesiaFitnessRequiredDesc = AM.AnesthesiaFitnessRequiredDesc,
                                     BloodRequired = AM.BloodRequired,
                                     BloodRequiredDesc = AM.BloodRequiredDesc,
                                     ContinueMedication = AM.ContinueMedication,
                                     InitialAdmissionStatus = AM.InitialAdmissionStatus,
                                     admissionStatusDesc = AM.InitialAdmissionStatus > 0 ? this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == AM.InitialAdmissionStatus).AdmissionStatusDesc : "",
                                     InstructionToPatient = AM.InstructionToPatient,
                                     AccompaniedBy = AM.AccompaniedBy,
                                     WardAndBed = AM.WardAndBed,
                                     AdditionalInfo = AM.AdditionalInfo,
                                     AmountPaid = this.uow.GenericRepository<AdmissionPayment>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID) != null ?
                                                  this.uow.GenericRepository<AdmissionPayment>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID).PaidAmount : 0

                                 }).ToList();

            List<AdmissionsModel> admissionsCollection = new List<AdmissionsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (admissionList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            admissionsCollection = (from adm in admissionList
                                                    join fac in facList on adm.FacilityID equals fac.FacilityId
                                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                    on adm.AdmittingPhysician equals prov.ProviderID
                                                    select adm).ToList();

                        }
                        else
                        {
                            admissionsCollection = (from adm in admissionList
                                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                    on adm.AdmittingPhysician equals prov.ProviderID
                                                    select adm).ToList();
                        }
                    }
                    else
                    {
                        admissionsCollection = (from adm in admissionList.Where(x => x.FacilityID == searchModel.FacilityId)
                                                join fac in facList on adm.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select adm).ToList();
                    }
                }
                else
                {
                    admissionsCollection = (from adm in admissionList
                                            join fac in facList on adm.FacilityID equals fac.FacilityId
                                            select adm).ToList();
                }
            }
            else
            {
                admissionsCollection = admissionList;
            }
            return admissionsCollection;
        }

        ///// <summary>
        ///// Get Patients for Admission search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<Patient> If Patient table data collection returns for the searchkey = success. else = failure</returns>
        public List<Patient> GetPatientsForAdmissionSearch(string searchKey)
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
        ///// Get Providers For Admission Search
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for Admission = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforAdmissionSearch(string searchKey)
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
        ///// Get Specialities for Admission search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProviderSpeciality> If ProviderSpeciality table data collection returns = success. else = failure</returns>
        public List<ProviderSpeciality> GetSpecialitiesForAdmissionSearch()
        {
            var specialityRecords = this.uow.GenericRepository<ProviderSpeciality>().Table().ToList();

            var providers = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false).GroupBy(mdu => new { mdu.UserID })
                                .Select(data => data.OrderBy(his => his.UserID).FirstOrDefault())
                                .ToList();

            var specialities = (from spclty in specialityRecords
                                join prov in providers
                                on spclty.ProviderID equals prov.ProviderID
                                select spclty).GroupBy(obj => new { obj.SpecialityDescription }).Select(data => data.OrderByDescending(set => set.ProviderSpecialtyID).FirstOrDefault()).ToList();

            return specialities;
        }

        #endregion

        #region Admission Payment

        ///// <summary>
        ///// Get Billing particulars from Billing Sub Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BillingSetupMasterModel>. if Collection of BillingSetupMaster from Billing Master = success. else = failure</returns>
        public List<BillingSetupMasterModel> GetbillingParticularsforAdmissionPayment(int departmentID, string searchKey)
        {
            List<BillingSetupMasterModel> billSetupCollection = new List<BillingSetupMasterModel>();

            var setupMasterCollection = (from setup in this.uow.GenericRepository<BillingSetupMaster>().Table().Where(x => x.DepartmentID == departmentID & x.IsActive != false)

                                         join billMaster in this.uow.GenericRepository<BillingMaster>().Table()
                                         on setup.MasterBillingType equals billMaster.BillingMasterID

                                         select new
                                         {
                                             setup.SetupMasterID,
                                             setup.MasterBillingType,
                                             subBillingType = (setup.SubMasterBillingType == null || setup.SubMasterBillingType == "") ? "None" : setup.SubMasterBillingType,
                                             setup.Charges,
                                             masterBillingTypeName = billMaster.MasterBillingType + " " + billMaster.BillingTypeDesc

                                         }).AsEnumerable().Select(BSM => new BillingSetupMasterModel
                                         {
                                             SetupMasterID = BSM.SetupMasterID,
                                             MasterBillingType = BSM.MasterBillingType,
                                             MasterBillingTypeName = BSM.masterBillingTypeName,
                                             SubMasterBillingType = BSM.subBillingType,
                                             Charges = BSM.Charges,
                                             billingparticularName = BSM.masterBillingTypeName + " - " + BSM.subBillingType

                                         }).ToList();

            billSetupCollection = (from set in setupMasterCollection
                                   where (searchKey == null ||
                                   (set.MasterBillingTypeName.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                   || set.SubMasterBillingType.ToLower().Trim().Contains(searchKey.ToLower().Trim())
                                   || set.billingparticularName.ToLower().Trim().Contains(searchKey.ToLower().Trim())))
                                   select set).ToList();

            return billSetupCollection;
        }

        ///// <summary>
        ///// Add or update a admission payment
        ///// </summary>
        ///// <param>AdmissionPaymentModel paymentModel(paymentModel--> object of AdmissionPaymentModel)</param>
        ///// <returns>AdmissionPaymentModel. if admission payment after insertion and updation = success. else = failure</returns>
        public AdmissionPaymentModel AddUpdateAdmissionPayment(AdmissionPaymentModel paymentModel)
        {
            var admissionPayment = this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionID == paymentModel.AdmissionID & x.IsActive != false).FirstOrDefault();

            var getRCPTCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "recno"
                                 select common).FirstOrDefault();

            var visitrcptCheck = this.uow.GenericRepository<VisitPayment>().Table()
                            .Where(x => x.ReceiptNo.ToLower().Trim() == getRCPTCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var rcptCheck = this.uow.GenericRepository<AdmissionPayment>().Table()
                            .Where(x => x.ReceiptNo.ToLower().Trim() == getRCPTCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var getBILLCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "bilno"
                                 select common).FirstOrDefault();

            var visitbillCheck = this.uow.GenericRepository<VisitPayment>().Table()
                            .Where(x => x.BillNo.ToLower().Trim() == getBILLCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var billCheck = this.uow.GenericRepository<AdmissionPayment>().Table()
                            .Where(x => x.BillNo.ToLower().Trim() == getBILLCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            if (admissionPayment == null)
            {
                admissionPayment = new AdmissionPayment();

                admissionPayment.AdmissionID = paymentModel.AdmissionID;
                admissionPayment.ReceiptNo = rcptCheck != null ? paymentModel.ReceiptNo : (visitrcptCheck != null ? paymentModel.ReceiptNo : getRCPTCommon.CommonMasterDesc);
                admissionPayment.ReceiptDate = this.utilService.GetLocalTime(paymentModel.ReceiptDate);
                admissionPayment.BillNo = billCheck != null ? paymentModel.BillNo : (visitbillCheck != null ? paymentModel.BillNo : getBILLCommon.CommonMasterDesc);
                admissionPayment.MiscAmount = paymentModel.MiscAmount;
                admissionPayment.DiscountPercentage = paymentModel.DiscountPercentage;
                admissionPayment.DiscountAmount = paymentModel.DiscountAmount;
                admissionPayment.GrandTotal = paymentModel.GrandTotal;
                admissionPayment.NetAmount = paymentModel.NetAmount;
                admissionPayment.PaidAmount = paymentModel.PaidAmount;
                admissionPayment.PaymentMode = paymentModel.PaymentMode;
                admissionPayment.Notes = paymentModel.Notes;
                admissionPayment.IsActive = true;
                admissionPayment.Createddate = DateTime.Now;
                admissionPayment.CreatedBy = "User";

                this.uow.GenericRepository<AdmissionPayment>().Insert(admissionPayment);

                this.uow.Save();

                getRCPTCommon.CurrentIncNo = admissionPayment.ReceiptNo;
                this.uow.GenericRepository<CommonMaster>().Update(getRCPTCommon);

                getBILLCommon.CurrentIncNo = admissionPayment.BillNo;
                this.uow.GenericRepository<CommonMaster>().Update(getBILLCommon);
                this.uow.Save();
            }
            else
            {
                admissionPayment.ReceiptDate = this.utilService.GetLocalTime(paymentModel.ReceiptDate);
                admissionPayment.MiscAmount = paymentModel.MiscAmount;
                admissionPayment.DiscountPercentage = paymentModel.DiscountPercentage;
                admissionPayment.DiscountAmount = paymentModel.DiscountAmount;
                admissionPayment.GrandTotal = paymentModel.GrandTotal;
                admissionPayment.NetAmount = paymentModel.NetAmount;
                admissionPayment.PaidAmount = paymentModel.PaidAmount;
                admissionPayment.PaymentMode = paymentModel.PaymentMode;
                admissionPayment.Notes = paymentModel.Notes;
                admissionPayment.IsActive = true;
                admissionPayment.ModifiedDate = DateTime.Now;
                admissionPayment.ModifiedBy = "User";

                this.uow.GenericRepository<AdmissionPayment>().Update(admissionPayment);
                this.uow.Save();
            }
            paymentModel.AdmissionPaymentID = admissionPayment.AdmissionPaymentID;

            if (paymentModel.AdmissionPaymentID > 0)
            {
                if (paymentModel.paymentDetailsItem.Count() > 0)
                {
                    var paymentDetails = this.uow.GenericRepository<AdmissionPaymentDetails>().Table()
                                        .Where(x => x.AdmissionPaymentID == admissionPayment.AdmissionPaymentID).ToList();

                    if (paymentDetails.Count() > 0)
                    {
                        foreach (var item in paymentDetails)
                        {
                            this.uow.GenericRepository<AdmissionPaymentDetails>().Delete(item);
                        }
                        this.uow.Save();

                        foreach (var detail in paymentModel.paymentDetailsItem)
                        {
                            AdmissionPaymentDetails paymentItem = new AdmissionPaymentDetails();

                            paymentItem.AdmissionPaymentID = admissionPayment.AdmissionPaymentID;
                            paymentItem.SetupMasterID = detail.SetupMasterID;
                            paymentItem.Charges = detail.Charges;
                            paymentItem.IsActive = true;
                            paymentItem.Createddate = DateTime.Now;
                            paymentItem.CreatedBy = "User";

                            this.uow.GenericRepository<AdmissionPaymentDetails>().Insert(paymentItem);
                        }
                    }
                    else
                    {
                        foreach (var detail in paymentModel.paymentDetailsItem)
                        {
                            AdmissionPaymentDetails paymentItem = new AdmissionPaymentDetails();

                            paymentItem.AdmissionPaymentID = admissionPayment.AdmissionPaymentID;
                            paymentItem.SetupMasterID = detail.SetupMasterID;
                            paymentItem.Charges = detail.Charges;
                            paymentItem.IsActive = true;
                            paymentItem.Createddate = DateTime.Now;
                            paymentItem.CreatedBy = "User";

                            this.uow.GenericRepository<AdmissionPaymentDetails>().Insert(paymentItem);
                        }
                    }
                    this.uow.Save();
                }

                //if (paymentModel.paymentDetailsItem.Count() > 0)
                //{
                //    AdmissionPaymentDetails paymentItem = new AdmissionPaymentDetails();
                    
                //    foreach (var detail in paymentModel.paymentDetailsItem)
                //    {
                //        paymentItem = this.uow.GenericRepository<AdmissionPaymentDetails>().Table().FirstOrDefault(x => x.AdmissionPaymentDetailsID == detail.AdmissionPaymentDetailsID);
                //        if (paymentItem == null)
                //        {
                //            paymentItem = new AdmissionPaymentDetails();

                //            paymentItem.AdmissionPaymentID = admissionPayment.AdmissionPaymentID;
                //            paymentItem.SetupMasterID = detail.SetupMasterID;
                //            paymentItem.Charges = detail.Charges;
                //            paymentItem.IsActive = true;
                //            paymentItem.Createddate = DateTime.Now;
                //            paymentItem.CreatedBy = "User";

                //            this.uow.GenericRepository<AdmissionPaymentDetails>().Insert(paymentItem);
                //        }
                //        else
                //        {
                //            paymentItem.SetupMasterID = detail.SetupMasterID;
                //            paymentItem.Charges = detail.Charges;
                //            paymentItem.IsActive = true;
                //            paymentItem.ModifiedDate = DateTime.Now;
                //            paymentItem.ModifiedBy = "User";

                //            this.uow.GenericRepository<AdmissionPaymentDetails>().Update(paymentItem);
                //        }
                //        this.uow.Save();
                //        detail.AdmissionPaymentDetailsID = paymentItem.AdmissionPaymentDetailsID;
                //    }
                //}
            }

            return paymentModel;
        }

        ///// <summary>
        ///// Get All AdmissionPayments 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionPaymentModel>. if All visit payments = success. else = failure</returns>
        public List<AdmissionPaymentModel> GetAllAdmissionPayments()
        {
            var admissionPayments = (from admissionPay in this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.IsActive != false)

                                     join admsn in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                     on admissionPay.AdmissionID equals admsn.AdmissionID

                                     join pat in this.uow.GenericRepository<Patient>().Table()
                                     on admsn.PatientID equals pat.PatientId

                                     select new
                                     {
                                         admissionPay.AdmissionPaymentID,
                                         admissionPay.AdmissionID,
                                         admissionPay.ReceiptNo,
                                         admissionPay.ReceiptDate,
                                         admissionPay.BillNo,
                                         admissionPay.MiscAmount,
                                         admissionPay.DiscountPercentage,
                                         admissionPay.DiscountAmount,
                                         admissionPay.GrandTotal,
                                         admissionPay.NetAmount,
                                         admissionPay.PaidAmount,
                                         admissionPay.PaymentMode,
                                         admissionPay.Notes,
                                         admsn.AdmissionDateTime,
                                         admsn.FacilityID,
                                         pat.PatientId,
                                         pat.PatientFirstName,
                                         pat.PatientMiddleName,
                                         pat.PatientLastName,
                                         pat.PrimaryContactNumber,
                                         pat.MRNo

                                     }).AsEnumerable().Select(APM => new AdmissionPaymentModel
                                     {
                                         AdmissionPaymentID = APM.AdmissionPaymentID,
                                         AdmissionID = APM.AdmissionID,
                                         FacilityId = APM.FacilityID,
                                         facilityName = APM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == APM.FacilityID).FacilityName : "",
                                         ReceiptNo = APM.ReceiptNo,
                                         ReceiptDate = APM.ReceiptDate,
                                         BillNo = APM.BillNo,
                                         MiscAmount = APM.MiscAmount,
                                         DiscountPercentage = APM.DiscountPercentage,
                                         DiscountAmount = APM.DiscountAmount,
                                         GrandTotal = APM.GrandTotal,
                                         NetAmount = APM.NetAmount,
                                         PaidAmount = APM.PaidAmount,
                                         PaymentMode = APM.PaymentMode,
                                         Notes = APM.Notes,
                                         PatientId = APM.PatientId,
                                         PatientName = APM.PatientFirstName + " " + APM.PatientMiddleName + " " + APM.PatientLastName,
                                         PatientContactNumber = APM.PrimaryContactNumber,
                                         MRNumber = APM.MRNo,
                                         AdmissionDateandTime = APM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + APM.AdmissionDateTime.TimeOfDay.ToString(),
                                         paymentDetailsItem = this.GetAdmissionPaymentDetailsbyID(APM.AdmissionPaymentID)

                                     }).ToList();

            List<AdmissionPaymentModel> admissionpaymentsCollection = new List<AdmissionPaymentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (admissionPayments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        admissionpaymentsCollection = (from admPay in admissionPayments
                                                       join fac in facList on admPay.FacilityId equals fac.FacilityId
                                                       join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                       on admPay.AdmissionID equals adm.AdmissionID
                                                       join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                       on adm.AdmittingPhysician equals prov.ProviderID
                                                       select admPay).ToList();
                    }
                    else
                    {
                        admissionpaymentsCollection = (from admPay in admissionPayments
                                                       join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                       on admPay.AdmissionID equals adm.AdmissionID
                                                       join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                       on adm.AdmittingPhysician equals prov.ProviderID
                                                       select admPay).ToList();
                    }
                }
                else
                {
                    admissionpaymentsCollection = (from admPay in admissionPayments
                                                   join fac in facList on admPay.FacilityId equals fac.FacilityId
                                                   select admPay).ToList();
                }
            }
            else
            {
                admissionpaymentsCollection = admissionPayments;
            }
            return admissionpaymentsCollection;
        }

        ///// <summary>
        ///// Get Payment record by admissionID
        ///// </summary>
        ///// <param>int admissionID</param>
        ///// <returns>AdmissionPaymentModel. if payment record for given admissionID = success. else = failure</returns>
        public AdmissionPaymentModel GetPaymentRecordforAdmissionbyID(int admissionID)
        {
            var admissionPaymentRecord = (from admissionPay in this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionID == admissionID & x.IsActive != false)

                                          join admsn in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                          on admissionPay.AdmissionID equals admsn.AdmissionID

                                          join pat in this.uow.GenericRepository<Patient>().Table()
                                          on admsn.PatientID equals pat.PatientId

                                          select new
                                          {
                                              admissionPay.AdmissionPaymentID,
                                              admissionPay.AdmissionID,
                                              admissionPay.ReceiptNo,
                                              admissionPay.ReceiptDate,
                                              admissionPay.BillNo,
                                              admissionPay.MiscAmount,
                                              admissionPay.DiscountPercentage,
                                              admissionPay.DiscountAmount,
                                              admissionPay.GrandTotal,
                                              admissionPay.NetAmount,
                                              admissionPay.PaidAmount,
                                              admissionPay.PaymentMode,
                                              admissionPay.Notes,
                                              admsn.AdmissionDateTime,
                                              admsn.FacilityID,
                                              pat.PatientId,
                                              pat.PatientFirstName,
                                              pat.PatientMiddleName,
                                              pat.PatientLastName,
                                              pat.PrimaryContactNumber,
                                              pat.MRNo

                                          }).AsEnumerable().Select(APM => new AdmissionPaymentModel
                                          {
                                              AdmissionPaymentID = APM.AdmissionPaymentID,
                                              AdmissionID = APM.AdmissionID,
                                              FacilityId = APM.FacilityID,
                                              facilityName = APM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == APM.FacilityID).FacilityName : "",
                                              ReceiptNo = APM.ReceiptNo,
                                              ReceiptDate = APM.ReceiptDate,
                                              BillNo = APM.BillNo,
                                              MiscAmount = APM.MiscAmount,
                                              DiscountPercentage = APM.DiscountPercentage,
                                              DiscountAmount = APM.DiscountAmount,
                                              GrandTotal = APM.GrandTotal,
                                              NetAmount = APM.NetAmount,
                                              PaidAmount = APM.PaidAmount,
                                              PaymentMode = APM.PaymentMode,
                                              Notes = APM.Notes,
                                              PatientId = APM.PatientId,
                                              PatientName = APM.PatientFirstName + " " + APM.PatientMiddleName + " " + APM.PatientLastName,
                                              PatientContactNumber = APM.PrimaryContactNumber,
                                              MRNumber = APM.MRNo,
                                              AdmissionDateandTime = APM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + APM.AdmissionDateTime.TimeOfDay.ToString(),
                                              paymentDetailsItem = this.GetAdmissionPaymentDetailsbyID(APM.AdmissionPaymentID)

                                          }).LastOrDefault();

            return admissionPaymentRecord;
        }

        ///// <summary>
        ///// Get Payments for a Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<AdmissionPaymentModel>. if payments for given Patient Id = success. else = failure</returns>
        public List<AdmissionPaymentModel> GetAdmissionPaymentsforPatient(int PatientId)
        {
            var admissionPayments = (from admissionPay in this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.IsActive != false)

                                     join admsn in this.uow.GenericRepository<Admissions>().Table().Where(x => x.PatientID == PatientId & x.IsActive != false)
                                     on admissionPay.AdmissionID equals admsn.AdmissionID

                                     join pat in this.uow.GenericRepository<Patient>().Table()
                                     on admsn.PatientID equals pat.PatientId

                                     select new
                                     {
                                         admissionPay.AdmissionPaymentID,
                                         admissionPay.AdmissionID,
                                         admissionPay.ReceiptNo,
                                         admissionPay.ReceiptDate,
                                         admissionPay.BillNo,
                                         admissionPay.MiscAmount,
                                         admissionPay.DiscountPercentage,
                                         admissionPay.DiscountAmount,
                                         admissionPay.GrandTotal,
                                         admissionPay.NetAmount,
                                         admissionPay.PaidAmount,
                                         admissionPay.PaymentMode,
                                         admissionPay.Notes,
                                         admsn.AdmissionDateTime,
                                         admsn.FacilityID,
                                         pat.PatientId,
                                         pat.PatientFirstName,
                                         pat.PatientMiddleName,
                                         pat.PatientLastName,
                                         pat.PrimaryContactNumber,
                                         pat.MRNo

                                     }).AsEnumerable().Select(APM => new AdmissionPaymentModel
                                     {
                                         AdmissionPaymentID = APM.AdmissionPaymentID,
                                         AdmissionID = APM.AdmissionID,
                                         FacilityId = APM.FacilityID,
                                         facilityName = APM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == APM.FacilityID).FacilityName : "",
                                         ReceiptNo = APM.ReceiptNo,
                                         ReceiptDate = APM.ReceiptDate,
                                         BillNo = APM.BillNo,
                                         MiscAmount = APM.MiscAmount,
                                         DiscountPercentage = APM.DiscountPercentage,
                                         DiscountAmount = APM.DiscountAmount,
                                         GrandTotal = APM.GrandTotal,
                                         NetAmount = APM.NetAmount,
                                         PaidAmount = APM.PaidAmount,
                                         PaymentMode = APM.PaymentMode,
                                         Notes = APM.Notes,
                                         PatientId = APM.PatientId,
                                         PatientName = APM.PatientFirstName + " " + APM.PatientMiddleName + " " + APM.PatientLastName,
                                         PatientContactNumber = APM.PrimaryContactNumber,
                                         MRNumber = APM.MRNo,
                                         AdmissionDateandTime = APM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + APM.AdmissionDateTime.TimeOfDay.ToString(),
                                         paymentDetailsItem = this.GetAdmissionPaymentDetailsbyID(APM.AdmissionPaymentID)

                                     }).ToList();

            List<AdmissionPaymentModel> admissionpaymentsCollection = new List<AdmissionPaymentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (admissionPayments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        admissionpaymentsCollection = (from admPay in admissionPayments
                                                       join fac in facList on admPay.FacilityId equals fac.FacilityId
                                                       join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                       on admPay.AdmissionID equals adm.AdmissionID
                                                       join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                       on adm.AdmittingPhysician equals prov.ProviderID
                                                       select admPay).ToList();
                    }
                    else
                    {
                        admissionpaymentsCollection = (from admPay in admissionPayments
                                                       join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                       on admPay.AdmissionID equals adm.AdmissionID
                                                       join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                       on adm.AdmittingPhysician equals prov.ProviderID
                                                       select admPay).ToList();
                    }
                }
                else
                {
                    admissionpaymentsCollection = (from admPay in admissionPayments
                                                   join fac in facList on admPay.FacilityId equals fac.FacilityId
                                                   select admPay).ToList();
                }
            }
            else
            {
                admissionpaymentsCollection = admissionPayments;
            }
            return admissionpaymentsCollection;
        }

        ///// <summary>
        ///// Get Payment record by id
        ///// </summary>
        ///// <param>int admissionPaymentId</param>
        ///// <returns>AdmissionPaymentModel. if payment record for given id = success. else = failure</returns>
        public AdmissionPaymentModel GetAdmissionPaymentRecordbyID(int admissionPaymentId)
        {
            var admissionPaymentRecord = (from admissionPay in this.uow.GenericRepository<AdmissionPayment>().Table().Where(x => x.AdmissionPaymentID == admissionPaymentId)

                                          join admsn in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                          on admissionPay.AdmissionID equals admsn.AdmissionID

                                          join pat in this.uow.GenericRepository<Patient>().Table()
                                          on admsn.PatientID equals pat.PatientId

                                          select new
                                          {
                                              admissionPay.AdmissionPaymentID,
                                              admissionPay.AdmissionID,
                                              admissionPay.ReceiptNo,
                                              admissionPay.ReceiptDate,
                                              admissionPay.BillNo,
                                              admissionPay.MiscAmount,
                                              admissionPay.DiscountPercentage,
                                              admissionPay.DiscountAmount,
                                              admissionPay.GrandTotal,
                                              admissionPay.NetAmount,
                                              admissionPay.PaidAmount,
                                              admissionPay.PaymentMode,
                                              admissionPay.Notes,
                                              admsn.AdmissionDateTime,
                                              admsn.FacilityID,
                                              pat.PatientId,
                                              pat.PatientFirstName,
                                              pat.PatientMiddleName,
                                              pat.PatientLastName,
                                              pat.PrimaryContactNumber,
                                              pat.MRNo

                                          }).AsEnumerable().Select(APM => new AdmissionPaymentModel
                                          {
                                              AdmissionPaymentID = APM.AdmissionPaymentID,
                                              AdmissionID = APM.AdmissionID,
                                              FacilityId = APM.FacilityID,
                                              facilityName = APM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == APM.FacilityID).FacilityName : "",
                                              ReceiptNo = APM.ReceiptNo,
                                              ReceiptDate = APM.ReceiptDate,
                                              BillNo = APM.BillNo,
                                              MiscAmount = APM.MiscAmount,
                                              DiscountPercentage = APM.DiscountPercentage,
                                              DiscountAmount = APM.DiscountAmount,
                                              GrandTotal = APM.GrandTotal,
                                              NetAmount = APM.NetAmount,
                                              PaidAmount = APM.PaidAmount,
                                              PaymentMode = APM.PaymentMode,
                                              Notes = APM.Notes,
                                              PatientId = APM.PatientId,
                                              PatientName = APM.PatientFirstName + " " + APM.PatientMiddleName + " " + APM.PatientLastName,
                                              PatientContactNumber = APM.PrimaryContactNumber,
                                              MRNumber = APM.MRNo,
                                              AdmissionDateandTime = APM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + APM.AdmissionDateTime.TimeOfDay.ToString(),
                                              paymentDetailsItem = this.GetAdmissionPaymentDetailsbyID(APM.AdmissionPaymentID)

                                          }).FirstOrDefault();

            return admissionPaymentRecord;
        }

        ///// <summary>
        ///// Get All Admission Payment Detail for admissionPaymentId
        ///// </summary>
        ///// <param>int admissionPaymentId</param>
        ///// <returns>List<AdmissionPaymentDetailsModel>. if All admission payment Detail for given admissionPaymentId = success. else = failure</returns>
        public List<AdmissionPaymentDetailsModel> GetAdmissionPaymentDetailsbyID(int admissionPaymentId)
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<AdmissionPaymentDetails>().Table().Where(x => x.IsActive != false & x.AdmissionPaymentID == admissionPaymentId)

                                  join setup in this.uow.GenericRepository<BillingSetupMaster>().Table()
                                  on detail.SetupMasterID equals setup.SetupMasterID

                                  join depart in this.uow.GenericRepository<Departments>().Table()
                                  on setup.DepartmentID equals depart.DepartmentID

                                  select new
                                  {
                                      detail.AdmissionPaymentDetailsID,
                                      detail.AdmissionPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      setup.DepartmentID,
                                      depart.DepartmentDesc

                                  }).AsEnumerable().Select(APDM => new AdmissionPaymentDetailsModel
                                  {
                                      AdmissionPaymentDetailsID = APDM.AdmissionPaymentDetailsID,
                                      AdmissionPaymentID = APDM.AdmissionPaymentID,
                                      SetupMasterID = APDM.SetupMasterID,
                                      Charges = APDM.Charges,
                                      DepartmentId = APDM.DepartmentID,
                                      DepartmentName = APDM.DepartmentDesc,
                                      billingParticular = this.GetbillingParticularsforAdmissionPayment(APDM.DepartmentID, null).FirstOrDefault().billingparticularName

                                  }).ToList();

            return paymentDetails;
        }

        #endregion

    }
}
