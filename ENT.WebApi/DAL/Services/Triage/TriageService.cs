using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Services
{
    public class TriageService : ITriageService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        private readonly IHostingEnvironment hostingEnvironment;

        public TriageService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
            hostingEnvironment = _hostingEnvironment;
        }

        #region Master Data

        ///// <summary>
        ///// Get All BP Locations
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BPLocation>. if Collection of BPLocation = success. else = failure</returns>
        public List<BPLocation> GetAllBPLocations()
        {
            var bplocations = this.iTenantMasterService.GetBPLocationList();
            return bplocations;
        }

        ///// <summary>
        ///// Get All Allergy Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AllergyType>. if Collection of AllergyType = success. else = failure</returns>
        public List<AllergyType> GetAllergyTypes()
        {
            var allergyTypes = this.iTenantMasterService.GetAllAllergyTypes();
            return allergyTypes;
        }

        ///// <summary>
        ///// Get All Allergy Severities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AllergySeverity>. if Collection of AllergySeverity = success. else = failure</returns>
        public List<AllergySeverity> GetAllergySeverities()
        {
            var allergySeverities = this.iTenantMasterService.GetAllergySeverities();
            return allergySeverities;
        }

        ///// <summary>
        ///// Get Allergy Status Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AllergyStatusMaster>. if Collection of Allergy Status Master = success. else = failure</returns>
        public List<AllergyStatusMaster> GetAllergyStatusMasters()
        {
            var allergyStatusMasters = this.iTenantMasterService.GetAllergyStatusMasterList();
            return allergyStatusMasters;
        }

        ///// <summary>
        ///// Get All DiagnosisCodes (ICD codes)
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DiagnosisCode>. if Collection of DiagnosisCode = success. else = failure</returns>
        public List<DiagnosisCode> GetAllDiagnosisCodes(string searchKey)
        {
            return this.utilService.GetAllDiagnosisCodesbySearch(searchKey);
        }

        ///// <summary>
        ///// Get All TreatmentCodes (CPT codes)
        ///// </summary>
        ///// <param>SearchKey</param>
        ///// <returns>List<TreatmentCode>. if Collection of TreatmentCode = success. else = failure</returns>
        public List<TreatmentCode> GetAllTreatmentCodes(string searchKey)
        {
            return this.utilService.GetTreatmentCodesbySearch(searchKey);
        }

        ///// <summary>
        ///// Get All SnomedCTCodes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<SnomedCT>. if Collection of SnomedCT = success. else = failure</returns>
        public List<SnomedCT> GetAllSnomedCTCodes(string searchKey)
        {
            return this.utilService.GetAllSnomedCTCodes(searchKey);
        }

        ///// <summary>
        ///// Get All Food Intake Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FoodIntakeType>. if Collection of FoodIntakeType = success. else = failure</returns>
        public List<FoodIntakeType> GetAllFoodIntakeTypes()
        {
            var foodIntaketypes = this.iTenantMasterService.GetFoodIntakeTypeList();
            return foodIntaketypes;
        }

        ///// <summary>
        ///// Get All Patient Eat Masters
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientEatMaster>. if Collection of Patient Eat Master = success. else = failure</returns>
        public List<PatientEatMaster> GetAllPatientEatMasters()
        {
            var patientEatMasters = this.iTenantMasterService.GetPatientEatMasterList();
            return patientEatMasters;
        }

        ///// <summary>
        ///// Get Food Intake Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FoodIntakeMaster>. if Collection of Food Intake Master = success. else = failure</returns>
        public List<FoodIntakeMaster> GetAllFoodIntakeMasters()
        {
            var foodIntakeMasters = this.iTenantMasterService.GetFoodIntakeMasterList();
            return foodIntakeMasters;
        }

        ///// <summary>
        ///// Get All Facilities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Facility>. if Collection of Facility = success. else = failure</returns>
        public List<Facility> GetAllFacilitiesForTriage()
        {
            var facList = this.utilService.GetFacilitiesforUser();
            var facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                              join record in facList
                              on fac.FacilityId equals record.FacilityId
                              select fac).ToList();
            return facilities;
        }

        ///// <summary>
        ///// Get All Providers
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Provider>. if Collection of Provider = success. else = failure</returns>
        public List<Provider> GetAllProvidersForTriage()
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
                            ProviderList.Add(prov);
                        }
                    }
                }
            }
            return ProviderList;
        }

        ///// <summary>
        ///// Get Providers For Triage
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for Registeration = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforTriage(string searchKey)
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
        ///// Get All Appointment Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AppointmentType>. if Collection of AppointmentType = success. else = failure</returns>
        public List<AppointmentType> GetAllAppointmentTypes()
        {
            var appointTypes = this.iTenantMasterService.GetAppointmentTypeList();
            return appointTypes;
        }

        ///// <summary>
        ///// Get All Appointment Statuses
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AppointmentStatus>. if Collection of AppointmentStatus = success. else = failure</returns>
        public List<AppointmentStatus> GetAllAppointmentStatuses()
        {
            var appointStatuses = this.iTenantMasterService.GetAppointmentStatusList();
            return appointStatuses;
        }

        ///// <summary>
        ///// Get All Problem Area values
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProblemArea>. if Collection of ProblemArea = success. else = failure</returns>
        public List<ProblemArea> GetAllProblemAreavalues()
        {
            var problemAreas = this.iTenantMasterService.GetAllProblemAreas();
            return problemAreas;
        }

        ///// <summary>
        ///// Get All Problem Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProblemType>. if Collection of ProblemType = success. else = failure</returns>
        public List<ProblemType> GetAllProblemTypes()
        {
            var problemTypes = this.iTenantMasterService.GetProblemTypeList();
            return problemTypes;
        }

        ///// <summary>
        ///// Get All Symptoms
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Symptoms>. if Collection of Symptoms = success. else = failure</returns>
        public List<Symptoms> GetAllSymptoms()
        {
            var symptoms = this.iTenantMasterService.GetSymptomsList();
            return symptoms;
        }

        ///// <summary>
        ///// Get All Requested Procedures
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RequestedProcedure>. if Collection of RequestedProcedure = success. else = failure</returns>
        public List<RequestedProcedure> GetAllRequestedProcedures()
        {
            var reqProcedures = this.iTenantMasterService.GetRequestedProcedureList();
            return reqProcedures;
        }

        ///// <summary>
        ///// Get Drug Codes for given searchKey
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<DrugCode>. if Collection of DrugCodes for given searchKey = success. else = failure</returns>
        public List<DrugCode> GetAllDrugCodes(string searchKey)
        {
            return this.utilService.GetAllDrugCodes(searchKey);
        }

        ///// <summary>
        ///// Get All Dispense Form data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DispenseForm>. if Collection of DispenseFormData = success. else = failure</returns>
        public List<DispenseForm> GetDispenseFormData()
        {
            var dispenseData = this.iTenantMasterService.GetDispenseFormList();
            return dispenseData;
        }

        ///// <summary>
        ///// Get All Dosage Form data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DosageForm>. if Collection of DosageFormData = success. else = failure</returns>
        public List<DosageForm> GetDosageFormData()
        {
            var dosageData = this.iTenantMasterService.GetDosageFormList();
            return dosageData;
        }

        ///// <summary>
        ///// Get Visit details by Patient Id
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientVisitModel>. if list of Visits for given Patient Id = success. else = failure</returns>
        public List<PatientVisitModel> GetVisitsForPatient(int PatientId)
        {
            var visitList = (from visit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.PatientId == PatientId)
                             join pat in this.uow.GenericRepository<Patient>().Table()
                             on visit.PatientId equals pat.PatientId
                             select new
                             {
                                 visit.VisitId,
                                 visit.VisitNo,
                                 visit.VisitDate,
                                 visit.FacilityID,
                                 visit.ProviderID,
                                 visit.Visittime,
                                 pat.PatientId,
                                 visit.RecordedDuringID

                             }).AsEnumerable().Select(PVM => new PatientVisitModel
                             {
                                 VisitId = PVM.VisitId,
                                 VisitNo = PVM.VisitNo,
                                 PatientId = PVM.PatientId,
                                 FacilityID = PVM.FacilityID,
                                 ProviderID = PVM.ProviderID,
                                 VisitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString(),
                                 recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : ""

                             }).ToList();

            List<PatientVisitModel> visitsCollection = new List<PatientVisitModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visitList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        visitsCollection = (from vis in visitList
                                            join fac in facList on vis.FacilityID equals fac.FacilityId
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                    else
                    {
                        visitsCollection = (from vis in visitList
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                }
                else
                {
                    visitsCollection = (from vis in visitList
                                        join fac in facList on vis.FacilityID equals fac.FacilityId
                                        select vis).ToList();
                }
            }
            else
            {
                visitsCollection = visitList;
            }

            return visitsCollection;
        }

        ///// <summary>
        ///// Get All Provider names
        ///// </summary>
        ///// <param>int FacilityId</param>
        ///// <returns>List<string>. if Collection of Provider Names for given FacilityID = success. else = failure</returns>
        public List<string> GetProviderNames(int facilityId)
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
        ///// Get All Prescription Order Type data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PrescriptionOrderType>. if Collection of PrescriptionOrderType = success. else = failure</returns>
        public List<PrescriptionOrderType> GetAllPrescriptionOrderTypes()
        {
            var prescriptionTypes = this.iTenantMasterService.GetPrescriptionOrderTypeList();
            return prescriptionTypes;
        }

        ///// <summary>
        ///// Get All Medication Units data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationUnits>. if Collection of MedicationUnits = success. else = failure</returns>
        public List<MedicationUnits> GetMedicationUnits()
        {
            var medicationUnits = this.iTenantMasterService.GetMedicationUnitList();
            return medicationUnits;
        }

        ///// <summary>
        ///// Get All Medication Routes data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationRoute>. if Collection of MedicationRoute = success. else = failure</returns>
        public List<MedicationRoute> GetMedicationRoutes()
        {
            var medicationRoutes = this.iTenantMasterService.GetMedicationRouteList();
            return medicationRoutes;
        }

        ///// <summary>
        ///// Get All Medication Statuses data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationStatus>. if Collection of MedicationStatus = success. else = failure</returns>
        public List<MedicationStatus> GetAllMedicationStatus()
        {
            var medicationStatuses = this.iTenantMasterService.GetMedicationStatusList();
            return medicationStatuses;
        }

        //// <summary>
        ///// Get All Balance values for Intake
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FCBalance>. if Collection of for Intake = success. else = failure</returns>
        public List<FCBalance> GetBalanceListforIntake()
        {
            var fcBalances = this.iTenantMasterService.GetAllBalanceList();

            return fcBalances;
        }

        //// <summary>
        ///// Get All Mobilities for Intake
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FCMobility>. if Collection of Mobilities for Intake = success. else = failure</returns>
        public List<FCMobility> GetMobilitiesforIntake()
        {
            var fcMobilities = this.iTenantMasterService.GetAllMobilities();

            return fcMobilities;
        }

        //// <summary>
        ///// Get All Pain Scales for Intake
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PainScale>. if Collection of Pain Scales for Intake = success. else = failure</returns>
        public List<PainScale> GetPainScalesforIntake()
        {
            var painScales = this.iTenantMasterService.GetAllPainScales();

            return painScales;
        }

        //// <summary>
        ///// Get All Gait Values
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<GaitMaster>. if Collection of Gait Values = success. else = failure</returns>
        public List<GaitMaster> GetGaitMasterValues()
        {
            var gaitValues = this.iTenantMasterService.GetAllGaitMasters();

            return gaitValues;
        }

        //// <summary>
        ///// Get Treatment Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<TreatmentTypeMaster>. if Collection of Treatment Types = success. else = failure</returns>
        public List<TreatmentTypeMaster> GetTreatmentTypes()
        {
            var treatmentTypes = this.iTenantMasterService.GetAllTreatmentTypes();

            return treatmentTypes;
        }

        ///// <summary>
        ///// Get Drinking Master List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DrinkingMaster>. if Collection of Drinking Master = success. else = failure</returns>
        public List<DrinkingMaster> GetAllDrinkingMasters()
        {
            var drinkingMasters = this.iTenantMasterService.GetDrinkingMasterList();
            return drinkingMasters;
        }

        ///// <summary>
        ///// Get Smoking Master List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<SmokingMaster>. if Collection of Smoking Master = success. else = failure</returns>
        public List<SmokingMaster> GetAllSmokingMasters()
        {
            var smokingMasters = this.iTenantMasterService.GetSmokingMasterList();
            return smokingMasters;
        }

        //// <summary>
        ///// Get All Patient Positions for Intake
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientPosition>. if Collection of Patient Positions for Intake = success. else = failure</returns>
        public List<PatientPosition> GetPatientPositionsforIntake()
        {
            var patientPositions = this.iTenantMasterService.GetAllPatientPositions();

            return patientPositions;
        }

        //// <summary>
        ///// Get All Problem Statuses for Intake
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProblemStatus>. if Collection of Problem Statuses for Intake = success. else = failure</returns>
        public List<ProblemStatus> GetProblemStatusesforCaseSheet()
        {
            var problemStatuses = this.iTenantMasterService.GetAllProblemStatuses();

            return problemStatuses;
        }

        //// <summary>
        ///// Get All Temperature Locations for Intake
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<TemperatureLocation>. if Collection of Temperature Locations for Intake = success. else = failure</returns>
        public List<TemperatureLocation> GetTemperatureLocationsforIntake()
        {
            var temperatureLocations = this.iTenantMasterService.GetAllTemperatureLocations();

            return temperatureLocations;
        }

        //// <summary>
        ///// Get All ProcedureStatuses for Intake
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProcedureStatus>. if Collection of Procedure Status for Intake = success. else = failure</returns>
        public List<ProcedureStatus> GetProcedureStatusesforCaseSheet()
        {
            var procedureStatuses = this.iTenantMasterService.GetAllProcedureStatuses();

            return procedureStatuses;
        }

        //// <summary>
        ///// Get All Procedure Type for Intake
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProcedureType>. if Collection of Procedure Type for Intake = success. else = failure</returns>
        public List<ProcedureType> GetProcedureTypesforCaseSheet()
        {
            var procedureTypes = this.iTenantMasterService.GetAllProcedureTypes();

            return procedureTypes;
        }

        //// <summary>
        ///// Get All Procedures for Procedure Request by search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Procedures>. if Collection of Procedures for Procedure Request by search = success. else = failure</returns>
        public List<Procedures> GetProceduresforProcedureRequest(string searchKey)
        {
            var procedures = this.iTenantMasterService.GetAllProcedures(searchKey);

            return procedures;
        }

        ///// <summary>
        ///// Get All Care Plan Status Masters
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<CarePlanStatusMaster>. if Collection of Care Plan Status Master = success. else = failure</returns>
        public List<CarePlanStatusMaster> GetAllCarePlanStatusMasters()
        {
            var carePlanStatusMasters = this.iTenantMasterService.GetCarePlanStatusMasterList();
            return carePlanStatusMasters;
        }

        ///// <summary>
        ///// Get All Care Plan Progress Masters
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<CarePlanProgressMaster>. if Collection of Care Plan Progress Master = success. else = failure</returns>
        public List<CarePlanProgressMaster> GetAllCarePlanProgressMasters()
        {
            var carePlanProgressMasters = this.iTenantMasterService.GetCarePlanProgressMasterList();
            return carePlanProgressMasters;
        }

        //// <summary>
        ///// Get Urgency Types
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<UrgencyType>. if Collection of Urgency Types = success. else = failure</returns>
        public List<UrgencyType> GetUrgencyTypes()
        {
            var Urgencies = this.iTenantMasterService.GetUrgencyTypeList();
            return Urgencies;
        }

        //// <summary>
        ///// Get AdmissionTypes for Triage
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionType>. if Collection of Admission Types for Triage = success. else = failure</returns>
        public List<AdmissionType> GetAdmissionTypesforTriage()
        {
            var admissionTypes = this.iTenantMasterService.GetAllAdmissionTypes();

            return admissionTypes;
        }

        //// <summary>
        ///// Get AdmissionStatus for Triage
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionStatus>. if Collection of Admission Status for Triage = success. else = failure</returns>
        public List<AdmissionStatus> GetAdmissionStatusforTriage()
        {
            var admissionStatus = this.iTenantMasterService.GetAllAdmissionStatus();
            return admissionStatus;
        }

        ///// <summary>
        ///// Get PatientVisit By Id
        ///// </summary>
        ///// <param>int VisitId</param>
        ///// <returns>PatientVisitModel. if Patient visit for given id = success. else = failure</returns>
        public PatientVisitModel GetVisitRecordById(int VisitId)
        {
            var visit = (from patVisit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitId)

                         join pat in this.uow.GenericRepository<Patient>().Table()
                         on patVisit.PatientId equals pat.PatientId

                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                         on patVisit.ProviderID equals prov.ProviderID

                         select new
                         {
                             patVisit.VisitId,
                             patVisit.VisitNo,
                             patVisit.VisitDate,
                             patVisit.ProviderID,
                             patVisit.FacilityID,
                             patVisit.RecordedDuringID,
                             prov.FirstName,
                             prov.MiddleName,
                             prov.LastName,
                             pat.PatientFirstName,
                             pat.PatientMiddleName,
                             pat.PatientLastName

                         }).AsEnumerable().Select(PVM => new PatientVisitModel
                         {
                             VisitId = PVM.VisitId,
                             VisitNo = PVM.VisitNo,
                             VisitDate = PVM.VisitDate,
                             VisitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString(),
                             ProviderID = PVM.ProviderID,
                             FacilityID = PVM.FacilityID,
                             FacilityName = PVM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PVM.FacilityID).FacilityName : "",
                             recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : "",
                             ProviderName = PVM.FirstName + " " + PVM.MiddleName + " " + PVM.LastName,
                             PatientName = PVM.PatientFirstName + " " + PVM.PatientMiddleName + " " + PVM.PatientLastName

                         }).FirstOrDefault();

            return visit;
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

        #endregion

        #region Search

        ///// <summary>
        ///// Get Visited Patients Data by using SearchModel
        ///// </summary>
        ///// <param>(SearchModel searchModel)</param>
        ///// <returns>List<PatientVisitModel>. if Collection of VisitedPatients = success. else = failure</returns>
        public List<PatientVisitModel> GetVisitedPatientsBySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            var VisitedPatients = (from visit in this.uow.GenericRepository<PatientVisit>().Table()
                                   join pat in this.uow.GenericRepository<Patient>().Table()
                                   on visit.PatientId equals pat.PatientId
                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                   on visit.ProviderID equals prov.ProviderID
                                   join status in this.uow.GenericRepository<VisitStatus>().Table()
                                   on visit.VisitStatusID equals status.VisitStatusId
                                   join type in this.uow.GenericRepository<VisitType>().Table()
                                   on visit.VisitTypeID equals type.VisitTypeId
                                   join urgncy in this.uow.GenericRepository<UrgencyType>().Table()
                                   on visit.UrgencyTypeID equals urgncy.UrgencyTypeId
                                   where
                                   (Fromdate.Date <= visit.VisitDate.Date
                                         && (Todate.Date >= Fromdate.Date && visit.VisitDate.Date <= Todate.Date)
                                         && (searchModel.PatientId == 0 || visit.PatientId == searchModel.PatientId)
                                         && (searchModel.ProviderId == 0 || visit.ProviderID == searchModel.ProviderId)
                                         && (searchModel.FacilityId == 0 || visit.FacilityID == searchModel.FacilityId)
                                         && ((searchModel.VisitNo == null || searchModel.VisitNo == "") || visit.VisitNo.ToLower().Trim() == searchModel.VisitNo.ToLower().Trim())
                                         )
                                   select new
                                   {
                                       pat.PatientFirstName,
                                       pat.PatientMiddleName,
                                       pat.PatientLastName,
                                       prov.FirstName,
                                       prov.MiddleName,
                                       prov.LastName,
                                       //proSpec.SpecialityDescription,
                                       status.VisitStatusDescription,
                                       type.VisitTypeDescription,
                                       urgncy.UrgencyTypeDescription,
                                       visit.VisitId,
                                       visit.VisitNo,
                                       visit.ProviderID,
                                       visit.PatientId,
                                       visit.FacilityID,
                                       visit.VisitDate,
                                       visit.Visittime,
                                       visit.VisitStatusID,
                                       visit.VisitTypeID,
                                       visit.RecordedDuringID
                                   }
                                   ).AsEnumerable().Select(PVM => new PatientVisitModel
                                   {
                                       VisitId = PVM.VisitId,
                                       VisitNo = PVM.VisitNo,
                                       ProviderID = PVM.ProviderID,
                                       PatientId = PVM.PatientId,
                                       PatientName = PVM.PatientFirstName + " " + PVM.PatientMiddleName + " " + PVM.PatientLastName,
                                       ProviderName = PVM.FirstName + " " + PVM.MiddleName + " " + PVM.LastName,// + "/ " + PVM.SpecialityDescription,
                                       FacilityID = PVM.FacilityID,
                                       FacilityName = PVM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PVM.FacilityID).FacilityName : "",
                                       visitStatus = PVM.VisitStatusDescription,
                                       visitType = PVM.VisitTypeDescription,
                                       urgencyType = PVM.UrgencyTypeDescription,
                                       VisitDate = PVM.VisitDate,
                                       Visittime = PVM.Visittime,
                                       VisitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString(),
                                       ConsultStartTime = PVM.VisitDate.ToString("hh:mm tt"),
                                       ConsultEndTime = PVM.VisitDate.ToString("hh:mm tt"),
                                       recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : ""

                                   }).ToList();

            List<PatientVisitModel> visitsCollection = new List<PatientVisitModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (VisitedPatients.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            visitsCollection = (from vis in VisitedPatients
                                                join fac in facList on vis.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on vis.ProviderID equals prov.ProviderID
                                                select vis).ToList();
                        }
                        else
                        {
                            visitsCollection = (from vis in VisitedPatients
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on vis.ProviderID equals prov.ProviderID
                                                select vis).ToList();
                        }
                    }
                    else
                    {
                        visitsCollection = (from vis in VisitedPatients.Where(x => x.FacilityID == searchModel.FacilityId)
                                            join fac in facList on vis.FacilityID equals fac.FacilityId
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                }
                else
                {
                    visitsCollection = (from vis in VisitedPatients
                                        join fac in facList on vis.FacilityID equals fac.FacilityId
                                        select vis).ToList();
                }
            }
            else
            {
                visitsCollection = VisitedPatients;
            }

            return visitsCollection;
        }

        ///// <summary>
        ///// Get Visited Patients Data 
        ///// </summary>
        ///// <param>Nil</param>
        ///// <returns>List<PatientVisitModel>. if Collection of VisitedPatients = success. else = failure</returns>
        public List<PatientVisitModel> GetVisitsforTriage()
        {
            var VisitedPatients = (from visit in this.uow.GenericRepository<PatientVisit>().Table()
                                   join pat in this.uow.GenericRepository<Patient>().Table()
                                   on visit.PatientId equals pat.PatientId
                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                   on visit.ProviderID equals prov.ProviderID
                                   join status in this.uow.GenericRepository<VisitStatus>().Table()
                                   on visit.VisitStatusID equals status.VisitStatusId
                                   join type in this.uow.GenericRepository<VisitType>().Table()
                                   on visit.VisitTypeID equals type.VisitTypeId
                                   join urgncy in this.uow.GenericRepository<UrgencyType>().Table()
                                   on visit.UrgencyTypeID equals urgncy.UrgencyTypeId

                                   select new
                                   {
                                       pat.PatientFirstName,
                                       pat.PatientMiddleName,
                                       pat.PatientLastName,
                                       prov.FirstName,
                                       prov.MiddleName,
                                       prov.LastName,
                                       //proSpec.SpecialityDescription,
                                       status.VisitStatusDescription,
                                       type.VisitTypeDescription,
                                       urgncy.UrgencyTypeDescription,
                                       visit.VisitId,
                                       visit.VisitNo,
                                       visit.ProviderID,
                                       visit.PatientId,
                                       visit.FacilityID,
                                       visit.VisitDate,
                                       visit.Visittime,
                                       visit.VisitStatusID,
                                       visit.VisitTypeID,
                                       visit.RecordedDuringID
                                   }
                                   ).AsEnumerable().Select(PVM => new PatientVisitModel
                                   {
                                       VisitId = PVM.VisitId,
                                       VisitNo = PVM.VisitNo,
                                       ProviderID = PVM.ProviderID,
                                       PatientId = PVM.PatientId,
                                       PatientName = PVM.PatientFirstName + " " + PVM.PatientMiddleName + " " + PVM.PatientLastName,
                                       ProviderName = PVM.FirstName + " " + PVM.MiddleName + " " + PVM.LastName,// + "/ " + PVM.SpecialityDescription,
                                       FacilityID = PVM.FacilityID,
                                       FacilityName = PVM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PVM.FacilityID).FacilityName : "",
                                       visitStatus = PVM.VisitStatusDescription,
                                       visitType = PVM.VisitTypeDescription,
                                       urgencyType = PVM.UrgencyTypeDescription,
                                       VisitDate = PVM.VisitDate,
                                       Visittime = PVM.Visittime,
                                       VisitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString(),
                                       ConsultStartTime = PVM.VisitDate.ToString("hh:mm tt"),
                                       ConsultEndTime = PVM.VisitDate.ToString("hh:mm tt"),
                                       recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : ""

                                   }).ToList();

            List<PatientVisitModel> visitsCollection = new List<PatientVisitModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (VisitedPatients.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        visitsCollection = (from vis in VisitedPatients
                                            join fac in facList on vis.FacilityID equals fac.FacilityId
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                    else
                    {
                        visitsCollection = (from vis in VisitedPatients
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                }
                else
                {
                    visitsCollection = (from vis in VisitedPatients
                                        join fac in facList on vis.FacilityID equals fac.FacilityId
                                        select vis).ToList();
                }
            }
            else
            {
                visitsCollection = VisitedPatients;
            }

            return visitsCollection;
        }

        ///// <summary>
        ///// Get Counts of Triage
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> If counts of Triage = success. else = failure</returns>
        public TriageCountModel GetTriageCount()
        {
            TriageCountModel countModel = new TriageCountModel();
            var visits = this.GetVisitsforTriage().Where(x => x.VisitDate.Date == DateTime.Now.Date).ToList();

            var triageRecords = (from set in visits
                                 join sign in this.uow.GenericRepository<VisitSignOff>().Table()
                                 on set.VisitId equals sign.VisitID
                                 select sign).ToList();

            countModel.TotalVisitCount = visits.Count();
            countModel.TriageCompletedCount = triageRecords.Count() == 0 ? 0 : triageRecords.Where(x => x.Intake == true && x.CaseSheet == true).ToList().Count();
            countModel.TriageWaitingCount = triageRecords.Count() == 0 ? visits.Count() : (visits.Count() - countModel.TriageCompletedCount);

            return countModel;
        }

        ///// <summary>
        ///// Get Patients for Triage search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForTriageSearch(string searchKey)
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
        ///// Get Specialities for Triage search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProviderSpeciality> If ProviderSpeciality table data collection returns = success. else = failure</returns>
        public List<ProviderSpeciality> GetSpecialitiesForTriageSearch()
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

        #region InTake

        ///// <summary>
        ///// Add or Update Patient Vitals for a Visit
        ///// </summary>
        ///// <param>(PatientVitalsModel vitalsModel)</param>
        ///// <returns>PatientVitalsModel. if set of PatientVitalsModel data saved in DB = success. else = failure</returns>
        public PatientVitalsModel AddUpdateVitalsforVisit(PatientVitalsModel vitalsModel)
        {
            var vital = this.uow.GenericRepository<PatientVitals>().Table().Where(x => x.VisitId == vitalsModel.VisitId & x.IsActive != false).FirstOrDefault();

            if (vital == null)
            {
                vital = new PatientVitals();

                vital.PatientId = vitalsModel.PatientId;
                vital.RecordedDate = this.utilService.GetLocalTime(vitalsModel.RecordedDate);
                vital.RecordedBy = vitalsModel.RecordedBy;
                vital.VisitId = vitalsModel.VisitId;
                vital.Height = vitalsModel.Height;
                vital.Weight = vitalsModel.Weight;
                vital.BMI = vitalsModel.BMI;
                vital.WaistCircumference = vitalsModel.WaistCircumference;
                vital.BPSystolic = vitalsModel.BPSystolic;
                vital.BPDiastolic = vitalsModel.BPDiastolic;
                vital.BPLocationID = vitalsModel.BPLocationID;
                vital.Temperature = vitalsModel.Temperature;
                vital.TemperatureLocation = vitalsModel.TemperatureLocation;
                vital.HeartRate = vitalsModel.HeartRate;
                vital.RespiratoryRate = vitalsModel.RespiratoryRate;
                vital.O2Saturation = vitalsModel.O2Saturation;
                vital.BloodsugarRandom = vitalsModel.BloodsugarRandom;
                vital.BloodsugarFasting = vitalsModel.BloodsugarFasting;
                vital.BloodSugarPostpardinal = vitalsModel.BloodSugarPostpardinal;
                vital.PainArea = vitalsModel.PainArea;
                vital.PainScale = vitalsModel.PainScale;
                vital.HeadCircumference = vitalsModel.HeadCircumference;
                vital.LastMealdetails = vitalsModel.LastMealdetails;
                vital.LastMealtakenon = vitalsModel.LastMealtakenon != null ? this.utilService.GetLocalTime(vitalsModel.LastMealtakenon.Value) : vitalsModel.LastMealtakenon;
                vital.PatientPosition = vitalsModel.PatientPosition;
                vital.IsBloodPressure = vitalsModel.IsBloodPressure;
                vital.IsDiabetic = vitalsModel.IsDiabetic;
                vital.Notes = vitalsModel.Notes;
                vital.IsActive = true;
                vital.Createdby = "User";
                vital.CreatedDate = DateTime.Now;

                this.uow.GenericRepository<PatientVitals>().Insert(vital);
            }
            else
            {
                //vital.PatientId = vitalsModel.PatientId;
                //vital.VisitId = vitalsModel.VisitId;
                vital.RecordedDate = this.utilService.GetLocalTime(vitalsModel.RecordedDate);
                vital.RecordedBy = vitalsModel.RecordedBy;
                vital.Height = vitalsModel.Height;
                vital.Weight = vitalsModel.Weight;
                vital.BMI = vitalsModel.BMI;
                vital.WaistCircumference = vitalsModel.WaistCircumference;
                vital.BPSystolic = vitalsModel.BPSystolic;
                vital.BPDiastolic = vitalsModel.BPDiastolic;
                vital.BPLocationID = vitalsModel.BPLocationID;
                vital.Temperature = vitalsModel.Temperature;
                vital.TemperatureLocation = vitalsModel.TemperatureLocation;
                vital.HeartRate = vitalsModel.HeartRate;
                vital.RespiratoryRate = vitalsModel.RespiratoryRate;
                vital.O2Saturation = vitalsModel.O2Saturation;
                vital.BloodsugarRandom = vitalsModel.BloodsugarRandom;
                vital.BloodsugarFasting = vitalsModel.BloodsugarFasting;
                vital.BloodSugarPostpardinal = vitalsModel.BloodSugarPostpardinal;
                vital.PainArea = vitalsModel.PainArea;
                vital.PainScale = vitalsModel.PainScale;
                vital.HeadCircumference = vitalsModel.HeadCircumference;
                vital.LastMealdetails = vitalsModel.LastMealdetails;
                vital.LastMealtakenon = vitalsModel.LastMealtakenon != null ? this.utilService.GetLocalTime(vitalsModel.LastMealtakenon.Value) : vitalsModel.LastMealtakenon;
                vital.PatientPosition = vitalsModel.PatientPosition;
                vital.IsBloodPressure = vitalsModel.IsBloodPressure;
                vital.IsDiabetic = vitalsModel.IsDiabetic;
                vital.Notes = vitalsModel.Notes;
                vital.IsActive = true;
                vital.ModifiedBy = "User";
                vital.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<PatientVitals>().Update(vital);
            }
            this.uow.Save();

            return vitalsModel;

        }

        ///// <summary>
        ///// Add or Update Patient Allergy details for a Visit
        ///// </summary>
        ///// <param>(PatientAllergyModel allergyModel)</param>
        ///// <returns>PatientAllergyModel. if set of PatientAllergyModel data saved in DB = success. else = failure</returns>
        public PatientAllergyModel AddUpdateAllergiesForVisit(PatientAllergyModel allergyModel)
        {
            //var allergy = this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.VisitId == allergyModel.VisitId & x.IsActive != false).FirstOrDefault();
            var allergy = this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.AllergyId == allergyModel.AllergyId).FirstOrDefault();

            if (allergy == null)
            {
                allergy = new PatientAllergy();

                allergy.PatientId = allergyModel.PatientId;
                allergy.VisitId = allergyModel.VisitId;
                allergy.RecordedDate = this.utilService.GetLocalTime(allergyModel.RecordedDate);
                allergy.RecordedBy = allergyModel.RecordedBy;
                allergy.AllergyTypeID = allergyModel.AllergyTypeID;
                allergy.Name = allergyModel.Name;
                allergy.Allergydescription = allergyModel.Allergydescription;
                allergy.Aggravatedby = allergyModel.Aggravatedby;
                allergy.Alleviatedby = allergyModel.Alleviatedby;
                allergy.Onsetdate = allergyModel.Onsetdate != null ? this.utilService.GetLocalTime(allergyModel.Onsetdate.Value) : allergyModel.Onsetdate;
                allergy.AllergySeverityID = allergyModel.AllergySeverityID;
                allergy.Reaction = allergyModel.Reaction;
                allergy.Status = allergyModel.Status;
                allergy.ICD10 = allergyModel.ICD10;
                allergy.SNOMED = allergyModel.SNOMED;
                allergy.Notes = allergyModel.Notes;
                allergy.IsActive = true;
                allergy.CreatedDate = DateTime.Now;
                allergy.Createdby = "User";

                this.uow.GenericRepository<PatientAllergy>().Insert(allergy);
            }
            else
            {
                //allergy.PatientId = allergyModel.PatientId;
                //allergy.VisitId = allergyModel.VisitId;
                allergy.RecordedDate = this.utilService.GetLocalTime(allergyModel.RecordedDate);
                allergy.RecordedBy = allergyModel.RecordedBy;
                allergy.AllergyTypeID = allergyModel.AllergyTypeID;
                allergy.Name = allergyModel.Name;
                allergy.Allergydescription = allergyModel.Allergydescription;
                allergy.Aggravatedby = allergyModel.Aggravatedby;
                allergy.Alleviatedby = allergyModel.Alleviatedby;
                allergy.Onsetdate = allergyModel.Onsetdate != null ? this.utilService.GetLocalTime(allergyModel.Onsetdate.Value) : allergyModel.Onsetdate;
                allergy.AllergySeverityID = allergyModel.AllergySeverityID;
                allergy.Reaction = allergyModel.Reaction;
                allergy.Status = allergyModel.Status;
                allergy.ICD10 = allergyModel.ICD10;
                allergy.SNOMED = allergyModel.SNOMED;
                allergy.Notes = allergyModel.Notes;
                allergy.IsActive = true;
                allergy.ModifiedDate = DateTime.Now;
                allergy.Modifiedby = "User";

                this.uow.GenericRepository<PatientAllergy>().Update(allergy);
            }
            this.uow.Save();
            allergyModel.AllergyId = allergy.AllergyId;

            return allergyModel;
        }

        ///// <summary>
        ///// Add or Update Patient Allergy collection for a Visit
        ///// </summary>
        ///// <param>(IEnumerable<PatientAllergyModel> allergycollection)</param>
        ///// <returns>List<PatientAllergyModel>. if collection of PatientAllergyModel data saved in DB = success. else = failure</returns>
        public List<PatientAllergyModel> AddUpdateAllergyCollection(IEnumerable<PatientAllergyModel> allergycollection)
        {
            List<PatientAllergyModel> AllergyList = new List<PatientAllergyModel>();
            var allergyRecords = this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.VisitId == allergycollection.FirstOrDefault().VisitId).ToList();
            if (allergyRecords.Count() == 0)
            {
                foreach (var allergyModel in allergycollection)
                {
                    PatientAllergyModel allergyItem = new PatientAllergyModel();
                    allergyItem = this.AddUpdateAllergiesForVisit(allergyModel);

                    AllergyList.Add(allergyItem);
                }
            }
            else
            {
                var itemsList = new List<PatientAllergyModel>();
                foreach (var set in allergyRecords)
                {
                    var record = allergycollection.Where(x => x.AllergyId == set.AllergyId).FirstOrDefault();
                    if (record == null)
                    {
                        this.uow.GenericRepository<PatientAllergy>().Delete(set);
                    }
                    else
                    {
                        itemsList.Add(record);
                    }
                }
                this.uow.Save();

                foreach (var Set in allergycollection)
                {
                    if (!itemsList.Contains(Set))
                    {
                        itemsList.Add(Set);
                    }
                }

                //foreach (var record in allergyRecords)
                //{
                //    this.uow.GenericRepository<PatientAllergy>().Delete(record);
                //}
                //this.uow.Save();

                foreach (var allergyModel in itemsList)
                {
                    PatientAllergyModel allergyItem = new PatientAllergyModel();
                    allergyItem = this.AddUpdateAllergiesForVisit(allergyModel);

                    AllergyList.Add(allergyItem);
                }
            }

            return AllergyList;
        }

        ///// <summary>
        ///// Add or Update Patient ProblemList details for a Visit
        ///// </summary>
        ///// <param>(PatientProblemListModel problemListModel)</param>
        ///// <returns>PatientProblemListModel. if set of PatientProblemListModel data saved in DB = success. else = failure</returns>
        public PatientProblemListModel AddUpdateProblemListForVisit(PatientProblemListModel problemListModel)
        {
            //var problems = this.uow.GenericRepository<PatientProblemList>().Table().Where(x => x.VisitId == problemListModel.VisitId & x.IsActive != false).FirstOrDefault();
            var problems = this.uow.GenericRepository<PatientProblemList>().Table().Where(x => x.ProblemlistId == problemListModel.ProblemlistId).FirstOrDefault();

            if (problems == null)
            {
                problems = new PatientProblemList();

                problems.PatientId = problemListModel.PatientId;
                problems.VisitId = problemListModel.VisitId;
                problems.RecordedDate = this.utilService.GetLocalTime(problemListModel.RecordedDate);
                problems.RecordedBy = problemListModel.RecordedBy;
                problems.ProblemTypeID = problemListModel.ProblemTypeID;
                problems.ProblemDescription = problemListModel.ProblemDescription;
                problems.ICD10Code = problemListModel.ICD10Code;
                problems.SNOMEDCode = problemListModel.SNOMEDCode;
                problems.Aggravatedby = problemListModel.Aggravatedby;
                problems.DiagnosedDate = problemListModel.DiagnosedDate != null ? this.utilService.GetLocalTime(problemListModel.DiagnosedDate.Value) : problemListModel.DiagnosedDate;
                problems.ResolvedDate = problemListModel.ResolvedDate != null ? this.utilService.GetLocalTime(problemListModel.ResolvedDate.Value) : problemListModel.ResolvedDate;
                problems.Status = problemListModel.Status;
                problems.AttendingPhysican = problemListModel.AttendingPhysican;
                problems.AlleviatedBy = problemListModel.AlleviatedBy;
                problems.FileName = problemListModel.FileName;
                problems.Notes = problemListModel.Notes;
                problems.IsActive = true;
                problems.CreatedDate = DateTime.Now;
                problems.Createdby = "User";

                this.uow.GenericRepository<PatientProblemList>().Insert(problems);
            }
            else
            {
                //problems.PatientId = problemListModel.PatientId;
                //problems.VisitId = problemListModel.VisitId;
                problems.RecordedDate = this.utilService.GetLocalTime(problemListModel.RecordedDate);
                problems.RecordedBy = problemListModel.RecordedBy;
                problems.ProblemTypeID = problemListModel.ProblemTypeID;
                problems.ProblemDescription = problemListModel.ProblemDescription;
                problems.ICD10Code = problemListModel.ICD10Code;
                problems.SNOMEDCode = problemListModel.SNOMEDCode;
                problems.Aggravatedby = problemListModel.Aggravatedby;
                problems.DiagnosedDate = problemListModel.DiagnosedDate != null ? this.utilService.GetLocalTime(problemListModel.DiagnosedDate.Value) : problemListModel.DiagnosedDate;
                problems.ResolvedDate = problemListModel.ResolvedDate != null ? this.utilService.GetLocalTime(problemListModel.ResolvedDate.Value) : problemListModel.ResolvedDate;
                problems.Status = problemListModel.Status;
                problems.AttendingPhysican = problemListModel.AttendingPhysican;
                problems.AlleviatedBy = problemListModel.AlleviatedBy;
                problems.FileName = problemListModel.FileName;
                problems.Notes = problemListModel.Notes;
                problems.IsActive = true;
                problems.ModifiedDate = DateTime.Now;
                problems.Modifiedby = "User";

                this.uow.GenericRepository<PatientProblemList>().Update(problems);
            }
            this.uow.Save();
            problemListModel.ProblemlistId = problems.ProblemlistId;

            return problemListModel;
        }

        ///// <summary>
        ///// Add or Update Patient ProblemList collection for a Visit
        ///// </summary>
        ///// <param>(IEnumerable<PatientProblemListModel> problemListCollection)</param>
        ///// <returns>List<PatientProblemListModel>. if collection of PatientProblemListModel data saved in DB = success. else = failure</returns>
        public List<PatientProblemListModel> AddUpdateProblemListCollection(IEnumerable<PatientProblemListModel> problemListCollection)
        {
            List<PatientProblemListModel> problemListRecords = new List<PatientProblemListModel>();
            var problemRecords = this.uow.GenericRepository<PatientProblemList>().Table().Where(x => x.VisitId == problemListCollection.FirstOrDefault().VisitId).ToList();
            if (problemRecords.Count() == 0)
            {
                foreach (var problemListModel in problemListCollection)
                {
                    PatientProblemListModel problemModel = new PatientProblemListModel();
                    problemModel = this.AddUpdateProblemListForVisit(problemListModel);

                    problemListRecords.Add(problemModel);
                }
            }
            else
            {
                var itemsList = new List<PatientProblemListModel>();
                foreach (var set in problemRecords)
                {
                    var record = problemListCollection.Where(x => x.ProblemlistId == set.ProblemlistId).FirstOrDefault();
                    if (record == null)
                    {
                        this.uow.GenericRepository<PatientProblemList>().Delete(set);
                    }
                    else
                    {
                        itemsList.Add(record);
                    }
                }
                this.uow.Save();

                foreach (var Set in problemListCollection)
                {
                    if (!itemsList.Contains(Set))
                    {
                        itemsList.Add(Set);
                    }
                }
                //foreach (var record in problemRecords)
                //{
                //    this.uow.GenericRepository<PatientProblemList>().Delete(record);
                //}
                //this.uow.Save();

                foreach (var problemListModel in itemsList)
                {
                    PatientProblemListModel problemModel = new PatientProblemListModel();
                    problemModel = this.AddUpdateProblemListForVisit(problemListModel);

                    problemListRecords.Add(problemModel);
                }
            }

            return problemListRecords;
        }

        ///// <summary>
        ///// Add or Update Patient Medication History for a Visit
        ///// </summary>
        ///// <param>(PatientMedicationHistoryModel medicationModel)</param>
        ///// <returns>PatientMedicationHistoryModel. if set of PatientMedicationHistoryModel data saved in DB = success. else = failure</returns>
        public PatientMedicationHistoryModel AddUpdateMedicationHistoryForVisit(PatientMedicationHistoryModel medicationModel)
        {
            //var medications = this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.VisitId == medicationModel.VisitId & x.IsActive != false).FirstOrDefault();
            var medications = this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.PatientmedicationId == medicationModel.PatientmedicationId).FirstOrDefault();

            if (medications == null)
            {
                medications = new PatientMedicationHistory();

                medications.RecordedDate = this.utilService.GetLocalTime(medicationModel.RecordedDate);
                medications.RecordedBy = medicationModel.RecordedBy;
                medications.PatientId = medicationModel.PatientId;
                medications.VisitId = medicationModel.VisitId;
                medications.DrugName = medicationModel.DrugName;
                medications.MedicationRouteCode = medicationModel.MedicationRouteCode;
                medications.ICDCode = medicationModel.ICDCode;
                medications.TotalQuantity = medicationModel.TotalQuantity;
                medications.NoOfDays = medicationModel.NoOfDays;
                medications.Morning = medicationModel.Morning;
                medications.Brunch = medicationModel.Brunch;
                medications.Noon = medicationModel.Noon;
                medications.Evening = medicationModel.Evening;
                medications.Night = medicationModel.Night;
                medications.Before = medicationModel.Before;
                medications.After = medicationModel.After;
                medications.Start = medicationModel.Start;
                medications.Hold = medicationModel.Hold;
                medications.Continued = medicationModel.Continued;
                medications.DisContinue = medicationModel.DisContinue;
                medications.SIG = medicationModel.SIG;
                medications.IsActive = true;
                medications.Createdby = "User";
                medications.CreatedDate = DateTime.Now;

                this.uow.GenericRepository<PatientMedicationHistory>().Insert(medications);
            }
            else
            {
                medications.RecordedDate = this.utilService.GetLocalTime(medicationModel.RecordedDate);
                medications.RecordedBy = medicationModel.RecordedBy;
                medications.PatientId = medicationModel.PatientId;
                medications.DrugName = medicationModel.DrugName;
                medications.MedicationRouteCode = medicationModel.MedicationRouteCode;
                medications.ICDCode = medicationModel.ICDCode;
                medications.TotalQuantity = medicationModel.TotalQuantity;
                medications.NoOfDays = medicationModel.NoOfDays;
                medications.Morning = medicationModel.Morning;
                medications.Brunch = medicationModel.Brunch;
                medications.Noon = medicationModel.Noon;
                medications.Evening = medicationModel.Evening;
                medications.Night = medicationModel.Night;
                medications.Before = medicationModel.Before;
                medications.After = medicationModel.After;
                medications.Start = medicationModel.Start;
                medications.Hold = medicationModel.Hold;
                medications.Continued = medicationModel.Continued;
                medications.DisContinue = medicationModel.DisContinue;
                medications.SIG = medicationModel.SIG;
                medications.IsActive = true;
                medications.Modifiedby = "User";
                medications.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<PatientMedicationHistory>().Update(medications);
            }
            this.uow.Save();
            medicationModel.PatientmedicationId = medications.PatientmedicationId;

            return medicationModel;
        }

        ///// <summary>
        ///// Add or Update Patient Medication collection for a Visit
        ///// </summary>
        ///// <param>(IEnumerable<PatientMedicationHistoryModel> medicationCollection)</param>
        ///// <returns>List<PatientMedicationHistoryModel>. if collection of PatientMedicationHistoryModel data saved in DB = success. else = failure</returns>
        public List<PatientMedicationHistoryModel> AddUpdateMedicationHistoryCollection(IEnumerable<PatientMedicationHistoryModel> medicationCollection)
        {
            List<PatientMedicationHistoryModel> medicationList = new List<PatientMedicationHistoryModel>();
            var medicHistoryRecords = this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.VisitId == medicationCollection.FirstOrDefault().VisitId).ToList();
            if (medicHistoryRecords.Count() == 0)
            {
                foreach (var medicationModel in medicationCollection)
                {
                    PatientMedicationHistoryModel patMedicationModel = new PatientMedicationHistoryModel();
                    patMedicationModel = this.AddUpdateMedicationHistoryForVisit(medicationModel);

                    medicationList.Add(patMedicationModel);
                }
            }
            else
            {
                var itemsList = new List<PatientMedicationHistoryModel>();
                foreach (var set in medicHistoryRecords)
                {
                    var record = medicationCollection.Where(x => x.PatientmedicationId == set.PatientmedicationId).FirstOrDefault();
                    if (record == null)
                    {
                        this.uow.GenericRepository<PatientMedicationHistory>().Delete(set);
                    }
                    else
                    {
                        itemsList.Add(record);
                    }
                }
                this.uow.Save();

                foreach (var Set in medicationCollection)
                {
                    if (!itemsList.Contains(Set))
                    {
                        itemsList.Add(Set);
                    }
                }

                foreach (var medicationModel in itemsList)
                {
                    PatientMedicationHistoryModel patMedicationModel = new PatientMedicationHistoryModel();
                    patMedicationModel = this.AddUpdateMedicationHistoryForVisit(medicationModel);

                    medicationList.Add(patMedicationModel);
                }
            }
            return medicationList;
        }

        ///// <summary>
        ///// Add or Update Patient Social History for a Visit
        ///// </summary>
        ///// <param>(PatientSocialHistoryModel socialModel)</param>
        ///// <returns>PatientSocialHistoryModel. if set of PatientSocialHistoryModel data saved in DB = success. else = failure</returns>
        public PatientSocialHistoryModel AddUpdateSocialHistoryForVisit(PatientSocialHistoryModel socialModel)
        {
            var socialHistory = this.uow.GenericRepository<PatientSocialHistory>().Table().Where(x => x.VisitId == socialModel.VisitId & x.IsActive != false).FirstOrDefault();

            if (socialHistory == null)
            {
                socialHistory = new PatientSocialHistory();

                socialHistory.PatientId = socialModel.PatientId;
                socialHistory.VisitId = socialModel.VisitId;
                socialHistory.RecordedDate = this.utilService.GetLocalTime(socialModel.RecordedDate);
                socialHistory.RecordedBy = socialModel.RecordedBy;
                socialHistory.Smoking = socialModel.Smoking;
                socialHistory.CigarettesPerDay = socialModel.CigarettesPerDay;
                socialHistory.Drinking = socialModel.Drinking;
                socialHistory.ConsumptionPerDay = socialModel.ConsumptionPerDay;
                socialHistory.DrugHabitsDetails = socialModel.DrugHabitsDetails;
                socialHistory.LifeStyleDetails = socialModel.LifeStyleDetails;
                socialHistory.CountriesVisited = socialModel.CountriesVisited;
                socialHistory.DailyActivities = socialModel.DailyActivities;
                socialHistory.AdditionalNotes = socialModel.AdditionalNotes;
                socialHistory.IsActive = true;
                socialHistory.CreatedBy = "User";
                socialHistory.CreatedDate = DateTime.Now;

                this.uow.GenericRepository<PatientSocialHistory>().Insert(socialHistory);
            }
            else
            {
                //socialHistory.PatientId = socialModel.PatientId;
                //socialHistory.VisitId = socialModel.VisitId;
                socialHistory.RecordedDate = this.utilService.GetLocalTime(socialModel.RecordedDate);
                socialHistory.RecordedBy = socialModel.RecordedBy;
                socialHistory.Smoking = socialModel.Smoking;
                socialHistory.CigarettesPerDay = socialModel.CigarettesPerDay;
                socialHistory.Drinking = socialModel.Drinking;
                socialHistory.ConsumptionPerDay = socialModel.ConsumptionPerDay;
                socialHistory.DrugHabitsDetails = socialModel.DrugHabitsDetails;
                socialHistory.LifeStyleDetails = socialModel.LifeStyleDetails;
                socialHistory.CountriesVisited = socialModel.CountriesVisited;
                socialHistory.DailyActivities = socialModel.DailyActivities;
                socialHistory.AdditionalNotes = socialModel.AdditionalNotes;
                socialHistory.IsActive = true;
                socialHistory.ModifiedBy = "User";
                socialHistory.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<PatientSocialHistory>().Update(socialHistory);
            }
            this.uow.Save();
            socialModel.SocialHistoryId = socialHistory.SocialHistoryId;

            return socialModel;
        }

        ///// <summary>
        ///// Add or Update Patient ROS for a Visit
        ///// </summary>
        ///// <param>(ROSModel rosModel)</param>
        ///// <returns>ROSModel. if set of ROSModel data saved in DB = success. else = failure</returns>
        public ROSModel AddUpdateROSForVisit(ROSModel rosModel)
        {
            var ros = this.uow.GenericRepository<ROS>().Table().Where(x => x.VisitID == rosModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (ros == null)
            {
                ros = new ROS();

                ros.PatientID = rosModel.PatientID;
                ros.VisitID = rosModel.VisitID;
                ros.RecordedDate = this.utilService.GetLocalTime(rosModel.RecordedDate);
                ros.RecordedBy = rosModel.RecordedBy;
                ros.Weightlossorgain = rosModel.Weightlossorgain == true ? true : false;
                ros.Feverorchills = rosModel.Feverorchills == true ? true : false;
                ros.Troublesleeping = rosModel.Troublesleeping == true ? true : false;
                ros.Fatigue = rosModel.Fatigue == true ? true : false;
                ros.GeneralWeakness = rosModel.GeneralWeakness == true ? true : false;
                ros.GeneralOthers = rosModel.GeneralOthers == true ? true : false;
                ros.GeneralothersComments = rosModel.GeneralothersComments;
                ros.Rashes = rosModel.Rashes == true ? true : false;
                ros.SkinItching = rosModel.SkinItching == true ? true : false;
                ros.Colorchanges = rosModel.Colorchanges == true ? true : false;
                ros.SkinLumps = rosModel.SkinLumps == true ? true : false;
                ros.Dryness = rosModel.Dryness == true ? true : false;
                ros.Hairandnailchanges = rosModel.Hairandnailchanges == true ? true : false;
                ros.SkinOthers = rosModel.SkinOthers == true ? true : false;
                ros.SkinothersComments = rosModel.SkinothersComments;
                ros.Headache = rosModel.Headache == true ? true : false;
                ros.Headinjury = rosModel.Headinjury == true ? true : false;
                ros.Others = rosModel.Others == true ? true : false;
                ros.HeadothersComments = rosModel.HeadothersComments;
                ros.Decreasedhearing = rosModel.Decreasedhearing == true ? true : false;
                ros.Earache = rosModel.Earache == true ? true : false;
                ros.Ringinginears = rosModel.Ringinginears == true ? true : false;
                ros.Drainage = rosModel.Drainage == true ? true : false;
                ros.EarOthers = rosModel.EarOthers == true ? true : false;
                ros.EarothersComments = rosModel.EarothersComments;
                ros.Vision = rosModel.Vision == true ? true : false;
                ros.Blurryordoublevision = rosModel.Blurryordoublevision == true ? true : false;
                ros.Cataracts = rosModel.Cataracts == true ? true : false;
                ros.Glassesorcontacts = rosModel.Glassesorcontacts == true ? true : false;
                ros.Flashinglights = rosModel.Flashinglights == true ? true : false;
                ros.Lasteyeexam = rosModel.Lasteyeexam == true ? true : false;
                ros.EyePain = rosModel.EyePain == true ? true : false;
                ros.Specks = rosModel.Specks == true ? true : false;
                ros.Redness = rosModel.Redness == true ? true : false;
                ros.Glaucoma = rosModel.Glaucoma == true ? true : false;
                ros.EyeOthers = rosModel.EyeOthers == true ? true : false;
                ros.EyesothersComments = rosModel.EyesothersComments;
                ros.Stuffiness = rosModel.Stuffiness == true ? true : false;
                ros.NoseItching = rosModel.NoseItching == true ? true : false;
                ros.Nosebleeds = rosModel.Nosebleeds == true ? true : false;
                ros.Discharge = rosModel.Discharge == true ? true : false;
                ros.Hayfever = rosModel.Hayfever == true ? true : false;
                ros.Sinuspain = rosModel.Sinuspain == true ? true : false;
                ros.NoseOthers = rosModel.NoseOthers == true ? true : false;
                ros.NoseothersComments = rosModel.NoseothersComments;
                ros.Teeth = rosModel.Teeth == true ? true : false;
                ros.Soretongue = rosModel.Soretongue == true ? true : false;
                ros.Thrush = rosModel.Thrush == true ? true : false;
                ros.Gums = rosModel.Gums == true ? true : false;
                ros.Drymouth = rosModel.Drymouth == true ? true : false;
                ros.Nonhealingsores = rosModel.Nonhealingsores == true ? true : false;
                ros.Bleeding = rosModel.Bleeding == true ? true : false;
                ros.Sorethroat = rosModel.Sorethroat == true ? true : false;
                ros.Sinus = rosModel.Sinus == true ? true : false;
                ros.Lastdentalexam = rosModel.Lastdentalexam == true ? true : false;
                ros.Lastdentalexamdate = rosModel.Lastdentalexamdate != null ? this.utilService.GetLocalTime(rosModel.Lastdentalexamdate.Value) : rosModel.Lastdentalexamdate;
                ros.Dentures = rosModel.Dentures == true ? true : false;
                ros.Hoarseness = rosModel.Hoarseness == true ? true : false;
                ros.ThroatOthers = rosModel.ThroatOthers == true ? true : false;
                ros.ThroatothersComments = rosModel.ThroatothersComments;
                ros.NeckLumps = rosModel.NeckLumps == true ? true : false;
                ros.NeckPain = rosModel.NeckPain == true ? true : false;
                ros.Swollenglands = rosModel.Swollenglands == true ? true : false;
                ros.Stiffness = rosModel.Stiffness == true ? true : false;
                ros.NeckOthers = rosModel.NeckOthers == true ? true : false;
                ros.NeckothersComments = rosModel.NeckothersComments;
                ros.Cough = rosModel.Cough == true ? true : false;
                ros.Coughingupblood = rosModel.Coughingupblood == true ? true : false;
                ros.Wheezing = rosModel.Wheezing == true ? true : false;
                ros.Sputum = rosModel.Sputum == true ? true : false;
                ros.Shortnessofbreath = rosModel.Shortnessofbreath == true ? true : false;
                ros.Painfulbreathing = rosModel.Painfulbreathing == true ? true : false;
                ros.RespiratoryOthers = rosModel.RespiratoryOthers == true ? true : false;
                ros.Respiratoryotherscomments = rosModel.Respiratoryotherscomments;
                ros.Dizziness = rosModel.Dizziness == true ? true : false;
                ros.Weakness = rosModel.Weakness == true ? true : false;
                ros.Tremor = rosModel.Tremor == true ? true : false;
                ros.Fainting = rosModel.Fainting == true ? true : false;
                ros.Numbness = rosModel.Numbness == true ? true : false;
                ros.Seizures = rosModel.Seizures == true ? true : false;
                ros.Tingling = rosModel.Tingling == true ? true : false;
                ros.NeurologicOthers = rosModel.NeurologicOthers == true ? true : false;
                ros.Neurologicotherscomments = rosModel.Neurologicotherscomments;
                ros.Easeofbruising = rosModel.Easeofbruising == true ? true : false;
                ros.Easeofbleeding = rosModel.Easeofbleeding == true ? true : false;
                ros.HematologicOthers = rosModel.HematologicOthers == true ? true : false;
                ros.Hematologicotherscomments = rosModel.Hematologicotherscomments;
                ros.Nervousness = rosModel.Nervousness == true ? true : false;
                ros.Memoryloss = rosModel.Memoryloss == true ? true : false;
                ros.Stress = rosModel.Stress == true ? true : false;
                ros.Depression = rosModel.Depression == true ? true : false;
                ros.PsychiatricOthers = rosModel.PsychiatricOthers == true ? true : false;
                ros.Psychiatricotherscomments = rosModel.Psychiatricotherscomments;
                ros.IsActive = true;
                ros.CreatedBy = "User";
                ros.Createddate = DateTime.Now;

                this.uow.GenericRepository<ROS>().Insert(ros);
            }
            else
            {
                //ros.PatientID = rosModel.PatientID;
                //ros.VisitID = rosModel.VisitID;
                ros.RecordedDate = this.utilService.GetLocalTime(rosModel.RecordedDate);
                ros.RecordedBy = rosModel.RecordedBy;
                ros.Weightlossorgain = rosModel.Weightlossorgain == true ? true : false;
                ros.Feverorchills = rosModel.Feverorchills == true ? true : false;
                ros.Troublesleeping = rosModel.Troublesleeping == true ? true : false;
                ros.Fatigue = rosModel.Fatigue == true ? true : false;
                ros.GeneralWeakness = rosModel.GeneralWeakness == true ? true : false;
                ros.GeneralOthers = rosModel.GeneralOthers == true ? true : false;
                ros.GeneralothersComments = rosModel.GeneralothersComments;
                ros.Rashes = rosModel.Rashes == true ? true : false;
                ros.SkinItching = rosModel.SkinItching == true ? true : false;
                ros.Colorchanges = rosModel.Colorchanges == true ? true : false;
                ros.SkinLumps = rosModel.SkinLumps == true ? true : false;
                ros.Dryness = rosModel.Dryness == true ? true : false;
                ros.Hairandnailchanges = rosModel.Hairandnailchanges == true ? true : false;
                ros.SkinOthers = rosModel.SkinOthers == true ? true : false;
                ros.SkinothersComments = rosModel.SkinothersComments;
                ros.Headache = rosModel.Headache == true ? true : false;
                ros.Headinjury = rosModel.Headinjury == true ? true : false;
                ros.Others = rosModel.Others == true ? true : false;
                ros.HeadothersComments = rosModel.HeadothersComments;
                ros.Decreasedhearing = rosModel.Decreasedhearing == true ? true : false;
                ros.Earache = rosModel.Earache == true ? true : false;
                ros.Ringinginears = rosModel.Ringinginears == true ? true : false;
                ros.Drainage = rosModel.Drainage == true ? true : false;
                ros.EarOthers = rosModel.EarOthers == true ? true : false;
                ros.EarothersComments = rosModel.EarothersComments;
                ros.Vision = rosModel.Vision == true ? true : false;
                ros.Blurryordoublevision = rosModel.Blurryordoublevision == true ? true : false;
                ros.Cataracts = rosModel.Cataracts == true ? true : false;
                ros.Glassesorcontacts = rosModel.Glassesorcontacts == true ? true : false;
                ros.Flashinglights = rosModel.Flashinglights == true ? true : false;
                ros.Lasteyeexam = rosModel.Lasteyeexam == true ? true : false;
                ros.EyePain = rosModel.EyePain == true ? true : false;
                ros.Specks = rosModel.Specks == true ? true : false;
                ros.Redness = rosModel.Redness == true ? true : false;
                ros.Glaucoma = rosModel.Glaucoma == true ? true : false;
                ros.EyeOthers = rosModel.EyeOthers == true ? true : false;
                ros.EyesothersComments = rosModel.EyesothersComments;
                ros.Stuffiness = rosModel.Stuffiness == true ? true : false;
                ros.NoseItching = rosModel.NoseItching == true ? true : false;
                ros.Nosebleeds = rosModel.Nosebleeds == true ? true : false;
                ros.Discharge = rosModel.Discharge == true ? true : false;
                ros.Hayfever = rosModel.Hayfever == true ? true : false;
                ros.Sinuspain = rosModel.Sinuspain == true ? true : false;
                ros.NoseOthers = rosModel.NoseOthers == true ? true : false;
                ros.NoseothersComments = rosModel.NoseothersComments;
                ros.Teeth = rosModel.Teeth == true ? true : false;
                ros.Soretongue = rosModel.Soretongue == true ? true : false;
                ros.Thrush = rosModel.Thrush == true ? true : false;
                ros.Gums = rosModel.Gums == true ? true : false;
                ros.Drymouth = rosModel.Drymouth == true ? true : false;
                ros.Nonhealingsores = rosModel.Nonhealingsores == true ? true : false;
                ros.Bleeding = rosModel.Bleeding == true ? true : false;
                ros.Sorethroat = rosModel.Sorethroat == true ? true : false;
                ros.Sinus = rosModel.Sinus == true ? true : false;
                ros.Lastdentalexam = rosModel.Lastdentalexam == true ? true : false;
                ros.Lastdentalexamdate = rosModel.Lastdentalexamdate != null ? this.utilService.GetLocalTime(rosModel.Lastdentalexamdate.Value) : rosModel.Lastdentalexamdate;
                ros.Dentures = rosModel.Dentures == true ? true : false;
                ros.Hoarseness = rosModel.Hoarseness == true ? true : false;
                ros.ThroatOthers = rosModel.ThroatOthers == true ? true : false;
                ros.ThroatothersComments = rosModel.ThroatothersComments;
                ros.NeckLumps = rosModel.NeckLumps == true ? true : false;
                ros.NeckPain = rosModel.NeckPain == true ? true : false;
                ros.Swollenglands = rosModel.Swollenglands == true ? true : false;
                ros.Stiffness = rosModel.Stiffness == true ? true : false;
                ros.NeckOthers = rosModel.NeckOthers == true ? true : false;
                ros.NeckothersComments = rosModel.NeckothersComments;
                ros.Cough = rosModel.Cough == true ? true : false;
                ros.Coughingupblood = rosModel.Coughingupblood == true ? true : false;
                ros.Wheezing = rosModel.Wheezing == true ? true : false;
                ros.Sputum = rosModel.Sputum == true ? true : false;
                ros.Shortnessofbreath = rosModel.Shortnessofbreath == true ? true : false;
                ros.Painfulbreathing = rosModel.Painfulbreathing == true ? true : false;
                ros.RespiratoryOthers = rosModel.RespiratoryOthers == true ? true : false;
                ros.Respiratoryotherscomments = rosModel.Respiratoryotherscomments;
                ros.Dizziness = rosModel.Dizziness == true ? true : false;
                ros.Weakness = rosModel.Weakness == true ? true : false;
                ros.Tremor = rosModel.Tremor == true ? true : false;
                ros.Fainting = rosModel.Fainting == true ? true : false;
                ros.Numbness = rosModel.Numbness == true ? true : false;
                ros.Seizures = rosModel.Seizures == true ? true : false;
                ros.Tingling = rosModel.Tingling == true ? true : false;
                ros.NeurologicOthers = rosModel.NeurologicOthers == true ? true : false;
                ros.Neurologicotherscomments = rosModel.Neurologicotherscomments;
                ros.Easeofbruising = rosModel.Easeofbruising == true ? true : false;
                ros.Easeofbleeding = rosModel.Easeofbleeding == true ? true : false;
                ros.HematologicOthers = rosModel.HematologicOthers == true ? true : false;
                ros.Hematologicotherscomments = rosModel.Hematologicotherscomments;
                ros.Nervousness = rosModel.Nervousness == true ? true : false;
                ros.Memoryloss = rosModel.Memoryloss == true ? true : false;
                ros.Stress = rosModel.Stress == true ? true : false;
                ros.Depression = rosModel.Depression == true ? true : false;
                ros.PsychiatricOthers = rosModel.PsychiatricOthers == true ? true : false;
                ros.Psychiatricotherscomments = rosModel.Psychiatricotherscomments;
                ros.IsActive = true;
                ros.ModifiedBy = "User";
                ros.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<ROS>().Update(ros);
            }
            this.uow.Save();

            return rosModel;
        }

        ///// <summary>
        ///// Add or Update Patient Nutrition Assessment for a Visit
        ///// </summary>
        ///// <param>(NutritionAssessmentModel nutritionModel)</param>
        ///// <returns>NutritionAssessmentModel. if set of NutritionAssessmentModel data saved in DB = success. else = failure</returns>
        public NutritionAssessmentModel AddUpdateNutritionForVisit(NutritionAssessmentModel nutritionModel)
        {
            //var nutrition = this.uow.GenericRepository<NutritionAssessment>().Table().Where(x => x.VisitId == nutritionModel.VisitId & x.IsActive != false).FirstOrDefault();
            var nutrition = this.uow.GenericRepository<NutritionAssessment>().Table().Where(x => x.NutritionAssessmentID == nutritionModel.NutritionAssessmentID).FirstOrDefault();

            if (nutrition == null)
            {
                nutrition = new NutritionAssessment();

                nutrition.PatientId = nutritionModel.PatientId;
                nutrition.VisitId = nutritionModel.VisitId;
                nutrition.RecordedDate = this.utilService.GetLocalTime(nutritionModel.RecordedDate);
                nutrition.RecordedBy = nutritionModel.RecordedBy;
                nutrition.IntakeCategory = nutritionModel.IntakeCategory;
                nutrition.FoodIntakeTypeID = nutritionModel.FoodIntakeTypeID;
                nutrition.EatRegularly = nutritionModel.EatRegularly;
                nutrition.RegularMeals = nutritionModel.RegularMeals;
                nutrition.Carvings = nutritionModel.Carvings;
                nutrition.DislikedIntake = nutritionModel.DislikedIntake;
                nutrition.FoodAllergies = nutritionModel.FoodAllergies;
                nutrition.Notes = nutritionModel.Notes;
                nutrition.FoodName = nutritionModel.FoodName;
                nutrition.Units = nutritionModel.Units;
                nutrition.Frequency = nutritionModel.Frequency;
                nutrition.NutritionNotes = nutritionModel.NutritionNotes;
                nutrition.IsActive = true;
                nutrition.Createdby = "User";
                nutrition.CreatedDate = DateTime.Now;

                this.uow.GenericRepository<NutritionAssessment>().Insert(nutrition);
            }
            else
            {
                //nutrition.PatientId = nutritionModel.PatientId;
                //nutrition.VisitId = nutritionModel.VisitId;
                nutrition.RecordedDate = this.utilService.GetLocalTime(nutritionModel.RecordedDate);
                nutrition.RecordedBy = nutritionModel.RecordedBy;
                nutrition.IntakeCategory = nutritionModel.IntakeCategory;
                nutrition.FoodIntakeTypeID = nutritionModel.FoodIntakeTypeID;
                nutrition.EatRegularly = nutritionModel.EatRegularly;
                nutrition.RegularMeals = nutritionModel.RegularMeals;
                nutrition.Carvings = nutritionModel.Carvings;
                nutrition.DislikedIntake = nutritionModel.DislikedIntake;
                nutrition.FoodAllergies = nutritionModel.FoodAllergies;
                nutrition.Notes = nutritionModel.Notes;
                nutrition.FoodName = nutritionModel.FoodName;
                nutrition.Units = nutritionModel.Units;
                nutrition.Frequency = nutritionModel.Frequency;
                nutrition.NutritionNotes = nutritionModel.NutritionNotes;
                nutrition.IsActive = true;
                nutrition.ModifiedBy = "User";
                nutrition.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<NutritionAssessment>().Update(nutrition);
            }
            this.uow.Save();
            nutritionModel.NutritionAssessmentID = nutrition.NutritionAssessmentID;

            return nutritionModel;
        }

        ///// <summary>
        ///// Add or Update Patient Nutrition Assessment collection for a Visit
        ///// </summary>
        ///// <param>(IEnumerable<NutritionAssessmentModel> nutritionCollection)</param>
        ///// <returns>IEnumerable<NutritionAssessmentModel>. if collection of NutritionAssessmentModel data saved in DB = success. else = failure</returns>
        public List<NutritionAssessmentModel> AddUpdateNutritionCollection(IEnumerable<NutritionAssessmentModel> nutritionCollection)
        {
            List<NutritionAssessmentModel> nutritionList = new List<NutritionAssessmentModel>();
            var nutritionRecords = this.uow.GenericRepository<NutritionAssessment>().Table().Where(x => x.VisitId == nutritionCollection.FirstOrDefault().VisitId).ToList();
            if (nutritionRecords.Count() == 0)
            {
                foreach (var nutritionModel in nutritionCollection)
                {
                    NutritionAssessmentModel nutritionItem = new NutritionAssessmentModel();
                    nutritionItem = this.AddUpdateNutritionForVisit(nutritionModel);

                    nutritionList.Add(nutritionItem);
                }
            }
            else
            {
                var itemsList = new List<NutritionAssessmentModel>();
                foreach (var set in nutritionRecords)
                {
                    var record = nutritionCollection.Where(x => x.NutritionAssessmentID == set.NutritionAssessmentID).FirstOrDefault();
                    if (record == null)
                    {
                        this.uow.GenericRepository<NutritionAssessment>().Delete(set);
                    }
                    else
                    {
                        itemsList.Add(record);
                    }
                }
                this.uow.Save();

                foreach (var Set in nutritionCollection)
                {
                    if (!itemsList.Contains(Set))
                    {
                        itemsList.Add(Set);
                    }
                }

                foreach (var nutritionModel in itemsList)
                {
                    NutritionAssessmentModel nutritionItem = new NutritionAssessmentModel();
                    nutritionItem = this.AddUpdateNutritionForVisit(nutritionModel);

                    nutritionList.Add(nutritionItem);
                }
            }
            return nutritionList;
        }

        ///// <summary>
        ///// Add or Update Functional & Cognitive details for a Visit
        ///// </summary>
        ///// <param>(CognitiveModel cognitiveModel)</param>
        ///// <returns>CognitiveModel. if set of CognitiveModel data saved in DB = success. else = failure</returns>
        public CognitiveModel AddUpdateFunctionalandCognitiveForVisit(CognitiveModel cognitiveModel)
        {
            var cognitive = this.uow.GenericRepository<Cognitive>().Table().Where(x => x.VisitID == cognitiveModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (cognitive == null)
            {
                cognitive = new Cognitive();

                cognitive.PatientID = cognitiveModel.PatientID;
                cognitive.VisitID = cognitiveModel.VisitID;
                cognitive.RecordedDate = this.utilService.GetLocalTime(cognitiveModel.RecordedDate);
                cognitive.RecordedBy = cognitiveModel.RecordedBy;
                cognitive.Gait = cognitiveModel.Gait;
                cognitive.GaitNotes = cognitiveModel.GaitNotes;
                cognitive.Balance = cognitiveModel.Balance;
                cognitive.BalanceNotes = cognitiveModel.BalanceNotes;
                cognitive.NeuromuscularNotes = cognitiveModel.NeuromuscularNotes;
                cognitive.Mobility = cognitiveModel.Mobility;
                cognitive.MobilitySupportDevice = cognitiveModel.MobilitySupportDevice;
                cognitive.MobilityNotes = cognitiveModel.MobilityNotes;
                cognitive.Functionalstatus = cognitiveModel.Functionalstatus;
                cognitive.Cognitivestatus = cognitiveModel.Cognitivestatus;
                cognitive.PrimaryDiagnosisNotes = cognitiveModel.PrimaryDiagnosisNotes;
                cognitive.ICD10 = cognitiveModel.ICD10;
                cognitive.PrimaryProcedure = cognitiveModel.PrimaryProcedure;
                cognitive.CPT = cognitiveModel.CPT;
                cognitive.Physicianname = cognitiveModel.Physicianname;
                cognitive.Hospital = cognitiveModel.Hospital;
                cognitive.IsActive = true;
                cognitive.CreatedBy = "User";
                cognitive.Createddate = DateTime.Now;

                this.uow.GenericRepository<Cognitive>().Insert(cognitive);
            }
            else
            {
                //cognitive.PatientID = cognitiveModel.PatientID;
                //cognitive.VisitID = cognitiveModel.VisitID;
                cognitive.RecordedDate = this.utilService.GetLocalTime(cognitiveModel.RecordedDate);
                cognitive.RecordedBy = cognitiveModel.RecordedBy;
                cognitive.Gait = cognitiveModel.Gait;
                cognitive.GaitNotes = cognitiveModel.GaitNotes;
                cognitive.Balance = cognitiveModel.Balance;
                cognitive.BalanceNotes = cognitiveModel.BalanceNotes;
                cognitive.NeuromuscularNotes = cognitiveModel.NeuromuscularNotes;
                cognitive.Mobility = cognitiveModel.Mobility;
                cognitive.MobilitySupportDevice = cognitiveModel.MobilitySupportDevice;
                cognitive.MobilityNotes = cognitiveModel.MobilityNotes;
                cognitive.Functionalstatus = cognitiveModel.Functionalstatus;
                cognitive.Cognitivestatus = cognitiveModel.Cognitivestatus;
                cognitive.PrimaryDiagnosisNotes = cognitiveModel.PrimaryDiagnosisNotes;
                cognitive.ICD10 = cognitiveModel.ICD10;
                cognitive.PrimaryProcedure = cognitiveModel.PrimaryProcedure;
                cognitive.CPT = cognitiveModel.CPT;
                cognitive.Physicianname = cognitiveModel.Physicianname;
                cognitive.Hospital = cognitiveModel.Hospital;
                cognitive.IsActive = true;
                cognitive.ModifiedBy = "User";
                cognitive.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<Cognitive>().Update(cognitive);
            }
            this.uow.Save();

            return cognitiveModel;
        }

        ///// <summary>
        ///// Add or Update Nursing Sign Off details for a Visit
        ///// </summary>
        ///// <param>(NursingSignOffModel nursingModel)</param>
        ///// <returns>NursingSignOffModel. if set of NursingSignOffModel data saved in DB = success. else = failure</returns>
        public NursingSignOffModel AddUpdateNursingSignOffData(NursingSignOffModel nursingModel)
        {
            var nursingData = this.uow.GenericRepository<NursingSignOff>().Table().Where(x => x.VisitID == nursingModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (nursingData == null)
            {
                nursingData = new NursingSignOff();

                nursingData.PatientID = nursingModel.PatientID;
                nursingData.VisitID = nursingModel.VisitID;
                nursingData.RecordedDate = this.utilService.GetLocalTime(nursingModel.RecordedDate);
                nursingData.RecordedBy = nursingModel.RecordedBy;
                nursingData.ObservationsNotes = nursingModel.ObservationsNotes;
                nursingData.FirstaidOrDressingsNotes = nursingModel.FirstaidOrDressingsNotes;
                nursingData.NursingProceduresNotes = nursingModel.NursingProceduresNotes;
                nursingData.NursingNotes = nursingModel.NursingNotes;
                nursingData.AdditionalInformation = nursingModel.AdditionalInformation;
                nursingData.IsActive = true;
                nursingData.Createddate = DateTime.Now;
                nursingData.CreatedBy = "User";

                this.uow.GenericRepository<NursingSignOff>().Insert(nursingData);
            }
            else
            {
                nursingData.PatientID = nursingModel.PatientID;
                nursingData.VisitID = nursingModel.VisitID;
                nursingData.RecordedDate = this.utilService.GetLocalTime(nursingModel.RecordedDate);
                nursingData.RecordedBy = nursingModel.RecordedBy;
                nursingData.ObservationsNotes = nursingModel.ObservationsNotes;
                nursingData.FirstaidOrDressingsNotes = nursingModel.FirstaidOrDressingsNotes;
                nursingData.NursingProceduresNotes = nursingModel.NursingProceduresNotes;
                nursingData.NursingNotes = nursingModel.NursingNotes;
                nursingData.AdditionalInformation = nursingModel.AdditionalInformation;
                nursingData.IsActive = true;
                nursingData.ModifiedDate = DateTime.Now;
                nursingData.ModifiedBy = "User";

                this.uow.GenericRepository<NursingSignOff>().Update(nursingData);
            }
            this.uow.Save();

            nursingModel.NursingId = nursingData.NursingId;

            return nursingModel;
        }



        ///// <summary>
        ///// Get Visit Intake for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>VisitIntakeModel. if set of VisitIntakeModel for given PatientId and Visit Id = success. else = failure</returns>
        public VisitIntakeModel GetVisitIntakeDataForVisit(int PatientID, int VisitID)
        {
            VisitIntakeModel inTakeData = new VisitIntakeModel();

            var visit = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == VisitID);

            inTakeData.vitalModel = this.GetVitalsforVisit(PatientID, VisitID);
            inTakeData.allergiesModel = this.GetPatientAllergiesForVisit(PatientID, VisitID);
            inTakeData.problemCollection = this.GetPatientProblemListForVisit(PatientID, VisitID);
            inTakeData.nutritionCollection = this.GetNutritionAssessmentForVisit(PatientID, VisitID);
            inTakeData.nutritionModel = this.GetNutritionAssessmentForVisit(PatientID, VisitID).FirstOrDefault();
            inTakeData.socialModel = this.GetSocialHistoryForVisit(PatientID, VisitID);
            inTakeData.rosModel = this.GetROSDetailsforVisit(PatientID, VisitID);
            inTakeData.cognitiveModel = this.GetCognitiveDataforVisit(PatientID, VisitID);
            inTakeData.medicationModel = this.GetPatientMedicationHistoryForVisit(PatientID, VisitID);
            inTakeData.nursingModel = this.GetPatientNursingDataForVisit(PatientID, VisitID);
            inTakeData.FacilityId = visit.FacilityID > 0 ? visit.FacilityID.Value : 0;
            inTakeData.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            return inTakeData;
        }

        ///// <summary>
        ///// Get Vitals for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>PatientVitalsModel. if set of PatientVitalsModel returns for Given PatientID and VisitID = success. else = failure</returns>
        public PatientVitalsModel GetVitalsforVisit(int PatientID, int VisitID)
        {
            PatientVitalsModel vitalsModel = new PatientVitalsModel();
            var vitals = this.uow.GenericRepository<PatientVitals>().Table().Where(x => x.PatientId == PatientID & x.VisitId == VisitID & x.IsActive != false).FirstOrDefault();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).SingleOrDefault();

            if (vitals != null)
            {
                vitalsModel.VitalsId = vitals.VitalsId;
                vitalsModel.PatientId = vitals.PatientId;
                vitalsModel.VisitId = vitals.VisitId;
                vitalsModel.RecordedDate = vitals.RecordedDate;
                vitalsModel.RecordedBy = vitals.RecordedBy;
                vitalsModel.Height = vitals.Height;
                vitalsModel.Weight = vitals.Weight;
                vitalsModel.BMI = vitals.BMI;
                vitalsModel.WaistCircumference = vitals.WaistCircumference;
                vitalsModel.BPSystolic = vitals.BPSystolic;
                vitalsModel.BPDiastolic = vitals.BPDiastolic;
                vitalsModel.BPLocationID = vitals.BPLocationID;
                vitalsModel.BPLocation = this.uow.GenericRepository<BPLocation>().Table().FirstOrDefault(x => x.BPLocationId == vitals.BPLocationID).BPLocationDescription;
                vitalsModel.Temperature = vitals.Temperature;
                vitalsModel.TemperatureLocation = vitals.TemperatureLocation;
                vitalsModel.HeartRate = vitals.HeartRate;
                vitalsModel.RespiratoryRate = vitals.RespiratoryRate;
                vitalsModel.O2Saturation = vitals.O2Saturation;
                vitalsModel.BloodsugarRandom = vitals.BloodsugarRandom;
                vitalsModel.BloodsugarFasting = vitals.BloodsugarFasting;
                vitalsModel.BloodSugarPostpardinal = vitals.BloodSugarPostpardinal;
                vitalsModel.PainArea = vitals.PainArea;
                vitalsModel.PainScale = vitals.PainScale;
                vitalsModel.PainScaleDesc = vitals.PainScale > 0 ? this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == vitals.PainScale).PainScaleDesc : "";
                vitalsModel.HeadCircumference = vitals.HeadCircumference;
                vitalsModel.LastMealdetails = vitals.LastMealdetails;
                vitalsModel.LastMealtakenon = vitals.LastMealtakenon;
                vitalsModel.PatientPosition = vitals.PatientPosition;
                vitalsModel.IsBloodPressure = vitals.IsBloodPressure;
                vitalsModel.BloodPressure = vitals.IsBloodPressure == "Y" ? "Yes" : (vitals.IsBloodPressure == "N" ? "No" : "Unknown");
                vitalsModel.IsDiabetic = vitals.IsDiabetic;
                vitalsModel.Diabetic = vitals.IsDiabetic == "Y" ? "Yes" : (vitals.IsDiabetic == "N" ? "No" : "Unknown");
                vitalsModel.Notes = vitals.Notes;
                vitalsModel.IsActive = vitals.IsActive;
                vitalsModel.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";
                vitalsModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                vitalsModel.RecordedTime = vitals.RecordedDate.TimeOfDay.ToString();
                vitalsModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                vitalsModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
            }
            return vitalsModel;
        }

        ///// <summary>
        ///// Get Allergies for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>List<PatientAllergyModel>. if collection of PatientAllergyModel return for Given PatientID and VisitID = success. else = failure</returns>
        public List<PatientAllergyModel> GetPatientAllergiesForVisit(int PatientID, int VisitID)
        {
            var allergies = this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.PatientId == PatientID & x.VisitId == VisitID & x.IsActive != false).ToList();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).SingleOrDefault();

            List<PatientAllergyModel> allergyCollection = new List<PatientAllergyModel>();

            if (allergies.Count() > 0)
            {
                foreach (var data in allergies)
                {
                    PatientAllergyModel allergyModel = new PatientAllergyModel();

                    allergyModel.AllergyId = data.AllergyId;
                    allergyModel.PatientId = data.PatientId;
                    allergyModel.VisitId = data.VisitId;
                    allergyModel.RecordedDate = data.RecordedDate;
                    allergyModel.RecordedBy = data.RecordedBy;
                    allergyModel.AllergyTypeID = data.AllergyTypeID;
                    allergyModel.AllergyTypeDesc = this.uow.GenericRepository<AllergyType>().Table().FirstOrDefault(x => x.AllergyTypeID == data.AllergyTypeID).AllergyTypeDescription;
                    allergyModel.Name = data.Name;
                    allergyModel.Allergydescription = data.Allergydescription;
                    allergyModel.Aggravatedby = data.Aggravatedby;
                    allergyModel.Alleviatedby = data.Alleviatedby;
                    allergyModel.Onsetdate = data.Onsetdate;
                    allergyModel.AllergySeverityID = data.AllergySeverityID;
                    allergyModel.AllergySeverityDesc = this.uow.GenericRepository<AllergySeverity>().Table().FirstOrDefault(x => x.AllergySeverityId == data.AllergySeverityID).AllergySeverityDescription;
                    allergyModel.Reaction = data.Reaction;
                    allergyModel.Status = data.Status;
                    allergyModel.ICD10 = data.ICD10;
                    allergyModel.SNOMED = data.SNOMED;
                    allergyModel.Notes = data.Notes;
                    allergyModel.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";
                    allergyModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                    allergyModel.RecordedTime = data.RecordedDate.TimeOfDay.ToString();
                    allergyModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                    allergyModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

                    allergyCollection.Add(allergyModel);
                }
            }
            return allergyCollection;
        }

        ///// <summary>
        ///// Get ProblemList for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>List<PatientProblemListModel>. if collection of PatientProblemListModel return for Given PatientID and VisitID = success. else = failure</returns>
        public List<PatientProblemListModel> GetPatientProblemListForVisit(int PatientID, int VisitID)
        {
            var problemList = this.uow.GenericRepository<PatientProblemList>().Table().Where(x => x.PatientId == PatientID & x.VisitId == VisitID & x.IsActive != false).ToList();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).SingleOrDefault();

            List<PatientProblemListModel> problemCollection = new List<PatientProblemListModel>();

            if (problemList.Count() > 0)
            {
                foreach (var data in problemList)
                {
                    PatientProblemListModel problemModel = new PatientProblemListModel();

                    problemModel.ProblemlistId = data.ProblemlistId;
                    problemModel.PatientId = data.PatientId;
                    problemModel.VisitId = data.VisitId;
                    problemModel.ProblemTypeID = data.ProblemTypeID;
                    problemModel.ProblemTypeDesc = this.uow.GenericRepository<ProblemType>().Table().FirstOrDefault(x => x.ProblemTypeId == data.ProblemTypeID).ProblemTypeDescription;
                    problemModel.ProblemDescription = data.ProblemDescription;
                    problemModel.ICD10Code = data.ICD10Code;
                    problemModel.SNOMEDCode = data.SNOMEDCode;
                    problemModel.Aggravatedby = data.Aggravatedby;
                    problemModel.DiagnosedDate = data.DiagnosedDate;
                    problemModel.ResolvedDate = data.ResolvedDate;
                    problemModel.Status = data.Status;
                    problemModel.AttendingPhysican = data.AttendingPhysican;
                    problemModel.AlleviatedBy = data.AlleviatedBy;
                    problemModel.Notes = data.Notes;
                    problemModel.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";
                    problemModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                    problemModel.RecordedDate = data.RecordedDate;
                    problemModel.RecordedBy = data.RecordedBy;
                    problemModel.RecordedTime = data.RecordedDate.TimeOfDay.ToString();
                    problemModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                    problemModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

                    problemModel.filePath = this.GetFile(data.ProblemlistId.ToString(), "Patient/ProblemList");
                    if (problemModel.filePath.Count() > 0)
                    {
                        string fileSet = "";
                        for (int i = 0; i < problemModel.filePath.Count(); i++)
                        {
                            if (i + 1 == problemModel.filePath.Count())
                            {
                                if (fileSet == null || fileSet == "")
                                {
                                    fileSet = problemModel.filePath[i].FileName;
                                }
                                else
                                {
                                    fileSet = fileSet + problemModel.filePath[i].FileName;
                                }
                            }
                            else
                            {
                                if (fileSet == null || fileSet == "")
                                {
                                    fileSet = problemModel.filePath[i].FileName + ", ";
                                }
                                else
                                {
                                    fileSet = fileSet + problemModel.filePath[i].FileName + ", ";
                                }
                            }
                        }
                        problemModel.FileName = fileSet;
                    }
                    problemCollection.Add(problemModel);
                }
            }
            return problemCollection;
        }

        ///// <summary>
        ///// Get NutritionAssessment collection for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>List<NutritionAssessmentModel>. if collection of NutritionAssessmentModel return for Given PatientID and VisitID = success. else = failure</returns>
        public List<NutritionAssessmentModel> GetNutritionAssessmentForVisit(int PatientID, int VisitID)
        {
            var nutritionAssessments = this.uow.GenericRepository<NutritionAssessment>().Table().Where(x => x.PatientId == PatientID & x.VisitId == VisitID & x.IsActive != false).ToList();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).SingleOrDefault();

            List<NutritionAssessmentModel> nutritionCollection = new List<NutritionAssessmentModel>();

            if (nutritionAssessments.Count() > 0)
            {
                foreach (var data in nutritionAssessments)
                {
                    NutritionAssessmentModel nutritionModel = new NutritionAssessmentModel();

                    nutritionModel.NutritionAssessmentID = data.NutritionAssessmentID;
                    nutritionModel.PatientId = data.PatientId;
                    nutritionModel.VisitId = data.VisitId;
                    nutritionModel.RecordedDate = data.RecordedDate;
                    nutritionModel.RecordedBy = data.RecordedBy;
                    nutritionModel.IntakeCategory = data.IntakeCategory;
                    nutritionModel.FoodIntakeTypeID = data.FoodIntakeTypeID;
                    nutritionModel.FoodIntakeTypeDesc = this.uow.GenericRepository<FoodIntakeType>().Table().FirstOrDefault(x => x.FoodIntaketypeID == data.FoodIntakeTypeID).FoodIntakeTypeDescription;
                    nutritionModel.EatRegularly = data.EatRegularly;
                    nutritionModel.RegularMeals = data.RegularMeals;
                    nutritionModel.Carvings = data.Carvings;
                    nutritionModel.DislikedIntake = data.DislikedIntake;
                    nutritionModel.FoodAllergies = data.FoodAllergies;
                    nutritionModel.Notes = data.Notes;
                    nutritionModel.FoodName = data.FoodName;
                    nutritionModel.Units = data.Units;
                    nutritionModel.Frequency = data.Frequency;
                    nutritionModel.NutritionNotes = data.NutritionNotes;
                    nutritionModel.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";
                    nutritionModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                    nutritionModel.RecordedTime = data.RecordedDate.TimeOfDay.ToString();
                    nutritionModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                    nutritionModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

                    nutritionCollection.Add(nutritionModel);
                }
            }
            return nutritionCollection;
        }

        ///// <summary>
        ///// Get Patient Social HistoryModel for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>PatientSocialHistoryModel. if set of PatientSocialHistoryModel returns for Given PatientID and VisitID = success. else = failure</returns>
        public PatientSocialHistoryModel GetSocialHistoryForVisit(int PatientID, int VisitID)
        {
            PatientSocialHistoryModel socialHistoryModel = new PatientSocialHistoryModel();
            var socialHistory = this.uow.GenericRepository<PatientSocialHistory>().Table().Where(x => x.PatientId == PatientID & x.VisitId == VisitID & x.IsActive != false).FirstOrDefault();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).SingleOrDefault();

            if (socialHistory != null)
            {
                socialHistoryModel.SocialHistoryId = socialHistory.SocialHistoryId;
                socialHistoryModel.VisitId = socialHistory.VisitId;
                socialHistoryModel.PatientId = socialHistory.PatientId;
                socialHistoryModel.RecordedDate = socialHistory.RecordedDate;
                socialHistoryModel.RecordedBy = socialHistory.RecordedBy;
                socialHistoryModel.Smoking = socialHistory.Smoking;
                socialHistoryModel.CigarettesPerDay = socialHistory.CigarettesPerDay;
                socialHistoryModel.Drinking = socialHistory.Drinking;
                socialHistoryModel.ConsumptionPerDay = socialHistory.ConsumptionPerDay;
                socialHistoryModel.DrugHabitsDetails = socialHistory.DrugHabitsDetails;
                socialHistoryModel.LifeStyleDetails = socialHistory.LifeStyleDetails;
                socialHistoryModel.CountriesVisited = socialHistory.CountriesVisited;
                socialHistoryModel.DailyActivities = socialHistory.DailyActivities;
                socialHistoryModel.AdditionalNotes = socialHistory.AdditionalNotes;
                socialHistoryModel.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";
                socialHistoryModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                socialHistoryModel.RecordedTime = socialHistory.RecordedDate.TimeOfDay.ToString();
                socialHistoryModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                socialHistoryModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
            }
            return socialHistoryModel;
        }

        ///// <summary>
        ///// Get ros Model for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>ROSModel. if set of ROSModel returns for Given PatientID and VisitID = success. else = failure</returns>
        public ROSModel GetROSDetailsforVisit(int PatientID, int VisitID)
        {
            ROSModel rosModel = new ROSModel();
            var rosData = this.uow.GenericRepository<ROS>().Table().Where(x => x.PatientID == PatientID & x.VisitID == VisitID & x.IsActive != false).FirstOrDefault();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).SingleOrDefault();

            if (rosData != null)
            {
                rosModel.ROSID = rosData.ROSID;
                rosModel.PatientID = rosData.PatientID;
                rosModel.VisitID = rosData.VisitID;
                rosModel.RecordedDate = rosData.RecordedDate;
                rosModel.RecordedBy = rosData.RecordedBy;
                rosModel.Weightlossorgain = rosData.Weightlossorgain;
                rosModel.Feverorchills = rosData.Feverorchills;
                rosModel.Troublesleeping = rosData.Troublesleeping;
                rosModel.Fatigue = rosData.Fatigue;
                rosModel.GeneralWeakness = rosData.GeneralWeakness;
                rosModel.GeneralOthers = rosData.GeneralOthers;
                rosModel.GeneralothersComments = rosData.GeneralothersComments;
                rosModel.Rashes = rosData.Rashes;
                rosModel.SkinItching = rosData.SkinItching;
                rosModel.Colorchanges = rosData.Colorchanges;
                rosModel.SkinLumps = rosData.SkinLumps;
                rosModel.Dryness = rosData.Dryness;
                rosModel.Hairandnailchanges = rosData.Hairandnailchanges;
                rosModel.SkinOthers = rosData.SkinOthers;
                rosModel.SkinothersComments = rosData.SkinothersComments;
                rosModel.Headache = rosData.Headache;
                rosModel.Headinjury = rosData.Headinjury;
                rosModel.Others = rosData.Others;
                rosModel.HeadothersComments = rosData.HeadothersComments;
                rosModel.Decreasedhearing = rosData.Decreasedhearing;
                rosModel.Earache = rosData.Earache;
                rosModel.Ringinginears = rosData.Ringinginears;
                rosModel.Drainage = rosData.Drainage;
                rosModel.EarOthers = rosData.EarOthers;
                rosModel.EarothersComments = rosData.EarothersComments;
                rosModel.Vision = rosData.Vision;
                rosModel.Blurryordoublevision = rosData.Blurryordoublevision;
                rosModel.Cataracts = rosData.Cataracts;
                rosModel.Glassesorcontacts = rosData.Glassesorcontacts;
                rosModel.Flashinglights = rosData.Flashinglights;
                rosModel.Lasteyeexam = rosData.Lasteyeexam;
                rosModel.EyePain = rosData.EyePain;
                rosModel.Specks = rosData.Specks;
                rosModel.Redness = rosData.Redness;
                rosModel.Glaucoma = rosData.Glaucoma;
                rosModel.EyeOthers = rosData.EyeOthers;
                rosModel.EyesothersComments = rosData.EyesothersComments;
                rosModel.Stuffiness = rosData.Stuffiness;
                rosModel.NoseItching = rosData.NoseItching;
                rosModel.Nosebleeds = rosData.Nosebleeds;
                rosModel.Discharge = rosData.Discharge;
                rosModel.Hayfever = rosData.Hayfever;
                rosModel.Sinuspain = rosData.Sinuspain;
                rosModel.NoseOthers = rosData.NoseOthers;
                rosModel.NoseothersComments = rosData.NoseothersComments;
                rosModel.Teeth = rosData.Teeth;
                rosModel.Soretongue = rosData.Soretongue;
                rosModel.Thrush = rosData.Thrush;
                rosModel.Gums = rosData.Gums;
                rosModel.Drymouth = rosData.Drymouth;
                rosModel.Nonhealingsores = rosData.Nonhealingsores;
                rosModel.Bleeding = rosData.Bleeding;
                rosModel.Sorethroat = rosData.Sorethroat;
                rosModel.Sinus = rosData.Sinus;
                rosModel.Lastdentalexam = rosData.Lastdentalexam;
                rosModel.Lastdentalexamdate = rosData.Lastdentalexamdate;
                rosModel.Dentures = rosData.Dentures;
                rosModel.Hoarseness = rosData.Hoarseness;
                rosModel.ThroatOthers = rosData.ThroatOthers;
                rosModel.ThroatothersComments = rosData.ThroatothersComments;
                rosModel.NeckLumps = rosData.NeckLumps;
                rosModel.NeckPain = rosData.NeckPain;
                rosModel.Swollenglands = rosData.Swollenglands;
                rosModel.Stiffness = rosData.Stiffness;
                rosModel.NeckOthers = rosData.NeckOthers;
                rosModel.NeckothersComments = rosData.NeckothersComments;
                rosModel.Cough = rosData.Cough;
                rosModel.Coughingupblood = rosData.Coughingupblood;
                rosModel.Wheezing = rosData.Wheezing;
                rosModel.Sputum = rosData.Sputum;
                rosModel.Shortnessofbreath = rosData.Shortnessofbreath;
                rosModel.Painfulbreathing = rosData.Painfulbreathing;
                rosModel.RespiratoryOthers = rosData.RespiratoryOthers;
                rosModel.Respiratoryotherscomments = rosData.Respiratoryotherscomments;
                rosModel.Dizziness = rosData.Dizziness;
                rosModel.Weakness = rosData.Weakness;
                rosModel.Tremor = rosData.Tremor;
                rosModel.Fainting = rosData.Fainting;
                rosModel.Numbness = rosData.Numbness;
                rosModel.Seizures = rosData.Seizures;
                rosModel.Tingling = rosData.Tingling;
                rosModel.NeurologicOthers = rosData.NeurologicOthers;
                rosModel.Neurologicotherscomments = rosData.Neurologicotherscomments;
                rosModel.Easeofbruising = rosData.Easeofbruising;
                rosModel.Easeofbleeding = rosData.Easeofbleeding;
                rosModel.HematologicOthers = rosData.HematologicOthers;
                rosModel.Hematologicotherscomments = rosData.Hematologicotherscomments;
                rosModel.Nervousness = rosData.Nervousness;
                rosModel.Memoryloss = rosData.Memoryloss;
                rosModel.Stress = rosData.Stress;
                rosModel.Depression = rosData.Depression;
                rosModel.PsychiatricOthers = rosData.PsychiatricOthers;
                rosModel.Psychiatricotherscomments = rosData.Psychiatricotherscomments;
                rosModel.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";
                rosModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                rosModel.RecordedTime = rosData.RecordedDate.TimeOfDay.ToString();
                rosModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                rosModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
            }
            return rosModel;
        }

        ///// <summary>
        ///// Get Cognitive Model for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>CognitiveModel. if set of CognitiveModel returns for Given PatientID and VisitID = success. else = failure</returns>
        public CognitiveModel GetCognitiveDataforVisit(int PatientID, int VisitID)
        {
            CognitiveModel cognitiveModel = new CognitiveModel();
            var cognitive = this.uow.GenericRepository<Cognitive>().Table().Where(x => x.PatientID == PatientID & x.VisitID == VisitID & x.IsActive != false).FirstOrDefault();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).SingleOrDefault();

            if (cognitive != null)
            {
                cognitiveModel.CognitiveID = cognitive.CognitiveID;
                cognitiveModel.PatientID = cognitive.PatientID;
                cognitiveModel.VisitID = cognitive.VisitID;
                cognitiveModel.Gait = cognitive.Gait;
                cognitiveModel.RecordedDate = cognitive.RecordedDate;
                cognitiveModel.RecordedBy = cognitive.RecordedBy;
                cognitiveModel.GaitNotes = cognitive.GaitNotes;
                cognitiveModel.Balance = cognitive.Balance;
                cognitiveModel.BalanceNotes = cognitive.BalanceNotes;
                cognitiveModel.NeuromuscularNotes = cognitive.NeuromuscularNotes;
                cognitiveModel.Mobility = cognitive.Mobility;
                cognitiveModel.MobilitySupportDevice = cognitive.MobilitySupportDevice;
                cognitiveModel.MobilityNotes = cognitive.MobilityNotes;
                cognitiveModel.Functionalstatus = cognitive.Functionalstatus;
                cognitiveModel.Cognitivestatus = cognitive.Cognitivestatus;
                cognitiveModel.PrimaryDiagnosisNotes = cognitive.PrimaryDiagnosisNotes;
                cognitiveModel.ICD10 = cognitive.ICD10;
                cognitiveModel.PrimaryProcedure = cognitive.PrimaryProcedure;
                cognitiveModel.CPT = cognitive.CPT;
                cognitiveModel.Physicianname = cognitive.Physicianname;
                cognitiveModel.Hospital = cognitive.Hospital;
                cognitiveModel.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";
                cognitiveModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                cognitiveModel.RecordedTime = cognitive.RecordedDate.TimeOfDay.ToString();
                cognitiveModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                cognitiveModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
            }

            return cognitiveModel;
        }

        ///// <summary>
        ///// Get MedicationHistory Model for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>CognitiveModel. if set of MedicationHistoryModel returns for Given PatientID and VisitID = success. else = failure</returns>
        public List<PatientMedicationHistoryModel> GetPatientMedicationHistoryForVisit(int PatientID, int VisitID)
        {
            var medication = this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.PatientId == PatientID & x.VisitId == VisitID & x.IsActive != false).ToList();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).SingleOrDefault();

            List<PatientMedicationHistoryModel> medicationCollection = new List<PatientMedicationHistoryModel>();
            if (medication.Count() > 0)
            {
                foreach (var data in medication)
                {
                    PatientMedicationHistoryModel medicationHistoryModel = new PatientMedicationHistoryModel();

                    medicationHistoryModel.PatientmedicationId = data.PatientmedicationId;
                    medicationHistoryModel.PatientId = data.PatientId;
                    medicationHistoryModel.VisitId = data.VisitId;
                    medicationHistoryModel.RecordedDate = data.RecordedDate;
                    medicationHistoryModel.RecordedBy = data.RecordedBy;
                    medicationHistoryModel.DrugName = data.DrugName;
                    medicationHistoryModel.MedicationRouteCode = data.MedicationRouteCode;
                    medicationHistoryModel.ICDCode = data.ICDCode;
                    medicationHistoryModel.TotalQuantity = data.TotalQuantity;
                    medicationHistoryModel.NoOfDays = data.NoOfDays;
                    medicationHistoryModel.Morning = data.Morning;
                    medicationHistoryModel.Brunch = data.Brunch;
                    medicationHistoryModel.Noon = data.Noon;
                    medicationHistoryModel.Evening = data.Evening;
                    medicationHistoryModel.Night = data.Night;
                    medicationHistoryModel.Before = data.Before;
                    medicationHistoryModel.After = data.After;
                    medicationHistoryModel.Start = data.Start;
                    medicationHistoryModel.Hold = data.Hold;
                    medicationHistoryModel.Continued = data.Continued;
                    medicationHistoryModel.DisContinue = data.DisContinue;
                    medicationHistoryModel.SIG = data.SIG;
                    medicationHistoryModel.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";
                    medicationHistoryModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                    medicationHistoryModel.RecordedTime = data.RecordedDate.TimeOfDay.ToString();
                    medicationHistoryModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                    medicationHistoryModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

                    medicationCollection.Add(medicationHistoryModel);
                }
            }
            return medicationCollection;
        }

        ///// <summary>
        ///// Get Nursing Sign Off Model for a Visit
        ///// </summary>
        ///// <param>(int PatientID, int VisitID)</param>
        ///// <returns>NursingSignOffModel. if set of NursingSignOffModel returns for Given PatientID and VisitID = success. else = failure</returns>
        public NursingSignOffModel GetPatientNursingDataForVisit(int PatientID, int VisitID)
        {
            NursingSignOffModel nursingModel = new NursingSignOffModel();
            var nursing = this.uow.GenericRepository<NursingSignOff>().Table().Where(x => x.PatientID == PatientID & x.VisitID == VisitID & x.IsActive != false).FirstOrDefault();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitID).SingleOrDefault();

            if (nursing != null)
            {
                nursingModel.NursingId = nursing.NursingId;
                nursingModel.PatientID = nursing.PatientID;
                nursingModel.VisitID = nursing.VisitID;
                nursingModel.RecordedDate = nursing.RecordedDate;
                nursingModel.RecordedBy = nursing.RecordedBy;
                nursingModel.ObservationsNotes = nursing.ObservationsNotes;
                nursingModel.FirstaidOrDressingsNotes = nursing.FirstaidOrDressingsNotes;
                nursingModel.NursingProceduresNotes = nursing.NursingProceduresNotes;
                nursingModel.NursingNotes = nursing.NursingNotes;
                nursingModel.AdditionalInformation = nursing.AdditionalInformation;
                nursingModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                nursingModel.RecordedTime = nursing.RecordedDate.TimeOfDay.ToString();
                nursingModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                nursingModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
                nursingModel.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";
                nursingModel.nursingFile = this.GetFile(nursing.NursingId.ToString(), "Patient/NursingSignoff");
            }
            return nursingModel;
        }

        ///// <summary>
        ///// Delete Allergy record by ID
        ///// </summary>
        ///// <param>int AllergyId</param>
        ///// <returns>PatientAllergy. if the record of Allergy for given AllergyId is deleted = success. else = failure</returns>
        public PatientAllergy DeleteAllergyRecord(int AllergyId)
        {
            var allergy = this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.AllergyId == AllergyId).SingleOrDefault();

            if (allergy != null)
            {
                allergy.IsActive = false;

                this.uow.GenericRepository<PatientAllergy>().Update(allergy);
                this.uow.Save();
            }

            return allergy;
        }

        ///// <summary>
        ///// Delete Patient Problem Record by ID
        ///// </summary>
        ///// <param>int problemListId</param>
        ///// <returns>PatientProblemList. if the record of Patient Problem for given problemListId is deleted = success. else = failure</returns>
        public PatientProblemList DeletePatientProblemRecord(int problemListId)
        {
            var problemRecord = this.uow.GenericRepository<PatientProblemList>().Table().Where(x => x.ProblemlistId == problemListId).SingleOrDefault();

            if (problemRecord != null)
            {
                problemRecord.IsActive = false;

                this.uow.GenericRepository<PatientProblemList>().Update(problemRecord);
                this.uow.Save();
            }

            return problemRecord;
        }

        ///// <summary>
        ///// Delete Nutrition Assessment Record by ID
        ///// </summary>
        ///// <param>int nutritionAssessmentId</param>
        ///// <returns>NutritionAssessment. if the record of Nutrition Assessment for given nutritionAssessmentId is deleted = success. else = failure</returns>
        public NutritionAssessment DeleteNutritionRecord(int nutritionAssessmentId)
        {
            var nutrition = this.uow.GenericRepository<NutritionAssessment>().Table().Where(x => x.NutritionAssessmentID == nutritionAssessmentId).SingleOrDefault();

            if (nutrition != null)
            {
                nutrition.IsActive = false;

                this.uow.GenericRepository<NutritionAssessment>().Update(nutrition);
                this.uow.Save();
            }

            return nutrition;
        }

        ///// <summary>
        ///// Delete Medication History Record by ID
        ///// </summary>
        ///// <param>int patientMedicationId</param>
        ///// <returns>PatientMedicationHistory . if the record of Medication History  for given patientMedicationId is deleted = success. else = failure</returns>
        public PatientMedicationHistory DeleteMedicationHistoryRecordbyID(int patientMedicationId)
        {
            var medicHistory = this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.PatientmedicationId == patientMedicationId).SingleOrDefault();

            if (medicHistory != null)
            {
                medicHistory.IsActive = false;

                this.uow.GenericRepository<PatientMedicationHistory>().Update(medicHistory);
                this.uow.Save();
            }

            return medicHistory;
        }

        #endregion

        #region VisitCaseSheet

        ///// <summary>
        ///// Get caseSheet Details for a Visit
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>PatientCaseSheetModel. if set of CaseSheetModel returns = success. else = failure</returns>
        public PatientCaseSheetModel GetcaseSheetDataForVisit(int VisitId)
        {
            PatientCaseSheetModel caseSheetModel = new PatientCaseSheetModel();

            var diagData = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == VisitId & x.IsActive != false).FirstOrDefault();
            var procedure = this.uow.GenericRepository<CaseSheetProcedure>().Table().Where(x => x.VisitID == VisitId & x.IsActive != false).FirstOrDefault();
            var careplan = this.uow.GenericRepository<CarePlan>().Table().Where(x => x.VisitID == VisitId & x.IsActive != false).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitId).FirstOrDefault();

            caseSheetModel.PatientId = visit.PatientId;
            caseSheetModel.VisitId = visit.VisitId;
            caseSheetModel.ProviderId = visit.ProviderID;
            caseSheetModel.diagnosisModel = diagData != null ? this.GetDiagnosisDataforVisitCase(diagData.DiagnosisId) : null;
            caseSheetModel.procedureModel = procedure != null ? this.GetProcedureForVisitCase(procedure.procedureId) : null;
            caseSheetModel.carePlanModel = careplan != null ? this.GetCarePlanForVisitCase(careplan.CarePlanId) : null;
            caseSheetModel.DiagnosisId = diagData != null ? diagData.DiagnosisId : 0;
            caseSheetModel.procedureId = procedure != null ? procedure.procedureId : 0;
            caseSheetModel.CarePlanId = careplan != null ? careplan.CarePlanId : 0;
            caseSheetModel.FacilityId = visit.FacilityID > 0 ? visit.FacilityID.Value : 0;
            caseSheetModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";

            return caseSheetModel;
        }

        ///// <summary>
        ///// Get Diagnosis record for a Visit with images
        ///// </summary>
        ///// <param>(int DiagnosisId)</param>
        ///// <returns>DiagnosisModel. if set of DiagnosisModel with uploaded for given Id= success. else = failure</returns>
        public DiagnosisModel GetDiagnosisRecordwithImages(int visitId)
        {
            DiagnosisModel diagModel = new DiagnosisModel();

            var diagData = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == visitId & x.IsActive != false).FirstOrDefault();

            if (diagData != null)
            {
                var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == diagData.VisitID).SingleOrDefault();

                diagModel.DiagnosisId = diagData.DiagnosisId;
                diagModel.VisitID = diagData.VisitID;
                diagModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();

                diagModel.filePath = this.GetFile(diagData.DiagnosisId.ToString(), "Patient/Diagnosis");
                diagModel.imageSet = new List<string>();
                if (diagModel.filePath.Count() > 0)
                {
                    foreach (var recordSet in diagModel.filePath)
                    {
                        //byte[] bytes = File.ReadAllBytes(recordSet.FileUrl);
                        //var data = Convert.ToBase64String(bytes);
                        //diagModel.imageSet.Add(data);
                        diagModel.imageSet.Add(recordSet.ActualFile);
                    }
                }
            }
            return diagModel;
        }

        ///// <summary>
        ///// Get Visit details by Patient Id
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientVisitModel>. if previous Visits for the patient for given visit Id = success. else = failure</returns>
        public List<PatientVisitModel> GetPreviousVisitsbyVisitId(int VisitId)
        {
            var Record = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == VisitId).FirstOrDefault();

            var visitList = (from visit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.PatientId == Record.PatientId)
                             join pat in this.uow.GenericRepository<Patient>().Table()
                             on visit.PatientId equals pat.PatientId
                             where visit.VisitDate < Record.VisitDate
                             select new
                             {
                                 visit.VisitId,
                                 visit.VisitNo,
                                 visit.VisitDate,
                                 visit.FacilityID,
                                 visit.ProviderID,
                                 visit.Visittime,
                                 pat.PatientId,
                                 visit.RecordedDuringID

                             }).AsEnumerable().Select(PVM => new PatientVisitModel
                             {
                                 VisitId = PVM.VisitId,
                                 VisitNo = PVM.VisitNo,
                                 PatientId = PVM.PatientId,
                                 FacilityID = PVM.FacilityID,
                                 ProviderID = PVM.ProviderID,
                                 VisitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString(),
                                 recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : ""

                             }).ToList();

            List<PatientVisitModel> visitsCollection = new List<PatientVisitModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visitList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        visitsCollection = (from vis in visitList
                                            join fac in facList on vis.FacilityID equals fac.FacilityId
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                    else
                    {
                        visitsCollection = (from vis in visitList
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                }
                else
                {
                    visitsCollection = (from vis in visitList
                                        join fac in facList on vis.FacilityID equals fac.FacilityId
                                        select vis).ToList();
                }
            }
            else
            {
                visitsCollection = visitList;
            }

            return visitsCollection;
        }

        ///// <summary>
        ///// Add or Update Diagnosis details for a Visit
        ///// </summary>
        ///// <param>(DiagnosisModel diagModel)</param>
        ///// <returns>DiagnosisModel. if set of DiagnosisModel data saved in DB = success. else = failure</returns>
        public DiagnosisModel AddUpdateDiagnosisForVisitcase(DiagnosisModel diagModel)
        {
            var diagnosis = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == diagModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (diagnosis == null)
            {
                diagnosis = new Diagnosis();

                diagnosis.VisitID = diagModel.VisitID;
                diagnosis.RecordedDate = this.utilService.GetLocalTime(diagModel.RecordedDate);
                diagnosis.RecordedBy = diagModel.RecordedBy;
                diagnosis.ChiefComplaint = diagModel.ChiefComplaint;
                diagnosis.ProblemAreaID = diagModel.ProblemAreaID;
                diagnosis.ProblemDuration = diagModel.ProblemDuration;
                diagnosis.PreviousHistory = diagModel.PreviousHistory;
                diagnosis.SymptomsID = diagModel.SymptomsID;
                diagnosis.OtherSymptoms = diagModel.OtherSymptoms;
                diagnosis.PainScale = diagModel.PainScale;
                diagnosis.PainNotes = diagModel.PainNotes;
                diagnosis.Timings = diagModel.Timings;
                diagnosis.ProblemTypeID = diagModel.ProblemTypeID;
                diagnosis.AggravatedBy = diagModel.AggravatedBy;
                diagnosis.Alleviatedby = diagModel.Alleviatedby;
                diagnosis.ProblemStatus = diagModel.ProblemStatus;
                diagnosis.Observationotes = diagModel.Observationotes;
                diagnosis.InteractionSummary = diagModel.InteractionSummary;
                diagnosis.PAdditionalNotes = diagModel.PAdditionalNotes;
                diagnosis.Prognosis = diagModel.Prognosis;
                diagnosis.AssessmentNotes = diagModel.AssessmentNotes;
                diagnosis.ICD10 = diagModel.ICD10 == null ? "" : diagModel.ICD10;
                diagnosis.DiagnosisNotes = diagModel.DiagnosisNotes;
                diagnosis.Etiology = diagModel.Etiology;
                diagnosis.DAdditionalNotes = diagModel.DAdditionalNotes;
                diagnosis.IsActive = true;
                diagnosis.CreatedBy = "User";
                diagnosis.Createddate = DateTime.Now;

                this.uow.GenericRepository<Diagnosis>().Insert(diagnosis);
            }
            else
            {
                //diagnosis.VisitID = diagModel.VisitID;
                diagnosis.RecordedDate = this.utilService.GetLocalTime(diagModel.RecordedDate);
                diagnosis.RecordedBy = diagModel.RecordedBy;
                diagnosis.ChiefComplaint = diagModel.ChiefComplaint;
                diagnosis.ProblemAreaID = diagModel.ProblemAreaID;
                diagnosis.ProblemDuration = diagModel.ProblemDuration;
                diagnosis.PreviousHistory = diagModel.PreviousHistory;
                diagnosis.SymptomsID = diagModel.SymptomsID;
                diagnosis.OtherSymptoms = diagModel.OtherSymptoms;
                diagnosis.PainScale = diagModel.PainScale;
                diagnosis.PainNotes = diagModel.PainNotes;
                diagnosis.Timings = diagModel.Timings;
                diagnosis.ProblemTypeID = diagModel.ProblemTypeID;
                diagnosis.AggravatedBy = diagModel.AggravatedBy;
                diagnosis.Alleviatedby = diagModel.Alleviatedby;
                diagnosis.ProblemStatus = diagModel.ProblemStatus;
                diagnosis.Observationotes = diagModel.Observationotes;
                diagnosis.InteractionSummary = diagModel.InteractionSummary;
                diagnosis.PAdditionalNotes = diagModel.PAdditionalNotes;
                diagnosis.Prognosis = diagModel.Prognosis;
                diagnosis.AssessmentNotes = diagModel.AssessmentNotes;
                diagnosis.ICD10 = diagModel.ICD10 == null ? "" : diagModel.ICD10;
                diagnosis.DiagnosisNotes = diagModel.DiagnosisNotes;
                diagnosis.Etiology = diagModel.Etiology;
                diagnosis.DAdditionalNotes = diagModel.DAdditionalNotes;
                diagnosis.IsActive = true;
                diagnosis.ModifiedBy = "User";
                diagnosis.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<Diagnosis>().Update(diagnosis);
            }
            this.uow.Save();
            diagModel.DiagnosisId = diagnosis.DiagnosisId;

            return diagModel;
        }

        ///// <summary>
        ///// Get Diagnosis details for a Visit
        ///// </summary>
        ///// <param>(int DiagnosisId)</param>
        ///// <returns>DiagnosisModel. if set of DiagnosisModel for given Id= success. else = failure</returns>
        public DiagnosisModel GetDiagnosisDataforVisitCase(int DiagnosisId)
        {
            DiagnosisModel diagModel = new DiagnosisModel();

            var diagData = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.DiagnosisId == DiagnosisId).FirstOrDefault();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == diagData.VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == diagData.VisitID).SingleOrDefault();

            if (diagData != null)
            {
                diagModel.DiagnosisId = diagData.DiagnosisId;
                diagModel.VisitID = diagData.VisitID;
                diagModel.RecordedDate = diagData.RecordedDate;
                diagModel.RecordedBy = diagData.RecordedBy;
                diagModel.ChiefComplaint = diagData.ChiefComplaint;
                diagModel.ProblemAreaID = diagData.ProblemAreaID;
                diagModel.ProblemDuration = diagData.ProblemDuration;
                diagModel.PreviousHistory = diagData.PreviousHistory;
                diagModel.SymptomsID = diagData.SymptomsID;
                diagModel.OtherSymptoms = diagData.OtherSymptoms;
                diagModel.PainScale = diagData.PainScale;
                diagModel.PainScaleDesc = diagData.PainScale > 0 ? this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == diagData.PainScale).PainScaleDesc : "";
                diagModel.PainNotes = diagData.PainNotes;
                diagModel.Timings = diagData.Timings;
                diagModel.ProblemTypeID = diagData.ProblemTypeID;
                diagModel.AggravatedBy = diagData.AggravatedBy;
                diagModel.Alleviatedby = diagData.Alleviatedby;
                diagModel.ProblemStatus = diagData.ProblemStatus;
                diagModel.Observationotes = diagData.Observationotes;
                diagModel.InteractionSummary = diagData.InteractionSummary;
                diagModel.PAdditionalNotes = diagData.PAdditionalNotes;
                diagModel.Prognosis = diagData.Prognosis;
                diagModel.AssessmentNotes = diagData.AssessmentNotes;
                diagModel.ICD10 = diagData.ICD10;
                diagModel.DiagnosisNotes = diagData.DiagnosisNotes;
                diagModel.Etiology = diagData.Etiology;
                diagModel.DAdditionalNotes = diagData.DAdditionalNotes;
                diagModel.ProblemAreaValues = this.GetProblemAreaValuesbyVisitId(diagData.VisitID);
                diagModel.ProblemAreaArray = this.GetProblemAreaArraybyVisitId(diagData.VisitID);
                diagModel.ProblemTypeValues = this.GetProblemTypeValuesbyVisitId(diagData.VisitID);
                diagModel.ProblemTypeArray = this.GetProblemTypeArraybyVisitId(diagData.VisitID);
                diagModel.SymptomsValues = this.GetSymptomsValuesbyVisitId(diagData.VisitID);
                diagModel.SymptomsValueArray = this.GetSymptomsArraybyVisitId(diagData.VisitID);
                diagModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                diagModel.RecordedTime = diagData.RecordedDate.TimeOfDay.ToString();
                diagModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                diagModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
                diagModel.signOffstatus = (signOff != null && signOff.CaseSheet == true) ? "Yes" : "No";

                diagModel.filePath = this.GetFile(diagData.DiagnosisId.ToString(), "Patient/Diagnosis");
            }

            return diagModel;
        }

        ///// <summary>
        ///// Get Problem Area for Visit
        ///// </summary>
        ///// <param>int visitID</param>
        ///// <returns>string. if ProblemArea values for Given visitId = success. else = failure</returns>
        public string GetProblemAreaValuesbyVisitId(int visitID)
        {
            string ProblemAreaValues = "";
            var diagData = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == visitID & x.IsActive != false).FirstOrDefault();
            if (diagData != null && (diagData.ProblemAreaID != null && diagData.ProblemAreaID != ""))
            {
                string[] probAreaIds = diagData.ProblemAreaID.Split(',');
                if (probAreaIds.Length > 0)
                {
                    for (int i = 0; i < probAreaIds.Length; i++)
                    {
                        if (probAreaIds[i] != null && probAreaIds[i] != "")
                        {
                            if (i + 1 == probAreaIds.Length)
                            {
                                if (ProblemAreaValues == null || ProblemAreaValues == "")
                                {
                                    ProblemAreaValues = this.uow.GenericRepository<ProblemArea>().Table().FirstOrDefault(x => x.ProblemAreaId == Convert.ToInt32(probAreaIds[i])).ProblemAreaDescription;
                                }
                                else
                                {
                                    ProblemAreaValues = ProblemAreaValues + this.uow.GenericRepository<ProblemArea>().Table().FirstOrDefault(x => x.ProblemAreaId == Convert.ToInt32(probAreaIds[i])).ProblemAreaDescription;
                                }
                            }
                            else// if()
                            {
                                if (ProblemAreaValues == null || ProblemAreaValues == "")
                                {
                                    ProblemAreaValues = this.uow.GenericRepository<ProblemArea>().Table().FirstOrDefault(x => x.ProblemAreaId == Convert.ToInt32(probAreaIds[i])).ProblemAreaDescription + ", ";
                                }
                                else
                                {
                                    ProblemAreaValues = ProblemAreaValues + this.uow.GenericRepository<ProblemArea>().Table().FirstOrDefault(x => x.ProblemAreaId == Convert.ToInt32(probAreaIds[i])).ProblemAreaDescription + ", ";
                                }
                            }
                        }
                    }
                }
            }
            return ProblemAreaValues;
        }

        ///// <summary>
        ///// Get Problem Area Array for Visit
        ///// </summary>
        ///// <param>int visitID</param>
        ///// <returns>string. if ProblemArea values for Given visitId = success. else = failure</returns>
        public List<int> GetProblemAreaArraybyVisitId(int visitID)
        {
            List<int> ProblemAreaArray = new List<int>();
            var diagData = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == visitID & x.IsActive != false).FirstOrDefault();
            if (diagData != null && (diagData.ProblemAreaID != null && diagData.ProblemAreaID != ""))
            {
                if (diagData.ProblemAreaID.Contains(","))
                {
                    string[] probAreaIds = diagData.ProblemAreaID.Split(',');
                    if (probAreaIds.Length > 0)
                    {
                        for (int i = 0; i < probAreaIds.Length; i++)
                        {
                            if (probAreaIds[i] != null && probAreaIds[i] != "" && Convert.ToInt32(probAreaIds[i]) > 0)
                            {
                                if (!ProblemAreaArray.Contains(Convert.ToInt32(probAreaIds[i])))
                                {
                                    ProblemAreaArray.Add(Convert.ToInt32(probAreaIds[i]));
                                }
                            }
                        }
                    }
                }
                else
                {
                    ProblemAreaArray.Add(Convert.ToInt32(diagData.ProblemAreaID));
                }
            }
            return ProblemAreaArray;
        }

        ///// <summary>
        ///// Get Problem Types for Visit
        ///// </summary>
        ///// <param>int visitID</param>
        ///// <returns>string. if Problem Type values for Given visitId = success. else = failure</returns>
        public string GetProblemTypeValuesbyVisitId(int visitID)
        {
            string ProblemTypeValues = "";
            var diagData = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == visitID & x.IsActive != false).FirstOrDefault();
            if (diagData != null && (diagData.ProblemTypeID != null && diagData.ProblemTypeID != ""))
            {
                string[] probTypeIds = diagData.ProblemTypeID.Split(',');
                if (probTypeIds.Length > 0)
                {
                    for (int i = 0; i < probTypeIds.Length; i++)
                    {
                        if (probTypeIds[i] != null && probTypeIds[i] != "")
                        {
                            if (i + 1 == probTypeIds.Length)
                            {
                                if (ProblemTypeValues == null || ProblemTypeValues == "")
                                {
                                    ProblemTypeValues = this.uow.GenericRepository<ProblemType>().Table().FirstOrDefault(x => x.ProblemTypeId == Convert.ToInt32(probTypeIds[i])).ProblemTypeDescription;
                                }
                                else
                                {
                                    ProblemTypeValues = ProblemTypeValues + this.uow.GenericRepository<ProblemType>().Table().FirstOrDefault(x => x.ProblemTypeId == Convert.ToInt32(probTypeIds[i])).ProblemTypeDescription;
                                }
                            }
                            else// if()
                            {
                                if (ProblemTypeValues == null || ProblemTypeValues == "")
                                {
                                    ProblemTypeValues = this.uow.GenericRepository<ProblemType>().Table().FirstOrDefault(x => x.ProblemTypeId == Convert.ToInt32(probTypeIds[i])).ProblemTypeDescription + ", ";
                                }
                                else
                                {
                                    ProblemTypeValues = ProblemTypeValues + this.uow.GenericRepository<ProblemType>().Table().FirstOrDefault(x => x.ProblemTypeId == Convert.ToInt32(probTypeIds[i])).ProblemTypeDescription + ", ";
                                }
                            }
                        }
                    }
                }
            }
            return ProblemTypeValues;
        }

        ///// <summary>
        ///// Get Problem Type Array for Visit
        ///// </summary>
        ///// <param>int visitID</param>
        ///// <returns>string. if ProblemType values for Given visitId = success. else = failure</returns>
        public List<int> GetProblemTypeArraybyVisitId(int visitID)
        {
            List<int> ProblemTypeArray = new List<int>();
            var diagData = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == visitID & x.IsActive != false).FirstOrDefault();
            if (diagData != null && (diagData.ProblemTypeID != null && diagData.ProblemTypeID != ""))
            {
                if (diagData.ProblemTypeID.Contains(","))
                {
                    string[] probTypeIds = diagData.ProblemTypeID.Split(',');
                    if (probTypeIds.Length > 0)
                    {
                        for (int i = 0; i < probTypeIds.Length; i++)
                        {
                            if (probTypeIds[i] != null && probTypeIds[i] != "" && Convert.ToInt32(probTypeIds[i]) > 0)
                            {
                                if (!ProblemTypeArray.Contains(Convert.ToInt32(probTypeIds[i])))
                                {
                                    ProblemTypeArray.Add(Convert.ToInt32(probTypeIds[i]));
                                }
                            }
                        }
                    }
                }
                else
                {
                    ProblemTypeArray.Add(Convert.ToInt32(diagData.ProblemTypeID));
                }
            }
            return ProblemTypeArray;
        }

        ///// <summary>
        ///// Get Symptoms for Visit
        ///// </summary>
        ///// <param>int visitID</param>
        ///// <returns>string. if Symptoms values for Given visitId = success. else = failure</returns>
        public string GetSymptomsValuesbyVisitId(int visitID)
        {
            string SymptomsValues = "";
            var diagData = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == visitID & x.IsActive != false).FirstOrDefault();
            if (diagData != null && (diagData.SymptomsID != null && diagData.SymptomsID != ""))
            {
                string[] symptomIds = diagData.SymptomsID.Split(',');
                if (symptomIds.Length > 0)
                {
                    for (int i = 0; i < symptomIds.Length; i++)
                    {
                        if (symptomIds[i] != null && symptomIds[i] != "")
                        {
                            if (i + 1 == symptomIds.Length)
                            {
                                if (SymptomsValues == null || SymptomsValues == "")
                                {
                                    SymptomsValues = this.uow.GenericRepository<Symptoms>().Table().FirstOrDefault(x => x.SymptomsId == Convert.ToInt32(symptomIds[i])).SymptomsDescription;
                                }
                                else
                                {
                                    SymptomsValues = SymptomsValues + this.uow.GenericRepository<Symptoms>().Table().FirstOrDefault(x => x.SymptomsId == Convert.ToInt32(symptomIds[i])).SymptomsDescription;
                                }
                            }
                            else// if()
                            {
                                if (SymptomsValues == null || SymptomsValues == "")
                                {
                                    SymptomsValues = this.uow.GenericRepository<Symptoms>().Table().FirstOrDefault(x => x.SymptomsId == Convert.ToInt32(symptomIds[i])).SymptomsDescription + ", ";
                                }
                                else
                                {
                                    SymptomsValues = SymptomsValues + this.uow.GenericRepository<Symptoms>().Table().FirstOrDefault(x => x.SymptomsId == Convert.ToInt32(symptomIds[i])).SymptomsDescription + ", ";
                                }
                            }
                        }
                    }
                }
            }
            return SymptomsValues;
        }

        ///// <summary>
        ///// Get Symptoms Array for Visit
        ///// </summary>
        ///// <param>int visitID</param>
        ///// <returns>string. if Symptoms values for Given visitId = success. else = failure</returns>
        public List<int> GetSymptomsArraybyVisitId(int visitID)
        {
            List<int> SymptomsArray = new List<int>();
            var diagData = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.VisitID == visitID & x.IsActive != false).FirstOrDefault();
            if (diagData != null && (diagData.SymptomsID != null && diagData.SymptomsID != ""))
            {
                if (diagData.SymptomsID.Contains(","))
                {
                    string[] symptomIds = diagData.SymptomsID.Split(',');
                    if (symptomIds.Length > 0)
                    {
                        for (int i = 0; i < symptomIds.Length; i++)
                        {
                            if (symptomIds[i] != null && symptomIds[i] != "" && Convert.ToInt32(symptomIds[i]) > 0)
                            {
                                if (!SymptomsArray.Contains(Convert.ToInt32(symptomIds[i])))
                                {
                                    SymptomsArray.Add(Convert.ToInt32(symptomIds[i]));
                                }
                            }
                        }
                    }
                }
                else
                {
                    SymptomsArray.Add(Convert.ToInt32(diagData.SymptomsID));
                }
            }
            return SymptomsArray;
        }

        ///// <summary>
        ///// Add or Update Procedure details for a Visit
        ///// </summary>
        ///// <param>(ProcedureModel procedureModel)</param>
        ///// <returns>ProcedureModel. if set of ProcedureModel data saved in DB = success. else = failure</returns>
        public CaseSheetProcedureModel AddUpdateProcedureForVisitcase(CaseSheetProcedureModel procedureModel)
        {
            var procedure = this.uow.GenericRepository<CaseSheetProcedure>().Table().Where(x => x.VisitID == procedureModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (procedure == null)
            {
                procedure = new CaseSheetProcedure();

                procedure.VisitID = procedureModel.VisitID;
                procedure.RecordedDate = this.utilService.GetLocalTime(procedureModel.RecordedDate);
                procedure.RecordedBy = procedureModel.RecordedBy;
                procedure.PrimaryCPT = procedureModel.PrimaryCPT;
                procedure.ChiefComplaint = procedureModel.ChiefComplaint;
                procedure.DiagnosisNotes = procedureModel.DiagnosisNotes;
                procedure.PrimaryICD = procedureModel.PrimaryICD;
                procedure.TreatmentType = procedureModel.TreatmentType;
                procedure.ProcedureNotes = procedureModel.ProcedureNotes;
                procedure.RequestedprocedureId = procedureModel.RequestedprocedureId;
                procedure.Proceduredate = procedureModel.Proceduredate != null ? this.utilService.GetLocalTime(procedureModel.Proceduredate.Value) : procedureModel.Proceduredate;
                procedure.ProcedureStatus = procedureModel.ProcedureStatus;
                procedure.IsReferred = procedureModel.IsReferred;
                procedure.ReferralNotes = procedureModel.ReferralNotes;
                procedure.FollowUpNotes = procedureModel.FollowUpNotes;
                procedure.AdditionalNotes = procedureModel.AdditionalNotes;
                procedure.IsActive = true;
                procedure.CreatedBy = "User";
                procedure.Createddate = DateTime.Now;

                this.uow.GenericRepository<CaseSheetProcedure>().Insert(procedure);
            }
            else
            {
                //procedure.VisitID = procedureModel.VisitID;
                procedure.RecordedDate = this.utilService.GetLocalTime(procedureModel.RecordedDate);
                procedure.RecordedBy = procedureModel.RecordedBy;
                procedure.PrimaryCPT = procedureModel.PrimaryCPT;
                procedure.ChiefComplaint = procedureModel.ChiefComplaint;
                procedure.DiagnosisNotes = procedureModel.DiagnosisNotes;
                procedure.PrimaryICD = procedureModel.PrimaryICD;
                procedure.TreatmentType = procedureModel.TreatmentType;
                procedure.ProcedureNotes = procedureModel.ProcedureNotes;
                procedure.RequestedprocedureId = procedureModel.RequestedprocedureId;
                procedure.Proceduredate = procedureModel.Proceduredate != null ? this.utilService.GetLocalTime(procedureModel.Proceduredate.Value) : procedureModel.Proceduredate;
                procedure.ProcedureStatus = procedureModel.ProcedureStatus;
                procedure.IsReferred = procedureModel.IsReferred;
                procedure.ReferralNotes = procedureModel.ReferralNotes;
                procedure.FollowUpNotes = procedureModel.FollowUpNotes;
                procedure.AdditionalNotes = procedureModel.AdditionalNotes;
                procedure.IsActive = true;
                procedure.ModifiedBy = "User";
                procedure.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<CaseSheetProcedure>().Update(procedure);
            }
            this.uow.Save();
            procedureModel.procedureId = procedure.procedureId;

            return procedureModel;
        }

        ///// <summary>
        ///// Get Procedure details for a Visit
        ///// </summary>
        ///// <param>(int procedureId)</param>
        ///// <returns>ProcedureModel. if set of ProcedureModel for given Id = success. else = failure</returns>
        public CaseSheetProcedureModel GetProcedureForVisitCase(int procedureId)
        {
            CaseSheetProcedureModel procModel = new CaseSheetProcedureModel();
            var procedure = this.uow.GenericRepository<CaseSheetProcedure>().Table().Where(x => x.procedureId == procedureId).FirstOrDefault();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == procedure.VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == procedure.VisitID).SingleOrDefault();

            if (procedure != null)
            {
                procModel.procedureId = procedure.procedureId;
                procModel.VisitID = procedure.VisitID;
                procModel.RecordedDate = procedure.RecordedDate;
                procModel.RecordedBy = procedure.RecordedBy;
                procModel.PrimaryCPT = procedure.PrimaryCPT;
                procModel.ChiefComplaint = procedure.ChiefComplaint;
                procModel.DiagnosisNotes = procedure.DiagnosisNotes;
                procModel.PrimaryICD = procedure.PrimaryICD;
                procModel.TreatmentType = procedure.TreatmentType;
                procModel.ProcedureNotes = procedure.ProcedureNotes;
                procModel.RequestedprocedureId = procedure.RequestedprocedureId;
                procModel.Proceduredate = procedure.Proceduredate;
                procModel.ProcedureStatus = procedure.ProcedureStatus;
                procModel.IsReferred = procedure.IsReferred;
                procModel.ReferralNotes = procedure.ReferralNotes;
                procModel.FollowUpNotes = procedure.FollowUpNotes;
                procModel.AdditionalNotes = procedure.AdditionalNotes;
                procModel.requestedProcedureValues = this.GetRequestedProcedureValuesbyVisitId(procedure.VisitID);
                procModel.requestedProcedureArray = this.GetRequestedProcedureArraybyVisitId(procedure.VisitID);
                procModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                procModel.RecordedTime = procedure.RecordedDate.TimeOfDay.ToString();
                procModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                procModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
                procModel.signOffstatus = (signOff != null && signOff.CaseSheet == true) ? "Yes" : "No";
            }
            return procModel;
        }

        ///// <summary>
        ///// Get Requested Procedures for Visit
        ///// </summary>
        ///// <param>int visitID</param>
        ///// <returns>string. if Requested Procedures values for Given visitId = success. else = failure</returns>
        public string GetRequestedProcedureValuesbyVisitId(int visitID)
        {
            string requestedProcedureValues = "";
            var procedure = this.uow.GenericRepository<CaseSheetProcedure>().Table().Where(x => x.VisitID == visitID & x.IsActive != false).FirstOrDefault();
            if (procedure != null && (procedure.RequestedprocedureId != null && procedure.RequestedprocedureId != ""))
            {
                string[] reqProcedureIds = procedure.RequestedprocedureId.Split(',');
                if (reqProcedureIds.Length > 0)
                {
                    for (int i = 0; i < reqProcedureIds.Length; i++)
                    {
                        if (reqProcedureIds[i] != null && reqProcedureIds[i] != "")
                        {
                            if (i + 1 == reqProcedureIds.Length)
                            {
                                if (requestedProcedureValues == null || requestedProcedureValues == "")
                                {
                                    requestedProcedureValues = this.uow.GenericRepository<RequestedProcedure>().Table().FirstOrDefault(x => x.RequestedProcedureId == Convert.ToInt32(reqProcedureIds[i])).RequestedProcedureDescription;
                                }
                                else
                                {
                                    requestedProcedureValues = requestedProcedureValues + this.uow.GenericRepository<RequestedProcedure>().Table().FirstOrDefault(x => x.RequestedProcedureId == Convert.ToInt32(reqProcedureIds[i])).RequestedProcedureDescription;
                                }
                            }
                            else// if()
                            {
                                if (requestedProcedureValues == null || requestedProcedureValues == "")
                                {
                                    requestedProcedureValues = this.uow.GenericRepository<RequestedProcedure>().Table().FirstOrDefault(x => x.RequestedProcedureId == Convert.ToInt32(reqProcedureIds[i])).RequestedProcedureDescription + ", ";
                                }
                                else
                                {
                                    requestedProcedureValues = requestedProcedureValues + this.uow.GenericRepository<RequestedProcedure>().Table().FirstOrDefault(x => x.RequestedProcedureId == Convert.ToInt32(reqProcedureIds[i])).RequestedProcedureDescription + ", ";
                                }
                            }
                        }
                    }
                }
            }
            return requestedProcedureValues;
        }

        ///// <summary>
        ///// Get Requested Procedures Array
        ///// </summary>
        ///// <param>int visitID</param>
        ///// <returns>string. if Requested Procedures values for Given visitId = success. else = failure</returns>
        public List<int> GetRequestedProcedureArraybyVisitId(int visitID)
        {
            var procedure = this.uow.GenericRepository<CaseSheetProcedure>().Table().Where(x => x.VisitID == visitID & x.IsActive != false).FirstOrDefault();
            List<int> ReqProcedureArray = new List<int>();

            if (procedure != null && (procedure.RequestedprocedureId != null && procedure.RequestedprocedureId != ""))
            {
                if (procedure.RequestedprocedureId.Contains(","))
                {
                    string[] reqProcedureIds = procedure.RequestedprocedureId.Split(',');
                    if (reqProcedureIds.Length > 0)
                    {
                        for (int i = 0; i < reqProcedureIds.Length; i++)
                        {
                            if (reqProcedureIds[i] != null && reqProcedureIds[i] != "" && Convert.ToInt32(reqProcedureIds[i]) > 0)
                            {
                                if (!ReqProcedureArray.Contains(Convert.ToInt32(reqProcedureIds[i])))
                                {
                                    ReqProcedureArray.Add(Convert.ToInt32(reqProcedureIds[i]));
                                }
                            }
                        }
                    }
                }
                else
                {
                    ReqProcedureArray.Add(Convert.ToInt32(procedure.RequestedprocedureId));
                }
            }
            return ReqProcedureArray;
        }

        ///// <summary>
        ///// Add or Update Care plan details for a Visit
        ///// </summary>
        ///// <param>(CarePlanModel careModel)</param>
        ///// <returns>CarePlanModel. if set of CarePlanModel data saved in DB = success. else = failure</returns>
        public CarePlanModel AddUpdateCarePlanForVisitCase(CarePlanModel careModel)
        {
            var care = this.uow.GenericRepository<CarePlan>().Table().Where(x => x.VisitID == careModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (care == null)
            {
                care = new CarePlan();

                care.VisitID = careModel.VisitID;
                care.RecordedDate = this.utilService.GetLocalTime(careModel.RecordedDate);
                care.RecordedBy = careModel.RecordedBy;
                care.PlanningActivity = careModel.PlanningActivity;
                care.Duration = careModel.Duration;
                care.StartDate = careModel.StartDate != null ? this.utilService.GetLocalTime(careModel.StartDate.Value) : careModel.StartDate;
                care.EndDate = careModel.EndDate != null ? this.utilService.GetLocalTime(careModel.EndDate.Value) : careModel.EndDate;
                care.CarePlanStatus = careModel.CarePlanStatus;
                care.Progress = careModel.Progress;
                care.NextVisitDate = careModel.NextVisitDate != null ? this.utilService.GetLocalTime(careModel.NextVisitDate.Value) : careModel.NextVisitDate;
                care.AdditionalNotes = careModel.AdditionalNotes;
                care.IsActive = true;
                care.CreatedBy = "User";
                care.Createddate = DateTime.Now;

                this.uow.GenericRepository<CarePlan>().Insert(care);
            }
            else
            {
                care.RecordedDate = this.utilService.GetLocalTime(careModel.RecordedDate);
                care.RecordedBy = careModel.RecordedBy;
                care.PlanningActivity = careModel.PlanningActivity;
                care.Duration = careModel.Duration;
                care.StartDate = careModel.StartDate != null ? this.utilService.GetLocalTime(careModel.StartDate.Value) : careModel.StartDate;
                care.EndDate = careModel.EndDate != null ? this.utilService.GetLocalTime(careModel.EndDate.Value) : careModel.EndDate;
                care.CarePlanStatus = careModel.CarePlanStatus;
                care.Progress = careModel.Progress;
                care.NextVisitDate = careModel.NextVisitDate != null ? this.utilService.GetLocalTime(careModel.NextVisitDate.Value) : careModel.NextVisitDate;
                care.AdditionalNotes = careModel.AdditionalNotes;
                care.IsActive = true;
                care.ModifiedBy = "User";
                care.ModifiedDate = DateTime.Now;

                this.uow.GenericRepository<CarePlan>().Update(care);
            }
            this.uow.Save();
            careModel.CarePlanId = care.CarePlanId;
            return careModel;
        }

        ///// <summary>
        ///// Get Care Plan details for a Visit
        ///// </summary>
        ///// <param>(int CarePlanId)</param>
        ///// <returns>CarePlanModel. if set of CarePlanModel for given CarePlanId = success. else = failure</returns>
        public CarePlanModel GetCarePlanForVisitCase(int CarePlanId)
        {
            var care = this.uow.GenericRepository<CarePlan>().Table().Where(x => x.CarePlanId == CarePlanId).FirstOrDefault();
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == care.VisitID).FirstOrDefault();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == care.VisitID).SingleOrDefault();

            CarePlanModel careModel = new CarePlanModel();

            if (care != null)
            {
                careModel.CarePlanId = care.CarePlanId;
                careModel.VisitID = care.VisitID;
                careModel.RecordedDate = care.RecordedDate;
                careModel.RecordedBy = care.RecordedBy;
                careModel.PlanningActivity = care.PlanningActivity;
                careModel.Duration = care.Duration;
                careModel.StartDate = care.StartDate;
                careModel.EndDate = care.EndDate;
                careModel.CarePlanStatus = care.CarePlanStatus;
                careModel.Progress = care.Progress;
                careModel.NextVisitDate = care.NextVisitDate;
                careModel.AdditionalNotes = care.AdditionalNotes;
                careModel.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";
                careModel.RecordedTime = care.RecordedDate.TimeOfDay.ToString();
                careModel.visitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
                careModel.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
                careModel.signOffstatus = (signOff != null && signOff.CaseSheet == true) ? "Yes" : "No";
            }
            return careModel;
        }

        #region Audiology Record

        ///// <summary>
        ///// Get Audiology Records in Triage
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>AudiologyDataModel. if set of AudiologyDataModel returns for Given VisitId = success. else = failure</returns>
        public AudiologyDataModel GetAudiologyRecords(int VisitId)
        {
            AudiologyDataModel audiologyRecords = new AudiologyDataModel();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == VisitId);

            audiologyRecords.assrTestData = this.GetAssrTestRecord(VisitId);
            audiologyRecords.beraTestData = this.GetBeraTestRecord(VisitId);
            audiologyRecords.electrocochleographyData = this.GetElectrocochleographyRecord(VisitId);
            audiologyRecords.hearingAidData = this.GetHearingAidRecord(VisitId);
            audiologyRecords.oaeTestData = this.GetOaeTestRecord(VisitId);
            audiologyRecords.speechTherapyData = this.GetSpeechTherapyRecord(VisitId);
            audiologyRecords.speechSpecialTestData = this.GetSpeechtherapySpecialtestRecord(VisitId);
            audiologyRecords.tinnitusMaskingData = this.GetTinnitusmaskingRecord(VisitId);
            audiologyRecords.tuningForkTestData = this.GetTuningForkTestRecord(VisitId);
            audiologyRecords.tympanometryData = this.GetTympanometryRecord(VisitId);
            audiologyRecords.VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
            audiologyRecords.FacilityId = visit.FacilityID > 0 ? visit.FacilityID.Value : 0;
            audiologyRecords.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
            audiologyRecords.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";

            return audiologyRecords;
        }

        ///// <summary>
        ///// Get ASSR Test Record for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>ASSRTestModel. if set of ASSRTestModel returns for Given VisitId = success. else = failure</returns>
        public ASSRTestModel GetAssrTestRecord(int VisitId)
        {
            var assrRecord = (from assr in this.uow.GenericRepository<ASSRTest>().Table().Where(x => x.VisitID == VisitId)

                              join visit in this.uow.GenericRepository<PatientVisit>().Table()
                              on assr.VisitID equals visit.VisitId

                              select new
                              {
                                  assr.ASSRTestId,
                                  assr.VisitID,
                                  assr.RTEar,
                                  assr.LTEar,
                                  assr.NotesandInstructions,
                                  assr.Starttime,
                                  assr.Endtime,
                                  assr.Totalduration,
                                  assr.Nextfollowupdate,
                                  assr.SignOffDate,
                                  assr.SignOffStatus,
                                  assr.SignOffBy,
                                  visit.VisitDate,
                                  visit.FacilityID,
                                  visit.RecordedDuringID

                              }).AsEnumerable().Select(AM => new ASSRTestModel
                              {
                                  ASSRTestId = AM.ASSRTestId,
                                  VisitID = AM.VisitID,
                                  facilityName = AM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == AM.FacilityID).FacilityName : "",
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
                                  VisitDateandTime = AM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + AM.VisitDate.TimeOfDay.ToString(),
                                  recordeDuring = AM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == AM.RecordedDuringID).RecordedDuringDescription : ""

                              }).FirstOrDefault();

            return assrRecord;
        }

        ///// <summary>
        ///// Get BERA Test Record for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>BERATestModel. if set of BERATestModel returns for Given VisitId = success. else = failure</returns>
        public BERATestModel GetBeraTestRecord(int VisitId)
        {
            var beraRecord = (from bera in this.uow.GenericRepository<BERATest>().Table().Where(x => x.VisitID == VisitId)

                              join visit in this.uow.GenericRepository<PatientVisit>().Table()
                              on bera.VisitID equals visit.VisitId

                              select new
                              {
                                  bera.BERATestId,
                                  bera.VisitID,
                                  bera.RTEar,
                                  bera.LTEar,
                                  bera.NotesandInstructions,
                                  bera.Starttime,
                                  bera.Endtime,
                                  bera.Totalduration,
                                  bera.Nextfollowupdate,
                                  bera.SignOffDate,
                                  bera.SignOffStatus,
                                  bera.SignOffBy,
                                  visit.VisitDate,
                                  visit.FacilityID,
                                  visit.RecordedDuringID

                              }).AsEnumerable().Select(BM => new BERATestModel
                              {
                                  BERATestId = BM.BERATestId,
                                  VisitID = BM.VisitID,
                                  facilityName = BM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == BM.FacilityID).FacilityName : "",
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
                                  VisitDateandTime = BM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + BM.VisitDate.TimeOfDay.ToString(),
                                  recordeDuring = BM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == BM.RecordedDuringID).RecordedDuringDescription : ""

                              }).FirstOrDefault();

            return beraRecord;
        }

        ///// <summary>
        ///// Get Electrocochleography Record for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>ElectrocochleographyModel. if set of ElectrocochleographyModel returns for Given VisitId = success. else = failure</returns>
        public ElectrocochleographyModel GetElectrocochleographyRecord(int VisitId)
        {
            var electrocochleoRecord = (from electro in this.uow.GenericRepository<Electrocochleography>().Table().Where(x => x.VisitID == VisitId)

                                        join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                        on electro.VisitID equals visit.VisitId
                                        select new
                                        {
                                            electro.ElectrocochleographyId,
                                            electro.VisitID,
                                            electro.LTEar,
                                            electro.RTEar,
                                            electro.ClinicalNotes,
                                            electro.Starttime,
                                            electro.Endtime,
                                            electro.Totalduration,
                                            electro.Nextfollowupdate,
                                            electro.SignOffDate,
                                            electro.SignOffStatus,
                                            electro.SignOffBy,
                                            visit.VisitDate,
                                            visit.FacilityID,
                                            visit.RecordedDuringID

                                        }).AsEnumerable().Select(EGM => new ElectrocochleographyModel
                                        {
                                            ElectrocochleographyId = EGM.ElectrocochleographyId,
                                            VisitID = EGM.VisitID,
                                            facilityName = EGM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == EGM.FacilityID).FacilityName : "",
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
                                            VisitDateandTime = EGM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + EGM.VisitDate.TimeOfDay.ToString(),
                                            recordeDuring = EGM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == EGM.RecordedDuringID).RecordedDuringDescription : ""

                                        }).FirstOrDefault();

            return electrocochleoRecord;
        }

        ///// <summary>
        ///// Get Hearing Aid Trial Record for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>HearingAidTrialModel. if set of HearingAidTrialModel returns for Given VisitId = success. else = failure</returns>
        public HearingAidTrialModel GetHearingAidRecord(int VisitId)
        {
            var hearingAidRecord = (from hearingAid in this.uow.GenericRepository<HearingAidTrial>().Table().Where(x => x.VisitID == VisitId)

                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on hearingAid.VisitID equals visit.VisitId

                                    select new
                                    {
                                        hearingAid.HearingAidTrialId,
                                        hearingAid.VisitID,
                                        hearingAid.LTEar,
                                        hearingAid.RTEar,
                                        hearingAid.NotesandInstructions,
                                        hearingAid.Starttime,
                                        hearingAid.Endtime,
                                        hearingAid.Totalduration,
                                        hearingAid.Nextfollowupdate,
                                        hearingAid.SignOffDate,
                                        hearingAid.SignOffStatus,
                                        hearingAid.SignOffBy,
                                        visit.VisitDate,
                                        visit.FacilityID,
                                        visit.RecordedDuringID

                                    }).AsEnumerable().Select(HATM => new HearingAidTrialModel
                                    {
                                        HearingAidTrialId = HATM.HearingAidTrialId,
                                        VisitID = HATM.VisitID,
                                        facilityName = HATM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == HATM.FacilityID).FacilityName : "",
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
                                        VisitDateandTime = HATM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + HATM.VisitDate.TimeOfDay.ToString(),
                                        recordeDuring = HATM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == HATM.RecordedDuringID).RecordedDuringDescription : ""

                                    }).FirstOrDefault();

            return hearingAidRecord;
        }

        ///// <summary>
        ///// Get OAE Test Record for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>OAETestModel. if set of OAETestModel returns for Given VisitId = success. else = failure</returns>
        public OAETestModel GetOaeTestRecord(int VisitId)
        {
            var oaeTestRecord = (from oaeTest in this.uow.GenericRepository<OAETest>().Table().Where(x => x.VisitID == VisitId)

                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                 on oaeTest.VisitID equals visit.VisitId

                                 select new
                                 {
                                     oaeTest.OAETestId,
                                     oaeTest.VisitID,
                                     oaeTest.LTEar,
                                     oaeTest.RTEar,
                                     oaeTest.NotesandInstructions,
                                     oaeTest.Starttime,
                                     oaeTest.Endtime,
                                     oaeTest.Totalduration,
                                     oaeTest.Nextfollowupdate,
                                     oaeTest.SignOffDate,
                                     oaeTest.SignOffStatus,
                                     oaeTest.SignOffBy,
                                     visit.VisitDate,
                                     visit.FacilityID,
                                     visit.RecordedDuringID

                                 }).AsEnumerable().Select(OM => new OAETestModel
                                 {
                                     OAETestId = OM.OAETestId,
                                     VisitID = OM.VisitID,
                                     facilityName = OM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == OM.FacilityID).FacilityName : "",
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
                                     VisitDateandTime = OM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + OM.VisitDate.TimeOfDay.ToString(),
                                     recordeDuring = OM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == OM.RecordedDuringID).RecordedDuringDescription : ""

                                 }).FirstOrDefault();

            return oaeTestRecord;
        }

        ///// <summary>
        ///// Get Speech Therapy for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>SpeechTherapyModel. if set of SpeechTherapyModel returns for Given VisitId = success. else = failure</returns>
        public SpeechTherapyModel GetSpeechTherapyRecord(int VisitId)
        {
            var speechTherapyRecord = (from speechTherapy in this.uow.GenericRepository<SpeechTherapy>().Table().Where(x => x.VisitID == VisitId)

                                       join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                       on speechTherapy.VisitID equals visit.VisitId

                                       select new
                                       {
                                           speechTherapy.SpeechTherapyId,
                                           speechTherapy.VisitID,
                                           speechTherapy.Findings,
                                           speechTherapy.ClinicalNotes,
                                           speechTherapy.Starttime,
                                           speechTherapy.Endtime,
                                           speechTherapy.Totalduration,
                                           speechTherapy.Nextfollowupdate,
                                           speechTherapy.SignOffDate,
                                           speechTherapy.SignOffStatus,
                                           speechTherapy.SignOffBy,
                                           visit.VisitDate,
                                           visit.FacilityID,
                                           visit.RecordedDuringID

                                       }).AsEnumerable().Select(STM => new SpeechTherapyModel
                                       {
                                           SpeechTherapyId = STM.SpeechTherapyId,
                                           VisitID = STM.VisitID,
                                           facilityName = STM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == STM.FacilityID).FacilityName : "",
                                           Findings = STM.Findings,
                                           ClinicalNotes = STM.ClinicalNotes,
                                           Starttime = STM.Starttime,
                                           Endtime = STM.Endtime,
                                           Totalduration = STM.Totalduration,
                                           Nextfollowupdate = STM.Nextfollowupdate,
                                           SignOffDate = STM.SignOffDate,
                                           SignOffStatus = STM.SignOffStatus,
                                           SignOffBy = STM.SignOffBy,
                                           VisitDateandTime = STM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + STM.VisitDate.TimeOfDay.ToString(),
                                           recordeDuring = STM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == STM.RecordedDuringID).RecordedDuringDescription : ""

                                       }).FirstOrDefault();

            return speechTherapyRecord;
        }

        ///// <summary>
        ///// Get Speechtherapy Special test for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>SpeechtherapySpecialtestsModel. if set of SpeechtherapySpecialtestsModel returns for Given VisitId = success. else = failure</returns>
        public SpeechtherapySpecialtestsModel GetSpeechtherapySpecialtestRecord(int VisitId)
        {
            var specialTestRecord = (from speechtherapySpecial in this.uow.GenericRepository<SpeechtherapySpecialtests>().Table().Where(x => x.VisitID == VisitId)

                                     join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                     on speechtherapySpecial.VisitID equals visit.VisitId

                                     select new
                                     {
                                         speechtherapySpecial.SpeechTherapySpecialTestId,
                                         speechtherapySpecial.VisitID,
                                         speechtherapySpecial.ChiefComplaint,
                                         speechtherapySpecial.SRTRight,
                                         speechtherapySpecial.SRTLeft,
                                         speechtherapySpecial.SDSRight,
                                         speechtherapySpecial.SDSLeft,
                                         speechtherapySpecial.SISIRight,
                                         speechtherapySpecial.SISILeft,
                                         speechtherapySpecial.TDTRight,
                                         speechtherapySpecial.TDTLeft,
                                         speechtherapySpecial.ABLBLeft,
                                         speechtherapySpecial.ABLBRight,
                                         speechtherapySpecial.NotesandInstructions,
                                         speechtherapySpecial.Starttime,
                                         speechtherapySpecial.Endtime,
                                         speechtherapySpecial.Totalduration,
                                         speechtherapySpecial.Nextfollowupdate,
                                         speechtherapySpecial.SignOffDate,
                                         speechtherapySpecial.SignOffStatus,
                                         speechtherapySpecial.SignOffBy,
                                         visit.VisitDate,
                                         visit.FacilityID,
                                         visit.RecordedDuringID

                                     }).AsEnumerable().Select(SSM => new SpeechtherapySpecialtestsModel
                                     {
                                         SpeechTherapySpecialTestId = SSM.SpeechTherapySpecialTestId,
                                         VisitID = SSM.VisitID,
                                         facilityName = SSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == SSM.FacilityID).FacilityName : "",
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
                                         VisitDateandTime = SSM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + SSM.VisitDate.TimeOfDay.ToString(),
                                         recordeDuring = SSM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == SSM.RecordedDuringID).RecordedDuringDescription : ""

                                     }).FirstOrDefault();

            return specialTestRecord;
        }

        ///// <summary>
        ///// Get Tinnitus masking for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>TinnitusmaskingModel. if set of TinnitusmaskingModel returns for Given VisitId = success. else = failure</returns>
        public TinnitusmaskingModel GetTinnitusmaskingRecord(int VisitId)
        {
            var tinnitusMaskingRecord = (from tinnitus in this.uow.GenericRepository<Tinnitusmasking>().Table().Where(x => x.VisitID == VisitId)

                                         join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                         on tinnitus.VisitID equals visit.VisitId

                                         select new
                                         {
                                             tinnitus.TinnitusmaskingId,
                                             tinnitus.VisitID,
                                             tinnitus.RTEar,
                                             tinnitus.LTEar,
                                             tinnitus.NotesandInstructions,
                                             tinnitus.Starttime,
                                             tinnitus.Endtime,
                                             tinnitus.Totalduration,
                                             tinnitus.Nextfollowupdate,
                                             tinnitus.SignOffDate,
                                             tinnitus.SignOffStatus,
                                             tinnitus.SignOffBy,
                                             visit.VisitDate,
                                             visit.FacilityID,
                                             visit.RecordedDuringID

                                         }).AsEnumerable().Select(TmM => new TinnitusmaskingModel
                                         {
                                             TinnitusmaskingId = TmM.TinnitusmaskingId,
                                             VisitID = TmM.VisitID,
                                             facilityName = TmM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == TmM.FacilityID).FacilityName : "",
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
                                             VisitDateandTime = TmM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + TmM.VisitDate.TimeOfDay.ToString(),
                                             recordeDuring = TmM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == TmM.RecordedDuringID).RecordedDuringDescription : ""

                                         }).FirstOrDefault();

            return tinnitusMaskingRecord;
        }

        ///// <summary>
        ///// Get Tuning Fork Test for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>TuningForkTestModel. if set of TuningForkTestModel returns for Given VisitId = success. else = failure</returns>
        public TuningForkTestModel GetTuningForkTestRecord(int VisitId)
        {
            var tuningRecord = (from forkTest in this.uow.GenericRepository<TuningForkTest>().Table().Where(x => x.VisitID == VisitId)

                                join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                on forkTest.VisitID equals visit.VisitId

                                select new
                                {
                                    forkTest.TuningForkTestId,
                                    forkTest.VisitID,
                                    forkTest.WeberRTEar,
                                    forkTest.WeberLTEar,
                                    forkTest.RinnersRTEar,
                                    forkTest.RinnersLTEar,
                                    forkTest.Starttime,
                                    forkTest.Endtime,
                                    forkTest.Totalduration,
                                    forkTest.Findings,
                                    forkTest.Nextfollowupdate,
                                    forkTest.SignOffDate,
                                    forkTest.SignOffStatus,
                                    forkTest.SignOffBy,
                                    visit.VisitDate,
                                    visit.FacilityID,
                                    visit.RecordedDuringID

                                }).AsEnumerable().Select(TFTM => new TuningForkTestModel
                                {
                                    TuningForkTestId = TFTM.TuningForkTestId,
                                    VisitID = TFTM.VisitID,
                                    facilityName = TFTM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == TFTM.FacilityID).FacilityName : "",
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
                                    VisitDateandTime = TFTM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + TFTM.VisitDate.TimeOfDay.ToString(),
                                    recordeDuring = TFTM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == TFTM.RecordedDuringID).RecordedDuringDescription : ""

                                }).FirstOrDefault();

            return tuningRecord;
        }

        ///// <summary>
        ///// Get Tympanometry for Audiology Record
        ///// </summary>
        ///// <param>(int VisitId)</param>
        ///// <returns>TympanometryModel. if set of TympanometryModel returns for Given VisitId = success. else = failure</returns>
        public TympanometryModel GetTympanometryRecord(int VisitId)
        {
            var typanometryRecord = (from tympanometry in this.uow.GenericRepository<Tympanometry>().Table().Where(x => x.VisitID == VisitId)

                                     join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                     on tympanometry.VisitID equals visit.VisitId

                                     select new
                                     {
                                         tympanometry.TympanogramId,
                                         tympanometry.VisitID,
                                         tympanometry.ECVRight,
                                         tympanometry.ECVLeft,
                                         tympanometry.MEPRight,
                                         tympanometry.MEPLeft,
                                         tympanometry.SCRight,
                                         tympanometry.SCLeft,
                                         tympanometry.GradRight,
                                         tympanometry.GradLeft,
                                         tympanometry.TWRight,
                                         tympanometry.TWLeft,
                                         tympanometry.SpeedRight,
                                         tympanometry.SpeedLeft,
                                         tympanometry.DirectionRight,
                                         tympanometry.DirectionLeft,
                                         tympanometry.NotesandInstructions,
                                         tympanometry.Starttime,
                                         tympanometry.Endtime,
                                         tympanometry.Totalduration,
                                         tympanometry.Nextfollowupdate,
                                         tympanometry.SignOffDate,
                                         tympanometry.SignOffStatus,
                                         tympanometry.SignOffBy,
                                         visit.VisitDate,
                                         visit.FacilityID,
                                         visit.RecordedDuringID

                                     }).AsEnumerable().Select(TM => new TympanometryModel
                                     {
                                         TympanogramId = TM.TympanogramId,
                                         VisitID = TM.VisitID,
                                         facilityName = TM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == TM.FacilityID).FacilityName : "",
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
                                         VisitDateandTime = TM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + TM.VisitDate.TimeOfDay.ToString(),
                                         recordeDuring = TM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == TM.RecordedDuringID).RecordedDuringDescription : ""

                                     }).FirstOrDefault();

            return typanometryRecord;
        }

        #endregion

        #region Procedure Request

        ///// <summary>
        ///// Add or Update Procedure Request Data
        ///// </summary>
        ///// <param>ProcedureRequestModel procedureRequestModel</param>
        ///// <returns>ProcedureRequestModel. if set of Procedure Request data added or updated = success. else = failure</returns>
        public ProcedureRequestModel AddUpdateProcedureRequest(ProcedureRequestModel procedureRequestModel)
        {
            var procedureRequest = this.uow.GenericRepository<ProcedureRequest>().Table().Where(x => x.VisitID == procedureRequestModel.VisitID).FirstOrDefault();

            if (procedureRequest == null)
            {
                procedureRequest = new ProcedureRequest();

                procedureRequest.VisitID = procedureRequestModel.VisitID;
                procedureRequest.ProcedureRequestedDate = this.utilService.GetLocalTime(procedureRequestModel.ProcedureRequestedDate);
                procedureRequest.ProcedureType = procedureRequestModel.ProcedureType;
                procedureRequest.AdmittingPhysician = procedureRequestModel.AdmittingPhysician;
                procedureRequest.ApproximateDuration = (procedureRequestModel.ApproximateDuration != null && procedureRequestModel.ApproximateDuration != "") ? procedureRequestModel.ApproximateDuration : "";
                procedureRequest.UrgencyID = procedureRequestModel.UrgencyID;
                procedureRequest.PreProcedureDiagnosis = procedureRequestModel.PreProcedureDiagnosis;
                procedureRequest.ICDCode = procedureRequestModel.ICDCode;
                procedureRequest.PlannedProcedure = procedureRequestModel.PlannedProcedure;
                procedureRequest.ProcedureName = procedureRequestModel.ProcedureName;
                procedureRequest.CPTCode = procedureRequestModel.CPTCode;
                procedureRequest.AnesthesiaFitnessRequired = procedureRequestModel.AnesthesiaFitnessRequired;
                procedureRequest.AnesthesiaFitnessRequiredDesc = procedureRequestModel.AnesthesiaFitnessRequiredDesc;
                procedureRequest.BloodRequired = procedureRequestModel.BloodRequired;
                procedureRequest.BloodRequiredDesc = procedureRequestModel.BloodRequiredDesc;
                procedureRequest.ContinueMedication = procedureRequestModel.ContinueMedication;
                procedureRequest.StopMedication = procedureRequestModel.StopMedication;
                procedureRequest.SpecialPreparation = procedureRequestModel.SpecialPreparation;
                procedureRequest.SpecialPreparationNotes = procedureRequestModel.SpecialPreparationNotes;
                procedureRequest.DietInstructions = procedureRequestModel.DietInstructions;
                procedureRequest.DietInstructionsNotes = procedureRequestModel.DietInstructionsNotes;
                procedureRequest.OtherInstructions = procedureRequestModel.OtherInstructions;
                procedureRequest.OtherInstructionsNotes = procedureRequestModel.OtherInstructionsNotes;
                procedureRequest.Cardiology = procedureRequestModel.Cardiology;
                procedureRequest.Nephrology = procedureRequestModel.Nephrology;
                procedureRequest.Neurology = procedureRequestModel.Neurology;
                procedureRequest.OtherConsults = procedureRequestModel.OtherConsults;
                procedureRequest.OtherConsultsNotes = procedureRequestModel.OtherConsultsNotes;
                procedureRequest.AdmissionType = procedureRequestModel.AdmissionType;
                procedureRequest.PatientExpectedStay = procedureRequestModel.PatientExpectedStay;
                procedureRequest.InstructionToPatient = procedureRequestModel.InstructionToPatient;
                procedureRequest.AdditionalInfo = procedureRequestModel.AdditionalInfo;
                procedureRequest.ProcedureRequestStatus = "Requested";
                procedureRequest.AdmissionStatus = this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusDesc.ToLower().Trim() == "requested").AdmissionStatusID;
                procedureRequest.IsActive = true;
                procedureRequest.Createddate = DateTime.Now;
                procedureRequest.CreatedBy = "User";

                this.uow.GenericRepository<ProcedureRequest>().Insert(procedureRequest);
            }
            else
            {
                procedureRequest.ProcedureRequestedDate = this.utilService.GetLocalTime(procedureRequestModel.ProcedureRequestedDate);
                procedureRequest.ProcedureType = procedureRequestModel.ProcedureType;
                procedureRequest.AdmittingPhysician = procedureRequestModel.AdmittingPhysician;
                procedureRequest.ApproximateDuration = (procedureRequestModel.ApproximateDuration != null && procedureRequestModel.ApproximateDuration != "") ? procedureRequestModel.ApproximateDuration : "";
                procedureRequest.UrgencyID = procedureRequestModel.UrgencyID;
                procedureRequest.PreProcedureDiagnosis = procedureRequestModel.PreProcedureDiagnosis;
                procedureRequest.ICDCode = procedureRequestModel.ICDCode;
                procedureRequest.PlannedProcedure = procedureRequestModel.PlannedProcedure;
                procedureRequest.ProcedureName = procedureRequestModel.ProcedureName;
                procedureRequest.CPTCode = procedureRequestModel.CPTCode;
                procedureRequest.AnesthesiaFitnessRequired = procedureRequestModel.AnesthesiaFitnessRequired;
                procedureRequest.AnesthesiaFitnessRequiredDesc = procedureRequestModel.AnesthesiaFitnessRequiredDesc;
                procedureRequest.BloodRequired = procedureRequestModel.BloodRequired;
                procedureRequest.BloodRequiredDesc = procedureRequestModel.BloodRequiredDesc;
                procedureRequest.ContinueMedication = procedureRequestModel.ContinueMedication;
                procedureRequest.StopMedication = procedureRequestModel.StopMedication;
                procedureRequest.SpecialPreparation = procedureRequestModel.SpecialPreparation;
                procedureRequest.SpecialPreparationNotes = procedureRequestModel.SpecialPreparationNotes;
                procedureRequest.DietInstructions = procedureRequestModel.DietInstructions;
                procedureRequest.DietInstructionsNotes = procedureRequestModel.DietInstructionsNotes;
                procedureRequest.OtherInstructions = procedureRequestModel.OtherInstructions;
                procedureRequest.OtherInstructionsNotes = procedureRequestModel.OtherInstructionsNotes;
                procedureRequest.Cardiology = procedureRequestModel.Cardiology;
                procedureRequest.Nephrology = procedureRequestModel.Nephrology;
                procedureRequest.Neurology = procedureRequestModel.Neurology;
                procedureRequest.OtherConsults = procedureRequestModel.OtherConsults;
                procedureRequest.OtherConsultsNotes = procedureRequestModel.OtherConsultsNotes;
                procedureRequest.AdmissionType = procedureRequestModel.AdmissionType;
                procedureRequest.PatientExpectedStay = procedureRequestModel.PatientExpectedStay;
                procedureRequest.InstructionToPatient = procedureRequestModel.InstructionToPatient;
                procedureRequest.AdditionalInfo = procedureRequestModel.AdditionalInfo;
                procedureRequest.AdmissionStatus = this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusDesc.ToLower().Trim() == "requested").AdmissionStatusID;
                procedureRequest.IsActive = true;
                procedureRequest.ModifiedDate = DateTime.Now;
                procedureRequest.ModifiedBy = "User";

                this.uow.GenericRepository<ProcedureRequest>().Update(procedureRequest);
            }
            this.uow.Save();
            procedureRequestModel.ProcedureRequestId = procedureRequest.ProcedureRequestId;

            return procedureRequestModel;
        }

        ///// <summary>
        ///// Get Procedure Request for Visit
        ///// </summary>
        ///// <param>(int visitId)</param>
        ///// <returns>ProcedureRequestModel. if set of ProcedureRequestModel for given visitId = success. else = failure</returns>
        public ProcedureRequestModel GetProcedureRequestforVisit(int visitId)
        {
            var procedureRequest = (from procRqst in this.uow.GenericRepository<ProcedureRequest>().Table()

                                    join visit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == visitId)
                                    on procRqst.VisitID equals visit.VisitId

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
                                        FacilityId = PRM.FacilityID > 0 ? PRM.FacilityID.Value : 0,
                                        facilityName = PRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PRM.FacilityID).FacilityName : "",
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
                                        AdmissionStatusDesc = this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == PRM.AdmissionStatus).AdmissionStatusDesc,
                                        VisitDateandTime = PRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PRM.VisitDate.TimeOfDay.ToString()

                                    }).FirstOrDefault();

            return procedureRequest;
        }

        #endregion

        #region Audiology Request 

        ///// <summary>
        ///// Get Providers For Audiology
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for Audiology = success. else = failure</returns>
        public List<ProviderModel> GetAudiologyDoctors(string searchKey)
        {
            List<ProviderModel> audiologistList = new List<ProviderModel>();
            var facList = this.utilService.GetFacilitiesforUser();

            var providers = (from prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)

                             join provSpec in this.uow.GenericRepository<ProviderSpeciality>().Table().Where(x => x.SpecialityDescription.ToLower().Trim() == "audiologist")
                             on prov.ProviderID equals provSpec.ProviderID

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
                        if (record != null && !audiologistList.Contains(prov))
                        {
                            audiologistList.Add(prov);
                        }
                    }
                }
            }

            return audiologistList.Take(10).ToList();
        }

        ///// <summary>
        ///// Add or Update Audiology Request for a Visit
        ///// </summary>
        ///// <param>(AudiologyRequestModel audiologyRequestModel)</param>
        ///// <returns>AudiologyRequestModel. if set of Audiology RequestModel saved in DB = success. else = failure</returns>
        public AudiologyRequestModel AddUpdateAudiologyRequest(AudiologyRequestModel audiologyRequestModel)
        {
            var audiology = this.uow.GenericRepository<AudiologyRequest>().Table().Where(x => x.VisitID == audiologyRequestModel.VisitID).FirstOrDefault();

            if (audiology == null)
            {
                audiology = new AudiologyRequest();

                audiology.VisitID = audiologyRequestModel.VisitID;
                audiology.ProviderId = audiologyRequestModel.ProviderId;
                audiology.TuningFork = audiologyRequestModel.TuningFork == true ? true : false;
                audiology.SpecialTest = audiologyRequestModel.SpecialTest == true ? true : false;
                audiology.Tympanometry = audiologyRequestModel.Tympanometry == true ? true : false;
                audiology.OAE = audiologyRequestModel.OAE == true ? true : false;
                audiology.BERA = audiologyRequestModel.BERA == true ? true : false;
                audiology.ASSR = audiologyRequestModel.ASSR == true ? true : false;
                audiology.HearingAid = audiologyRequestModel.HearingAid == true ? true : false;
                audiology.TinnitusMasking = audiologyRequestModel.TinnitusMasking == true ? true : false;
                audiology.SpeechTherapy = audiologyRequestModel.SpeechTherapy == true ? true : false;
                audiology.Electrocochleography = audiologyRequestModel.Electrocochleography == true ? true : false;
                audiology.Createddate = DateTime.Now;
                audiology.CreatedBy = "User";

                this.uow.GenericRepository<AudiologyRequest>().Insert(audiology);
            }
            else
            {
                audiology.ProviderId = audiologyRequestModel.ProviderId;
                audiology.TuningFork = audiologyRequestModel.TuningFork == true ? true : false;
                audiology.SpecialTest = audiologyRequestModel.SpecialTest == true ? true : false;
                audiology.Tympanometry = audiologyRequestModel.Tympanometry == true ? true : false;
                audiology.OAE = audiologyRequestModel.OAE == true ? true : false;
                audiology.BERA = audiologyRequestModel.BERA == true ? true : false;
                audiology.ASSR = audiologyRequestModel.ASSR == true ? true : false;
                audiology.HearingAid = audiologyRequestModel.HearingAid == true ? true : false;
                audiology.TinnitusMasking = audiologyRequestModel.TinnitusMasking == true ? true : false;
                audiology.SpeechTherapy = audiologyRequestModel.SpeechTherapy == true ? true : false;
                audiology.Electrocochleography = audiologyRequestModel.Electrocochleography == true ? true : false;
                audiology.ModifiedDate = DateTime.Now;
                audiology.ModifiedBy = "User";

                this.uow.GenericRepository<AudiologyRequest>().Update(audiology);
            }
            this.uow.Save();
            audiologyRequestModel.AudiologyRequestID = audiology.AudiologyRequestID;

            return audiologyRequestModel;
        }

        ///// <summary>
        ///// Get Audiology Requests for a Patient by ID
        ///// </summary>
        ///// <param>(int  nb</param>
        ///// <returns>List<AudiologyRequestModel>. if collection of AudiologyRequestModel returns for Given patientId = success. else = failure</returns>
        public List<AudiologyRequestModel> GetAudiologyRequestsForPatient(int patientId)
        {
            var audiologyRequests = (from audioRequest in this.uow.GenericRepository<AudiologyRequest>().Table()

                                     join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                     on audioRequest.VisitID equals visit.VisitId

                                     join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                     on audioRequest.ProviderId equals prov.ProviderID

                                     join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == patientId)
                                     on visit.PatientId equals pat.PatientId

                                     select new
                                     {
                                         audioRequest.AudiologyRequestID,
                                         audioRequest.VisitID,
                                         prov.ProviderID,
                                         prov.FirstName,
                                         prov.MiddleName,
                                         prov.LastName,
                                         audioRequest.TuningFork,
                                         audioRequest.SpecialTest,
                                         audioRequest.Tympanometry,
                                         audioRequest.OAE,
                                         audioRequest.BERA,
                                         audioRequest.ASSR,
                                         audioRequest.HearingAid,
                                         audioRequest.SpeechTherapy,
                                         audioRequest.TinnitusMasking,
                                         audioRequest.Electrocochleography,
                                         visit.VisitDate,
                                         visit.FacilityID

                                     }).AsEnumerable().Select(ARM => new AudiologyRequestModel
                                     {
                                         AudiologyRequestID = ARM.AudiologyRequestID,
                                         VisitID = ARM.VisitID,
                                         FacilityId = ARM.FacilityID > 0 ? ARM.FacilityID.Value : 0,
                                         facilityName = ARM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == ARM.FacilityID).FacilityName : "",
                                         ProviderId = ARM.ProviderID,
                                         ProviderName = ARM.FirstName + " " + ARM.MiddleName + " " + ARM.LastName,
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

            if (audiologyRequests.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        audioRequestCollection = (from audio in audiologyRequests
                                                  join fac in facList on audio.FacilityId equals fac.FacilityId
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on audio.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select audio).ToList();
                    }
                    else
                    {
                        audioRequestCollection = (from audio in audiologyRequests
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on audio.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select audio).ToList();
                    }
                }
                else
                {
                    audioRequestCollection = (from audio in audiologyRequests
                                              join fac in facList on audio.FacilityId equals fac.FacilityId
                                              select audio).ToList();
                }
            }
            else
            {
                audioRequestCollection = audiologyRequests;
            }

            return audioRequestCollection;
        }

        ///// <summary>
        ///// Get Audiology Request Record by ID
        ///// </summary>
        ///// <param>(int visitId)</param>
        ///// <returns>AudiologyRequestModel. if set of AudiologyRequestModel returns for Given visitId = success. else = failure</returns>
        public AudiologyRequestModel GetAudiologyRequestRecordbyVisitID(int visitId)
        {
            var audiologyRequestRecord = (from audioRequest in this.uow.GenericRepository<AudiologyRequest>().Table().Where(x => x.VisitID == visitId)

                                          join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                          on audioRequest.VisitID equals visit.VisitId

                                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                          on audioRequest.ProviderId equals prov.ProviderID

                                          select new
                                          {
                                              audioRequest.AudiologyRequestID,
                                              audioRequest.VisitID,
                                              prov.ProviderID,
                                              prov.FirstName,
                                              prov.MiddleName,
                                              prov.LastName,
                                              audioRequest.TuningFork,
                                              audioRequest.SpecialTest,
                                              audioRequest.Tympanometry,
                                              audioRequest.OAE,
                                              audioRequest.BERA,
                                              audioRequest.ASSR,
                                              audioRequest.HearingAid,
                                              audioRequest.SpeechTherapy,
                                              audioRequest.TinnitusMasking,
                                              audioRequest.Electrocochleography,
                                              visit.VisitDate,
                                              visit.FacilityID

                                          }).AsEnumerable().Select(ARM => new AudiologyRequestModel
                                          {
                                              AudiologyRequestID = ARM.AudiologyRequestID,
                                              VisitID = ARM.VisitID,
                                              FacilityId = ARM.FacilityID > 0 ? ARM.FacilityID.Value : 0,
                                              facilityName = ARM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == ARM.FacilityID).FacilityName : "",
                                              ProviderId = ARM.ProviderID,
                                              ProviderName = ARM.FirstName + " " + ARM.MiddleName + " " + ARM.LastName,
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

            return audiologyRequestRecord;
        }

        #endregion

        #region E - Prescription => (Medication Request)

        ///// <summary>
        ///// Add or Update MedicationRequests from Triage
        ///// </summary>
        ///// <param>(MedicationRequestsModel medicationRequestsModel)</param>
        ///// <returns>MedicationRequestsModel. if Record of Medication Request added or Updated = success. else = failure</returns>
        public MedicationRequestsModel AddUpdateMedicationRequestforVisit(MedicationRequestsModel medicationRequestsModel)
        {
            var medicationRequest = this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.VisitID == medicationRequestsModel.VisitID).FirstOrDefault();

            if (medicationRequest == null)
            {
                medicationRequest = new MedicationRequests();

                medicationRequest.VisitID = medicationRequestsModel.VisitID;
                medicationRequest.AdmissionID = 0;
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
                medicationRequest.RequestedBy = this.GetVisitRecordById(medicationRequestsModel.VisitID).ProviderName;
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
        ///// Get Medication Requests for Visit
        ///// </summary>
        ///// <param>int VisitId</param>
        ///// <returns>MedicationRequestsModel. if Medication Request for selected Visit Id = success. else = failure</returns>
        public MedicationRequestsModel GetMedicationRequestForVisit(int VisitId)
        {
            var medicationRequest = (from medRequest in this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.VisitID == VisitId)

                                     join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                     on medRequest.VisitID equals visit.VisitId

                                     join pat in this.uow.GenericRepository<Patient>().Table()
                                     on visit.PatientId equals pat.PatientId

                                     join prov in this.uow.GenericRepository<Provider>().Table()
                                     on visit.ProviderID equals prov.ProviderID

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
                                         visit.VisitDate,
                                         visit.ProviderID,
                                         visit.FacilityID,
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
                                         FacilityId = MRM.FacilityID > 0 ? MRM.FacilityID.Value : 0,
                                         facilityName = MRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == MRM.FacilityID).FacilityName : "",
                                         providerId = MRM.ProviderID,
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
                                         VisitDateandTime = MRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + MRM.VisitDate.TimeOfDay.ToString(),
                                         medicationRequestItems = this.GetMedicationRequestItems(MRM.MedicationRequestId),
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
        public MedicationRequests CancelMedicationRequestFromTriage(int medicationRequestId)
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

        #region e Lab Request - Triage

        ///// <summary>
        ///// Get eLab Setup Masters by Search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<eLabSetupMasterModel>. if eLab Setup Masters = success. else = failure</returns>
        public List<eLabSetupMasterModel> GetELabSetupMastersbySearchfromTriage(string searchKey)
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
                                     LabSubMasterDesc = (eLSM.SubMasterLabTypeDesc != null && eLSM.SubMasterLabTypeDesc != "") ? (eLSM.SubMasterLabType + " - " + eLSM.SubMasterLabTypeDesc) : eLSM.SubMasterLabType

                                 }).FirstOrDefault();

            return eLabSubRecord;
        }

        ///// <summary>
        ///// Add or Update e Lab Requests
        ///// </summary>
        ///// <param>(eLabRequestModel elabRequestModel)</param>
        ///// <returns>eLabRequestModel. if Record of eLab Request added or Updated = success. else = failure</returns>
        public eLabRequestModel AddUpdateELabRequestfromTriage(eLabRequestModel elabRequest)
        {
            var elabRequestData = this.uow.GenericRepository<eLabRequest>().Table().Where(x => x.VisitID == elabRequest.VisitID).FirstOrDefault();

            if (elabRequestData == null)
            {
                elabRequestData = new eLabRequest();

                elabRequestData.AdmissionID = 0;
                elabRequestData.VisitID = elabRequest.VisitID;
                elabRequestData.RequestedDate = DateTime.Now;
                elabRequestData.RequestedBy = this.GetVisitRecordById(elabRequest.VisitID).ProviderName;
                elabRequestData.LabOrderStatus = "Requested";
                elabRequestData.IsActive = true;
                elabRequestData.Createddate = DateTime.Now;
                elabRequestData.CreatedBy = "User";

                this.uow.GenericRepository<eLabRequest>().Insert(elabRequestData);
            }
            else
            {

                //elabRequestData.LabOrderStatus = "Requested";
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

                //       this.uow.GenericRepository<eLabRequestItems>().Update(requestItem);
                //    }
                //    this.uow.Save();
                //    data.LabRequestID = requestItem.LabRequestID;
                //    data.LabRequestItemsID = requestItem.LabRequestItemsID;
                //}
            }

            return elabRequest;
        }

        ///// <summary>
        ///// Get e Lab Requests for visit
        ///// </summary>
        ///// <param>int visitId</param>
        ///// <returns>List<eLabRequestModel>. if Records of eLab Request for given visitId = success. else = failure</returns>
        public eLabRequestModel GetELabRequestforVisit(int visitId)
        {
            var elabRequests = (from eLabReq in this.uow.GenericRepository<eLabRequest>().Table().
                                Where(x => x.IsActive != false & x.VisitID == visitId)

                                join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                on eLabReq.VisitID equals visit.VisitId

                                join pat in this.uow.GenericRepository<Patient>().Table()
                                on visit.PatientId equals pat.PatientId

                                join prov in this.uow.GenericRepository<Provider>().Table()
                                on visit.ProviderID equals prov.ProviderID

                                select new
                                {
                                    eLabReq.LabRequestID,
                                    eLabReq.AdmissionID,
                                    eLabReq.VisitID,
                                    eLabReq.RequestedDate,
                                    eLabReq.RequestedBy,
                                    eLabReq.LabOrderStatus,
                                    visit.VisitDate,
                                    visit.PatientId,
                                    visit.FacilityID,
                                    visit.ProviderID,
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
                                    VisitID = eLRM.VisitID,
                                    FacilityId = eLRM.FacilityID > 0 ? eLRM.FacilityID.Value : 0,
                                    facilityName = eLRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == eLRM.FacilityID).FacilityName : "",
                                    RequestedDate = eLRM.RequestedDate,
                                    RequestedBy = eLRM.RequestedBy,
                                    LabOrderStatus = eLRM.LabOrderStatus,
                                    visitDateandTime = eLRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + eLRM.VisitDate.TimeOfDay.ToString(),
                                    patientId = eLRM.PatientId,
                                    patientName = eLRM.PatientFirstName + " " + eLRM.PatientMiddleName + " " + eLRM.PatientLastName,
                                    providerId = eLRM.ProviderID,
                                    RequestingPhysician = eLRM.FirstName + " " + eLRM.MiddleName + " " + eLRM.LastName,
                                    labRequestItems = this.GetELabRequestItems(eLRM.LabRequestID)

                                }).FirstOrDefault();

            return elabRequests;
        }

        ///// <summary>
        ///// Get eLab Setup Master Record by ID
        ///// </summary>
        ///// <param>int eLabSetupMasterId</param>
        ///// <returns>eLabSetupMasterModel. if eLab Setup Master data Record for Given eLabSetupMaster Id = success. else = failure</returns>
        public eLabSetupMasterModel GetELabSetupMasterRecordbyID(int eLabSetupMasterId)
        {
            var eLabSetupMasterRecord = (from eLabSetup in this.uow.GenericRepository<eLabSetupMaster>().Table().Where(x => x.SetupMasterID == eLabSetupMasterId)

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

                                         }).FirstOrDefault();

            return eLabSetupMasterRecord;
        }

        ///// <summary>
        ///// Get e Lab Requests by Id
        ///// </summary>
        ///// <param>int labRequestId</param>
        ///// <returns>eLabRequestModel. if Record of eLab Request for given Id = success. else = failure</returns>
        public eLabRequestModel GetELabRequestbyIdfromTriage(int labRequestId)
        {
            var elabRequest = (from eLabReq in this.uow.GenericRepository<eLabRequest>().Table().Where(x => x.LabRequestID == labRequestId)

                               join visit in this.uow.GenericRepository<PatientVisit>().Table()
                               on eLabReq.VisitID equals visit.VisitId

                               join pat in this.uow.GenericRepository<Patient>().Table()
                               on visit.PatientId equals pat.PatientId

                               join prov in this.uow.GenericRepository<Provider>().Table()
                               on visit.ProviderID equals prov.ProviderID

                               select new
                               {
                                   eLabReq.LabRequestID,
                                   eLabReq.AdmissionID,
                                   eLabReq.VisitID,
                                   eLabReq.RequestedDate,
                                   eLabReq.RequestedBy,
                                   eLabReq.LabOrderStatus,
                                   visit.VisitDate,
                                   visit.PatientId,
                                   visit.FacilityID,
                                   visit.ProviderID,
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
                                   VisitID = eLRM.VisitID,
                                   FacilityId = eLRM.FacilityID > 0 ? eLRM.FacilityID.Value : 0,
                                   facilityName = eLRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == eLRM.FacilityID).FacilityName : "",
                                   RequestedDate = eLRM.RequestedDate,
                                   RequestedBy = eLRM.RequestedBy,
                                   LabOrderStatus = eLRM.LabOrderStatus,
                                   visitDateandTime = eLRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + eLRM.VisitDate.TimeOfDay.ToString(),
                                   patientId = eLRM.PatientId,
                                   patientName = eLRM.PatientFirstName + " " + eLRM.PatientMiddleName + " " + eLRM.PatientLastName,
                                   providerId = eLRM.ProviderID,
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
                                                      (this.GetELabSetupMasterRecordbyID(eLRI.SetupMasterID) != null ?
                                                      this.GetELabSetupMasterRecordbyID(eLRI.SetupMasterID).setupMasterDesc : "") : "",
                                    UrgencyCode = eLRI.UrgencyCode,
                                    LabOnDate = eLRI.LabOnDate,
                                    LabNotes = eLRI.LabNotes,
                                    urgencyDescription = eLRI.UrgencyTypeDescription

                                }).ToList();

            return requestItems;
        }

        #endregion

        #endregion

        ///// <summary>
        ///// Add or Update OPD Nursing Orders details for a Visit
        ///// </summary>
        ///// <param>(OPDNursingorderModel nursingModel)</param>
        ///// <returns> OPDNursingorderModel. if a set of OPDNursingorder data saved in DB = success. else = failure</returns>
        public OPDNursingorderModel AddUpdateOPDNursingOrders(OPDNursingorderModel nursingModel)
        {
            var opdNursing = this.uow.GenericRepository<OPDNursingorders>().Table().Where(x => x.OPDNOId == nursingModel.OPDNOId).SingleOrDefault();

            if (opdNursing == null)
            {
                opdNursing = new OPDNursingorders();

                opdNursing.VisitID = nursingModel.VisitID;
                opdNursing.CaseSheetID = nursingModel.CaseSheetID;
                opdNursing.ChiefComplaint = nursingModel.ChiefComplaint;
                opdNursing.ICD10 = nursingModel.ICD10;
                opdNursing.Proceduretype = nursingModel.Proceduretype;
                opdNursing.ProcedureNotes = nursingModel.ProcedureNotes;
                opdNursing.Instructiontype = nursingModel.Instructiontype;
                opdNursing.NursingNotes = nursingModel.NursingNotes;
                opdNursing.CreatedBy = "User";
                opdNursing.Createddate = DateTime.Now;

                this.uow.GenericRepository<OPDNursingorders>().Insert(opdNursing);
            }
            else
            {
                //opdNursing.VisitID = nursingModel.VisitID;
                //opdNursing.CaseSheetID = nursingModel.CaseSheetID;
                opdNursing.ChiefComplaint = nursingModel.ChiefComplaint;
                opdNursing.ICD10 = nursingModel.ICD10;
                opdNursing.Proceduretype = nursingModel.Proceduretype;
                opdNursing.ProcedureNotes = nursingModel.ProcedureNotes;
                opdNursing.Instructiontype = nursingModel.Instructiontype;
                opdNursing.NursingNotes = nursingModel.NursingNotes;
                opdNursing.CreatedBy = "User";
                opdNursing.Createddate = DateTime.Now;

                this.uow.GenericRepository<OPDNursingorders>().Update(opdNursing);
            }
            this.uow.Save();

            if (nursingModel.opdnursingMedications.Count() > 0)
            {
                OPDNursingMedication medication = new OPDNursingMedication();
                foreach (var nurseMedic in nursingModel.opdnursingMedications)
                {
                    medication = this.uow.GenericRepository<OPDNursingMedication>().Table().FirstOrDefault(x => x.NursingMedicationID == nurseMedic.NursingMedicationID);
                    if (medication == null)
                    {
                        medication = new OPDNursingMedication();

                        medication.OPDNOId = nurseMedic.OPDNOId;
                        medication.Drugname = nurseMedic.Drugname;
                        medication.DispenseformId = nurseMedic.DispenseformId;
                        medication.SelectedDiagnosis = nurseMedic.SelectedDiagnosis;
                        medication.Quantity = nurseMedic.Quantity;
                        medication.MedicationTime = nurseMedic.MedicationTime;
                        medication.After = nurseMedic.After;
                        medication.Before = nurseMedic.Before;
                        medication.DoneBy = nurseMedic.DoneBy;
                        medication.SIGNotes = nurseMedic.SIGNotes;
                        medication.CreatedBy = "User";
                        medication.Createddate = DateTime.Now;

                        this.uow.GenericRepository<OPDNursingMedication>().Insert(medication);
                    }
                    else
                    {
                        medication.Drugname = nurseMedic.Drugname;
                        medication.DispenseformId = nurseMedic.DispenseformId;
                        medication.SelectedDiagnosis = nurseMedic.SelectedDiagnosis;
                        medication.Quantity = nurseMedic.Quantity;
                        medication.MedicationTime = nurseMedic.MedicationTime;
                        medication.After = nurseMedic.After;
                        medication.Before = nurseMedic.Before;
                        medication.DoneBy = nurseMedic.DoneBy;
                        medication.SIGNotes = nurseMedic.SIGNotes;
                        medication.ModifiedBy = "User";
                        medication.ModifiedDate = DateTime.Now;

                        this.uow.GenericRepository<OPDNursingMedication>().Update(medication);
                    }
                    this.uow.Save();
                    nurseMedic.OPDNOId = medication.OPDNOId;
                    nurseMedic.NursingMedicationID = medication.NursingMedicationID;
                }
            }

            return nursingModel;
        }

        ///// <summary>
        ///// Get OPD Nusing Data for a Visit
        ///// </summary>
        ///// <param>(int VisitID)</param>
        ///// <returns>OPDNursingorderModel. if set of OPDNursingorderModel returns for Given VisitID = success. else = failure</returns>
        public OPDNursingorderModel GetOPDNursingDataForVisit(int VisitID)
        {
            var opdNursingData = (from opdnursing in this.uow.GenericRepository<OPDNursingorders>().Table().Where(X => X.VisitID == VisitID)
                                  select opdnursing).AsEnumerable().Select(ONOM => new OPDNursingorderModel
                                  {
                                      OPDNOId = ONOM.OPDNOId,
                                      VisitID = ONOM.CaseSheetID,
                                      CaseSheetID = ONOM.CaseSheetID,
                                      ChiefComplaint = ONOM.ChiefComplaint,
                                      ICD10 = ONOM.ICD10,
                                      Proceduretype = ONOM.Proceduretype,
                                      ProcedureNotes = ONOM.ProcedureNotes,
                                      Instructiontype = ONOM.Instructiontype,
                                      NursingNotes = ONOM.NursingNotes,
                                      opdnursingMedications = this.GetOPDNursingMedicationForOrder(ONOM.OPDNOId)

                                  }).FirstOrDefault();

            return opdNursingData;
        }

        ///// <summary>
        ///// Get OPD Nusing Medication data for nursingOrder
        ///// </summary>
        ///// <param>(int OPDNOId)</param>
        ///// <returns>OPDNursingMedicationModel. if set of OPDNursingMedicationModel returns for Given OPDNOId = success. else = failure</returns>
        public List<OPDNursingMedicationModel> GetOPDNursingMedicationForOrder(int OPDNOId)
        {
            var opdMedication = (from medic in this.uow.GenericRepository<OPDNursingMedication>().Table().Where(x => x.OPDNOId == OPDNOId)
                                 select medic).AsEnumerable().Select(OPNM => new OPDNursingMedicationModel
                                 {
                                     NursingMedicationID = OPNM.NursingMedicationID,
                                     OPDNOId = OPNM.OPDNOId,
                                     Drugname = OPNM.Drugname,
                                     DispenseformId = OPNM.DispenseformId,
                                     SelectedDiagnosis = OPNM.SelectedDiagnosis,
                                     Quantity = OPNM.Quantity,
                                     MedicationTime = OPNM.MedicationTime,
                                     After = OPNM.After,
                                     Before = OPNM.Before,
                                     DoneBy = OPNM.DoneBy,
                                     SIGNotes = OPNM.SIGNotes

                                 }).ToList();

            return opdMedication;
        }

        #region File Access

        ///// <summary>
        ///// Get GetFile
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

        ///// <summary>
        ///// Get SigningOffModel with status for Triage
        ///// </summary>
        ///// <param>SigningOffModel signOffModel</param>
        ///// <returns>Task<SigningOffModel>. if SigningOffModel with status for Triage = success. else = failure</returns>
        public Task<SigningOffModel> SignoffUpdationforTriage(SigningOffModel signOffModel)
        {
            var signOffdata = this.utilService.TriageSignoffUpdation(signOffModel);

            return signOffdata;
        }

    }
}
