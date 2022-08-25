using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.Web;
using System.Net;
using System.Text;
using System.Collections.Specialized;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;

namespace ENT.WebApi.DAL.Services
{
    public class RegisterationService : IRegisterationService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        public readonly IConfiguration iconfiguration;
        public string imageCode;
        private readonly IHostingEnvironment hostingEnvironment;

        public RegisterationService(IUnitOfWork _uow, IUtilityService _utilityService, ITenantMasterService _iTenantMasterService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            uow = _uow;
            utilService = _utilityService;
            iTenantMasterService = _iTenantMasterService;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        #region Master Data

        //// <summary>
        ///// Get Genders for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Gender>. if Collection of Genders for Patient = success. else = failure</returns>
        public List<Gender> GetGendersForPatient()
        {
            return this.iTenantMasterService.GetAllGender();
        }

        //// <summary>
        ///// Get Salutations for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Salutation>. if Collection of Salutation for Patient = success. else = failure</returns>
        public List<Salutation> GetSalutationsforPatient()
        {
            return this.iTenantMasterService.GetAllSalutations();
        }

        //// <summary>
        ///// Get States for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<State>. if Collection of State = success. else = failure</returns>
        public List<State> GetStateListforPatient()
        {
            var states = this.iTenantMasterService.GetAllStates();

            return states;
        }

        //// <summary>
        ///// Get Countries for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Country>. if Collection of Country = success. else = failure</returns>
        public List<Country> GetCountryListforPatient()
        {
            var countries = this.iTenantMasterService.GetAllCountries();

            return countries;
        }

        ///// <summary>
        ///// Get CPT or Treatment codes by Search
        ///// </summary>
        ///// <param>string searchkey</param>
        ///// <returns>List<TreatmentCode>. if list of Treatment codes for given searchkey = success. else = failure</returns>
        public List<TreatmentCode> GetCPTCodesbySearch(string searchkey)
        {
            var cptCodes = this.utilService.GetTreatmentCodesbySearch(searchkey);
            return cptCodes;
        }

        ///// <summary>
        ///// Get ICD or Diagnosis codes by Search
        ///// </summary>
        ///// <param>string searchkey</param>
        ///// <returns>List<DiagnosisCode>. if list of Diagnosis codes for given searchkey = success. else = failure</returns>
        public List<DiagnosisCode> GetICDCodesbySearch(string searchkey)
        {
            var icdCodes = this.utilService.GetAllDiagnosisCodesbySearch(searchkey);
            return icdCodes;
        }

        ///// <summary>
        ///// Get Discharge codes by Search
        ///// </summary>
        ///// <param>string searchkey</param>
        ///// <returns>List<DischargeCode>. if list of Discharge codes for given searchkey = success. else = failure</returns>
        public List<DischargeCode> GetDischargeCodesbySearch(string searchkey)
        {
            var dischargeCodes = this.utilService.GetDischargeCodesbySearch(searchkey);
            return dischargeCodes;
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
                                if (!providerList.Contains(data))
                                {
                                    providerList.Add(data);
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
        ///// Get Providers For Registeration
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for Registeration = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforRegisteration(string searchKey)
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
        ///// Get All available Relationships to patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Relationshiptopatient>. if Collection of Relations = success. else = failure</returns>
        public List<Relationshiptopatient> GetAllRelations()
        {
            var Relations = this.iTenantMasterService.GetRelationstoPatient();
            return Relations;
        }

        ///// <summary>
        ///// Get All available IdentificationTypes for patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<IdentificationIdType>. if Collection of IdentificationTypes = success. else = failure</returns>
        public List<IdentificationIdType> GetIdentificationTypes()
        {
            var Ids = this.iTenantMasterService.GetAllIdentificationTypes();
            return Ids;
        }

        ///// <summary>
        ///// Get All PatientCategories
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientCategory>. if Collection of PatientCategory = success. else = failure</returns>
        public List<PatientCategory> GetAllPatientCategories()
        {
            var categories = this.iTenantMasterService.GetPatientCategories();

            return categories;
        }

        ///// <summary>
        ///// Get All PatientTypes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientType>. if Collection of PatientTypes = success. else = failure</returns>
        public List<PatientType> GetAllPatientTypes()
        {
            var types = this.iTenantMasterService.GetPatientTypes();

            return types;
        }

        ///// <summary>
        ///// Get Family History Status Master List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<FamilyHistoryStatusMaster>. if Collection of Family History Status Master = success. else = failure</returns>
        public List<FamilyHistoryStatusMaster> GetAllFamilyHistoryStatusMasters()
        {
            var familyHistoryStatusMasters = this.iTenantMasterService.GetFamilyHistoryStatusMasterList();
            return familyHistoryStatusMasters;
        }

        ///// <summary>
        ///// Get All Marital Statuses
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MaritalStatus>. if Collection of Marital Status = success. else = failure</returns>
        public List<MaritalStatus> GetMaritalStatusesForPatient()
        {
            var maritalStatuses = this.iTenantMasterService.GetMaritalStatuses();

            return maritalStatuses;
        }

        ///// <summary>
        ///// Get All Contact Types for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ContactType>. if Collection of Contact Types for Patient = success. else = failure</returns>
        public List<ContactType> GetContactTypesForPatient()
        {
            var contactInfos = this.iTenantMasterService.GetContactTypes();

            return contactInfos;
        }

        ///// <summary>
        ///// Get All Religions For Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Religion>. if Collection of Religion For Patient = success. else = failure</returns>
        public List<Religion> GetReligionsForPatient()
        {
            var religions = this.iTenantMasterService.GetReligions();

            return religions;
        }

        ///// <summary>
        ///// Get All Races For Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Race>. if Collection of Race For Patient = success. else = failure</returns>
        public List<Race> GetRacesForPatient()
        {
            var races = this.iTenantMasterService.GetRaces();

            return races;
        }

        ///// <summary>
        ///// Get All BloodGroups for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BloodGroup>. if Collection of BloodGroups for Patient = success. else = failure</returns>
        public List<BloodGroup> GetBloodGroupsforPatient()
        {
            var bloodGroups = this.iTenantMasterService.GetAllBloodGroups();

            return bloodGroups;
        }

        ///// <summary>
        ///// Get All IllnessTypes for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<IllnessType>. if Collection of IllnessTypes for Patient = success. else = failure</returns>
        public List<IllnessType> GetIllnessTypesforPatient()
        {
            var illnessTypes = this.iTenantMasterService.GetAllIllnessTypes();

            return illnessTypes;
        }

        //// <summary>
        ///// Get AdmissionTypes for Registeration
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionType>. if Collection of Admission Types for Registeration = success. else = failure</returns>
        public List<AdmissionType> GetAdmissionTypesforRegisteration()
        {
            var admissionTypes = this.iTenantMasterService.GetAllAdmissionTypes();

            return admissionTypes;
        }

        //// <summary>
        ///// Get AdmissionStatus for Registeration
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionStatus>. if Collection of Admission Status for Registeration = success. else = failure</returns>
        public List<AdmissionStatus> GetAdmissionStatusforRegisteration()
        {
            var admissionStatus = this.iTenantMasterService.GetAllAdmissionStatus();
            return admissionStatus;
        }

        //// <summary>
        ///// Get All Problem Statuses for Registeration
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProblemStatus>. if Collection of Problem Statuses for Registeration = success. else = failure</returns>
        public List<ProblemStatus> GetProblemStatusesforRegisteration()
        {
            var problemStatuses = this.iTenantMasterService.GetAllProblemStatuses();

            return problemStatuses;
        }

        //// <summary>
        ///// Get All Procedure Type for Registeration
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProcedureType>. if Collection of Procedure Type for Registeration = success. else = failure</returns>
        public List<ProcedureType> GetProcedureTypesforRegisteration()
        {
            var procedureTypes = this.iTenantMasterService.GetAllProcedureTypes();

            return procedureTypes;
        }

        ///// <summary>
        ///// Get All Insurance Types for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<InsuranceType>. if Collection of Insurance Types for Patient = success. else = failure</returns>
        public List<InsuranceType> GetInsuranceTypesforPatient()
        {
            var insuranceTypes = this.iTenantMasterService.GetAllInsuranceTypes();

            return insuranceTypes;
        }

        ///// <summary>
        ///// Get All Insurance Categories for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<InsuranceCategory>. if Collection of Insurance Categories for Patient = success. else = failure</returns>
        public List<InsuranceCategory> GetInsuranceCategoriesforPatient()
        {
            var insuranceCategories = this.iTenantMasterService.GetAllInsuranceCategories();

            return insuranceCategories;
        }

        ///// <summary>
        ///// Get All Radiology Procedures Requested for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RadiologyProcedureRequested>. if Collection of Radiology Procedures Requested for Patient = success. else = failure</returns>
        public List<RadiologyProcedureRequested> GetRadiologyProcedureRequestedforPatient()
        {
            var radiologyProcedureRequested = this.iTenantMasterService.GetAllRadiologyProcedureRequested();

            return radiologyProcedureRequested;
        }

        ///// <summary>
        ///// Get All Radiology Types for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RadiologyType>. if Collection of Radiology Types for Patient = success. else = failure</returns>
        public List<RadiologyType> GetRadiologyTypesforPatient()
        {
            var radiologyType = this.iTenantMasterService.GetAllRadiologyType();

            return radiologyType;
        }

        ///// <summary>
        ///// Get All Referred Lab for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ReferredLab>. if Collection of Referred Labs for Patient = success. else = failure</returns>
        public List<ReferredLab> GetReferredLabsforPatient()
        {
            var referredLab = this.iTenantMasterService.GetAllReferredLab();

            return referredLab;
        }

        ///// <summary>
        ///// Get All Body Section for Patient 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BodySection>. if Collection of Body Sections for Patient = success. else = failure</returns>
        public List<BodySection> GetBodySectionsforPatient()
        {
            var bodySection = this.iTenantMasterService.GetAllBodySection();

            return bodySection;
        }

        ///// <summary>
        ///// Get All Report Format for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ReportFormat>. if Collection of Report Formats for Patient = success. else = failure</returns>
        public List<ReportFormat> GetReportFormatsforPatient()
        {
            var reportFormat = this.iTenantMasterService.GetAllReportFormat();

            return reportFormat;
        }

        ///// <summary>
        ///// Get Body Site for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BodySite>. if Collection of Body Sites for Patient = success. else = failure</returns>
        public List<BodySite> GetBodySitesforPatient()
        {
            var bodySite = this.iTenantMasterService.GetAllBodySite();

            return bodySite;
        }

        ///// <summary>
        ///// Get Body Site for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationRoute>. if Collection of Body Sites for Patient = success. else = failure</returns>
        public List<MedicationRoute> GetMedicationRouteforPatient()
        {
            var routes = this.iTenantMasterService.GetMedicationRouteList();

            return routes;
        }

        ///// <summary>
        ///// Get Document Type for Patient
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DocumentType>. if Collection of Document Types for Patient = success. else = failure</returns>
        public List<DocumentType> GetDocumentTypeforPatient()
        {
            var documentTypes = this.iTenantMasterService.GetAllDocumentType();

            return documentTypes;
        }

        #endregion

        #region Patients

        ///// <summary>
        ///// Get All Patient Data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientDemographicModel>. if Collection of Patient Data = success. else = failure</returns>
        public List<PatientDemographicModel> GetAllPatients()
        {
            List<PatientDemographicModel> patList = (from pat in uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
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
                                                         patDemo.NKSalutation,
                                                         patDemo.NKFirstname,
                                                         patDemo.NKLastname,
                                                         patDemo.NKPrimarycontactnumber,
                                                         patDemo.NKContactType,
                                                         patDemo.RSPId,
                                                         date = pat.ModifiedDate == null ? pat.CreatedDate : pat.ModifiedDate

                                                     }).AsEnumerable().OrderByDescending(x => x.date).Select(PDM => new PatientDemographicModel
                                                     {
                                                         PatientId = PDM.PatientId,
                                                         MRNo = PDM.MRNo,
                                                         PatientFirstName = PDM.PatientFirstName,
                                                         PatientMiddleName = PDM.PatientMiddleName,
                                                         PatientLastName = PDM.PatientLastName,
                                                         PatientFullName = PDM.PatientFirstName + " " + PDM.PatientMiddleName + " " + PDM.PatientLastName,
                                                         PatientDOB = PDM.PatientDOB,
                                                         PatientAge = PDM.PatientAge,
                                                         PatientStatus = PDM.PatientStatus,
                                                         Gender = PDM.Gender,
                                                         PrimaryContactNumber = PDM.PrimaryContactNumber,
                                                         PrimaryContactType = PDM.PrimaryContactType,
                                                         SecondaryContactNumber = PDM.SecondaryContactNumber,
                                                         SecondaryContactType = PDM.SecondaryContactType,
                                                         PatientType = PDM.PatientType,
                                                         FacilityId = PDM.FacilityId,
                                                         FacilityName = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == PDM.FacilityId).FirstOrDefault().FacilityName,
                                                         RegisterationAt = PDM.RegisterationAt,
                                                         PatientCategory = PDM.PatientCategory,
                                                         Salutation = PDM.Salutation,
                                                         IDTID1 = PDM.IDTID1,
                                                         IdType1 = PDM.IDTID1 > 0 ? this.uow.GenericRepository<IdentificationIdType>().Table().FirstOrDefault(x => x.IDTId == PDM.IDTID1).IDTDescription : "None",
                                                         PatientIdentificationtype1details = PDM.PatientIdentificationtype1details,
                                                         IDTID2 = PDM.IDTID2,
                                                         IdType2 = PDM.IDTID2 > 0 ? this.uow.GenericRepository<IdentificationIdType>().Table().FirstOrDefault(x => x.IDTId == PDM.IDTID2).IDTDescription : "None",
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
                                                         Allergies = this.GetAllergyforPatient(PDM.PatientId),
                                                         PatientFile = this.GetFile(PDM.PatientId.ToString(), "Patient").Count() > 0 ? this.GetFile(PDM.PatientId.ToString(), "Patient") : new List<clsViewFile>(),
                                                         PatientImage = this.imageCode,
                                                         //PatPicture = this.GetProfileImage(this.imageCode)

                                                     }).ToList();

            List<PatientDemographicModel> patientsCollection = new List<PatientDemographicModel>();

            var facList = this.utilService.GetFacilitiesforUser();

            if (facList.Count() > 0)
            {
                patientsCollection = (from pat in patList
                                      join fac in facList on pat.FacilityId equals fac.FacilityId
                                      select pat).ToList();

                return patientsCollection;
            }
            else
            {
                return patList;
            }
        }

        ///// <summary>
        ///// Get Patient DetailBy Id
        ///// </summary>
        ///// <param>PatientId</param>
        ///// <returns>PatientDemographicModel. if Patient Data for given PatientId = success. else = failure</returns>
        public PatientDemographicModel GetPatientDetailById(int PatientId)
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
                                                     IdType1 = PDM.IDTID1 > 0 ? this.uow.GenericRepository<IdentificationIdType>().Table().FirstOrDefault(x => x.IDTId == PDM.IDTID1).IDTDescription : "None",
                                                     PatientIdentificationtype1details = PDM.PatientIdentificationtype1details,
                                                     IDTID2 = PDM.IDTID2,
                                                     IdType2 = PDM.IDTID2 > 0 ? this.uow.GenericRepository<IdentificationIdType>().Table().FirstOrDefault(x => x.IDTId == PDM.IDTID2).IDTDescription : "None",
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
                                                     Allergies = this.GetAllergyforPatient(PDM.PatientId),
                                                     PatientFile = this.GetFile(PDM.PatientId.ToString(), "Patient").Count() > 0 ? this.GetFile(PDM.PatientId.ToString(), "Patient") : new List<clsViewFile>(),
                                                     PatientImage = this.imageCode

                                                 }).FirstOrDefault();

            //this.SendMessage(demoModel.IdType1 + "/ " + demoModel.IdType2);

            var bills = this.billCalculationforPatient(demoModel.PatientId);

            demoModel.billedAmount = bills[0];
            demoModel.paidAmount = bills[1];
            demoModel.balanceAmount = bills[2];

            if (this.GetFile(demoModel.PatientId.ToString(), "Patient/QR").Count() > 0)
            {
                // byte[] bytes = System.IO.File.ReadAllBytes(this.GetFile(demoModel.PatientId.ToString(), "Patient/QR").FirstOrDefault().FileUrl);
                //demoModel.QRImage = Convert.ToBase64String(bytes);
                demoModel.QRImage = this.GetFile(demoModel.PatientId.ToString(), "Patient/QR").FirstOrDefault().ActualFile;
            }

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
                                      prov.ProviderID,
                                      prov.FirstName,
                                      prov.MiddleName,
                                      prov.LastName

                                  }).AsEnumerable().Select(CPDM => new CommonPaymentDetailsModel
                                  {
                                      VisitPaymentDetailsID = CPDM.VisitPaymentDetailsID,
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

            return paymentDetails;
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

            return paymentDetails;
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

        ///// <summary>
        ///// Add or Update a patient data by checking PatientId
        ///// </summary>
        ///// <param name=PatientDemographicModel>patData(object of PatientDemographicModel)</param>
        ///// <returns>PatientDemographicModel. if a patient data added or updated = success. else = failure</returns>
        public PatientDemographicModel AddUpdatePatientData(PatientDemographicModel patData)
        {
            Patient pat = this.uow.GenericRepository<Patient>().Table().SingleOrDefault(x => x.PatientId == patData.PatientId);

            var getMRCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                               where common.CommonMasterCode.ToLower().Trim() == "mrno"
                               select common).FirstOrDefault();

            var MRCheck = this.uow.GenericRepository<Patient>().Table()
                        .Where(x => x.MRNo.ToLower().Trim() == getMRCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            if (pat == null)
            {
                pat = new Patient();

                pat.PatientFirstName = patData.PatientFirstName;
                pat.MRNo = MRCheck != null ? this.iTenantMasterService.GetMRNo() : getMRCommon.CommonMasterDesc;
                pat.PatientMiddleName = patData.PatientMiddleName == null ? "" : patData.PatientMiddleName;
                pat.PatientLastName = patData.PatientLastName == null ? "" : patData.PatientLastName;
                pat.PatientDOB = this.utilService.GetLocalTime(patData.PatientDOB);
                pat.PatientAge = patData.PatientAge == 0 ? (DateTime.Now.Year - patData.PatientDOB.Year) : patData.PatientAge;
                pat.Gender = patData.Gender == null ? "" : patData.Gender;
                pat.PrimaryContactNumber = patData.PrimaryContactNumber == null ? "" : patData.PrimaryContactNumber;
                pat.PrimaryContactType = patData.PrimaryContactType == null ? "" : patData.PrimaryContactType;
                pat.SecondaryContactNumber = patData.SecondaryContactNumber == null ? "" : patData.SecondaryContactNumber;
                pat.SecondaryContactType = patData.SecondaryContactType == null ? "" : patData.SecondaryContactType;
                pat.PatientStatus = "Active";
                pat.CreatedDate = DateTime.Now;
                pat.Createdby = "User";

                this.uow.GenericRepository<Patient>().Insert(pat);

                this.uow.Save();

                getMRCommon.CurrentIncNo = pat.MRNo;
                this.uow.GenericRepository<CommonMaster>().Update(getMRCommon);

                this.uow.Save();
            }
            else
            {
                pat.PatientFirstName = patData.PatientFirstName;
                //pat.MRNo = "MR" + patData.PatientId;
                pat.PatientMiddleName = patData.PatientMiddleName == null ? "" : patData.PatientMiddleName;
                pat.PatientLastName = patData.PatientLastName == null ? "" : patData.PatientLastName;
                pat.PatientDOB = this.utilService.GetLocalTime(patData.PatientDOB);
                pat.PatientAge = patData.PatientAge == 0 ? (DateTime.Now.Year - patData.PatientDOB.Year) : patData.PatientAge;
                pat.Gender = patData.Gender == null ? "" : patData.Gender;
                pat.PrimaryContactNumber = patData.PrimaryContactNumber == null ? "" : patData.PrimaryContactNumber;
                pat.PrimaryContactType = patData.PrimaryContactType == null ? "" : patData.PrimaryContactType;
                pat.SecondaryContactNumber = patData.SecondaryContactNumber == null ? "" : patData.SecondaryContactNumber;
                pat.SecondaryContactType = patData.SecondaryContactType == null ? "" : patData.SecondaryContactType;
                pat.PatientStatus = "Active";
                pat.ModifiedDate = DateTime.Now;
                pat.Modifiedby = "User";

                this.uow.GenericRepository<Patient>().Update(pat);

                this.uow.Save();
            }



            if (pat.PatientId > 0)
            {
                PatientDemographic patDemo = this.uow.GenericRepository<PatientDemographic>().Table().Where(x => x.PatientId == pat.PatientId).FirstOrDefault();

                if (patDemo == null)
                {
                    patDemo = new PatientDemographic();

                    patDemo.PatientId = pat.PatientId;
                    patDemo.FacilityId = patData.FacilityId;
                    patDemo.PatientType = patData.PatientType == null ? "" : patData.PatientType;
                    patDemo.RegisterationAt = patData.RegisterationAt == null ? "" : patData.RegisterationAt;
                    patDemo.PatientCategory = patData.PatientCategory == null ? "" : patData.PatientCategory;
                    patDemo.Salutation = patData.Salutation == null ? "" : patData.Salutation;
                    patDemo.IDTID1 = patData.IDTID1;
                    patDemo.PatientIdentificationtype1details = patData.PatientIdentificationtype1details == null ? "" : patData.PatientIdentificationtype1details;
                    patDemo.IDTID2 = patData.IDTID2;
                    patDemo.PatientIdentificationtype2details = patData.PatientIdentificationtype2details == null ? "" : patData.PatientIdentificationtype2details;
                    patDemo.MaritalStatus = patData.MaritalStatus == null ? "" : patData.MaritalStatus;
                    patDemo.Religion = patData.Religion == null ? "" : patData.Religion;
                    patDemo.Race = patData.Race == null ? "" : patData.Race;
                    patDemo.Occupation = patData.Occupation == null ? "" : patData.Occupation;
                    patDemo.email = patData.email == null ? "" : patData.email;
                    patDemo.Emergencycontactnumber = patData.Emergencycontactnumber == null ? "" : patData.Emergencycontactnumber;
                    patDemo.Address1 = patData.Address1 == null ? "" : patData.Address1;
                    patDemo.Address2 = patData.Address2 == null ? "" : patData.Address2;
                    patDemo.Village = patData.Village == null ? "" : patData.Village;
                    patDemo.Town = patData.Town == null ? "" : patData.Town;
                    patDemo.City = patData.City == null ? "" : patData.City;
                    patDemo.Pincode = patData.Pincode;
                    patDemo.State = patData.State == null ? "" : patData.State;
                    patDemo.Country = patData.Country == null ? "" : patData.Country;
                    patDemo.Bloodgroup = patData.Bloodgroup == null ? "" : patData.Bloodgroup;
                    patDemo.NKSalutation = patData.NKSalutation == null ? "" : patData.NKSalutation;
                    patDemo.NKFirstname = patData.NKFirstname == null ? "" : patData.NKFirstname;
                    patDemo.NKLastname = patData.NKLastname == null ? "" : patData.NKLastname;
                    patDemo.NKPrimarycontactnumber = patData.NKPrimarycontactnumber == null ? "" : patData.NKPrimarycontactnumber;
                    patDemo.NKContactType = patData.NKContactType == null ? "" : patData.NKContactType;
                    patDemo.RSPId = patData.RSPId == null ? 0 : patData.RSPId;
                    patDemo.Createddate = DateTime.Now;
                    patDemo.CreatedBy = "User";

                    this.uow.GenericRepository<PatientDemographic>().Insert(patDemo);
                }
                else
                {
                    patDemo.PatientType = patData.PatientType == null ? "" : patData.PatientType;
                    patDemo.RegisterationAt = patData.RegisterationAt == null ? "" : patData.RegisterationAt;
                    patDemo.PatientCategory = patData.PatientCategory == null ? "" : patData.PatientCategory;
                    patDemo.Salutation = patData.Salutation == null ? "" : patData.Salutation;
                    patDemo.IDTID1 = patData.IDTID1;
                    patDemo.PatientIdentificationtype1details = patData.PatientIdentificationtype1details == null ? "" : patData.PatientIdentificationtype1details;
                    patDemo.IDTID2 = patData.IDTID2;
                    patDemo.PatientIdentificationtype2details = patData.PatientIdentificationtype2details == null ? "" : patData.PatientIdentificationtype2details;
                    patDemo.MaritalStatus = patData.MaritalStatus == null ? "" : patData.MaritalStatus;
                    patDemo.Religion = patData.Religion == null ? "" : patData.Religion;
                    patDemo.Race = patData.Race == null ? "" : patData.Race;
                    patDemo.Occupation = patData.Occupation == null ? "" : patData.Occupation;
                    patDemo.email = patData.email == null ? "" : patData.email;
                    patDemo.Emergencycontactnumber = patData.Emergencycontactnumber == null ? "" : patData.Emergencycontactnumber;
                    patDemo.Address1 = patData.Address1 == null ? "" : patData.Address1;
                    patDemo.Address2 = patData.Address2 == null ? "" : patData.Address2;
                    patDemo.Village = patData.Village == null ? "" : patData.Village;
                    patDemo.Town = patData.Town == null ? "" : patData.Town;
                    patDemo.City = patData.City == null ? "" : patData.City;
                    patDemo.Pincode = patData.Pincode;
                    patDemo.State = patData.State == null ? "" : patData.State;
                    patDemo.Country = patData.Country == null ? "" : patData.Country;
                    patDemo.Bloodgroup = patData.Bloodgroup == null ? "" : patData.Bloodgroup;
                    patDemo.NKSalutation = patData.NKSalutation == null ? "" : patData.NKSalutation;
                    patDemo.NKFirstname = patData.NKFirstname == null ? "" : patData.NKFirstname;
                    patDemo.NKLastname = patData.NKLastname == null ? "" : patData.NKLastname;
                    patDemo.NKPrimarycontactnumber = patData.NKPrimarycontactnumber == null ? "" : patData.NKPrimarycontactnumber;
                    patDemo.NKContactType = patData.NKContactType == null ? "" : patData.NKContactType;
                    patDemo.RSPId = patData.RSPId == null ? 0 : patData.RSPId;
                    patDemo.ModifiedDate = DateTime.Now;
                    patDemo.ModifiedBy = "User";

                    this.uow.GenericRepository<PatientDemographic>().Update(patDemo);
                }
                this.uow.Save();
            }
            patData.PatientId = pat.PatientId;
            return patData;
        }

        ///// <summary>
        ///// Get Patients By Searchkey
        ///// </summary>
        ///// <param>string Searchkey</param>
        ///// <returns>List<PatientDemographicModel>. if Collection of Patient Data By Search = success. else = failure</returns>
        public List<PatientDemographicModel> GetPatientsBySearch(string Searchkey)
        {
            List<PatientDemographicModel> patList = (from pat in uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                                                     join patDemo in uow.GenericRepository<PatientDemographic>().Table()
                                                     on pat.PatientId equals patDemo.PatientId

                                                     where (Searchkey == null ||
                                                     (pat.PatientFirstName.ToLower().Trim().Contains(Searchkey.ToLower().Trim()) || pat.PatientMiddleName.ToLower().Trim().Contains(Searchkey.ToLower().Trim())
                                                     || pat.PatientLastName.ToLower().Trim().Contains(Searchkey.ToLower().Trim()) || pat.Gender.ToLower().Trim().Contains(Searchkey.ToLower().Trim())
                                                     || pat.PrimaryContactNumber.ToLower().Trim().Contains(Searchkey.ToLower().Trim()) || patDemo.email.ToLower().Trim().Contains(Searchkey.ToLower().Trim())
                                                     || patDemo.Pincode.ToString().Contains(Searchkey.ToLower().Trim())
                                                     || pat.MRNo.ToLower().Trim().Contains(Searchkey.ToLower().Trim())))
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
                                                         patDemo.NKSalutation,
                                                         patDemo.NKFirstname,
                                                         patDemo.NKLastname,
                                                         patDemo.NKPrimarycontactnumber,
                                                         patDemo.NKContactType,
                                                         patDemo.RSPId,
                                                         date = pat.ModifiedDate == null ? pat.CreatedDate : pat.ModifiedDate

                                                     }).AsEnumerable().OrderByDescending(x => x.date).Select(PDM => new PatientDemographicModel
                                                     {
                                                         PatientId = PDM.PatientId,
                                                         MRNo = PDM.MRNo,
                                                         PatientFirstName = PDM.PatientFirstName,
                                                         PatientMiddleName = PDM.PatientMiddleName,
                                                         PatientLastName = PDM.PatientLastName,
                                                         PatientDOB = PDM.PatientDOB,
                                                         PatientAge = PDM.PatientAge,
                                                         Gender = PDM.Gender,
                                                         PrimaryContactNumber = PDM.PrimaryContactNumber,
                                                         PrimaryContactType = PDM.PrimaryContactType,
                                                         SecondaryContactNumber = PDM.SecondaryContactNumber,
                                                         SecondaryContactType = PDM.SecondaryContactType,
                                                         PatientStatus = PDM.PatientStatus,
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
                                                         Relationship = PDM.RSPId > 0 ? this.uow.GenericRepository<Relationshiptopatient>().Table().FirstOrDefault(x => x.RSPId == PDM.RSPId).RSPDescription : ""

                                                     }).Take(10).ToList();

            List<PatientDemographicModel> patientsCollection = new List<PatientDemographicModel>();

            var facList = this.utilService.GetFacilitiesforUser();

            if (facList.Count() > 0)
            {
                patientsCollection = (from pat in patList
                                      join fac in facList on pat.FacilityId equals fac.FacilityId
                                      select pat).ToList();

                return patientsCollection;
            }
            else
            {
                return patList;
            }
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
                                 visit.Visittime,
                                 visit.AccompaniedBy,
                                 visit.Appointment,
                                 visit.AdditionalInformation,
                                 visit.ChiefComplaint,
                                 visit.ConsultationType,
                                 visit.FacilityID,
                                 visit.PatientArrivalConditionID,
                                 visit.PatientNextConsultation,
                                 visit.ProviderID,
                                 visit.AppointmentID,
                                 provName = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == visit.ProviderID),
                                 visit.ReferringFacility,
                                 visit.ReferringProvider,
                                 visit.SkipVisitIntake,
                                 visit.ToConsult,
                                 visit.TokenNumber,
                                 visit.TransitionOfCarePatient,
                                 visit.UrgencyTypeID,
                                 urgType = this.uow.GenericRepository<UrgencyType>().Table().FirstOrDefault(x => x.UrgencyTypeId == visit.UrgencyTypeID),
                                 visit.VisitReason,
                                 visit.VisitStatusID,
                                 visStatus = this.uow.GenericRepository<VisitStatus>().Table().FirstOrDefault(x => x.VisitStatusId == visit.VisitStatusID),
                                 visit.VisitTypeID,
                                 visType = this.uow.GenericRepository<VisitType>().Table().FirstOrDefault(x => x.VisitTypeId == visit.VisitTypeID),
                                 pat.PatientId,
                                 pat.PatientFirstName,
                                 pat.PatientMiddleName,
                                 pat.PatientLastName,
                                 pat.PrimaryContactNumber,
                                 pat.MRNo,
                                 visit.RecordedDuringID

                             }).AsEnumerable().OrderByDescending(x => x.VisitDate).Select(PVM => new PatientVisitModel
                             {
                                 VisitId = PVM.VisitId,
                                 VisitNo = PVM.VisitNo,
                                 VisitDate = PVM.VisitDate,
                                 Visittime = PVM.Visittime,
                                 VisitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString(),
                                 PatientId = PVM.PatientId,
                                 PatientName = PVM.PatientFirstName + " " + PVM.PatientMiddleName + " " + PVM.PatientLastName,
                                 PatientContactNumber = PVM.PrimaryContactNumber,
                                 MRNumber = PVM.MRNo,
                                 FacilityID = PVM.FacilityID,
                                 FacilityName = PVM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PVM.FacilityID).FacilityName : "",
                                 VisitReason = PVM.VisitReason,
                                 ToConsult = PVM.ToConsult,
                                 ProviderID = PVM.ProviderID,
                                 AppointmentID = PVM.AppointmentID,
                                 ProviderName = PVM.provName != null ? (PVM.provName.FirstName + " " + PVM.provName.MiddleName + " " + PVM.provName.LastName) : "",
                                 ReferringFacility = PVM.ReferringFacility,
                                 ReferringProvider = PVM.ReferringProvider,
                                 ConsultationType = PVM.ConsultationType,
                                 ChiefComplaint = PVM.ChiefComplaint,
                                 AccompaniedBy = PVM.AccompaniedBy,
                                 Appointment = PVM.Appointment,
                                 PatientNextConsultation = PVM.PatientNextConsultation,
                                 TokenNumber = PVM.TokenNumber,
                                 AdditionalInformation = PVM.AdditionalInformation,
                                 TransitionOfCarePatient = PVM.TransitionOfCarePatient,
                                 SkipVisitIntake = PVM.SkipVisitIntake,
                                 PatientArrivalConditionID = PVM.PatientArrivalConditionID,
                                 patientArrivalCondition = PVM.PatientArrivalConditionID > 0 ?
                                                        this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == PVM.PatientArrivalConditionID).PatientArrivalconditionDescription : "",
                                 UrgencyTypeID = PVM.UrgencyTypeID,
                                 urgencyType = PVM.urgType != null ? PVM.urgType.UrgencyTypeDescription : "",
                                 VisitStatusID = PVM.VisitStatusID,
                                 visitStatus = PVM.visStatus != null ? PVM.visStatus.VisitStatusDescription : "",
                                 RecordedDuringID = PVM.RecordedDuringID,
                                 recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : "",
                                 VisitTypeID = PVM.VisitTypeID,
                                 visitType = PVM.visType != null ? PVM.visType.VisitTypeDescription : ""
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

        #region Family Health History

        ///// <summary>
        ///// Add or Update Family Health History
        ///// </summary>
        ///// <param>FamilyHealthHistoryModel familyHealthModel</param>
        ///// <returns>FamilyHealthHistoryModel. if FamilyHealthHistoryModel with ID = success. else = failure</returns>
        public FamilyHealthHistoryModel AddUpdateFamilyHealthHistory(FamilyHealthHistoryModel familyHealthModel)
        {
            var famHealth = this.uow.GenericRepository<FamilyHealthHistory>().Table().Where(x => x.VisitID == familyHealthModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (famHealth == null)
            {
                famHealth = new FamilyHealthHistory();

                famHealth.VisitID = familyHealthModel.VisitID;
                famHealth.ICDCode = familyHealthModel.ICDCode;
                famHealth.RecordedDate = this.utilService.GetLocalTime(familyHealthModel.RecordedDate);
                famHealth.RecordedBy = familyHealthModel.RecordedBy;
                famHealth.FamilyMemberName = familyHealthModel.FamilyMemberName;
                famHealth.FamilyMemberAge = familyHealthModel.FamilyMemberAge;
                famHealth.Relationship = familyHealthModel.Relationship;
                famHealth.DiagnosisNotes = familyHealthModel.DiagnosisNotes;
                famHealth.IllnessType = familyHealthModel.IllnessType;
                famHealth.ProblemStatus = familyHealthModel.ProblemStatus;
                famHealth.PhysicianName = familyHealthModel.PhysicianName;
                famHealth.AdditionalNotes = familyHealthModel.AdditionalNotes;
                famHealth.IsActive = true;
                famHealth.Createddate = DateTime.Now;
                famHealth.CreatedBy = familyHealthModel.RecordedBy;

                this.uow.GenericRepository<FamilyHealthHistory>().Insert(famHealth);
            }
            else
            {
                famHealth.ICDCode = familyHealthModel.ICDCode;
                famHealth.RecordedDate = this.utilService.GetLocalTime(familyHealthModel.RecordedDate);
                famHealth.RecordedBy = familyHealthModel.RecordedBy;
                famHealth.FamilyMemberName = familyHealthModel.FamilyMemberName;
                famHealth.FamilyMemberAge = familyHealthModel.FamilyMemberAge;
                famHealth.Relationship = familyHealthModel.Relationship;
                famHealth.DiagnosisNotes = familyHealthModel.DiagnosisNotes;
                famHealth.IllnessType = familyHealthModel.IllnessType;
                famHealth.ProblemStatus = familyHealthModel.ProblemStatus;
                famHealth.PhysicianName = familyHealthModel.PhysicianName;
                famHealth.AdditionalNotes = familyHealthModel.AdditionalNotes;
                famHealth.IsActive = true;
                famHealth.ModifiedDate = DateTime.Now;
                famHealth.ModifiedBy = familyHealthModel.RecordedBy;

                this.uow.GenericRepository<FamilyHealthHistory>().Update(famHealth);
            }
            this.uow.Save();
            familyHealthModel.FamilyHealthHistoryID = famHealth.FamilyHealthHistoryID;

            return familyHealthModel;
        }

        ///// <summary>
        ///// Get Family Health History for Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<FamilyHealthHistoryModel>. if list of FamilyHealthHistoryModel for given Patient ID = success. else = failure</returns>
        public List<FamilyHealthHistoryModel> GetFamilyHealthHistory(int PatientId)
        {
            var familyHealthList = (from health in this.uow.GenericRepository<FamilyHealthHistory>().Table().Where(x => x.IsActive != false)
                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on health.VisitID equals visit.VisitId

                                    join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                    on visit.PatientId equals pat.PatientId
                                    select new
                                    {
                                        health.FamilyHealthHistoryID,
                                        health.VisitID,
                                        health.ICDCode,
                                        health.RecordedDate,
                                        health.RecordedBy,
                                        health.FamilyMemberName,
                                        health.FamilyMemberAge,
                                        health.Relationship,
                                        health.DiagnosisNotes,
                                        health.IllnessType,
                                        health.ProblemStatus,
                                        health.PhysicianName,
                                        health.AdditionalNotes,
                                        health.IsActive,
                                        visit.RecordedDuringID,
                                        visit.FacilityID,
                                        visit.VisitNo,
                                        visit.VisitDate,
                                        visit.Visittime,
                                        pat.PatientFirstName,
                                        pat.PatientLastName,
                                        date = health.ModifiedDate == null ? health.Createddate : health.ModifiedDate

                                    }).AsEnumerable().OrderByDescending(x => x.date).Select(FHM => new FamilyHealthHistoryModel
                                    {
                                        FamilyHealthHistoryID = FHM.FamilyHealthHistoryID,
                                        VisitID = FHM.VisitID,
                                        VisitNo = FHM.VisitNo,
                                        FacilityId = FHM.FacilityID > 0 ? FHM.FacilityID.Value : 0,
                                        facilityName = FHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == FHM.FacilityID).FacilityName : "",
                                        ICDCode = FHM.ICDCode,
                                        RecordedDate = FHM.RecordedDate,
                                        RecordedBy = FHM.RecordedBy,
                                        FamilyMemberName = FHM.FamilyMemberName,
                                        FamilyMemberAge = FHM.FamilyMemberAge,
                                        Relationship = FHM.Relationship,
                                        DiagnosisNotes = FHM.DiagnosisNotes,
                                        IllnessType = FHM.IllnessType,
                                        ProblemStatus = FHM.ProblemStatus,
                                        PhysicianName = FHM.PhysicianName,
                                        AdditionalNotes = FHM.AdditionalNotes,
                                        IsActive = FHM.IsActive,
                                        recordedDuring = FHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == FHM.RecordedDuringID).RecordedDuringDescription : "",
                                        RecordedTime = FHM.RecordedDate.TimeOfDay.ToString(),
                                        PatientName = FHM.PatientFirstName + " " + FHM.PatientLastName,
                                        visitDateandTime = FHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + FHM.VisitDate.TimeOfDay.ToString()

                                    }).ToList();

            List<FamilyHealthHistoryModel> familyHealthCollection = new List<FamilyHealthHistoryModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (familyHealthList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        familyHealthCollection = (from famHealth in familyHealthList
                                                  join fac in facList on famHealth.FacilityId equals fac.FacilityId
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on famHealth.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select famHealth).ToList();
                    }
                    else
                    {
                        familyHealthCollection = (from famHealth in familyHealthList
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on famHealth.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select famHealth).ToList();
                    }
                }
                else
                {
                    familyHealthCollection = (from famHealth in familyHealthList
                                              join fac in facList on famHealth.FacilityId equals fac.FacilityId
                                              select famHealth).ToList();
                }
            }
            else
            {
                familyHealthCollection = familyHealthList;
            }

            return familyHealthCollection;
        }

        ///// <summary>
        ///// Get Family Health Record by ID
        ///// </summary>
        ///// <param>int FamilyHealthHistoryID</param>
        ///// <returns>FamilyHealthHistoryModel. if the record of FamilyHealthHistoryModel for given FamilyHealthHistoryID = success. else = failure</returns>
        public FamilyHealthHistoryModel GetFamilyHealthRecordbyID(int familyHealthHistoryID)
        {
            var familyHealthRecord = (from health in this.uow.GenericRepository<FamilyHealthHistory>().Table().Where(x => x.FamilyHealthHistoryID == familyHealthHistoryID)
                                      join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                      on health.VisitID equals visit.VisitId
                                      select new
                                      {
                                          health.FamilyHealthHistoryID,
                                          health.VisitID,
                                          health.ICDCode,
                                          health.RecordedDate,
                                          health.RecordedBy,
                                          health.FamilyMemberName,
                                          health.FamilyMemberAge,
                                          health.Relationship,
                                          health.DiagnosisNotes,
                                          health.IllnessType,
                                          health.ProblemStatus,
                                          health.PhysicianName,
                                          health.AdditionalNotes,
                                          health.IsActive,
                                          visit.RecordedDuringID,
                                          visit.VisitNo,
                                          visit.FacilityID,
                                          visit.VisitDate,
                                          visit.Visittime

                                      }).AsEnumerable().Select(FHM => new FamilyHealthHistoryModel
                                      {
                                          FamilyHealthHistoryID = FHM.FamilyHealthHistoryID,
                                          VisitID = FHM.VisitID,
                                          VisitNo = FHM.VisitNo,
                                          facilityName = FHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == FHM.FacilityID).FacilityName : "",
                                          ICDCode = FHM.ICDCode,
                                          RecordedDate = FHM.RecordedDate,
                                          RecordedBy = FHM.RecordedBy,
                                          FamilyMemberName = FHM.FamilyMemberName,
                                          FamilyMemberAge = FHM.FamilyMemberAge,
                                          Relationship = FHM.Relationship,
                                          DiagnosisNotes = FHM.DiagnosisNotes,
                                          IllnessType = FHM.IllnessType,
                                          ProblemStatus = FHM.ProblemStatus,
                                          PhysicianName = FHM.PhysicianName,
                                          AdditionalNotes = FHM.AdditionalNotes,
                                          IsActive = FHM.IsActive,
                                          recordedDuring = FHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == FHM.RecordedDuringID).RecordedDuringDescription : "",
                                          RecordedTime = FHM.RecordedDate.TimeOfDay.ToString(),
                                          visitDateandTime = FHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + FHM.VisitDate.TimeOfDay.ToString()

                                      }).SingleOrDefault();

            return familyHealthRecord;
        }

        ///// <summary>
        ///// Delete Family Health record by ID
        ///// </summary>
        ///// <param>int familyHealthHistoyID</param>
        ///// <returns>FamilyHealthHistory. if the record of Family Health for given familyHealthHistoyID is deleted = success. else = failure</returns>
        public FamilyHealthHistory DeleteFamilyHealthRecord(int familyHealthHistoryID)
        {
            var famHealthRecord = this.uow.GenericRepository<FamilyHealthHistory>().Table().Where(x => x.FamilyHealthHistoryID == familyHealthHistoryID).SingleOrDefault();

            if (famHealthRecord != null)
            {
                famHealthRecord.IsActive = false;
                this.uow.GenericRepository<FamilyHealthHistory>().Update(famHealthRecord);
                this.uow.Save();
            }

            return famHealthRecord;
        }
        #endregion

        #region Hospitalization History

        ///// <summary>
        ///// Add or Update Hospitalization History
        ///// </summary>
        ///// <param>HospitalizationHistoryModel hospitalizationModel</param>
        ///// <returns>HospitalizationHistoryModel. if Hospitalization History Model with ID = success. else = failure</returns>
        public HospitalizationHistoryModel AddUpdateHospitalizationHistory(HospitalizationHistoryModel hospitalizationModel)
        {
            var hospHistory = this.uow.GenericRepository<HospitalizationHistory>().Table().Where(x => x.VisitID == hospitalizationModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (hospHistory == null)
            {
                hospHistory = new HospitalizationHistory();

                hospHistory.VisitID = hospitalizationModel.VisitID;
                hospHistory.RecordedDate = this.utilService.GetLocalTime(hospitalizationModel.RecordedDate);
                hospHistory.RecordedBy = hospitalizationModel.RecordedBy;
                hospHistory.AdmissionDate = this.utilService.GetLocalTime(hospitalizationModel.AdmissionDate);
                hospHistory.AdmissionType = hospitalizationModel.AdmissionType;
                hospHistory.InitialAdmissionStatus = hospitalizationModel.InitialAdmissionStatus;
                hospHistory.FacilityName = hospitalizationModel.FacilityName;
                hospHistory.AdmittingPhysician = hospitalizationModel.AdmittingPhysician;
                hospHistory.AttendingPhysician = hospitalizationModel.AttendingPhysician;
                hospHistory.ChiefComplaint = hospitalizationModel.ChiefComplaint;
                hospHistory.PrimaryDiagnosis = hospitalizationModel.PrimaryDiagnosis;
                hospHistory.ICDCode = hospitalizationModel.ICDCode;
                hospHistory.ProcedureType = hospitalizationModel.ProcedureType;
                hospHistory.PrimaryProcedure = hospitalizationModel.PrimaryProcedure;
                hospHistory.CPTCode = hospitalizationModel.CPTCode;
                hospHistory.ProblemStatus = hospitalizationModel.ProblemStatus;
                hospHistory.DischargeDate = this.utilService.GetLocalTime(hospitalizationModel.DischargeDate);
                hospHistory.DischargeStatusCode = hospitalizationModel.DischargeStatusCode;
                hospHistory.AdditionalNotes = hospitalizationModel.AdditionalNotes;
                hospHistory.IsActive = true;
                hospHistory.Createddate = DateTime.Now;
                hospHistory.CreatedBy = hospitalizationModel.RecordedBy;

                this.uow.GenericRepository<HospitalizationHistory>().Insert(hospHistory);
            }
            else
            {
                //hospHistory.VisitID = hospitalizationModel.VisitID;
                hospHistory.RecordedDate = this.utilService.GetLocalTime(hospitalizationModel.RecordedDate);
                hospHistory.RecordedBy = hospitalizationModel.RecordedBy;
                hospHistory.AdmissionDate = this.utilService.GetLocalTime(hospitalizationModel.AdmissionDate);
                hospHistory.AdmissionType = hospitalizationModel.AdmissionType;
                hospHistory.InitialAdmissionStatus = hospitalizationModel.InitialAdmissionStatus;
                hospHistory.FacilityName = hospitalizationModel.FacilityName;
                hospHistory.AdmittingPhysician = hospitalizationModel.AdmittingPhysician;
                hospHistory.AttendingPhysician = hospitalizationModel.AttendingPhysician;
                hospHistory.ChiefComplaint = hospitalizationModel.ChiefComplaint;
                hospHistory.PrimaryDiagnosis = hospitalizationModel.PrimaryDiagnosis;
                hospHistory.ICDCode = hospitalizationModel.ICDCode;
                hospHistory.ProcedureType = hospitalizationModel.ProcedureType;
                hospHistory.PrimaryProcedure = hospitalizationModel.PrimaryProcedure;
                hospHistory.CPTCode = hospitalizationModel.CPTCode;
                hospHistory.ProblemStatus = hospitalizationModel.ProblemStatus;
                hospHistory.DischargeDate = this.utilService.GetLocalTime(hospitalizationModel.DischargeDate);
                hospHistory.DischargeStatusCode = hospitalizationModel.DischargeStatusCode;
                hospHistory.AdditionalNotes = hospitalizationModel.AdditionalNotes;
                hospHistory.IsActive = true;
                hospHistory.ModifiedDate = DateTime.Now;
                hospHistory.ModifiedBy = hospitalizationModel.RecordedBy;

                this.uow.GenericRepository<HospitalizationHistory>().Update(hospHistory);
            }
            this.uow.Save();
            hospitalizationModel.HospitalizationID = hospHistory.HospitalizationID;

            return hospitalizationModel;
        }

        ///// <summary>
        ///// Get Hospitalization History List
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<HospitalizationHistoryModel>. if list of Hospitalization History Model for given Patient ID = success. else = failure</returns>
        public List<HospitalizationHistoryModel> GetHospitalizationHistory(int PatientId)
        {
            var hospitalizationList = (from hosp in this.uow.GenericRepository<HospitalizationHistory>().Table().Where(x => x.IsActive != false)
                                       join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                       on hosp.VisitID equals visit.VisitId

                                       join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                       on visit.PatientId equals pat.PatientId

                                       select new
                                       {
                                           hosp.HospitalizationID,
                                           hosp.VisitID,
                                           hosp.RecordedDate,
                                           hosp.RecordedBy,
                                           hosp.AdmissionDate,
                                           hosp.AdmissionType,
                                           hosp.InitialAdmissionStatus,
                                           hosp.FacilityName,
                                           hosp.AdmittingPhysician,
                                           hosp.AttendingPhysician,
                                           hosp.ChiefComplaint,
                                           hosp.PrimaryDiagnosis,
                                           hosp.ICDCode,
                                           hosp.ProcedureType,
                                           hosp.PrimaryProcedure,
                                           hosp.CPTCode,
                                           hosp.ProblemStatus,
                                           hosp.DischargeDate,
                                           hosp.DischargeStatusCode,
                                           hosp.AdditionalNotes,
                                           hosp.IsActive,
                                           visit.RecordedDuringID,
                                           visit.VisitNo,
                                           visit.FacilityID,
                                           visit.VisitDate,
                                           visit.Visittime,
                                           pat.PatientFirstName,
                                           pat.PatientLastName,
                                           date = hosp.ModifiedDate == null ? hosp.Createddate : hosp.ModifiedDate

                                       }).AsEnumerable().OrderByDescending(x => x.date).Select(HHM => new HospitalizationHistoryModel
                                       {
                                           HospitalizationID = HHM.HospitalizationID,
                                           VisitID = HHM.VisitID,
                                           VisitNo = HHM.VisitNo,
                                           FacilityId = HHM.FacilityID > 0 ? HHM.FacilityID.Value : 0,
                                           facilityName = HHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == HHM.FacilityID).FacilityName : "",
                                           RecordedDate = HHM.RecordedDate,
                                           RecordedBy = HHM.RecordedBy,
                                           AdmissionDate = HHM.AdmissionDate,
                                           AdmissionType = HHM.AdmissionType,
                                           InitialAdmissionStatus = HHM.InitialAdmissionStatus,
                                           FacilityName = HHM.FacilityName,
                                           AdmittingPhysician = HHM.AdmittingPhysician,
                                           AttendingPhysician = HHM.AttendingPhysician,
                                           ChiefComplaint = HHM.ChiefComplaint,
                                           PrimaryDiagnosis = HHM.PrimaryDiagnosis,
                                           ICDCode = HHM.ICDCode,
                                           ProcedureType = HHM.ProcedureType,
                                           PrimaryProcedure = HHM.PrimaryProcedure,
                                           CPTCode = HHM.CPTCode,
                                           ProblemStatus = HHM.ProblemStatus,
                                           DischargeDate = HHM.DischargeDate,
                                           DischargeStatusCode = HHM.DischargeStatusCode,
                                           AdditionalNotes = HHM.AdditionalNotes,
                                           IsActive = HHM.IsActive,
                                           recordedDuring = HHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == HHM.RecordedDuringID).RecordedDuringDescription : "",
                                           RecordedTime = HHM.RecordedDate.TimeOfDay.ToString(),
                                           PatientName = HHM.PatientFirstName + " " + HHM.PatientLastName,
                                           visitDateandTime = HHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + HHM.VisitDate.TimeOfDay.ToString(),
                                           filePath = this.GetFile(HHM.HospitalizationID.ToString(), "Patient/HospitalizationHistory")

                                       }).ToList();

            List<HospitalizationHistoryModel> hospHistoryCollection = new List<HospitalizationHistoryModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (hospitalizationList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        hospHistoryCollection = (from hosp in hospitalizationList
                                                 join fac in facList on hosp.FacilityId equals fac.FacilityId
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on hosp.VisitID equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select hosp).ToList();
                    }
                    else
                    {
                        hospHistoryCollection = (from hosp in hospitalizationList
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on hosp.VisitID equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select hosp).ToList();
                    }
                }
                else
                {
                    hospHistoryCollection = (from hosp in hospitalizationList
                                             join fac in facList on hosp.FacilityId equals fac.FacilityId
                                             select hosp).ToList();
                }
            }
            else
            {
                hospHistoryCollection = hospitalizationList;
            }

            return hospHistoryCollection;
        }

        ///// <summary>
        ///// Get Hospitalization History by ID
        ///// </summary>
        ///// <param>int HospitalizationID</param>
        ///// <returns>List<HospitalizationHistoryModel>. if the record of Hospitalization History Model for given HospitalizationID = success. else = failure</returns>
        public HospitalizationHistoryModel GetHospitalizationRecordbyID(int hospitalizationID)
        {
            var hospitalizationRecord = (from hosp in this.uow.GenericRepository<HospitalizationHistory>().Table().Where(x => x.HospitalizationID == hospitalizationID)
                                         join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                         on hosp.VisitID equals visit.VisitId

                                         select new
                                         {
                                             hosp.HospitalizationID,
                                             hosp.VisitID,
                                             hosp.RecordedDate,
                                             hosp.RecordedBy,
                                             hosp.AdmissionDate,
                                             hosp.AdmissionType,
                                             hosp.InitialAdmissionStatus,
                                             hosp.FacilityName,
                                             hosp.AdmittingPhysician,
                                             hosp.AttendingPhysician,
                                             hosp.ChiefComplaint,
                                             hosp.PrimaryDiagnosis,
                                             hosp.ICDCode,
                                             hosp.ProcedureType,
                                             hosp.PrimaryProcedure,
                                             hosp.CPTCode,
                                             hosp.ProblemStatus,
                                             hosp.DischargeDate,
                                             hosp.DischargeStatusCode,
                                             hosp.AdditionalNotes,
                                             hosp.IsActive,
                                             visit.RecordedDuringID,
                                             visit.FacilityID,
                                             visit.VisitNo,
                                             visit.VisitDate,
                                             visit.Visittime,
                                             visit.PatientId

                                         }).AsEnumerable().Select(HHM => new HospitalizationHistoryModel
                                         {
                                             HospitalizationID = HHM.HospitalizationID,
                                             VisitID = HHM.VisitID,
                                             VisitNo = HHM.VisitNo,
                                             facilityName = HHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == HHM.FacilityID).FacilityName : "",
                                             RecordedDate = HHM.RecordedDate,
                                             RecordedBy = HHM.RecordedBy,
                                             AdmissionDate = HHM.AdmissionDate,
                                             AdmissionType = HHM.AdmissionType,
                                             InitialAdmissionStatus = HHM.InitialAdmissionStatus,
                                             FacilityName = HHM.FacilityName,
                                             AdmittingPhysician = HHM.AdmittingPhysician,
                                             AttendingPhysician = HHM.AttendingPhysician,
                                             ChiefComplaint = HHM.ChiefComplaint,
                                             PrimaryDiagnosis = HHM.PrimaryDiagnosis,
                                             ICDCode = HHM.ICDCode,
                                             ProcedureType = HHM.ProcedureType,
                                             PrimaryProcedure = HHM.PrimaryProcedure,
                                             CPTCode = HHM.CPTCode,
                                             ProblemStatus = HHM.ProblemStatus,
                                             DischargeDate = HHM.DischargeDate,
                                             DischargeStatusCode = HHM.DischargeStatusCode,
                                             AdditionalNotes = HHM.AdditionalNotes,
                                             IsActive = HHM.IsActive,
                                             recordedDuring = HHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == HHM.RecordedDuringID).RecordedDuringDescription : "",
                                             RecordedTime = HHM.RecordedDate.TimeOfDay.ToString(),
                                             visitDateandTime = HHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + HHM.VisitDate.TimeOfDay.ToString(),
                                             filePath = this.GetFile(HHM.HospitalizationID.ToString(), "Patient/HospitalizationHistory")

                                         }).SingleOrDefault();

            return hospitalizationRecord;
        }

        ///// <summary>
        ///// Delete Hospitalization record by ID
        ///// </summary>
        ///// <param>int hospitalizationID</param>
        ///// <returns>HospitalizationHistory. if the record of Hospitalization for given hospitalizationID is deleted = success. else = failure</returns>
        public HospitalizationHistory DeleteHospitalizationRecord(int hospitalizationID)
        {
            var hospRecord = this.uow.GenericRepository<HospitalizationHistory>().Table().Where(x => x.HospitalizationID == hospitalizationID).SingleOrDefault();

            if (hospRecord != null)
            {
                hospRecord.IsActive = false;
                this.uow.GenericRepository<HospitalizationHistory>().Update(hospRecord);
                this.uow.Save();
            }

            return hospRecord;
        }

        #endregion

        #region Physical Exam

        ///// <summary>
        ///// Add or Update Physical Exam Details
        ///// </summary>
        ///// <param>PhysicalExamModel physicalModel</param>
        ///// <returns>PhysicalExamModel. if Physical Exam Model with ID = success. else = failure</returns>
        public PhysicalExamModel AddUpdatePhysicalExamData(PhysicalExamModel physicalModel)
        {
            var physicalExam = this.uow.GenericRepository<PhysicalExam>().Table().Where(x => x.VisitID == physicalModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (physicalExam == null)
            {
                physicalExam = new PhysicalExam();

                physicalExam.VisitID = physicalModel.VisitID;
                physicalExam.RecordedDate = this.utilService.GetLocalTime(physicalModel.RecordedDate);
                physicalExam.RecordedBy = physicalModel.RecordedBy;
                physicalExam.HeadValue = physicalModel.HeadValue;
                physicalExam.HeadDesc = physicalModel.HeadDesc;
                physicalExam.EARValue = physicalModel.EARValue;
                physicalExam.EARDesc = physicalModel.EARDesc;
                physicalExam.MouthValue = physicalModel.MouthValue;
                physicalExam.MouthDesc = physicalModel.MouthDesc;
                physicalExam.ThroatValue = physicalModel.ThroatValue;
                physicalExam.ThroatDesc = physicalModel.ThroatDesc;
                physicalExam.HairValue = physicalModel.HairValue;
                physicalExam.HairDesc = physicalModel.HairDesc;
                physicalExam.NeckValue = physicalModel.NeckValue;
                physicalExam.NeckDesc = physicalModel.NeckDesc;
                physicalExam.SpineValue = physicalModel.SpineValue;
                physicalExam.SpineDesc = physicalModel.SpineDesc;
                physicalExam.SkinValue = physicalModel.SkinValue;
                physicalExam.SkinDesc = physicalModel.SkinDesc;
                physicalExam.LegValue = physicalModel.LegValue;
                physicalExam.LegDesc = physicalModel.LegDesc;
                physicalExam.SensationValue = physicalModel.SensationValue;
                physicalExam.SensationDesc = physicalModel.SensationDesc;
                physicalExam.EyeValue = physicalModel.EyeValue;
                physicalExam.EyeDesc = physicalModel.EyeDesc;
                physicalExam.NoseValue = physicalModel.NoseValue;
                physicalExam.NoseDesc = physicalModel.NoseDesc;
                physicalExam.TeethValue = physicalModel.TeethValue;
                physicalExam.TeethDesc = physicalModel.TeethDesc;
                physicalExam.ChestValue = physicalModel.ChestValue;
                physicalExam.ChestDesc = physicalModel.ChestDesc;
                physicalExam.ThoraxValue = physicalModel.ThoraxValue;
                physicalExam.ThoraxDesc = physicalModel.ThoraxDesc;
                physicalExam.AbdomenValue = physicalModel.AbdomenValue;
                physicalExam.AbdomenDesc = physicalModel.AbdomenDesc;
                physicalExam.PelvisValue = physicalModel.PelvisValue;
                physicalExam.PelvisDesc = physicalModel.PelvisDesc;
                physicalExam.NailsValue = physicalModel.NailsValue;
                physicalExam.NailsDesc = physicalModel.NailsDesc;
                physicalExam.FootValue = physicalModel.FootValue;
                physicalExam.FootDesc = physicalModel.FootDesc;
                physicalExam.HandValue = physicalModel.HandValue;
                physicalExam.HandDesc = physicalModel.HandDesc;
                physicalExam.IsActive = true;
                physicalExam.Createddate = DateTime.Now;
                physicalExam.CreatedBy = physicalModel.RecordedBy;

                this.uow.GenericRepository<PhysicalExam>().Insert(physicalExam);
            }
            else
            {
                physicalExam.RecordedDate = this.utilService.GetLocalTime(physicalModel.RecordedDate);
                physicalExam.RecordedBy = physicalModel.RecordedBy;
                physicalExam.HeadValue = physicalModel.HeadValue;
                physicalExam.HeadDesc = physicalModel.HeadDesc;
                physicalExam.EARValue = physicalModel.EARValue;
                physicalExam.EARDesc = physicalModel.EARDesc;
                physicalExam.MouthValue = physicalModel.MouthValue;
                physicalExam.MouthDesc = physicalModel.MouthDesc;
                physicalExam.ThroatValue = physicalModel.ThroatValue;
                physicalExam.ThroatDesc = physicalModel.ThroatDesc;
                physicalExam.HairValue = physicalModel.HairValue;
                physicalExam.HairDesc = physicalModel.HairDesc;
                physicalExam.NeckValue = physicalModel.NeckValue;
                physicalExam.NeckDesc = physicalModel.NeckDesc;
                physicalExam.SpineValue = physicalModel.SpineValue;
                physicalExam.SpineDesc = physicalModel.SpineDesc;
                physicalExam.SkinValue = physicalModel.SkinValue;
                physicalExam.SkinDesc = physicalModel.SkinDesc;
                physicalExam.LegValue = physicalModel.LegValue;
                physicalExam.LegDesc = physicalModel.LegDesc;
                physicalExam.SensationValue = physicalModel.SensationValue;
                physicalExam.SensationDesc = physicalModel.SensationDesc;
                physicalExam.EyeValue = physicalModel.EyeValue;
                physicalExam.EyeDesc = physicalModel.EyeDesc;
                physicalExam.NoseValue = physicalModel.NoseValue;
                physicalExam.NoseDesc = physicalModel.NoseDesc;
                physicalExam.TeethValue = physicalModel.TeethValue;
                physicalExam.TeethDesc = physicalModel.TeethDesc;
                physicalExam.ChestValue = physicalModel.ChestValue;
                physicalExam.ChestDesc = physicalModel.ChestDesc;
                physicalExam.ThoraxValue = physicalModel.ThoraxValue;
                physicalExam.ThoraxDesc = physicalModel.ThoraxDesc;
                physicalExam.AbdomenValue = physicalModel.AbdomenValue;
                physicalExam.AbdomenDesc = physicalModel.AbdomenDesc;
                physicalExam.PelvisValue = physicalModel.PelvisValue;
                physicalExam.PelvisDesc = physicalModel.PelvisDesc;
                physicalExam.NailsValue = physicalModel.NailsValue;
                physicalExam.NailsDesc = physicalModel.NailsDesc;
                physicalExam.FootValue = physicalModel.FootValue;
                physicalExam.FootDesc = physicalModel.FootDesc;
                physicalExam.HandValue = physicalModel.HandValue;
                physicalExam.HandDesc = physicalModel.HandDesc;
                physicalExam.IsActive = true;
                physicalExam.ModifiedDate = DateTime.Now;
                physicalExam.ModifiedBy = physicalModel.RecordedBy;

                this.uow.GenericRepository<PhysicalExam>().Update(physicalExam);
            }
            this.uow.Save();
            physicalModel.PhysicalExamID = physicalExam.PhysicalExamID;

            return physicalModel;
        }

        ///// <summary>
        ///// Get Physical Exam List
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PhysicalExamModel>. if list of Physical Exam Model for given Patient ID = success. else = failure</returns>
        public List<PhysicalExamModel> GetPhysicalExamList(int PatientId)
        {
            var physicalExamList = (from exam in this.uow.GenericRepository<PhysicalExam>().Table().Where(x => x.IsActive != false)
                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on exam.VisitID equals visit.VisitId

                                    join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                    on visit.PatientId equals pat.PatientId
                                    select new
                                    {
                                        exam.PhysicalExamID,
                                        exam.VisitID,
                                        exam.RecordedDate,
                                        exam.RecordedBy,
                                        exam.HeadValue,
                                        exam.HeadDesc,
                                        exam.EARValue,
                                        exam.EARDesc,
                                        exam.MouthValue,
                                        exam.MouthDesc,
                                        exam.ThroatValue,
                                        exam.ThroatDesc,
                                        exam.HairValue,
                                        exam.HairDesc,
                                        exam.NeckValue,
                                        exam.NeckDesc,
                                        exam.SpineValue,
                                        exam.SpineDesc,
                                        exam.SkinValue,
                                        exam.SkinDesc,
                                        exam.LegValue,
                                        exam.LegDesc,
                                        exam.SensationValue,
                                        exam.SensationDesc,
                                        exam.EyeValue,
                                        exam.EyeDesc,
                                        exam.NoseValue,
                                        exam.NoseDesc,
                                        exam.TeethValue,
                                        exam.TeethDesc,
                                        exam.ChestValue,
                                        exam.ChestDesc,
                                        exam.ThoraxValue,
                                        exam.ThoraxDesc,
                                        exam.AbdomenValue,
                                        exam.AbdomenDesc,
                                        exam.PelvisValue,
                                        exam.PelvisDesc,
                                        exam.NailsValue,
                                        exam.NailsDesc,
                                        exam.FootValue,
                                        exam.FootDesc,
                                        exam.HandValue,
                                        exam.HandDesc,
                                        exam.IsActive,
                                        visit.RecordedDuringID,
                                        visit.FacilityID,
                                        visit.VisitNo,
                                        visit.VisitDate,
                                        visit.Visittime,
                                        pat.PatientFirstName,
                                        pat.PatientLastName,
                                        date = exam.ModifiedDate == null ? exam.Createddate : exam.ModifiedDate

                                    }).AsEnumerable().OrderByDescending(x => x.date).Select(PEM => new PhysicalExamModel
                                    {
                                        PhysicalExamID = PEM.PhysicalExamID,
                                        VisitID = PEM.VisitID,
                                        VisitNo = PEM.VisitNo,
                                        FacilityId = PEM.FacilityID > 0 ? PEM.FacilityID.Value : 0,
                                        facilityName = PEM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PEM.FacilityID).FacilityName : "",
                                        RecordedDate = PEM.RecordedDate,
                                        RecordedBy = PEM.RecordedBy,
                                        HeadValue = PEM.HeadValue,
                                        HeadDesc = PEM.HeadDesc,
                                        EARValue = PEM.EARValue,
                                        EARDesc = PEM.EARDesc,
                                        MouthValue = PEM.MouthValue,
                                        MouthDesc = PEM.MouthDesc,
                                        ThroatValue = PEM.ThroatValue,
                                        ThroatDesc = PEM.ThroatDesc,
                                        HairValue = PEM.HairValue,
                                        HairDesc = PEM.HairDesc,
                                        NeckValue = PEM.NeckValue,
                                        NeckDesc = PEM.NeckDesc,
                                        SpineValue = PEM.SpineValue,
                                        SpineDesc = PEM.SpineDesc,
                                        SkinValue = PEM.SkinValue,
                                        SkinDesc = PEM.SkinDesc,
                                        LegValue = PEM.LegValue,
                                        LegDesc = PEM.LegDesc,
                                        SensationValue = PEM.SensationValue,
                                        SensationDesc = PEM.SensationDesc,
                                        EyeValue = PEM.EyeValue,
                                        EyeDesc = PEM.EyeDesc,
                                        NoseValue = PEM.NoseValue,
                                        NoseDesc = PEM.NoseDesc,
                                        TeethValue = PEM.TeethValue,
                                        TeethDesc = PEM.TeethDesc,
                                        ChestValue = PEM.ChestValue,
                                        ChestDesc = PEM.ChestDesc,
                                        ThoraxValue = PEM.ThoraxValue,
                                        ThoraxDesc = PEM.ThoraxDesc,
                                        AbdomenValue = PEM.AbdomenValue,
                                        AbdomenDesc = PEM.AbdomenDesc,
                                        PelvisValue = PEM.PelvisValue,
                                        PelvisDesc = PEM.PelvisDesc,
                                        NailsValue = PEM.NailsValue,
                                        NailsDesc = PEM.NailsDesc,
                                        FootValue = PEM.FootValue,
                                        FootDesc = PEM.FootDesc,
                                        HandValue = PEM.HandValue,
                                        HandDesc = PEM.HandDesc,
                                        IsActive = PEM.IsActive,
                                        recordedDuring = PEM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PEM.RecordedDuringID).RecordedDuringDescription : "",
                                        RecordedTime = PEM.RecordedDate.TimeOfDay.ToString(),
                                        PatientName = PEM.PatientFirstName + " " + PEM.PatientLastName,
                                        visitDateandTime = PEM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PEM.VisitDate.TimeOfDay.ToString()

                                    }).ToList();

            List<PhysicalExamModel> physicalExamCollection = new List<PhysicalExamModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (physicalExamList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        physicalExamCollection = (from phy in physicalExamList
                                                  join fac in facList on phy.FacilityId equals fac.FacilityId
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on phy.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select phy).ToList();
                    }
                    else
                    {
                        physicalExamCollection = (from phy in physicalExamList
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on phy.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select phy).ToList();
                    }
                }
                else
                {
                    physicalExamCollection = (from phy in physicalExamList
                                              join fac in facList on phy.FacilityId equals fac.FacilityId
                                              select phy).ToList();
                }
            }
            else
            {
                physicalExamCollection = physicalExamList;
            }

            return physicalExamCollection;
        }

        ///// <summary>
        ///// Get Physical Exam record by ID
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>PhysicalExamModel. if the record of Physical Exam Model for given Physical Exam ID = success. else = failure</returns>
        public PhysicalExamModel GetPhysicalExamRecordbyID(int physicalExamID)
        {
            var physicalExamRecord = (from exam in this.uow.GenericRepository<PhysicalExam>().Table().Where(x => x.PhysicalExamID == physicalExamID)
                                      join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                      on exam.VisitID equals visit.VisitId

                                      select new
                                      {
                                          exam.PhysicalExamID,
                                          exam.VisitID,
                                          exam.RecordedDate,
                                          exam.RecordedBy,
                                          exam.HeadValue,
                                          exam.HeadDesc,
                                          exam.EARValue,
                                          exam.EARDesc,
                                          exam.MouthValue,
                                          exam.MouthDesc,
                                          exam.ThroatValue,
                                          exam.ThroatDesc,
                                          exam.HairValue,
                                          exam.HairDesc,
                                          exam.NeckValue,
                                          exam.NeckDesc,
                                          exam.SpineValue,
                                          exam.SpineDesc,
                                          exam.SkinValue,
                                          exam.SkinDesc,
                                          exam.LegValue,
                                          exam.LegDesc,
                                          exam.SensationValue,
                                          exam.SensationDesc,
                                          exam.EyeValue,
                                          exam.EyeDesc,
                                          exam.NoseValue,
                                          exam.NoseDesc,
                                          exam.TeethValue,
                                          exam.TeethDesc,
                                          exam.ChestValue,
                                          exam.ChestDesc,
                                          exam.ThoraxValue,
                                          exam.ThoraxDesc,
                                          exam.AbdomenValue,
                                          exam.AbdomenDesc,
                                          exam.PelvisValue,
                                          exam.PelvisDesc,
                                          exam.NailsValue,
                                          exam.NailsDesc,
                                          exam.FootValue,
                                          exam.FootDesc,
                                          exam.HandValue,
                                          exam.HandDesc,
                                          exam.IsActive,
                                          visit.RecordedDuringID,
                                          visit.FacilityID,
                                          visit.VisitNo,
                                          visit.VisitDate,
                                          visit.Visittime

                                      }).AsEnumerable().Select(PEM => new PhysicalExamModel
                                      {
                                          PhysicalExamID = PEM.PhysicalExamID,
                                          VisitID = PEM.VisitID,
                                          VisitNo = PEM.VisitNo,
                                          facilityName = PEM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PEM.FacilityID).FacilityName : "",
                                          RecordedDate = PEM.RecordedDate,
                                          RecordedBy = PEM.RecordedBy,
                                          HeadValue = PEM.HeadValue,
                                          HeadDesc = PEM.HeadDesc,
                                          EARValue = PEM.EARValue,
                                          EARDesc = PEM.EARDesc,
                                          MouthValue = PEM.MouthValue,
                                          MouthDesc = PEM.MouthDesc,
                                          ThroatValue = PEM.ThroatValue,
                                          ThroatDesc = PEM.ThroatDesc,
                                          HairValue = PEM.HairValue,
                                          HairDesc = PEM.HairDesc,
                                          NeckValue = PEM.NeckValue,
                                          NeckDesc = PEM.NeckDesc,
                                          SpineValue = PEM.SpineValue,
                                          SpineDesc = PEM.SpineDesc,
                                          SkinValue = PEM.SkinValue,
                                          SkinDesc = PEM.SkinDesc,
                                          LegValue = PEM.LegValue,
                                          LegDesc = PEM.LegDesc,
                                          SensationValue = PEM.SensationValue,
                                          SensationDesc = PEM.SensationDesc,
                                          EyeValue = PEM.EyeValue,
                                          EyeDesc = PEM.EyeDesc,
                                          NoseValue = PEM.NoseValue,
                                          NoseDesc = PEM.NoseDesc,
                                          TeethValue = PEM.TeethValue,
                                          TeethDesc = PEM.TeethDesc,
                                          ChestValue = PEM.ChestValue,
                                          ChestDesc = PEM.ChestDesc,
                                          ThoraxValue = PEM.ThoraxValue,
                                          ThoraxDesc = PEM.ThoraxDesc,
                                          AbdomenValue = PEM.AbdomenValue,
                                          AbdomenDesc = PEM.AbdomenDesc,
                                          PelvisValue = PEM.PelvisValue,
                                          PelvisDesc = PEM.PelvisDesc,
                                          NailsValue = PEM.NailsValue,
                                          NailsDesc = PEM.NailsDesc,
                                          FootValue = PEM.FootValue,
                                          FootDesc = PEM.FootDesc,
                                          HandValue = PEM.HandValue,
                                          HandDesc = PEM.HandDesc,
                                          IsActive = PEM.IsActive,
                                          recordedDuring = PEM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PEM.RecordedDuringID).RecordedDuringDescription : "",
                                          RecordedTime = PEM.RecordedDate.TimeOfDay.ToString(),
                                          visitDateandTime = PEM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PEM.VisitDate.TimeOfDay.ToString()

                                      }).SingleOrDefault();

            return physicalExamRecord;
        }

        ///// <summary>
        ///// Delete Physical Exam record by ID
        ///// </summary>
        ///// <param>int physicalExamID</param>
        ///// <returns>PhysicalExam. if the record of Physical Exam for given physicalExamID is deleted = success. else = failure</returns>
        public PhysicalExam DeletePhysicalExamRecord(int physicalExamID)
        {
            var physicExam = this.uow.GenericRepository<PhysicalExam>().Table().Where(x => x.PhysicalExamID == physicalExamID).SingleOrDefault();

            if (physicExam != null)
            {
                physicExam.IsActive = false;
                this.uow.GenericRepository<PhysicalExam>().Update(physicExam);
                this.uow.Save();
            }

            return physicExam;
        }

        #endregion

        #region Patient Work History

        ///// <summary>
        ///// Add or Update Patient Work History
        ///// </summary>
        ///// <param>PatientWorkHistoryModel workHistoryModel</param>
        ///// <returns>PatientWorkHistoryModel. if patient work Hisroty Model with ID = success. else = failure</returns>
        public PatientWorkHistoryModel AddUpdatePatientWorkHistory(PatientWorkHistoryModel workHistoryModel)
        {
            var workHistory = this.uow.GenericRepository<PatientWorkHistory>().Table().Where(x => x.VisitID == workHistoryModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (workHistory == null)
            {
                workHistory = new PatientWorkHistory();

                workHistory.VisitID = workHistoryModel.VisitID;
                workHistory.RecordedDate = this.utilService.GetLocalTime(workHistoryModel.RecordedDate);
                workHistory.RecordedBy = workHistoryModel.RecordedBy;
                workHistory.EmployerName = workHistoryModel.EmployerName;
                workHistory.ContactPerson = workHistoryModel.ContactPerson;
                workHistory.Email = workHistoryModel.Email;
                workHistory.CellPhone = workHistoryModel.CellPhone;
                workHistory.PhoneNo = workHistoryModel.PhoneNo;
                workHistory.AddressLine1 = workHistoryModel.AddressLine1;
                workHistory.AddressLine2 = workHistoryModel.AddressLine2;
                workHistory.Town = workHistoryModel.Town;
                workHistory.City = workHistoryModel.City; ;
                workHistory.District = workHistoryModel.District;
                workHistory.State = workHistoryModel.State;
                workHistory.Country = workHistoryModel.Country;
                workHistory.PIN = workHistoryModel.PIN;
                workHistory.WorkDateFrom = this.utilService.GetLocalTime(workHistoryModel.WorkDateFrom);
                workHistory.WorkDateTo = this.utilService.GetLocalTime(workHistoryModel.WorkDateTo);
                workHistory.AdditionalNotes = workHistoryModel.AdditionalNotes;
                workHistory.IsActive = true;
                workHistory.Createddate = DateTime.Now;
                workHistory.CreatedBy = workHistoryModel.RecordedBy;

                this.uow.GenericRepository<PatientWorkHistory>().Insert(workHistory);
            }
            else
            {
                workHistory.RecordedDate = this.utilService.GetLocalTime(workHistoryModel.RecordedDate);
                workHistory.RecordedBy = workHistoryModel.RecordedBy;
                workHistory.EmployerName = workHistoryModel.EmployerName;
                workHistory.ContactPerson = workHistoryModel.ContactPerson;
                workHistory.Email = workHistoryModel.Email;
                workHistory.CellPhone = workHistoryModel.CellPhone;
                workHistory.PhoneNo = workHistoryModel.PhoneNo;
                workHistory.AddressLine1 = workHistoryModel.AddressLine1;
                workHistory.AddressLine2 = workHistoryModel.AddressLine2;
                workHistory.Town = workHistoryModel.Town;
                workHistory.City = workHistoryModel.City; ;
                workHistory.District = workHistoryModel.District;
                workHistory.State = workHistoryModel.State;
                workHistory.Country = workHistoryModel.Country;
                workHistory.PIN = workHistoryModel.PIN;
                workHistory.WorkDateFrom = this.utilService.GetLocalTime(workHistoryModel.WorkDateFrom);
                workHistory.WorkDateTo = this.utilService.GetLocalTime(workHistoryModel.WorkDateTo);
                workHistory.AdditionalNotes = workHistoryModel.AdditionalNotes;
                workHistory.IsActive = true;
                workHistory.Createddate = DateTime.Now;
                workHistory.CreatedBy = workHistoryModel.RecordedBy;

                this.uow.GenericRepository<PatientWorkHistory>().Update(workHistory);
            }
            this.uow.Save();
            workHistoryModel.PatientWorkHistoryID = workHistory.PatientWorkHistoryID;

            return workHistoryModel;
        }

        ///// <summary>
        ///// Get Patient Work History List
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientWorkHistoryModel>. if list of Patient Work History Model for given Patient ID = success. else = failure</returns>
        public List<PatientWorkHistoryModel> GetPatientWorkHistoryList(int PatientId)
        {
            var patientWorkList = (from work in this.uow.GenericRepository<PatientWorkHistory>().Table().Where(x => x.IsActive != false)
                                   join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on work.VisitID equals visit.VisitId

                                   join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                   on visit.PatientId equals pat.PatientId

                                   select new
                                   {
                                       work.PatientWorkHistoryID,
                                       work.VisitID,
                                       work.RecordedDate,
                                       work.RecordedBy,
                                       work.EmployerName,
                                       work.ContactPerson,
                                       work.Email,
                                       work.CellPhone,
                                       work.PhoneNo,
                                       work.AddressLine1,
                                       work.AddressLine2,
                                       work.Town,
                                       work.City,
                                       work.District,
                                       work.State,
                                       work.Country,
                                       work.PIN,
                                       work.WorkDateFrom,
                                       work.WorkDateTo,
                                       work.AdditionalNotes,
                                       work.IsActive,
                                       visit.RecordedDuringID,
                                       visit.FacilityID,
                                       visit.VisitNo,
                                       visit.VisitDate,
                                       visit.Visittime,
                                       pat.PatientFirstName,
                                       pat.PatientLastName,
                                       date = work.ModifiedDate == null ? work.Createddate : work.ModifiedDate

                                   }).AsEnumerable().OrderByDescending(x => x.date).Select(PWHM => new PatientWorkHistoryModel
                                   {
                                       PatientWorkHistoryID = PWHM.PatientWorkHistoryID,
                                       VisitID = PWHM.VisitID,
                                       VisitNo = PWHM.VisitNo,
                                       FacilityId = PWHM.FacilityID > 0 ? PWHM.FacilityID.Value : 0,
                                       facilityName = PWHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PWHM.FacilityID).FacilityName : "",
                                       RecordedDate = PWHM.RecordedDate,
                                       RecordedBy = PWHM.RecordedBy,
                                       EmployerName = PWHM.EmployerName,
                                       ContactPerson = PWHM.ContactPerson,
                                       Email = PWHM.Email,
                                       CellPhone = PWHM.CellPhone,
                                       PhoneNo = PWHM.PhoneNo,
                                       AddressLine1 = PWHM.AddressLine1,
                                       AddressLine2 = PWHM.AddressLine2,
                                       Town = PWHM.Town,
                                       City = PWHM.City,
                                       District = PWHM.District,
                                       State = PWHM.State,
                                       Country = PWHM.Country,
                                       PIN = PWHM.PIN,
                                       WorkDateFrom = PWHM.WorkDateFrom,
                                       WorkDateTo = PWHM.WorkDateTo,
                                       AdditionalNotes = PWHM.AdditionalNotes,
                                       IsActive = PWHM.IsActive,
                                       recordedDuring = PWHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PWHM.RecordedDuringID).RecordedDuringDescription : "",
                                       RecordedTime = PWHM.RecordedDate.TimeOfDay.ToString(),
                                       PatientName = PWHM.PatientFirstName + " " + PWHM.PatientLastName,
                                       visitDateandTime = PWHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PWHM.VisitDate.TimeOfDay.ToString()

                                   }).ToList();

            List<PatientWorkHistoryModel> patientWorkCollection = new List<PatientWorkHistoryModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (patientWorkList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        patientWorkCollection = (from work in patientWorkList
                                                 join fac in facList on work.FacilityId equals fac.FacilityId
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on work.VisitID equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select work).ToList();
                    }
                    else
                    {
                        patientWorkCollection = (from work in patientWorkList
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on work.VisitID equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select work).ToList();
                    }
                }
                else
                {
                    patientWorkCollection = (from work in patientWorkList
                                             join fac in facList on work.FacilityId equals fac.FacilityId
                                             select work).ToList();
                }
            }
            else
            {
                patientWorkCollection = patientWorkList;
            }

            return patientWorkCollection;
        }

        ///// <summary>
        ///// Get Patient Work History record by ID
        ///// </summary>
        ///// <param>int PatientWorkHistoryID</param>
        ///// <returns>PatientWorkHistoryModel. if the record of Patient Work History Model for given patientWorkHistoryID = success. else = failure</returns>
        public PatientWorkHistoryModel GetPatientWorkRecordbyID(int patientWorkHistoryID)
        {
            var patientWorkRecord = (from work in this.uow.GenericRepository<PatientWorkHistory>().Table().Where(x => x.PatientWorkHistoryID == patientWorkHistoryID)

                                     join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on work.VisitID equals visit.VisitId

                                     select new
                                     {
                                         work.PatientWorkHistoryID,
                                         work.VisitID,
                                         work.RecordedDate,
                                         work.RecordedBy,
                                         work.EmployerName,
                                         work.ContactPerson,
                                         work.Email,
                                         work.CellPhone,
                                         work.PhoneNo,
                                         work.AddressLine1,
                                         work.AddressLine2,
                                         work.Town,
                                         work.City,
                                         work.District,
                                         work.State,
                                         work.Country,
                                         work.PIN,
                                         work.WorkDateFrom,
                                         work.WorkDateTo,
                                         work.AdditionalNotes,
                                         work.IsActive,
                                         visit.RecordedDuringID,
                                         visit.FacilityID,
                                         visit.VisitNo,
                                         visit.VisitDate,
                                         visit.Visittime

                                     }).AsEnumerable().Select(PWHM => new PatientWorkHistoryModel
                                     {
                                         PatientWorkHistoryID = PWHM.PatientWorkHistoryID,
                                         VisitID = PWHM.VisitID,
                                         VisitNo = PWHM.VisitNo,
                                         facilityName = PWHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PWHM.FacilityID).FacilityName : "",
                                         RecordedDate = PWHM.RecordedDate,
                                         RecordedBy = PWHM.RecordedBy,
                                         EmployerName = PWHM.EmployerName,
                                         ContactPerson = PWHM.ContactPerson,
                                         Email = PWHM.Email,
                                         CellPhone = PWHM.CellPhone,
                                         PhoneNo = PWHM.PhoneNo,
                                         AddressLine1 = PWHM.AddressLine1,
                                         AddressLine2 = PWHM.AddressLine2,
                                         Town = PWHM.Town,
                                         City = PWHM.City,
                                         District = PWHM.District,
                                         State = PWHM.State,
                                         Country = PWHM.Country,
                                         PIN = PWHM.PIN,
                                         WorkDateFrom = PWHM.WorkDateFrom,
                                         WorkDateTo = PWHM.WorkDateTo,
                                         AdditionalNotes = PWHM.AdditionalNotes,
                                         IsActive = PWHM.IsActive,
                                         recordedDuring = PWHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PWHM.RecordedDuringID).RecordedDuringDescription : "",
                                         RecordedTime = PWHM.RecordedDate.TimeOfDay.ToString(),
                                         visitDateandTime = PWHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PWHM.VisitDate.TimeOfDay.ToString()

                                     }).SingleOrDefault();

            return patientWorkRecord;
        }

        ///// <summary>
        ///// Delete Patient Work History record by ID
        ///// </summary>
        ///// <param>int patientWorkHistoryID</param>
        ///// <returns>PatientWorkHistory. if the record of Patient Work History for given patientWorkHistoryID is deleted = success. else = failure</returns>
        public PatientWorkHistory DeletePatientWorkRecord(int patientWorkHistoryID)
        {
            var patWork = this.uow.GenericRepository<PatientWorkHistory>().Table().Where(x => x.PatientWorkHistoryID == patientWorkHistoryID).SingleOrDefault();

            if (patWork != null)
            {
                patWork.IsActive = false;
                this.uow.GenericRepository<PatientWorkHistory>().Update(patWork);
                this.uow.Save();
            }

            return patWork;
        }

        #endregion

        #region Patient Immunization

        ///// <summary>
        ///// Add or Update Patient Immunization
        ///// </summary>
        ///// <param>PatientImmunizationModel workHistoryModel</param>
        ///// <returns>PatientImmunizationModel. if Patient Immunization Model with ID = success. else = failure</returns>
        public PatientImmunizationModel AddUpdatePatientImmunizationData(PatientImmunizationModel immunizationModel)
        {
            var immunization = this.uow.GenericRepository<PatientImmunization>().Table().Where(x => x.VisitID == immunizationModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (immunization == null)
            {
                immunization = new PatientImmunization();

                immunization.VisitID = immunizationModel.VisitID;
                immunization.RecordedDate = this.utilService.GetLocalTime(immunizationModel.RecordedDate);
                immunization.RecordedBy = immunizationModel.RecordedBy;
                immunization.ImmunizationDate = immunizationModel.ImmunizationDate != null ? this.utilService.GetLocalTime(immunizationModel.ImmunizationDate.Value) : immunizationModel.ImmunizationDate;
                immunization.InjectingPhysician = immunizationModel.InjectingPhysician;
                immunization.VaccineName = immunizationModel.VaccineName;
                immunization.ProductName = immunizationModel.ProductName;
                immunization.Manufacturer = immunizationModel.Manufacturer;
                immunization.BatchNo = immunizationModel.BatchNo;
                immunization.Route = immunizationModel.Route;
                immunization.BodySite = immunizationModel.BodySite;
                immunization.DoseUnits = immunizationModel.DoseUnits;
                immunization.FacilityName = immunizationModel.FacilityName;
                immunization.PatientAge = immunizationModel.PatientAge;
                immunization.Notes = immunizationModel.Notes;
                immunization.IsActive = true;
                immunization.Createddate = DateTime.Now;
                immunization.CreatedBy = immunizationModel.RecordedBy;

                this.uow.GenericRepository<PatientImmunization>().Insert(immunization);
            }
            else
            {
                immunization.RecordedDate = this.utilService.GetLocalTime(immunizationModel.RecordedDate);
                immunization.RecordedBy = immunizationModel.RecordedBy;
                immunization.ImmunizationDate = immunizationModel.ImmunizationDate != null ? this.utilService.GetLocalTime(immunizationModel.ImmunizationDate.Value) : immunizationModel.ImmunizationDate;
                immunization.InjectingPhysician = immunizationModel.InjectingPhysician;
                immunization.VaccineName = immunizationModel.VaccineName;
                immunization.ProductName = immunizationModel.ProductName;
                immunization.Manufacturer = immunizationModel.Manufacturer;
                immunization.BatchNo = immunizationModel.BatchNo;
                immunization.Route = immunizationModel.Route;
                immunization.BodySite = immunizationModel.BodySite;
                immunization.DoseUnits = immunizationModel.DoseUnits;
                immunization.FacilityName = immunizationModel.FacilityName;
                immunization.PatientAge = immunizationModel.PatientAge;
                immunization.Notes = immunizationModel.Notes;
                immunization.IsActive = true;
                immunization.Createddate = DateTime.Now;
                immunization.CreatedBy = immunizationModel.RecordedBy;

                this.uow.GenericRepository<PatientImmunization>().Update(immunization);
            }
            this.uow.Save();
            immunizationModel.ImmunizationID = immunization.ImmunizationID;

            return immunizationModel;
        }

        ///// <summary>
        ///// Get Patient Immunization List 
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientImmunizationModel>. if list of Patient Immunization Model for given Patient ID = success. else = failure</returns>
        public List<PatientImmunizationModel> GetPatientImmunizationList(int PatientId)
        {
            var immunizationList = (from immune in this.uow.GenericRepository<PatientImmunization>().Table().Where(x => x.IsActive != false)
                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on immune.VisitID equals visit.VisitId

                                    join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                   on visit.PatientId equals pat.PatientId

                                    select new
                                    {
                                        immune.ImmunizationID,
                                        immune.VisitID,
                                        immune.RecordedDate,
                                        immune.RecordedBy,
                                        immune.ImmunizationDate,
                                        immune.InjectingPhysician,
                                        immune.VaccineName,
                                        immune.ProductName,
                                        immune.Manufacturer,
                                        immune.BatchNo,
                                        immune.Route,
                                        immune.BodySite,
                                        immune.DoseUnits,
                                        immune.FacilityName,
                                        immune.PatientAge,
                                        immune.Notes,
                                        visit.RecordedDuringID,
                                        visit.FacilityID,
                                        visit.VisitNo,
                                        visit.VisitDate,
                                        visit.Visittime,
                                        pat.PatientFirstName,
                                        pat.PatientLastName,
                                        date = immune.ModifiedDate == null ? immune.Createddate : immune.ModifiedDate

                                    }).AsEnumerable().OrderByDescending(x => x.date).Select(PIM => new PatientImmunizationModel
                                    {
                                        ImmunizationID = PIM.ImmunizationID,
                                        VisitID = PIM.VisitID,
                                        VisitNo = PIM.VisitNo,
                                        FacilityId = PIM.FacilityID > 0 ? PIM.FacilityID.Value : 0,
                                        facilityName = PIM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PIM.FacilityID).FacilityName : "",
                                        RecordedDate = PIM.RecordedDate,
                                        RecordedBy = PIM.RecordedBy,
                                        ImmunizationDate = PIM.ImmunizationDate,
                                        ImmunizationTime = PIM.ImmunizationDate.Value.TimeOfDay.ToString(),
                                        InjectingPhysician = PIM.InjectingPhysician,
                                        VaccineName = PIM.VaccineName,
                                        ProductName = PIM.ProductName,
                                        Manufacturer = PIM.Manufacturer,
                                        BatchNo = PIM.BatchNo,
                                        Route = PIM.Route,
                                        BodySite = PIM.BodySite,
                                        DoseUnits = PIM.DoseUnits,
                                        FacilityName = PIM.FacilityName,
                                        PatientAge = PIM.PatientAge,
                                        Notes = PIM.Notes,
                                        recordedDuring = PIM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PIM.RecordedDuringID).RecordedDuringDescription : "",
                                        RecordedTime = PIM.RecordedDate.TimeOfDay.ToString(),
                                        PatientName = PIM.PatientFirstName + " " + PIM.PatientLastName,
                                        visitDateandTime = PIM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PIM.VisitDate.TimeOfDay.ToString()

                                    }).ToList();

            List<PatientImmunizationModel> patientImmuneCollection = new List<PatientImmunizationModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (immunizationList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        patientImmuneCollection = (from immune in immunizationList
                                                   join fac in facList on immune.FacilityId equals fac.FacilityId
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on immune.VisitID equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select immune).ToList();
                    }
                    else
                    {
                        patientImmuneCollection = (from immune in immunizationList
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on immune.VisitID equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select immune).ToList();
                    }
                }
                else
                {
                    patientImmuneCollection = (from immune in immunizationList
                                               join fac in facList on immune.FacilityId equals fac.FacilityId
                                               select immune).ToList();
                }
            }
            else
            {
                patientImmuneCollection = immunizationList;
            }
            return patientImmuneCollection;
        }

        ///// <summary>
        ///// Get Patient Immunization record by ID
        ///// </summary>
        ///// <param>int immunizationID</param>
        ///// <returns>PatientImmunizationModel. if the record of Patient Immunization Model for given immunizationID = success. else = failure</returns>
        public PatientImmunizationModel GetPatientImmunizationRecordbyID(int immunizationID)
        {
            var immunizationData = (from immune in this.uow.GenericRepository<PatientImmunization>().Table().Where(x => x.ImmunizationID == immunizationID)
                                    join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on immune.VisitID equals visit.VisitId
                                    select new
                                    {
                                        immune.ImmunizationID,
                                        immune.VisitID,
                                        immune.RecordedDate,
                                        immune.RecordedBy,
                                        immune.ImmunizationDate,
                                        immune.InjectingPhysician,
                                        immune.VaccineName,
                                        immune.ProductName,
                                        immune.Manufacturer,
                                        immune.BatchNo,
                                        immune.Route,
                                        immune.BodySite,
                                        immune.DoseUnits,
                                        immune.FacilityName,
                                        immune.PatientAge,
                                        immune.Notes,
                                        visit.RecordedDuringID,
                                        visit.FacilityID,
                                        visit.VisitNo,
                                        visit.VisitDate,
                                        visit.Visittime

                                    }).AsEnumerable().Select(PIM => new PatientImmunizationModel
                                    {
                                        ImmunizationID = PIM.ImmunizationID,
                                        VisitID = PIM.VisitID,
                                        VisitNo = PIM.VisitNo,
                                        facilityName = PIM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PIM.FacilityID).FacilityName : "",
                                        RecordedDate = PIM.RecordedDate,
                                        RecordedBy = PIM.RecordedBy,
                                        ImmunizationDate = PIM.ImmunizationDate,
                                        ImmunizationTime = PIM.ImmunizationDate.Value.TimeOfDay.ToString(),
                                        InjectingPhysician = PIM.InjectingPhysician,
                                        VaccineName = PIM.VaccineName,
                                        ProductName = PIM.ProductName,
                                        Manufacturer = PIM.Manufacturer,
                                        BatchNo = PIM.BatchNo,
                                        Route = PIM.Route,
                                        BodySite = PIM.BodySite,
                                        DoseUnits = PIM.DoseUnits,
                                        FacilityName = PIM.FacilityName,
                                        PatientAge = PIM.PatientAge,
                                        Notes = PIM.Notes,
                                        recordedDuring = PIM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PIM.RecordedDuringID).RecordedDuringDescription : "",
                                        RecordedTime = PIM.RecordedDate.TimeOfDay.ToString(),
                                        visitDateandTime = PIM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PIM.VisitDate.TimeOfDay.ToString()

                                    }).SingleOrDefault();

            return immunizationData;
        }

        ///// <summary>
        ///// Delete Patient Immunization record by ID
        ///// </summary>
        ///// <param>int immunizationID</param>
        ///// <returns>PatientImmunization. if the record of Patient Immunization for given immunizationID is deleted = success. else = failure</returns>
        public PatientImmunization DeletePatientImmunizationRecord(int immunizationID)
        {
            var patImmunization = this.uow.GenericRepository<PatientImmunization>().Table().Where(x => x.ImmunizationID == immunizationID).SingleOrDefault();

            if (patImmunization != null)
            {
                patImmunization.IsActive = false;
                this.uow.GenericRepository<PatientImmunization>().Update(patImmunization);
                this.uow.Save();
            }

            return patImmunization;
        }

        #endregion

        #region Document Management

        ///// <summary>
        ///// Add or Update Document Management record
        ///// </summary>
        ///// <param>DocumentManagementModel documentModel</param>
        ///// <returns>DocumentManagementModel. if Document Management Model with ID = success. else = failure</returns>
        public DocumentManagementModel AddUpdateDocumentData(DocumentManagementModel documentModel)
        {
            var documentRecord = this.uow.GenericRepository<DocumentManagement>().Table().Where(x => x.VisitID == documentModel.VisitID).FirstOrDefault();

            if (documentRecord == null)
            {
                documentRecord = new DocumentManagement();

                documentRecord.VisitID = documentModel.VisitID;
                documentRecord.RecordedDate = this.utilService.GetLocalTime(documentModel.RecordedDate);
                documentRecord.RecordedBy = documentModel.RecordedBy;
                documentRecord.DocumentName = documentModel.DocumentName;
                documentRecord.DocumentType = documentModel.DocumentType;
                documentRecord.DocumentNotes = documentModel.DocumentNotes;
                documentRecord.IsActive = true;
                documentRecord.Createddate = DateTime.Now;
                documentRecord.CreatedBy = documentModel.RecordedBy;

                this.uow.GenericRepository<DocumentManagement>().Insert(documentRecord);
            }
            else
            {
                documentRecord.RecordedDate = this.utilService.GetLocalTime(documentModel.RecordedDate);
                documentRecord.RecordedBy = documentModel.RecordedBy;
                documentRecord.DocumentName = documentModel.DocumentName;
                documentRecord.DocumentType = documentModel.DocumentType;
                documentRecord.DocumentNotes = documentModel.DocumentNotes;
                documentRecord.IsActive = true;
                documentRecord.ModifiedDate = DateTime.Now;
                documentRecord.ModifiedBy = documentModel.RecordedBy;

                this.uow.GenericRepository<DocumentManagement>().Update(documentRecord);
            }
            this.uow.Save();
            documentModel.DocumentID = documentRecord.DocumentID;

            return documentModel;
        }

        ///// <summary>
        ///// Get Document Management List 
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<DocumentManagementModel>. if list of Document Management Model for given Patient ID = success. else = failure</returns>
        public List<DocumentManagementModel> GetDocumentManagementList(int PatientId)
        {
            var DocumentRecordList = (from doc in this.uow.GenericRepository<DocumentManagement>().Table().Where(x => x.IsActive != false)

                                      join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on doc.VisitID equals visit.VisitId

                                      join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                     on visit.PatientId equals pat.PatientId

                                      select new
                                      {
                                          doc.DocumentID,
                                          doc.VisitID,
                                          doc.RecordedDate,
                                          doc.RecordedBy,
                                          doc.DocumentName,
                                          doc.DocumentType,
                                          doc.DocumentNotes,
                                          visit.RecordedDuringID,
                                          visit.FacilityID,
                                          visit.VisitNo,
                                          visit.VisitDate,
                                          visit.Visittime,
                                          pat.PatientFirstName,
                                          pat.PatientLastName,
                                          date = doc.ModifiedDate == null ? doc.Createddate : doc.ModifiedDate

                                      }).AsEnumerable().OrderByDescending(x => x.date).Select(DMM => new DocumentManagementModel
                                      {
                                          DocumentID = DMM.DocumentID,
                                          VisitID = DMM.VisitID,
                                          VisitNo = DMM.VisitNo,
                                          FacilityId = DMM.FacilityID > 0 ? DMM.FacilityID.Value : 0,
                                          facilityName = DMM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DMM.FacilityID).FacilityName : "",
                                          RecordedDate = DMM.RecordedDate,
                                          RecordedBy = DMM.RecordedBy,
                                          DocumentName = DMM.DocumentName,
                                          DocumentType = DMM.DocumentType,
                                          DocumentNotes = DMM.DocumentNotes,
                                          recordedDuring = DMM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == DMM.RecordedDuringID).RecordedDuringDescription : "",
                                          RecordedTime = DMM.RecordedDate.TimeOfDay.ToString(),
                                          PatientName = DMM.PatientFirstName + " " + DMM.PatientLastName,
                                          visitDateandTime = DMM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + DMM.VisitDate.TimeOfDay.ToString()

                                      }).ToList();

            List<DocumentManagementModel> documentCollection = new List<DocumentManagementModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (DocumentRecordList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        documentCollection = (from doc in DocumentRecordList
                                              join fac in facList on doc.FacilityId equals fac.FacilityId
                                              join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                              on doc.VisitID equals vis.VisitId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on vis.ProviderID equals prov.ProviderID
                                              select doc).ToList();
                    }
                    else
                    {
                        documentCollection = (from doc in DocumentRecordList
                                              join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                              on doc.VisitID equals vis.VisitId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on vis.ProviderID equals prov.ProviderID
                                              select doc).ToList();
                    }
                }
                else
                {
                    documentCollection = (from doc in DocumentRecordList
                                          join fac in facList on doc.FacilityId equals fac.FacilityId
                                          select doc).ToList();
                }
            }
            else
            {
                documentCollection = DocumentRecordList;
            }

            return documentCollection;
        }

        ///// <summary>
        ///// Get Document Management record by ID
        ///// </summary>
        ///// <param>int documentID</param>
        ///// <returns>DocumentManagementModel. if the record of Document Management Model for given documentID = success. else = failure</returns>
        public DocumentManagementModel GetDocumentRecordbyID(int documentID)
        {
            var DocumentRecord = (from doc in this.uow.GenericRepository<DocumentManagement>().Table().Where(x => x.DocumentID == documentID)

                                  join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                on doc.VisitID equals visit.VisitId

                                  select new
                                  {
                                      doc.DocumentID,
                                      doc.VisitID,
                                      doc.RecordedDate,
                                      doc.RecordedBy,
                                      doc.DocumentName,
                                      doc.DocumentType,
                                      doc.DocumentNotes,
                                      visit.RecordedDuringID,
                                      visit.FacilityID,
                                      visit.VisitNo,
                                      visit.VisitDate,
                                      visit.Visittime

                                  }).AsEnumerable().Select(DMM => new DocumentManagementModel
                                  {
                                      DocumentID = DMM.DocumentID,
                                      VisitID = DMM.VisitID,
                                      VisitNo = DMM.VisitNo,
                                      facilityName = DMM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DMM.FacilityID).FacilityName : "",
                                      RecordedDate = DMM.RecordedDate,
                                      RecordedBy = DMM.RecordedBy,
                                      DocumentName = DMM.DocumentName,
                                      DocumentType = DMM.DocumentType,
                                      DocumentNotes = DMM.DocumentNotes,
                                      recordedDuring = DMM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == DMM.RecordedDuringID).RecordedDuringDescription : "",
                                      RecordedTime = DMM.RecordedDate.TimeOfDay.ToString(),
                                      visitDateandTime = DMM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + DMM.VisitDate.TimeOfDay.ToString()

                                  }).SingleOrDefault();

            return DocumentRecord;
        }

        ///// <summary>
        ///// Delete Document Management record by ID
        ///// </summary>
        ///// <param>int documentID</param>
        ///// <returns>DocumentManagement. if the record of Document Management for given documentID is deleted = success. else = failure</returns>
        public DocumentManagement DeleteDocumentRecord(int documentID)
        {
            var docData = this.uow.GenericRepository<DocumentManagement>().Table().Where(x => x.DocumentID == documentID).SingleOrDefault();

            if (docData != null)
            {
                docData.IsActive = false;
                this.uow.GenericRepository<DocumentManagement>().Update(docData);
                this.uow.Save();
            }

            return docData;
        }

        #endregion

        #region Patient Insurance

        ///// <summary>
        ///// Add or Update Patient Insurance record
        ///// </summary>
        ///// <param>PatientInsuranceModel insuranceModel</param>
        ///// <returns>PatientInsuranceModel. if Patient Insurance Model with ID = success. else = failure</returns>
        public PatientInsuranceModel AddUpdatePatientInsuranceData(PatientInsuranceModel insuranceModel)
        {
            var insurance = this.uow.GenericRepository<PatientInsurance>().Table().Where(x => x.VisitID == insuranceModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (insurance == null)
            {
                insurance = new PatientInsurance();

                insurance.VisitID = insuranceModel.VisitID;
                insurance.RecordedDate = this.utilService.GetLocalTime(insuranceModel.RecordedDate);
                insurance.RecordedBy = insuranceModel.RecordedBy;
                insurance.InsuranceType = insuranceModel.InsuranceType;
                insurance.InsuranceCategory = insuranceModel.InsuranceCategory;
                insurance.InsuranceCompany = insuranceModel.InsuranceCompany;
                insurance.Proposer = insuranceModel.Proposer;
                insurance.RelationshipToPatient = insuranceModel.RelationshipToPatient;
                insurance.PolicyNo = insuranceModel.PolicyNo;
                insurance.GroupPolicyNo = insuranceModel.GroupPolicyNo;
                insurance.CardNo = insuranceModel.CardNo;
                insurance.ValidFrom = this.utilService.GetLocalTime(insuranceModel.ValidFrom);
                insurance.ValidTo = this.utilService.GetLocalTime(insuranceModel.ValidTo);
                insurance.AdditionalInfo = insuranceModel.AdditionalInfo;
                insurance.IsActive = true;
                insurance.Createddate = DateTime.Now;
                insurance.CreatedBy = insuranceModel.RecordedBy;

                this.uow.GenericRepository<PatientInsurance>().Insert(insurance);
            }
            else
            {
                insurance.RecordedDate = this.utilService.GetLocalTime(insuranceModel.RecordedDate);
                insurance.RecordedBy = insuranceModel.RecordedBy;
                insurance.InsuranceType = insuranceModel.InsuranceType;
                insurance.InsuranceCategory = insuranceModel.InsuranceCategory;
                insurance.InsuranceCompany = insuranceModel.InsuranceCompany;
                insurance.Proposer = insuranceModel.Proposer;
                insurance.RelationshipToPatient = insuranceModel.RelationshipToPatient;
                insurance.PolicyNo = insuranceModel.PolicyNo;
                insurance.GroupPolicyNo = insuranceModel.GroupPolicyNo;
                insurance.CardNo = insuranceModel.CardNo;
                insurance.ValidFrom = this.utilService.GetLocalTime(insuranceModel.ValidFrom);
                insurance.ValidTo = this.utilService.GetLocalTime(insuranceModel.ValidTo);
                insurance.AdditionalInfo = insuranceModel.AdditionalInfo;
                insurance.IsActive = true;
                insurance.ModifiedDate = DateTime.Now;
                insurance.ModifiedBy = insuranceModel.RecordedBy;

                this.uow.GenericRepository<PatientInsurance>().Update(insurance);
            }
            this.uow.Save();
            insuranceModel.InsuranceID = insurance.InsuranceID;

            return insuranceModel;
        }

        ///// <summary>
        ///// Get Patient Insurance List 
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientInsuranceModel>. if list of Patient Insurance Model for given Patient ID = success. else = failure</returns>
        public List<PatientInsuranceModel> GetPatientInsuranceList(int PatientId)
        {
            var insuranceList = (from insure in this.uow.GenericRepository<PatientInsurance>().Table().Where(x => x.IsActive != false)

                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on insure.VisitID equals visit.VisitId

                                 join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                on visit.PatientId equals pat.PatientId

                                 select new
                                 {
                                     insure.InsuranceID,
                                     insure.VisitID,
                                     insure.RecordedDate,
                                     insure.RecordedBy,
                                     insure.InsuranceType,
                                     insure.InsuranceCategory,
                                     insure.InsuranceCompany,
                                     insure.Proposer,
                                     insure.RelationshipToPatient,
                                     insure.PolicyNo,
                                     insure.GroupPolicyNo,
                                     insure.CardNo,
                                     insure.ValidFrom,
                                     insure.ValidTo,
                                     insure.AdditionalInfo,
                                     visit.RecordedDuringID,
                                     visit.VisitNo,
                                     visit.FacilityID,
                                     visit.VisitDate,
                                     visit.Visittime,
                                     pat.PatientFirstName,
                                     pat.PatientLastName,
                                     date = insure.ModifiedDate == null ? insure.Createddate : insure.ModifiedDate

                                 }).AsEnumerable().OrderByDescending(x => x.date).Select(PIM => new PatientInsuranceModel
                                 {
                                     InsuranceID = PIM.InsuranceID,
                                     VisitID = PIM.VisitID,
                                     VisitNo = PIM.VisitNo,
                                     FacilityId = PIM.FacilityID > 0 ? PIM.FacilityID.Value : 0,
                                     facilityName = PIM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PIM.FacilityID).FacilityName : "",
                                     RecordedDate = PIM.RecordedDate,
                                     RecordedBy = PIM.RecordedBy,
                                     InsuranceType = PIM.InsuranceType,
                                     InsuranceCategory = PIM.InsuranceCategory,
                                     InsuranceCompany = PIM.InsuranceCompany,
                                     Proposer = PIM.Proposer,
                                     RelationshipToPatient = PIM.RelationshipToPatient,
                                     PolicyNo = PIM.PolicyNo,
                                     GroupPolicyNo = PIM.GroupPolicyNo,
                                     CardNo = PIM.CardNo,
                                     ValidFrom = PIM.ValidFrom,
                                     ValidTo = PIM.ValidTo,
                                     AdditionalInfo = PIM.AdditionalInfo,
                                     recordedDuring = PIM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PIM.RecordedDuringID).RecordedDuringDescription : "",
                                     RecordedTime = PIM.RecordedDate.TimeOfDay.ToString(),
                                     PatientName = PIM.PatientFirstName + " " + PIM.PatientLastName,
                                     visitDateandTime = PIM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PIM.VisitDate.TimeOfDay.ToString(),
                                     filePath = this.GetFile(PIM.InsuranceID.ToString(), "Patient/Insurance")

                                 }).ToList();

            List<PatientInsuranceModel> insuranceCollection = new List<PatientInsuranceModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (insuranceList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        insuranceCollection = (from ins in insuranceList
                                               join fac in facList on ins.FacilityId equals fac.FacilityId
                                               join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                               on ins.VisitID equals vis.VisitId
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on vis.ProviderID equals prov.ProviderID
                                               select ins).ToList();
                    }
                    else
                    {
                        insuranceCollection = (from ins in insuranceList
                                               join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                               on ins.VisitID equals vis.VisitId
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on vis.ProviderID equals prov.ProviderID
                                               select ins).ToList();
                    }
                }
                else
                {
                    insuranceCollection = (from ins in insuranceList
                                           join fac in facList on ins.FacilityId equals fac.FacilityId
                                           select ins).ToList();
                }
            }
            else
            {
                insuranceCollection = insuranceList;
            }

            return insuranceCollection;
        }

        ///// <summary>
        ///// Get Patient Insurance record by ID
        ///// </summary>
        ///// <param>int insuranceID</param>
        ///// <returns>PatientInsuranceModel. if the record of Patient Insurance Model for given insuranceID = success. else = failure</returns>
        public PatientInsuranceModel GetPatientInsuranceRecordbyID(int insuranceID)
        {
            var insuranceRecord = (from insure in this.uow.GenericRepository<PatientInsurance>().Table().Where(x => x.InsuranceID == insuranceID)

                                   join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                      on insure.VisitID equals visit.VisitId

                                   select new
                                   {
                                       insure.InsuranceID,
                                       insure.VisitID,
                                       insure.RecordedDate,
                                       insure.RecordedBy,
                                       insure.InsuranceType,
                                       insure.InsuranceCategory,
                                       insure.InsuranceCompany,
                                       insure.Proposer,
                                       insure.RelationshipToPatient,
                                       insure.PolicyNo,
                                       insure.GroupPolicyNo,
                                       insure.CardNo,
                                       insure.ValidFrom,
                                       insure.ValidTo,
                                       insure.AdditionalInfo,
                                       visit.RecordedDuringID,
                                       visit.FacilityID,
                                       visit.VisitNo,
                                       visit.VisitDate,
                                       visit.Visittime

                                   }).AsEnumerable().Select(PIM => new PatientInsuranceModel
                                   {
                                       InsuranceID = PIM.InsuranceID,
                                       VisitID = PIM.VisitID,
                                       VisitNo = PIM.VisitNo,
                                       facilityName = PIM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PIM.FacilityID).FacilityName : "",
                                       RecordedDate = PIM.RecordedDate,
                                       RecordedBy = PIM.RecordedBy,
                                       InsuranceType = PIM.InsuranceType,
                                       InsuranceCategory = PIM.InsuranceCategory,
                                       InsuranceCompany = PIM.InsuranceCompany,
                                       Proposer = PIM.Proposer,
                                       RelationshipToPatient = PIM.RelationshipToPatient,
                                       PolicyNo = PIM.PolicyNo,
                                       GroupPolicyNo = PIM.GroupPolicyNo,
                                       CardNo = PIM.CardNo,
                                       ValidFrom = PIM.ValidFrom,
                                       ValidTo = PIM.ValidTo,
                                       AdditionalInfo = PIM.AdditionalInfo,
                                       recordedDuring = PIM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PIM.RecordedDuringID).RecordedDuringDescription : "",
                                       RecordedTime = PIM.RecordedDate.TimeOfDay.ToString(),
                                       visitDateandTime = PIM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PIM.VisitDate.TimeOfDay.ToString(),
                                       filePath = this.GetFile(PIM.InsuranceID.ToString(), "Patient/Insurance")

                                   }).SingleOrDefault();

            return insuranceRecord;
        }

        ///// <summary>
        ///// Delete Patient Insurance record by ID
        ///// </summary>
        ///// <param>int insuranceID</param>
        ///// <returns>PatientInsurance. if the record of Patient Insurance for given insuranceID is deleted = success. else = failure</returns>
        public PatientInsurance DeleteInsuranceRecord(int insuranceID)
        {
            var patInsurance = this.uow.GenericRepository<PatientInsurance>().Table().Where(x => x.InsuranceID == insuranceID).SingleOrDefault();

            if (patInsurance != null)
            {
                patInsurance.IsActive = false;
                this.uow.GenericRepository<PatientInsurance>().Update(patInsurance);
                this.uow.Save();
            }

            return patInsurance;
        }

        #endregion

        #region Radiology

        ///// <summary>
        ///// Add or Update Radiology record
        ///// </summary>
        ///// <param>RadiologyOrderModel radiologyOrderModel</param>
        ///// <returns>RadiologyOrderModel. if Radiology Order Model with ID = success. else = failure</returns>
        public RadiologyOrderModel AddUpdateRadiologyRecord(RadiologyOrderModel radiologyOrderModel)
        {
            var radiology = this.uow.GenericRepository<RadiologyOrder>().Table().Where(x => x.VisitID == radiologyOrderModel.VisitID & x.IsActive != false).FirstOrDefault();

            if (radiology == null)
            {
                radiology = new RadiologyOrder();

                radiology.VisitID = radiologyOrderModel.VisitID;
                radiology.RecordedDate = this.utilService.GetLocalTime(radiologyOrderModel.RecordedDate);
                radiology.RecordedBy = radiologyOrderModel.RecordedBy;
                radiology.OrderingPhysician = radiologyOrderModel.OrderingPhysician;
                radiology.NarrativeDiagnosis = radiologyOrderModel.NarrativeDiagnosis;
                radiology.PrimaryICD = radiologyOrderModel.PrimaryICD;
                radiology.RadiologyProcedure = radiologyOrderModel.RadiologyProcedure;
                radiology.Type = radiologyOrderModel.Type;
                radiology.Section = radiologyOrderModel.Section;
                radiology.ContrastNotes = radiologyOrderModel.ContrastNotes;
                radiology.PrimaryCPT = radiologyOrderModel.PrimaryCPT;
                radiology.ProcedureRequestedDate = radiologyOrderModel.ProcedureRequestedDate != null ? this.utilService.GetLocalTime(radiologyOrderModel.ProcedureRequestedDate.Value) : radiologyOrderModel.ProcedureRequestedDate;
                radiology.InstructionsToPatient = radiologyOrderModel.InstructionsToPatient;
                radiology.ProcedureStatus = radiologyOrderModel.ProcedureStatus;
                radiology.ReferredLab = radiologyOrderModel.ReferredLab;
                radiology.ReferredLabValue = radiologyOrderModel.ReferredLabValue;
                radiology.ReportFormat = radiologyOrderModel.ReportFormat;
                radiology.AdditionalInfo = radiologyOrderModel.AdditionalInfo;
                radiology.IsActive = true;
                radiology.Createddate = DateTime.Now;
                radiology.CreatedBy = radiologyOrderModel.RecordedBy;

                this.uow.GenericRepository<RadiologyOrder>().Insert(radiology);
            }
            else
            {
                radiology.RecordedDate = this.utilService.GetLocalTime(radiologyOrderModel.RecordedDate);
                radiology.RecordedBy = radiologyOrderModel.RecordedBy;
                radiology.OrderingPhysician = radiologyOrderModel.OrderingPhysician;
                radiology.NarrativeDiagnosis = radiologyOrderModel.NarrativeDiagnosis;
                radiology.PrimaryICD = radiologyOrderModel.PrimaryICD;
                radiology.RadiologyProcedure = radiologyOrderModel.RadiologyProcedure;
                radiology.Type = radiologyOrderModel.Type;
                radiology.Section = radiologyOrderModel.Section;
                radiology.ContrastNotes = radiologyOrderModel.ContrastNotes;
                radiology.PrimaryCPT = radiologyOrderModel.PrimaryCPT;
                radiology.ProcedureRequestedDate = radiologyOrderModel.ProcedureRequestedDate != null ? this.utilService.GetLocalTime(radiologyOrderModel.ProcedureRequestedDate.Value) : radiologyOrderModel.ProcedureRequestedDate;
                radiology.InstructionsToPatient = radiologyOrderModel.InstructionsToPatient;
                radiology.ProcedureStatus = radiologyOrderModel.ProcedureStatus;
                radiology.ReferredLab = radiologyOrderModel.ReferredLab;
                radiology.ReferredLabValue = radiologyOrderModel.ReferredLabValue;
                radiology.ReportFormat = radiologyOrderModel.ReportFormat;
                radiology.AdditionalInfo = radiologyOrderModel.AdditionalInfo;
                radiology.IsActive = true;
                radiology.ModifiedDate = DateTime.Now;
                radiology.ModifiedBy = radiologyOrderModel.RecordedBy;

                this.uow.GenericRepository<RadiologyOrder>().Update(radiology);
            }
            this.uow.Save();
            radiologyOrderModel.RadiologyID = radiology.RadiologyID;

            return radiologyOrderModel;
        }

        ///// <summary>
        ///// Get Radiology Record List 
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<RadiologyOrderModel>. if list of Radiology Order Model for given Patient ID = success. else = failure</returns>
        public List<RadiologyOrderModel> GetRadiologyRecordsforPatient(int PatientId)
        {
            var RadiologyOrders = (from radio in this.uow.GenericRepository<RadiologyOrder>().Table().Where(x => x.IsActive != false)
                                   join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on radio.VisitID equals visit.VisitId

                                   join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                  on visit.PatientId equals pat.PatientId

                                   select new
                                   {
                                       radio.RadiologyID,
                                       radio.VisitID,
                                       radio.RecordedDate,
                                       radio.RecordedBy,
                                       radio.OrderingPhysician,
                                       radio.NarrativeDiagnosis,
                                       radio.PrimaryICD,
                                       radio.RadiologyProcedure,
                                       radio.Type,
                                       radio.Section,
                                       radio.ContrastNotes,
                                       radio.PrimaryCPT,
                                       radio.ProcedureRequestedDate,
                                       radio.InstructionsToPatient,
                                       radio.ProcedureStatus,
                                       radio.ReferredLab,
                                       radio.ReferredLabValue,
                                       radio.ReportFormat,
                                       radio.AdditionalInfo,
                                       visit.RecordedDuringID,
                                       visit.FacilityID,
                                       visit.VisitNo,
                                       visit.VisitDate,
                                       visit.Visittime,
                                       pat.PatientFirstName,
                                       pat.PatientLastName,
                                       date = radio.ModifiedDate == null ? radio.Createddate : radio.ModifiedDate

                                   }).AsEnumerable().OrderByDescending(x => x.date).Select(ROM => new RadiologyOrderModel
                                   {
                                       RadiologyID = ROM.RadiologyID,
                                       VisitID = ROM.VisitID,
                                       VisitNo = ROM.VisitNo,
                                       FacilityId = ROM.FacilityID > 0 ? ROM.FacilityID.Value : 0,
                                       facilityName = ROM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == ROM.FacilityID).FacilityName : "",
                                       RecordedDate = ROM.RecordedDate,
                                       RecordedBy = ROM.RecordedBy,
                                       OrderingPhysician = ROM.OrderingPhysician,
                                       NarrativeDiagnosis = ROM.NarrativeDiagnosis,
                                       PrimaryICD = ROM.PrimaryICD,
                                       RadiologyProcedure = ROM.RadiologyProcedure,
                                       Type = ROM.Type,
                                       Section = ROM.Section,
                                       ContrastNotes = ROM.ContrastNotes,
                                       PrimaryCPT = ROM.PrimaryCPT,
                                       ProcedureRequestedDate = ROM.ProcedureRequestedDate,
                                       ProcedureReqTime = ROM.ProcedureRequestedDate!= null ? ROM.ProcedureRequestedDate.Value.ToString("hh:mm tt") : "",
                                       InstructionsToPatient = ROM.InstructionsToPatient,
                                       ProcedureStatus = ROM.ProcedureStatus,
                                       ReferredLab = ROM.ReferredLab,
                                       ReferredLabValue = ROM.ReferredLabValue,
                                       ReportFormat = ROM.ReportFormat,
                                       AdditionalInfo = ROM.AdditionalInfo,
                                       recordedDuring = ROM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == ROM.RecordedDuringID).RecordedDuringDescription : "",
                                       RecordedTime = ROM.RecordedDate.TimeOfDay.ToString(),
                                       PatientName = ROM.PatientFirstName + " " + ROM.PatientLastName,
                                       visitDateandTime = ROM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + ROM.VisitDate.TimeOfDay.ToString()

                                   }).ToList();

            List<RadiologyOrderModel> radiologyCollection = new List<RadiologyOrderModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (RadiologyOrders.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        radiologyCollection = (from rad in RadiologyOrders
                                               join fac in facList on rad.FacilityId equals fac.FacilityId
                                               join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                               on rad.VisitID equals vis.VisitId
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on vis.ProviderID equals prov.ProviderID
                                               select rad).ToList();
                    }
                    else
                    {
                        radiologyCollection = (from rad in RadiologyOrders
                                               join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                               on rad.VisitID equals vis.VisitId
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on vis.ProviderID equals prov.ProviderID
                                               select rad).ToList();
                    }
                }
                else
                {
                    radiologyCollection = (from rad in RadiologyOrders
                                           join fac in facList on rad.FacilityId equals fac.FacilityId
                                           select rad).ToList();
                }
            }
            else
            {
                radiologyCollection = RadiologyOrders;
            }

            return radiologyCollection;
        }

        ///// <summary>
        ///// Get Radiology Order record by ID
        ///// </summary>
        ///// <param>int radiologyID</param>
        ///// <returns>RadiologyOrderModel. if the record of Radiology Order Model for given radiologyID = success. else = failure</returns>
        public RadiologyOrderModel GetRadiologyRecordbyID(int radiologyID)
        {
            var RadiologyRecord = (from radio in this.uow.GenericRepository<RadiologyOrder>().Table().Where(x => x.RadiologyID == radiologyID)
                                   join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on radio.VisitID equals visit.VisitId

                                   select new
                                   {
                                       radio.RadiologyID,
                                       radio.VisitID,
                                       radio.RecordedDate,
                                       radio.RecordedBy,
                                       radio.OrderingPhysician,
                                       radio.NarrativeDiagnosis,
                                       radio.PrimaryICD,
                                       radio.RadiologyProcedure,
                                       radio.Type,
                                       radio.Section,
                                       radio.ContrastNotes,
                                       radio.PrimaryCPT,
                                       radio.ProcedureRequestedDate,
                                       radio.InstructionsToPatient,
                                       radio.ProcedureStatus,
                                       radio.ReferredLab,
                                       radio.ReferredLabValue,
                                       radio.ReportFormat,
                                       radio.AdditionalInfo,
                                       visit.RecordedDuringID,
                                       visit.FacilityID,
                                       visit.VisitNo,
                                       visit.VisitDate,
                                       visit.Visittime

                                   }).AsEnumerable().Select(ROM => new RadiologyOrderModel
                                   {
                                       RadiologyID = ROM.RadiologyID,
                                       VisitID = ROM.VisitID,
                                       VisitNo = ROM.VisitNo,
                                       facilityName = ROM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == ROM.FacilityID).FacilityName : "",
                                       RecordedDate = ROM.RecordedDate,
                                       RecordedBy = ROM.RecordedBy,
                                       OrderingPhysician = ROM.OrderingPhysician,
                                       NarrativeDiagnosis = ROM.NarrativeDiagnosis,
                                       PrimaryICD = ROM.PrimaryICD,
                                       RadiologyProcedure = ROM.RadiologyProcedure,
                                       Type = ROM.Type,
                                       Section = ROM.Section,
                                       ContrastNotes = ROM.ContrastNotes,
                                       PrimaryCPT = ROM.PrimaryCPT,
                                       ProcedureRequestedDate = ROM.ProcedureRequestedDate,
                                       ProcedureReqTime = ROM.ProcedureRequestedDate != null ? ROM.ProcedureRequestedDate.Value.ToString("hh:mm tt") : "",
                                       InstructionsToPatient = ROM.InstructionsToPatient,
                                       ProcedureStatus = ROM.ProcedureStatus,
                                       ReferredLab = ROM.ReferredLab,
                                       ReferredLabValue = ROM.ReferredLabValue,
                                       ReportFormat = ROM.ReportFormat,
                                       AdditionalInfo = ROM.AdditionalInfo,
                                       recordedDuring = ROM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == ROM.RecordedDuringID).RecordedDuringDescription : "",
                                       RecordedTime = ROM.RecordedDate.TimeOfDay.ToString(),
                                       visitDateandTime = ROM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + ROM.VisitDate.TimeOfDay.ToString()

                                   }).SingleOrDefault();

            return RadiologyRecord;
        }

        ///// <summary>
        ///// Delete Radiology Order record by ID
        ///// </summary>
        ///// <param>int radiologyID</param>
        ///// <returns>RadiologyOrder. if the record of Radiology Order for given radiologyID is deleted = success. else = failure</returns>
        public RadiologyOrder DeleteRadiologyRecord(int radiologyID)
        {
            var radio = this.uow.GenericRepository<RadiologyOrder>().Table().Where(x => x.RadiologyID == radiologyID).SingleOrDefault();

            if (radio != null)
            {
                radio.IsActive = false;
                this.uow.GenericRepository<RadiologyOrder>().Update(radio);
                this.uow.Save();
            }

            return radio;
        }

        #endregion

        #region Vitals-Patient Screen

        ///// <summary>
        ///// Get Patient Vitals List 
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientVitalsModel>. if list of Patient Vitals List for given Patient ID = success. else = failure</returns>
        public List<PatientVitalsModel> GetVitalsForPatient(int PatientId)
        {
            List<PatientVitalsModel> vitalsCollection = new List<PatientVitalsModel>();

            var vitalsList = (from vitals in this.uow.GenericRepository<PatientVitals>().Table().Where(x => x.PatientId == PatientId & x.IsActive != false)
                              join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                              on vitals.PatientId equals pat.PatientId

                              join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on vitals.VisitId equals visit.VisitId

                              select new
                              {
                                  vitals.VitalsId,
                                  vitals.PatientId,
                                  vitals.VisitId,
                                  vitals.RecordedDate,
                                  vitals.RecordedBy,
                                  vitals.Height,
                                  vitals.Weight,
                                  vitals.BMI,
                                  vitals.WaistCircumference,
                                  vitals.BPSystolic,
                                  vitals.BPDiastolic,
                                  vitals.BPLocationID,
                                  vitals.Temperature,
                                  vitals.TemperatureLocation,
                                  vitals.HeartRate,
                                  vitals.RespiratoryRate,
                                  vitals.O2Saturation,
                                  vitals.BloodsugarRandom,
                                  vitals.BloodsugarFasting,
                                  vitals.BloodSugarPostpardinal,
                                  vitals.PainArea,
                                  vitals.PainScale,
                                  vitals.HeadCircumference,
                                  vitals.LastMealdetails,
                                  vitals.LastMealtakenon,
                                  vitals.PatientPosition,
                                  vitals.IsBloodPressure,
                                  vitals.IsDiabetic,
                                  vitals.Notes,
                                  visit.RecordedDuringID,
                                  visit.FacilityID,
                                  visit.VisitNo,
                                  visit.VisitDate,
                                  date = vitals.ModifiedDate == null ? vitals.CreatedDate : vitals.ModifiedDate

                              }).AsEnumerable().OrderByDescending(x => x.date).Select(PVM => new PatientVitalsModel
                              {
                                  VitalsId = PVM.VitalsId,
                                  PatientId = PVM.PatientId,
                                  VisitId = PVM.VisitId,
                                  VisitNo = PVM.VisitNo,
                                  FacilityId = PVM.FacilityID > 0 ? PVM.FacilityID.Value : 0,
                                  facilityName = PVM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PVM.FacilityID).FacilityName : "",
                                  RecordedDate = PVM.RecordedDate,
                                  RecordedBy = PVM.RecordedBy,
                                  Height = PVM.Height,
                                  Weight = PVM.Weight,
                                  BMI = PVM.BMI,
                                  WaistCircumference = PVM.WaistCircumference,
                                  BPSystolic = PVM.BPSystolic,
                                  BPDiastolic = PVM.BPDiastolic,
                                  BPLocationID = PVM.BPLocationID,
                                  BPLocation = this.uow.GenericRepository<BPLocation>().Table().FirstOrDefault(x => x.BPLocationId == PVM.BPLocationID).BPLocationDescription,
                                  Temperature = PVM.Temperature,
                                  TemperatureLocation = PVM.TemperatureLocation,
                                  HeartRate = PVM.HeartRate,
                                  RespiratoryRate = PVM.RespiratoryRate,
                                  O2Saturation = PVM.O2Saturation,
                                  BloodsugarRandom = PVM.BloodsugarRandom,
                                  BloodsugarFasting = PVM.BloodsugarFasting,
                                  BloodSugarPostpardinal = PVM.BloodSugarPostpardinal,
                                  PainArea = PVM.PainArea,
                                  PainScale = PVM.PainScale,
                                  PainScaleDesc = (PVM.PainScale != null && PVM.PainScale > 0) ? this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == PVM.PainScale).PainScaleDesc : "",
                                  HeadCircumference = PVM.HeadCircumference,
                                  LastMealdetails = PVM.LastMealdetails,
                                  LastMealtakenon = PVM.LastMealtakenon,
                                  PatientPosition = PVM.PatientPosition,
                                  IsBloodPressure = PVM.IsBloodPressure,
                                  BloodPressure = PVM.IsBloodPressure == "Y" ? "Yes" : (PVM.IsBloodPressure == "N" ? "No" : "Unknown"),
                                  IsDiabetic = PVM.IsDiabetic,
                                  Diabetic = PVM.IsDiabetic == "Y" ? "Yes" : (PVM.IsDiabetic == "N" ? "No" : "Unknown"),
                                  Notes = PVM.Notes,
                                  recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : "",
                                  RecordedTime = PVM.RecordedDate.TimeOfDay.ToString(),
                                  visitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString()

                              }).ToList();

            foreach (var data in vitalsList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitId).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

                vitalsCollection.Add(data);
            }

            List<PatientVitalsModel> vitalDataCollection = new List<PatientVitalsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (vitalsCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        vitalDataCollection = (from vital in vitalsCollection
                                               join fac in facList on vital.FacilityId equals fac.FacilityId
                                               join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                               on vital.VisitId equals vis.VisitId
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on vis.ProviderID equals prov.ProviderID
                                               select vital).ToList();
                    }
                    else
                    {
                        vitalDataCollection = (from vital in vitalsCollection
                                               join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                               on vital.VisitId equals vis.VisitId
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on vis.ProviderID equals prov.ProviderID
                                               select vital).ToList();
                    }
                }
                else
                {
                    vitalDataCollection = (from vital in vitalsCollection
                                           join fac in facList on vital.FacilityId equals fac.FacilityId
                                           select vital).ToList();
                }
            }
            else
            {
                vitalDataCollection = vitalsCollection;
            }

            return vitalDataCollection;
        }

        ///// <summary>
        ///// Get Patient Vital for VitalsId
        ///// </summary>
        ///// <param>int VitalsId</param>
        ///// <returns>PatientVitalsModel. if PatientVitals Record for Given Vitals ID = success. else = failure</returns>
        public PatientVitalsModel GetVitalRecordbyID(int VitalsId)
        {
            var vitalRecord = (from vitals in this.uow.GenericRepository<PatientVitals>().Table().Where(x => x.VitalsId == VitalsId)
                               join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on vitals.VisitId equals visit.VisitId

                               select new
                               {
                                   vitals.VitalsId,
                                   vitals.PatientId,
                                   vitals.VisitId,
                                   vitals.RecordedDate,
                                   vitals.RecordedBy,
                                   vitals.Height,
                                   vitals.Weight,
                                   vitals.BMI,
                                   vitals.WaistCircumference,
                                   vitals.BPSystolic,
                                   vitals.BPDiastolic,
                                   vitals.BPLocationID,
                                   vitals.Temperature,
                                   vitals.TemperatureLocation,
                                   vitals.HeartRate,
                                   vitals.RespiratoryRate,
                                   vitals.O2Saturation,
                                   vitals.BloodsugarRandom,
                                   vitals.BloodsugarFasting,
                                   vitals.BloodSugarPostpardinal,
                                   vitals.PainArea,
                                   vitals.PainScale,
                                   vitals.HeadCircumference,
                                   vitals.LastMealdetails,
                                   vitals.LastMealtakenon,
                                   vitals.PatientPosition,
                                   vitals.IsBloodPressure,
                                   vitals.IsDiabetic,
                                   vitals.Notes,
                                   visit.RecordedDuringID,
                                   visit.VisitNo,
                                   visit.FacilityID,
                                   visit.VisitDate

                               }).AsEnumerable().Select(PVM => new PatientVitalsModel
                               {
                                   VitalsId = PVM.VitalsId,
                                   PatientId = PVM.PatientId,
                                   VisitId = PVM.VisitId,
                                   VisitNo = PVM.VisitNo,
                                   facilityName = PVM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PVM.FacilityID).FacilityName : "",
                                   RecordedDate = PVM.RecordedDate,
                                   RecordedBy = PVM.RecordedBy,
                                   Height = PVM.Height,
                                   Weight = PVM.Weight,
                                   BMI = PVM.BMI,
                                   WaistCircumference = PVM.WaistCircumference,
                                   BPSystolic = PVM.BPSystolic,
                                   BPDiastolic = PVM.BPDiastolic,
                                   BPLocationID = PVM.BPLocationID,
                                   BPLocation = this.uow.GenericRepository<BPLocation>().Table().FirstOrDefault(x => x.BPLocationId == PVM.BPLocationID).BPLocationDescription,
                                   Temperature = PVM.Temperature,
                                   TemperatureLocation = PVM.TemperatureLocation,
                                   HeartRate = PVM.HeartRate,
                                   RespiratoryRate = PVM.RespiratoryRate,
                                   O2Saturation = PVM.O2Saturation,
                                   BloodsugarRandom = PVM.BloodsugarRandom,
                                   BloodsugarFasting = PVM.BloodsugarFasting,
                                   BloodSugarPostpardinal = PVM.BloodSugarPostpardinal,
                                   PainArea = PVM.PainArea,
                                   PainScale = PVM.PainScale,
                                   PainScaleDesc = (PVM.PainScale != null && PVM.PainScale > 0) ? this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == PVM.PainScale).PainScaleDesc : "",
                                   HeadCircumference = PVM.HeadCircumference,
                                   LastMealdetails = PVM.LastMealdetails,
                                   LastMealtakenon = PVM.LastMealtakenon,
                                   PatientPosition = PVM.PatientPosition,
                                   IsBloodPressure = PVM.IsBloodPressure,
                                   BloodPressure = PVM.IsBloodPressure == "Y" ? "Yes" : (PVM.IsBloodPressure == "N" ? "No" : "Unknown"),
                                   IsDiabetic = PVM.IsDiabetic,
                                   Diabetic = PVM.IsDiabetic == "Y" ? "Yes" : (PVM.IsDiabetic == "N" ? "No" : "Unknown"),
                                   Notes = PVM.Notes,
                                   recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : "",
                                   RecordedTime = PVM.RecordedDate.TimeOfDay.ToString(),
                                   visitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString()

                               }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == vitalRecord.VisitId).FirstOrDefault();
            vitalRecord.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

            return vitalRecord;
        }

        ///// <summary>
        ///// Delete Vital record by ID
        ///// </summary>
        ///// <param>int VitalsId</param>
        ///// <returns>PatientVitals. if the record of Vital for given VitalsId is deleted = success. else = failure</returns>
        public PatientVitals DeleteVitalRecord(int VitalsId)
        {
            var vital = this.uow.GenericRepository<PatientVitals>().Table().Where(x => x.VitalsId == VitalsId).SingleOrDefault();

            if (vital != null)
            {
                vital.IsActive = false;

                this.uow.GenericRepository<PatientVitals>().Update(vital);
                this.uow.Save();
            }

            return vital;
        }

        #endregion

        #region Allergy-Patient Screen

        ///// <summary>
        ///// Get Patient Allergy List 
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientAllergyModel>. if list of Patient Allergy List for given Patient ID = success. else = failure</returns>
        public List<PatientAllergyModel> GetAllergiesforPatient(int PatientId)
        {
            List<PatientAllergyModel> allergyCollection = new List<PatientAllergyModel>();

            var allergyList = (from alrgy in this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.PatientId == PatientId & x.IsActive != false)
                               join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                               on alrgy.PatientId equals pat.PatientId

                               join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on alrgy.VisitId equals visit.VisitId

                               select new
                               {
                                   alrgy.AllergyId,
                                   alrgy.PatientId,
                                   alrgy.VisitId,
                                   alrgy.RecordedDate,
                                   alrgy.RecordedBy,
                                   alrgy.AllergyTypeID,
                                   alrgy.Name,
                                   alrgy.Allergydescription,
                                   alrgy.Aggravatedby,
                                   alrgy.Alleviatedby,
                                   alrgy.Onsetdate,
                                   alrgy.AllergySeverityID,
                                   alrgy.Reaction,
                                   alrgy.Status,
                                   alrgy.ICD10,
                                   alrgy.SNOMED,
                                   alrgy.Notes,
                                   visit.RecordedDuringID,
                                   visit.FacilityID,
                                   visit.VisitNo,
                                   visit.VisitDate,
                                   date = alrgy.ModifiedDate == null ? alrgy.CreatedDate : alrgy.ModifiedDate

                               }).AsEnumerable().OrderByDescending(x => x.date).Select(PAM => new PatientAllergyModel
                               {
                                   AllergyId = PAM.AllergyId,
                                   PatientId = PAM.PatientId,
                                   VisitId = PAM.VisitId,
                                   VisitNo = PAM.VisitNo,
                                   FacilityId = PAM.FacilityID > 0 ? PAM.FacilityID.Value : 0,
                                   facilityName = PAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PAM.FacilityID).FacilityName : "",
                                   RecordedDate = PAM.RecordedDate,
                                   RecordedBy = PAM.RecordedBy,
                                   AllergyTypeID = PAM.AllergyTypeID,
                                   AllergyTypeDesc = this.uow.GenericRepository<AllergyType>().Table().FirstOrDefault(x => x.AllergyTypeID == PAM.AllergyTypeID).AllergyTypeDescription,
                                   Name = PAM.Name,
                                   Allergydescription = PAM.Allergydescription,
                                   Aggravatedby = PAM.Aggravatedby,
                                   Alleviatedby = PAM.Alleviatedby,
                                   Onsetdate = PAM.Onsetdate,
                                   AllergySeverityID = PAM.AllergySeverityID,
                                   AllergySeverityDesc = this.uow.GenericRepository<AllergySeverity>().Table().FirstOrDefault(x => x.AllergySeverityId == PAM.AllergySeverityID).AllergySeverityDescription,
                                   Reaction = PAM.Reaction,
                                   Status = PAM.Status,
                                   ICD10 = PAM.ICD10,
                                   SNOMED = PAM.SNOMED,
                                   Notes = PAM.Notes,
                                   recordedDuring = PAM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PAM.RecordedDuringID).RecordedDuringDescription : "",
                                   RecordedTime = PAM.RecordedDate.TimeOfDay.ToString(),
                                   visitDateandTime = PAM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PAM.VisitDate.TimeOfDay.ToString()

                               }).ToList();

            foreach (var data in allergyList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitId).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

                allergyCollection.Add(data);
            }

            List<PatientAllergyModel> allergyDataCollection = new List<PatientAllergyModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (allergyCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        allergyDataCollection = (from alrgy in allergyCollection
                                                 join fac in facList on alrgy.FacilityId equals fac.FacilityId
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on alrgy.VisitId equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select alrgy).ToList();
                    }
                    else
                    {
                        allergyDataCollection = (from alrgy in allergyCollection
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on alrgy.VisitId equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select alrgy).ToList();
                    }
                }
                else
                {
                    allergyDataCollection = (from alrgy in allergyCollection
                                             join fac in facList on alrgy.FacilityId equals fac.FacilityId
                                             select alrgy).ToList();
                }
            }
            else
            {
                allergyDataCollection = allergyCollection;
            }

            return allergyDataCollection;
        }

        ///// <summary>
        ///// Get Patient Allergy for AllergyId
        ///// </summary>
        ///// <param>int AllergyId</param>
        ///// <returns>PatientAllergyModel. if PatientAllergy Record for Given Allergy ID = success. else = failure</returns>
        public PatientAllergyModel GetAllergyRecordbyID(int AllergyId)
        {
            var allergyRecord = (from alrgy in this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.AllergyId == AllergyId)
                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on alrgy.VisitId equals visit.VisitId

                                 select new
                                 {
                                     alrgy.AllergyId,
                                     alrgy.PatientId,
                                     alrgy.VisitId,
                                     alrgy.RecordedDate,
                                     alrgy.RecordedBy,
                                     alrgy.AllergyTypeID,
                                     alrgy.Name,
                                     alrgy.Allergydescription,
                                     alrgy.Aggravatedby,
                                     alrgy.Alleviatedby,
                                     alrgy.Onsetdate,
                                     alrgy.AllergySeverityID,
                                     alrgy.Reaction,
                                     alrgy.Status,
                                     alrgy.ICD10,
                                     alrgy.SNOMED,
                                     alrgy.Notes,
                                     visit.RecordedDuringID,
                                     visit.VisitNo,
                                     visit.FacilityID,
                                     visit.VisitDate

                                 }).AsEnumerable().Select(PAM => new PatientAllergyModel
                                 {
                                     AllergyId = PAM.AllergyId,
                                     PatientId = PAM.PatientId,
                                     VisitId = PAM.VisitId,
                                     VisitNo = PAM.VisitNo,
                                     facilityName = PAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PAM.FacilityID).FacilityName : "",
                                     RecordedDate = PAM.RecordedDate,
                                     RecordedBy = PAM.RecordedBy,
                                     AllergyTypeID = PAM.AllergyTypeID,
                                     AllergyTypeDesc = this.uow.GenericRepository<AllergyType>().Table().FirstOrDefault(x => x.AllergyTypeID == PAM.AllergyTypeID).AllergyTypeDescription,
                                     Name = PAM.Name,
                                     Allergydescription = PAM.Allergydescription,
                                     Aggravatedby = PAM.Aggravatedby,
                                     Alleviatedby = PAM.Alleviatedby,
                                     Onsetdate = PAM.Onsetdate,
                                     AllergySeverityID = PAM.AllergySeverityID,
                                     AllergySeverityDesc = this.uow.GenericRepository<AllergySeverity>().Table().FirstOrDefault(x => x.AllergySeverityId == PAM.AllergySeverityID).AllergySeverityDescription,
                                     Reaction = PAM.Reaction,
                                     Status = PAM.Status,
                                     ICD10 = PAM.ICD10,
                                     SNOMED = PAM.SNOMED,
                                     Notes = PAM.Notes,
                                     recordedDuring = PAM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PAM.RecordedDuringID).RecordedDuringDescription : "",
                                     RecordedTime = PAM.RecordedDate.TimeOfDay.ToString(),
                                     visitDateandTime = PAM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PAM.VisitDate.TimeOfDay.ToString()

                                 }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == allergyRecord.VisitId).FirstOrDefault();
            allergyRecord.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

            return allergyRecord;
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

        #endregion

        #region ProblemList-Patient Screen

        ///// <summary>
        ///// Get Patient Problem List
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientProblemListModel>. if list of Patient Problem List for given Patient ID = success. else = failure</returns>
        public List<PatientProblemListModel> GetPatientProblemListforPatient(int PatientId)
        {
            List<PatientProblemListModel> problemCollection = new List<PatientProblemListModel>();

            var problemList = (from prblm in this.uow.GenericRepository<PatientProblemList>().Table().Where(x => x.PatientId == PatientId & x.IsActive != false)
                               join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                               on prblm.PatientId equals pat.PatientId

                               join visit in this.uow.GenericRepository<PatientVisit>().Table()
                               on prblm.VisitId equals visit.VisitId

                               select new
                               {
                                   prblm.ProblemlistId,
                                   prblm.PatientId,
                                   prblm.VisitId,
                                   prblm.RecordedDate,
                                   prblm.RecordedBy,
                                   prblm.ProblemTypeID,
                                   prblm.ProblemDescription,
                                   prblm.ICD10Code,
                                   prblm.SNOMEDCode,
                                   prblm.Aggravatedby,
                                   prblm.DiagnosedDate,
                                   prblm.ResolvedDate,
                                   prblm.Status,
                                   prblm.AttendingPhysican,
                                   prblm.AlleviatedBy,
                                   prblm.FileName,
                                   prblm.Notes,
                                   visit.RecordedDuringID,
                                   visit.VisitNo,
                                   visit.FacilityID,
                                   visit.VisitDate,
                                   date = prblm.ModifiedDate == null ? prblm.CreatedDate : prblm.ModifiedDate

                               }).AsEnumerable().OrderByDescending(x => x.date).Select(PPM => new PatientProblemListModel
                               {
                                   ProblemlistId = PPM.ProblemlistId,
                                   PatientId = PPM.PatientId,
                                   VisitId = PPM.VisitId,
                                   VisitNo = PPM.VisitNo,
                                   FacilityId = PPM.FacilityID > 0 ? PPM.FacilityID.Value : 0,
                                   facilityName = PPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PPM.FacilityID).FacilityName : "",
                                   RecordedDate = PPM.RecordedDate,
                                   RecordedBy = PPM.RecordedBy,
                                   ProblemTypeID = PPM.ProblemTypeID,
                                   ProblemTypeDesc = this.uow.GenericRepository<ProblemType>().Table().FirstOrDefault(x => x.ProblemTypeId == PPM.ProblemTypeID).ProblemTypeDescription,
                                   ProblemDescription = PPM.ProblemDescription,
                                   ICD10Code = PPM.ICD10Code,
                                   SNOMEDCode = PPM.SNOMEDCode,
                                   Aggravatedby = PPM.Aggravatedby,
                                   DiagnosedDate = PPM.DiagnosedDate,
                                   ResolvedDate = PPM.ResolvedDate,
                                   Status = PPM.Status,
                                   AttendingPhysican = PPM.AttendingPhysican,
                                   AlleviatedBy = PPM.AlleviatedBy,
                                   FileName = PPM.FileName,
                                   Notes = PPM.Notes,
                                   recordedDuring = PPM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PPM.RecordedDuringID).RecordedDuringDescription : "",
                                   RecordedTime = PPM.RecordedDate.TimeOfDay.ToString(),
                                   visitDateandTime = PPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PPM.VisitDate.TimeOfDay.ToString()

                               }).ToList();

            foreach (var data in problemList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitId).FirstOrDefault();

                data.filePath = this.GetFile(data.ProblemlistId.ToString(), "Patient/ProblemList");

                data.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

                problemCollection.Add(data);
            }

            List<PatientProblemListModel> problemDataCollection = new List<PatientProblemListModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (problemCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        problemDataCollection = (from prob in problemCollection
                                                 join fac in facList on prob.FacilityId equals fac.FacilityId
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on prob.VisitId equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select prob).ToList();
                    }
                    else
                    {
                        problemDataCollection = (from prob in problemCollection
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on prob.VisitId equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select prob).ToList();
                    }
                }
                else
                {
                    problemDataCollection = (from prob in problemCollection
                                             join fac in facList on prob.FacilityId equals fac.FacilityId
                                             select prob).ToList();
                }
            }
            else
            {
                problemDataCollection = problemCollection;
            }

            return problemDataCollection;
        }

        ///// <summary>
        ///// Get Patient Problem Record for problemListId
        ///// </summary>
        ///// <param>int problemListId</param>
        ///// <returns>PatientProblemListModel. if list of Patient Problem Record for Given problemList Id = success. else = failure</returns>
        public PatientProblemListModel GetPatientProblemRecordbyID(int problemListId)
        {
            var problemRecord = (from prblm in this.uow.GenericRepository<PatientProblemList>().Table().Where(x => x.ProblemlistId == problemListId)
                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on prblm.VisitId equals visit.VisitId

                                 select new
                                 {
                                     prblm.ProblemlistId,
                                     prblm.PatientId,
                                     prblm.VisitId,
                                     prblm.RecordedDate,
                                     prblm.RecordedBy,
                                     prblm.ProblemTypeID,
                                     prblm.ProblemDescription,
                                     prblm.ICD10Code,
                                     prblm.SNOMEDCode,
                                     prblm.Aggravatedby,
                                     prblm.DiagnosedDate,
                                     prblm.ResolvedDate,
                                     prblm.Status,
                                     prblm.AttendingPhysican,
                                     prblm.AlleviatedBy,
                                     prblm.FileName,
                                     prblm.Notes,
                                     visit.RecordedDuringID,
                                     visit.VisitNo,
                                     visit.FacilityID,
                                     visit.VisitDate

                                 }).AsEnumerable().Select(PPM => new PatientProblemListModel
                                 {
                                     ProblemlistId = PPM.ProblemlistId,
                                     PatientId = PPM.PatientId,
                                     VisitId = PPM.VisitId,
                                     VisitNo = PPM.VisitNo,
                                     facilityName = PPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PPM.FacilityID).FacilityName : "",
                                     RecordedDate = PPM.RecordedDate,
                                     RecordedBy = PPM.RecordedBy,
                                     ProblemTypeID = PPM.ProblemTypeID,
                                     ProblemTypeDesc = this.uow.GenericRepository<ProblemType>().Table().FirstOrDefault(x => x.ProblemTypeId == PPM.ProblemTypeID).ProblemTypeDescription,
                                     ProblemDescription = PPM.ProblemDescription,
                                     ICD10Code = PPM.ICD10Code,
                                     SNOMEDCode = PPM.SNOMEDCode,
                                     Aggravatedby = PPM.Aggravatedby,
                                     DiagnosedDate = PPM.DiagnosedDate,
                                     ResolvedDate = PPM.ResolvedDate,
                                     Status = PPM.Status,
                                     AttendingPhysican = PPM.AttendingPhysican,
                                     AlleviatedBy = PPM.AlleviatedBy,
                                     FileName = PPM.FileName,
                                     Notes = PPM.Notes,
                                     recordedDuring = PPM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PPM.RecordedDuringID).RecordedDuringDescription : "",
                                     RecordedTime = PPM.RecordedDate.TimeOfDay.ToString(),
                                     visitDateandTime = PPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PPM.VisitDate.TimeOfDay.ToString()

                                 }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == problemRecord.VisitId).FirstOrDefault();

            problemRecord.filePath = this.GetFile(problemRecord.ProblemlistId.ToString(), "Patient/ProblemList");

            problemRecord.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

            return problemRecord;
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

        #endregion

        #region Medication History-Patient Screen

        ///// <summary>
        ///// Get Patient Medication History List
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientMedicationHistoryModel>. if list of Patient Medication History List for given Patient ID = success. else = failure</returns>
        public List<PatientMedicationHistoryModel> GetPatientMedicationHistoryListForPatient(int PatientId)
        {
            List<PatientMedicationHistoryModel> medicationCollection = new List<PatientMedicationHistoryModel>();

            var medicationHistoryList = (from medicHistory in this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.PatientId == PatientId & x.IsActive != false)

                                         join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                                         on medicHistory.PatientId equals pat.PatientId

                                         join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                         on medicHistory.VisitId equals visit.VisitId

                                         select new
                                         {
                                             medicHistory.PatientmedicationId,
                                             medicHistory.PatientId,
                                             medicHistory.VisitId,
                                             medicHistory.RecordedDate,
                                             medicHistory.RecordedBy,
                                             medicHistory.DrugName,
                                             medicHistory.MedicationRouteCode,
                                             medicHistory.ICDCode,
                                             medicHistory.TotalQuantity,
                                             medicHistory.NoOfDays,
                                             medicHistory.Morning,
                                             medicHistory.Brunch,
                                             medicHistory.Noon,
                                             medicHistory.Evening,
                                             medicHistory.Night,
                                             medicHistory.Before,
                                             medicHistory.After,
                                             medicHistory.Start,
                                             medicHistory.Hold,
                                             medicHistory.Continued,
                                             medicHistory.DisContinue,
                                             medicHistory.SIG,
                                             visit.VisitDate,
                                             visit.VisitNo,
                                             visit.FacilityID,
                                             visit.RecordedDuringID,
                                             date = medicHistory.ModifiedDate == null ? medicHistory.CreatedDate : medicHistory.ModifiedDate

                                         }).AsEnumerable().OrderByDescending(x => x.date).Select(PMHM => new PatientMedicationHistoryModel
                                         {
                                             PatientmedicationId = PMHM.PatientmedicationId,
                                             PatientId = PMHM.PatientId,
                                             VisitId = PMHM.VisitId,
                                             VisitNo = PMHM.VisitNo,
                                             FacilityId = PMHM.FacilityID > 0 ? PMHM.FacilityID.Value : 0,
                                             facilityName = PMHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PMHM.FacilityID).FacilityName : "",
                                             RecordedDate = PMHM.RecordedDate,
                                             RecordedBy = PMHM.RecordedBy,
                                             DrugName = PMHM.DrugName,
                                             MedicationRouteCode = PMHM.MedicationRouteCode,
                                             ICDCode = PMHM.ICDCode,
                                             TotalQuantity = PMHM.TotalQuantity,
                                             NoOfDays = PMHM.NoOfDays,
                                             Morning = PMHM.Morning,
                                             Brunch = PMHM.Brunch,
                                             Noon = PMHM.Noon,
                                             Evening = PMHM.Evening,
                                             Night = PMHM.Night,
                                             Before = PMHM.Before,
                                             After = PMHM.After,
                                             Start = PMHM.Start,
                                             Hold = PMHM.Hold,
                                             Continued = PMHM.Continued,
                                             DisContinue = PMHM.DisContinue,
                                             SIG = PMHM.SIG,
                                             recordedDuring = PMHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PMHM.RecordedDuringID).RecordedDuringDescription : "",
                                             RecordedTime = PMHM.RecordedDate.TimeOfDay.ToString(),
                                             visitDateandTime = PMHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PMHM.VisitDate.TimeOfDay.ToString()

                                         }).ToList();

            foreach (var data in medicationHistoryList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitId).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

                medicationCollection.Add(data);
            }

            List<PatientMedicationHistoryModel> medicDataCollection = new List<PatientMedicationHistoryModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (medicationCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        medicDataCollection = (from med in medicationCollection
                                               join fac in facList on med.FacilityId equals fac.FacilityId
                                               join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                               on med.VisitId equals vis.VisitId
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on vis.ProviderID equals prov.ProviderID
                                               select med).ToList();
                    }
                    else
                    {
                        medicDataCollection = (from med in medicationCollection
                                               join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                               on med.VisitId equals vis.VisitId
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on vis.ProviderID equals prov.ProviderID
                                               select med).ToList();
                    }
                }
                else
                {
                    medicDataCollection = (from med in medicationCollection
                                           join fac in facList on med.FacilityId equals fac.FacilityId
                                           select med).ToList();
                }
            }
            else
            {
                medicDataCollection = medicationCollection;
            }

            return medicDataCollection;
        }

        ///// <summary>
        ///// Get Patient Medication History Record for PatientMedicationId
        ///// </summary>
        ///// <param>int PatientMedicationId</param>
        ///// <returns>PatientMedicationHistoryModel. if Patient Medication History Record for Given PatientMedication Id = success. else = failure</returns>
        public PatientMedicationHistoryModel GetPatientMedicationHistoryRecordbyID(int PatientMedicationId)
        {
            var medicationHistoryRecord = (from medicHistory in this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.PatientmedicationId == PatientMedicationId)
                                           join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                            on medicHistory.VisitId equals visit.VisitId

                                           select new
                                           {
                                               medicHistory.PatientmedicationId,
                                               medicHistory.PatientId,
                                               medicHistory.VisitId,
                                               medicHistory.RecordedDate,
                                               medicHistory.RecordedBy,
                                               medicHistory.DrugName,
                                               medicHistory.MedicationRouteCode,
                                               medicHistory.ICDCode,
                                               medicHistory.TotalQuantity,
                                               medicHistory.NoOfDays,
                                               medicHistory.Morning,
                                               medicHistory.Brunch,
                                               medicHistory.Noon,
                                               medicHistory.Evening,
                                               medicHistory.Night,
                                               medicHistory.Before,
                                               medicHistory.After,
                                               medicHistory.Start,
                                               medicHistory.Hold,
                                               medicHistory.Continued,
                                               medicHistory.DisContinue,
                                               medicHistory.SIG,
                                               visit.VisitDate,
                                               visit.VisitNo,
                                               visit.FacilityID,
                                               visit.RecordedDuringID

                                           }).AsEnumerable().Select(PMHM => new PatientMedicationHistoryModel
                                           {
                                               PatientmedicationId = PMHM.PatientmedicationId,
                                               PatientId = PMHM.PatientId,
                                               VisitId = PMHM.VisitId,
                                               VisitNo = PMHM.VisitNo,
                                               facilityName = PMHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PMHM.FacilityID).FacilityName : "",
                                               RecordedDate = PMHM.RecordedDate,
                                               RecordedBy = PMHM.RecordedBy,
                                               DrugName = PMHM.DrugName,
                                               MedicationRouteCode = PMHM.MedicationRouteCode,
                                               ICDCode = PMHM.ICDCode,
                                               TotalQuantity = PMHM.TotalQuantity,
                                               NoOfDays = PMHM.NoOfDays,
                                               Morning = PMHM.Morning,
                                               Brunch = PMHM.Brunch,
                                               Noon = PMHM.Noon,
                                               Evening = PMHM.Evening,
                                               Night = PMHM.Night,
                                               Before = PMHM.Before,
                                               After = PMHM.After,
                                               Start = PMHM.Start,
                                               Hold = PMHM.Hold,
                                               Continued = PMHM.Continued,
                                               DisContinue = PMHM.DisContinue,
                                               SIG = PMHM.SIG,
                                               recordedDuring = PMHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PMHM.RecordedDuringID).RecordedDuringDescription : "",
                                               RecordedTime = PMHM.RecordedDate.TimeOfDay.ToString(),
                                               visitDateandTime = PMHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PMHM.VisitDate.TimeOfDay.ToString()

                                           }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == medicationHistoryRecord.VisitId).FirstOrDefault();
            medicationHistoryRecord.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

            return medicationHistoryRecord;
        }

        ///// <summary>
        ///// Delete Patient Medication History Record by ID
        ///// </summary>
        ///// <param>int PatientMedicationId</param>
        ///// <returns>PatientMedicationHistory. if the record of Patient Medication History for given PatientMedicationId is deleted = success. else = failure</returns>
        public PatientMedicationHistory DeletePatientMedicationRecord(int PatientMedicationId)
        {
            var medicHistory = this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.PatientmedicationId == PatientMedicationId).SingleOrDefault();

            if (medicHistory != null)
            {
                medicHistory.IsActive = false;

                this.uow.GenericRepository<PatientMedicationHistory>().Update(medicHistory);
                this.uow.Save();
            }

            return medicHistory;
        }

        #endregion

        #region Social History-Patient Screen

        ///// <summary>
        ///// Get Patient Social History List
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientSocialHistoryModel>. if list of Patient Social History List for given Patient ID = success. else = failure</returns>
        public List<PatientSocialHistoryModel> GetSocialHistoryListforPatient(int PatientId)
        {
            List<PatientSocialHistoryModel> socialCollection = new List<PatientSocialHistoryModel>();

            var socialHistoryList = (from social in this.uow.GenericRepository<PatientSocialHistory>().Table().Where(x => x.PatientId == PatientId & x.IsActive != false)
                                     join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                                     on social.PatientId equals pat.PatientId

                                     join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on social.VisitId equals visit.VisitId

                                     select new
                                     {
                                         social.SocialHistoryId,
                                         social.VisitId,
                                         social.PatientId,
                                         social.RecordedDate,
                                         social.RecordedBy,
                                         social.Smoking,
                                         social.CigarettesPerDay,
                                         social.Drinking,
                                         social.ConsumptionPerDay,
                                         social.DrugHabitsDetails,
                                         social.LifeStyleDetails,
                                         social.CountriesVisited,
                                         social.DailyActivities,
                                         social.AdditionalNotes,
                                         visit.RecordedDuringID,
                                         visit.VisitDate,
                                         visit.VisitNo,
                                         visit.FacilityID,
                                         date = social.ModifiedDate == null ? social.CreatedDate : social.ModifiedDate

                                     }).AsEnumerable().OrderByDescending(x => x.date).Select(PSHM => new PatientSocialHistoryModel
                                     {
                                         SocialHistoryId = PSHM.SocialHistoryId,
                                         VisitId = PSHM.VisitId,
                                         VisitNo = PSHM.VisitNo,
                                         FacilityId = PSHM.FacilityID > 0 ? PSHM.FacilityID.Value : 0,
                                         facilityName = PSHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PSHM.FacilityID).FacilityName : "",
                                         PatientId = PSHM.PatientId,
                                         RecordedDate = PSHM.RecordedDate,
                                         RecordedBy = PSHM.RecordedBy,
                                         Smoking = PSHM.Smoking,
                                         CigarettesPerDay = PSHM.CigarettesPerDay,
                                         Drinking = PSHM.Drinking,
                                         ConsumptionPerDay = PSHM.ConsumptionPerDay,
                                         DrugHabitsDetails = PSHM.DrugHabitsDetails,
                                         LifeStyleDetails = PSHM.LifeStyleDetails,
                                         CountriesVisited = PSHM.CountriesVisited,
                                         DailyActivities = PSHM.DailyActivities,
                                         AdditionalNotes = PSHM.AdditionalNotes,
                                         recordedDuring = PSHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PSHM.RecordedDuringID).RecordedDuringDescription : "",
                                         RecordedTime = PSHM.RecordedDate.TimeOfDay.ToString(),
                                         visitDateandTime = PSHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PSHM.VisitDate.TimeOfDay.ToString()

                                     }).ToList();

            foreach (var data in socialHistoryList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitId).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

                socialCollection.Add(data);
            }

            List<PatientSocialHistoryModel> socialDataCollection = new List<PatientSocialHistoryModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (socialCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        socialDataCollection = (from soc in socialCollection
                                                join fac in facList on soc.FacilityId equals fac.FacilityId
                                                join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                on soc.VisitId equals vis.VisitId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on vis.ProviderID equals prov.ProviderID
                                                select soc).ToList();
                    }
                    else
                    {
                        socialDataCollection = (from soc in socialCollection
                                                join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                on soc.VisitId equals vis.VisitId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on vis.ProviderID equals prov.ProviderID
                                                select soc).ToList();
                    }
                }
                else
                {
                    socialDataCollection = (from soc in socialCollection
                                            join fac in facList on soc.FacilityId equals fac.FacilityId
                                            select soc).ToList();
                }
            }
            else
            {
                socialDataCollection = socialCollection;
            }

            return socialDataCollection;
        }

        ///// <summary>
        ///// Get Patient Social History Record for SocialHistoryID
        ///// </summary>
        ///// <param>int SocialHistoryID</param>
        ///// <returns>PatientSocialHistoryModel. if Patient Social History Record for Given SocialHistory ID = success. else = failure</returns>
        public PatientSocialHistoryModel GetSocialHistoryRecordbyID(int SocialHistoryID)
        {
            var socialHistoryRecord = (from social in this.uow.GenericRepository<PatientSocialHistory>().Table().Where(x => x.SocialHistoryId == SocialHistoryID)
                                       join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                        on social.VisitId equals visit.VisitId

                                       select new
                                       {
                                           social.SocialHistoryId,
                                           social.VisitId,
                                           social.PatientId,
                                           social.RecordedDate,
                                           social.RecordedBy,
                                           social.Smoking,
                                           social.CigarettesPerDay,
                                           social.Drinking,
                                           social.ConsumptionPerDay,
                                           social.DrugHabitsDetails,
                                           social.LifeStyleDetails,
                                           social.CountriesVisited,
                                           social.DailyActivities,
                                           social.AdditionalNotes,
                                           visit.RecordedDuringID,
                                           visit.FacilityID,
                                           visit.VisitNo,
                                           visit.VisitDate

                                       }).AsEnumerable().Select(PSHM => new PatientSocialHistoryModel
                                       {
                                           SocialHistoryId = PSHM.SocialHistoryId,
                                           VisitId = PSHM.VisitId,
                                           VisitNo = PSHM.VisitNo,
                                           facilityName = PSHM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PSHM.FacilityID).FacilityName : "",
                                           PatientId = PSHM.PatientId,
                                           RecordedDate = PSHM.RecordedDate,
                                           RecordedBy = PSHM.RecordedBy,
                                           Smoking = PSHM.Smoking,
                                           CigarettesPerDay = PSHM.CigarettesPerDay,
                                           Drinking = PSHM.Drinking,
                                           ConsumptionPerDay = PSHM.ConsumptionPerDay,
                                           DrugHabitsDetails = PSHM.DrugHabitsDetails,
                                           LifeStyleDetails = PSHM.LifeStyleDetails,
                                           CountriesVisited = PSHM.CountriesVisited,
                                           DailyActivities = PSHM.DailyActivities,
                                           AdditionalNotes = PSHM.AdditionalNotes,
                                           recordedDuring = PSHM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PSHM.RecordedDuringID).RecordedDuringDescription : "",
                                           RecordedTime = PSHM.RecordedDate.TimeOfDay.ToString(),
                                           visitDateandTime = PSHM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PSHM.VisitDate.TimeOfDay.ToString()

                                       }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == socialHistoryRecord.VisitId).FirstOrDefault();
            socialHistoryRecord.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

            return socialHistoryRecord;
        }

        ///// <summary>
        ///// Delete Patient Social History Record by ID
        ///// </summary>
        ///// <param>int SocialHistoryID</param>
        ///// <returns>PatientSocialHistory. if the record of Patient Social History for given SocialHistoryID is deleted = success. else = failure</returns>
        public PatientSocialHistory DeletePatientSocialHistoryRecord(int SocialHistoryID)
        {
            var socialHistory = this.uow.GenericRepository<PatientSocialHistory>().Table().Where(x => x.SocialHistoryId == SocialHistoryID).SingleOrDefault();

            if (socialHistory != null)
            {
                socialHistory.IsActive = false;

                this.uow.GenericRepository<PatientSocialHistory>().Update(socialHistory);
                this.uow.Save();
            }

            return socialHistory;
        }

        #endregion

        #region ROS-Patient Screen

        ///// <summary>
        ///// Get Patient ROS List
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<ROSModel>. if list of Patient ROS List for given Patient ID = success. else = failure</returns>
        public List<ROSModel> GetROSDetailsforPatient(int PatientId)
        {
            List<ROSModel> rosCollection = new List<ROSModel>();

            var rosList = (from ros in this.uow.GenericRepository<ROS>().Table().Where(x => x.PatientID == PatientId & x.IsActive != false)
                           join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                           on ros.PatientID equals pat.PatientId

                           join visit in this.uow.GenericRepository<PatientVisit>().Table()
                          on ros.VisitID equals visit.VisitId

                           select new
                           {
                               ros.ROSID,
                               ros.PatientID,
                               ros.VisitID,
                               ros.RecordedDate,
                               ros.RecordedBy,
                               ros.Weightlossorgain,
                               ros.Feverorchills,
                               ros.Troublesleeping,
                               ros.Fatigue,
                               ros.GeneralWeakness,
                               ros.GeneralOthers,
                               ros.GeneralothersComments,
                               ros.Rashes,
                               ros.SkinItching,
                               ros.Colorchanges,
                               ros.SkinLumps,
                               ros.Dryness,
                               ros.Hairandnailchanges,
                               ros.SkinOthers,
                               ros.SkinothersComments,
                               ros.Headache,
                               ros.Headinjury,
                               ros.Others,
                               ros.HeadothersComments,
                               ros.Decreasedhearing,
                               ros.Earache,
                               ros.Ringinginears,
                               ros.Drainage,
                               ros.EarOthers,
                               ros.EarothersComments,
                               ros.Vision,
                               ros.Blurryordoublevision,
                               ros.Cataracts,
                               ros.Glassesorcontacts,
                               ros.Flashinglights,
                               ros.Lasteyeexam,
                               ros.EyePain,
                               ros.Specks,
                               ros.Redness,
                               ros.Glaucoma,
                               ros.EyeOthers,
                               ros.EyesothersComments,
                               ros.Stuffiness,
                               ros.NoseItching,
                               ros.Nosebleeds,
                               ros.Discharge,
                               ros.Hayfever,
                               ros.Sinuspain,
                               ros.NoseOthers,
                               ros.NoseothersComments,
                               ros.Teeth,
                               ros.Soretongue,
                               ros.Thrush,
                               ros.Gums,
                               ros.Drymouth,
                               ros.Nonhealingsores,
                               ros.Bleeding,
                               ros.Sorethroat,
                               ros.Sinus,
                               ros.Lastdentalexam,
                               ros.Lastdentalexamdate,
                               ros.Dentures,
                               ros.Hoarseness,
                               ros.ThroatOthers,
                               ros.ThroatothersComments,
                               ros.NeckLumps,
                               ros.NeckPain,
                               ros.Swollenglands,
                               ros.Stiffness,
                               ros.NeckOthers,
                               ros.NeckothersComments,
                               ros.Cough,
                               ros.Coughingupblood,
                               ros.Wheezing,
                               ros.Sputum,
                               ros.Shortnessofbreath,
                               ros.Painfulbreathing,
                               ros.RespiratoryOthers,
                               ros.Respiratoryotherscomments,
                               ros.Dizziness,
                               ros.Weakness,
                               ros.Tremor,
                               ros.Fainting,
                               ros.Numbness,
                               ros.Seizures,
                               ros.Tingling,
                               ros.NeurologicOthers,
                               ros.Neurologicotherscomments,
                               ros.Easeofbruising,
                               ros.Easeofbleeding,
                               ros.HematologicOthers,
                               ros.Hematologicotherscomments,
                               ros.Nervousness,
                               ros.Memoryloss,
                               ros.Stress,
                               ros.Depression,
                               ros.PsychiatricOthers,
                               ros.Psychiatricotherscomments,
                               visit.RecordedDuringID,
                               visit.VisitNo,
                               visit.FacilityID,
                               visit.VisitDate,
                               date = ros.ModifiedDate == null ? ros.Createddate : ros.ModifiedDate

                           }).AsEnumerable().OrderByDescending(x => x.date).Select(RM => new ROSModel
                           {
                               ROSID = RM.ROSID,
                               PatientID = RM.PatientID,
                               VisitID = RM.VisitID,
                               VisitNo = RM.VisitNo,
                               FacilityId = RM.FacilityID > 0 ? RM.FacilityID.Value : 0,
                               facilityName = RM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == RM.FacilityID).FacilityName : "",
                               RecordedDate = RM.RecordedDate,
                               RecordedBy = RM.RecordedBy,
                               Weightlossorgain = RM.Weightlossorgain,
                               Feverorchills = RM.Feverorchills,
                               Troublesleeping = RM.Troublesleeping,
                               Fatigue = RM.Fatigue,
                               GeneralWeakness = RM.GeneralWeakness,
                               GeneralOthers = RM.GeneralOthers,
                               GeneralothersComments = RM.GeneralothersComments,
                               Rashes = RM.Rashes,
                               SkinItching = RM.SkinItching,
                               Colorchanges = RM.Colorchanges,
                               SkinLumps = RM.SkinLumps,
                               Dryness = RM.Dryness,
                               Hairandnailchanges = RM.Hairandnailchanges,
                               SkinOthers = RM.SkinOthers,
                               SkinothersComments = RM.SkinothersComments,
                               Headache = RM.Headache,
                               Headinjury = RM.Headinjury,
                               Others = RM.Others,
                               HeadothersComments = RM.HeadothersComments,
                               Decreasedhearing = RM.Decreasedhearing,
                               Earache = RM.Earache,
                               Ringinginears = RM.Ringinginears,
                               Drainage = RM.Drainage,
                               EarOthers = RM.EarOthers,
                               EarothersComments = RM.EarothersComments,
                               Vision = RM.Vision,
                               Blurryordoublevision = RM.Blurryordoublevision,
                               Cataracts = RM.Cataracts,
                               Glassesorcontacts = RM.Glassesorcontacts,
                               Flashinglights = RM.Flashinglights,
                               Lasteyeexam = RM.Lasteyeexam,
                               EyePain = RM.EyePain,
                               Specks = RM.Specks,
                               Redness = RM.Redness,
                               Glaucoma = RM.Glaucoma,
                               EyeOthers = RM.EyeOthers,
                               EyesothersComments = RM.EyesothersComments,
                               Stuffiness = RM.Stuffiness,
                               NoseItching = RM.NoseItching,
                               Nosebleeds = RM.Nosebleeds,
                               Discharge = RM.Discharge,
                               Hayfever = RM.Hayfever,
                               Sinuspain = RM.Sinuspain,
                               NoseOthers = RM.NoseOthers,
                               NoseothersComments = RM.NoseothersComments,
                               Teeth = RM.Teeth,
                               Soretongue = RM.Soretongue,
                               Thrush = RM.Thrush,
                               Gums = RM.Gums,
                               Drymouth = RM.Drymouth,
                               Nonhealingsores = RM.Nonhealingsores,
                               Bleeding = RM.Bleeding,
                               Sorethroat = RM.Sorethroat,
                               Sinus = RM.Sinus,
                               Lastdentalexam = RM.Lastdentalexam,
                               Lastdentalexamdate = RM.Lastdentalexamdate,
                               Dentures = RM.Dentures,
                               Hoarseness = RM.Hoarseness,
                               ThroatOthers = RM.ThroatOthers,
                               ThroatothersComments = RM.ThroatothersComments,
                               NeckLumps = RM.NeckLumps,
                               NeckPain = RM.NeckPain,
                               Swollenglands = RM.Swollenglands,
                               Stiffness = RM.Stiffness,
                               NeckOthers = RM.NeckOthers,
                               NeckothersComments = RM.NeckothersComments,
                               Cough = RM.Cough,
                               Coughingupblood = RM.Coughingupblood,
                               Wheezing = RM.Wheezing,
                               Sputum = RM.Sputum,
                               Shortnessofbreath = RM.Shortnessofbreath,
                               Painfulbreathing = RM.Painfulbreathing,
                               RespiratoryOthers = RM.RespiratoryOthers,
                               Respiratoryotherscomments = RM.Respiratoryotherscomments,
                               Dizziness = RM.Dizziness,
                               Weakness = RM.Weakness,
                               Tremor = RM.Tremor,
                               Fainting = RM.Fainting,
                               Numbness = RM.Numbness,
                               Seizures = RM.Seizures,
                               Tingling = RM.Tingling,
                               NeurologicOthers = RM.NeurologicOthers,
                               Neurologicotherscomments = RM.Neurologicotherscomments,
                               Easeofbruising = RM.Easeofbruising,
                               Easeofbleeding = RM.Easeofbleeding,
                               HematologicOthers = RM.HematologicOthers,
                               Hematologicotherscomments = RM.Hematologicotherscomments,
                               Nervousness = RM.Nervousness,
                               Memoryloss = RM.Memoryloss,
                               Stress = RM.Stress,
                               Depression = RM.Depression,
                               PsychiatricOthers = RM.PsychiatricOthers,
                               Psychiatricotherscomments = RM.Psychiatricotherscomments,
                               recordedDuring = RM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == RM.RecordedDuringID).RecordedDuringDescription : "",
                               RecordedTime = RM.RecordedDate.TimeOfDay.ToString(),
                               visitDateandTime = RM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + RM.VisitDate.TimeOfDay.ToString()

                           }).ToList();

            foreach (var data in rosList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitID).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

                rosCollection.Add(data);
            }

            List<ROSModel> rosDataCollection = new List<ROSModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (rosCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        rosDataCollection = (from ros in rosCollection
                                             join fac in facList on ros.FacilityId equals fac.FacilityId
                                             join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                             on ros.VisitID equals vis.VisitId
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on vis.ProviderID equals prov.ProviderID
                                             select ros).ToList();
                    }
                    else
                    {
                        rosDataCollection = (from ros in rosCollection
                                             join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                             on ros.VisitID equals vis.VisitId
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on vis.ProviderID equals prov.ProviderID
                                             select ros).ToList();
                    }
                }
                else
                {
                    rosDataCollection = (from ros in rosCollection
                                         join fac in facList on ros.FacilityId equals fac.FacilityId
                                         select ros).ToList();
                }
            }
            else
            {
                rosDataCollection = rosCollection;
            }

            return rosDataCollection;
        }

        ///// <summary>
        ///// Get Patient ROS Record for ROSId
        ///// </summary>
        ///// <param>int ROSId</param>
        ///// <returns>ROSModel. if Patient ROS Record for Given ROS Id = success. else = failure</returns>
        public ROSModel GetROSRecordbyID(int ROSId)
        {
            var rosRecord = (from ros in this.uow.GenericRepository<ROS>().Table().Where(x => x.ROSID == ROSId)
                             join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                on ros.VisitID equals visit.VisitId

                             select new
                             {
                                 ros.ROSID,
                                 ros.PatientID,
                                 ros.VisitID,
                                 ros.RecordedDate,
                                 ros.RecordedBy,
                                 ros.Weightlossorgain,
                                 ros.Feverorchills,
                                 ros.Troublesleeping,
                                 ros.Fatigue,
                                 ros.GeneralWeakness,
                                 ros.GeneralOthers,
                                 ros.GeneralothersComments,
                                 ros.Rashes,
                                 ros.SkinItching,
                                 ros.Colorchanges,
                                 ros.SkinLumps,
                                 ros.Dryness,
                                 ros.Hairandnailchanges,
                                 ros.SkinOthers,
                                 ros.SkinothersComments,
                                 ros.Headache,
                                 ros.Headinjury,
                                 ros.Others,
                                 ros.HeadothersComments,
                                 ros.Decreasedhearing,
                                 ros.Earache,
                                 ros.Ringinginears,
                                 ros.Drainage,
                                 ros.EarOthers,
                                 ros.EarothersComments,
                                 ros.Vision,
                                 ros.Blurryordoublevision,
                                 ros.Cataracts,
                                 ros.Glassesorcontacts,
                                 ros.Flashinglights,
                                 ros.Lasteyeexam,
                                 ros.EyePain,
                                 ros.Specks,
                                 ros.Redness,
                                 ros.Glaucoma,
                                 ros.EyeOthers,
                                 ros.EyesothersComments,
                                 ros.Stuffiness,
                                 ros.NoseItching,
                                 ros.Nosebleeds,
                                 ros.Discharge,
                                 ros.Hayfever,
                                 ros.Sinuspain,
                                 ros.NoseOthers,
                                 ros.NoseothersComments,
                                 ros.Teeth,
                                 ros.Soretongue,
                                 ros.Thrush,
                                 ros.Gums,
                                 ros.Drymouth,
                                 ros.Nonhealingsores,
                                 ros.Bleeding,
                                 ros.Sorethroat,
                                 ros.Sinus,
                                 ros.Lastdentalexam,
                                 ros.Lastdentalexamdate,
                                 ros.Dentures,
                                 ros.Hoarseness,
                                 ros.ThroatOthers,
                                 ros.ThroatothersComments,
                                 ros.NeckLumps,
                                 ros.NeckPain,
                                 ros.Swollenglands,
                                 ros.Stiffness,
                                 ros.NeckOthers,
                                 ros.NeckothersComments,
                                 ros.Cough,
                                 ros.Coughingupblood,
                                 ros.Wheezing,
                                 ros.Sputum,
                                 ros.Shortnessofbreath,
                                 ros.Painfulbreathing,
                                 ros.RespiratoryOthers,
                                 ros.Respiratoryotherscomments,
                                 ros.Dizziness,
                                 ros.Weakness,
                                 ros.Tremor,
                                 ros.Fainting,
                                 ros.Numbness,
                                 ros.Seizures,
                                 ros.Tingling,
                                 ros.NeurologicOthers,
                                 ros.Neurologicotherscomments,
                                 ros.Easeofbruising,
                                 ros.Easeofbleeding,
                                 ros.HematologicOthers,
                                 ros.Hematologicotherscomments,
                                 ros.Nervousness,
                                 ros.Memoryloss,
                                 ros.Stress,
                                 ros.Depression,
                                 ros.PsychiatricOthers,
                                 ros.Psychiatricotherscomments,
                                 visit.RecordedDuringID,
                                 visit.VisitNo,
                                 visit.FacilityID,
                                 visit.VisitDate

                             }).AsEnumerable().Select(RM => new ROSModel
                             {
                                 ROSID = RM.ROSID,
                                 PatientID = RM.PatientID,
                                 VisitID = RM.VisitID,
                                 VisitNo = RM.VisitNo,
                                 facilityName = RM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == RM.FacilityID).FacilityName : "",
                                 RecordedDate = RM.RecordedDate,
                                 RecordedBy = RM.RecordedBy,
                                 Weightlossorgain = RM.Weightlossorgain,
                                 Feverorchills = RM.Feverorchills,
                                 Troublesleeping = RM.Troublesleeping,
                                 Fatigue = RM.Fatigue,
                                 GeneralWeakness = RM.GeneralWeakness,
                                 GeneralOthers = RM.GeneralOthers,
                                 GeneralothersComments = RM.GeneralothersComments,
                                 Rashes = RM.Rashes,
                                 SkinItching = RM.SkinItching,
                                 Colorchanges = RM.Colorchanges,
                                 SkinLumps = RM.SkinLumps,
                                 Dryness = RM.Dryness,
                                 Hairandnailchanges = RM.Hairandnailchanges,
                                 SkinOthers = RM.SkinOthers,
                                 SkinothersComments = RM.SkinothersComments,
                                 Headache = RM.Headache,
                                 Headinjury = RM.Headinjury,
                                 Others = RM.Others,
                                 HeadothersComments = RM.HeadothersComments,
                                 Decreasedhearing = RM.Decreasedhearing,
                                 Earache = RM.Earache,
                                 Ringinginears = RM.Ringinginears,
                                 Drainage = RM.Drainage,
                                 EarOthers = RM.EarOthers,
                                 EarothersComments = RM.EarothersComments,
                                 Vision = RM.Vision,
                                 Blurryordoublevision = RM.Blurryordoublevision,
                                 Cataracts = RM.Cataracts,
                                 Glassesorcontacts = RM.Glassesorcontacts,
                                 Flashinglights = RM.Flashinglights,
                                 Lasteyeexam = RM.Lasteyeexam,
                                 EyePain = RM.EyePain,
                                 Specks = RM.Specks,
                                 Redness = RM.Redness,
                                 Glaucoma = RM.Glaucoma,
                                 EyeOthers = RM.EyeOthers,
                                 EyesothersComments = RM.EyesothersComments,
                                 Stuffiness = RM.Stuffiness,
                                 NoseItching = RM.NoseItching,
                                 Nosebleeds = RM.Nosebleeds,
                                 Discharge = RM.Discharge,
                                 Hayfever = RM.Hayfever,
                                 Sinuspain = RM.Sinuspain,
                                 NoseOthers = RM.NoseOthers,
                                 NoseothersComments = RM.NoseothersComments,
                                 Teeth = RM.Teeth,
                                 Soretongue = RM.Soretongue,
                                 Thrush = RM.Thrush,
                                 Gums = RM.Gums,
                                 Drymouth = RM.Drymouth,
                                 Nonhealingsores = RM.Nonhealingsores,
                                 Bleeding = RM.Bleeding,
                                 Sorethroat = RM.Sorethroat,
                                 Sinus = RM.Sinus,
                                 Lastdentalexam = RM.Lastdentalexam,
                                 Lastdentalexamdate = RM.Lastdentalexamdate,
                                 Dentures = RM.Dentures,
                                 Hoarseness = RM.Hoarseness,
                                 ThroatOthers = RM.ThroatOthers,
                                 ThroatothersComments = RM.ThroatothersComments,
                                 NeckLumps = RM.NeckLumps,
                                 NeckPain = RM.NeckPain,
                                 Swollenglands = RM.Swollenglands,
                                 Stiffness = RM.Stiffness,
                                 NeckOthers = RM.NeckOthers,
                                 NeckothersComments = RM.NeckothersComments,
                                 Cough = RM.Cough,
                                 Coughingupblood = RM.Coughingupblood,
                                 Wheezing = RM.Wheezing,
                                 Sputum = RM.Sputum,
                                 Shortnessofbreath = RM.Shortnessofbreath,
                                 Painfulbreathing = RM.Painfulbreathing,
                                 RespiratoryOthers = RM.RespiratoryOthers,
                                 Respiratoryotherscomments = RM.Respiratoryotherscomments,
                                 Dizziness = RM.Dizziness,
                                 Weakness = RM.Weakness,
                                 Tremor = RM.Tremor,
                                 Fainting = RM.Fainting,
                                 Numbness = RM.Numbness,
                                 Seizures = RM.Seizures,
                                 Tingling = RM.Tingling,
                                 NeurologicOthers = RM.NeurologicOthers,
                                 Neurologicotherscomments = RM.Neurologicotherscomments,
                                 Easeofbruising = RM.Easeofbruising,
                                 Easeofbleeding = RM.Easeofbleeding,
                                 HematologicOthers = RM.HematologicOthers,
                                 Hematologicotherscomments = RM.Hematologicotherscomments,
                                 Nervousness = RM.Nervousness,
                                 Memoryloss = RM.Memoryloss,
                                 Stress = RM.Stress,
                                 Depression = RM.Depression,
                                 PsychiatricOthers = RM.PsychiatricOthers,
                                 Psychiatricotherscomments = RM.Psychiatricotherscomments,
                                 recordedDuring = RM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == RM.RecordedDuringID).RecordedDuringDescription : "",
                                 RecordedTime = RM.RecordedDate.TimeOfDay.ToString(),
                                 visitDateandTime = RM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + RM.VisitDate.TimeOfDay.ToString()

                             }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == rosRecord.VisitID).FirstOrDefault();
            rosRecord.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

            return rosRecord;
        }

        ///// <summary>
        ///// Delete Patient ROS Record by ID
        ///// </summary>
        ///// <param>int ROSId</param>
        ///// <returns>ROS. if the record of Patient ROS for given ROSId is deleted = success. else = failure</returns>
        public ROS DeleteROSRecord(int ROSId)
        {
            var ros = this.uow.GenericRepository<ROS>().Table().Where(x => x.ROSID == ROSId).SingleOrDefault();

            if (ros != null)
            {
                ros.IsActive = false;

                this.uow.GenericRepository<ROS>().Update(ros);
                this.uow.Save();
            }

            return ros;
        }

        #endregion

        #region Nutrition-Patient Screen

        ///// <summary>
        ///// Get Nutrition Assessment List
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<NutritionAssessmentModel>. if list of Nutrition Assessment List for given Patient ID = success. else = failure</returns>
        public List<NutritionAssessmentModel> GetNutritionAssessmentListforPatient(int PatientId)
        {
            List<NutritionAssessmentModel> nutritionCollection = new List<NutritionAssessmentModel>();

            var nutritionList = (from nutrition in this.uow.GenericRepository<NutritionAssessment>().Table().Where(x => x.PatientId == PatientId & x.IsActive != false)
                                 join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                                     on nutrition.PatientId equals pat.PatientId

                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                on nutrition.VisitId equals visit.VisitId

                                 select new
                                 {
                                     nutrition.NutritionAssessmentID,
                                     nutrition.PatientId,
                                     nutrition.VisitId,
                                     nutrition.RecordedDate,
                                     nutrition.RecordedBy,
                                     nutrition.IntakeCategory,
                                     nutrition.FoodIntakeTypeID,
                                     nutrition.EatRegularly,
                                     nutrition.RegularMeals,
                                     nutrition.Carvings,
                                     nutrition.DislikedIntake,
                                     nutrition.FoodAllergies,
                                     nutrition.Notes,
                                     nutrition.FoodName,
                                     nutrition.Units,
                                     nutrition.Frequency,
                                     nutrition.NutritionNotes,
                                     visit.RecordedDuringID,
                                     visit.VisitNo,
                                     visit.FacilityID,
                                     visit.VisitDate,
                                     date = nutrition.ModifiedDate == null ? nutrition.CreatedDate : nutrition.ModifiedDate

                                 }).AsEnumerable().OrderByDescending(x => x.date).Select(NAM => new NutritionAssessmentModel
                                 {
                                     NutritionAssessmentID = NAM.NutritionAssessmentID,
                                     PatientId = NAM.PatientId,
                                     VisitId = NAM.VisitId,
                                     VisitNo = NAM.VisitNo,
                                     FacilityId = NAM.FacilityID > 0 ? NAM.FacilityID.Value : 0,
                                     facilityName = NAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == NAM.FacilityID).FacilityName : "",
                                     RecordedDate = NAM.RecordedDate,
                                     RecordedBy = NAM.RecordedBy,
                                     IntakeCategory = NAM.IntakeCategory,
                                     FoodIntakeTypeID = NAM.FoodIntakeTypeID,
                                     FoodIntakeTypeDesc = this.uow.GenericRepository<FoodIntakeType>().Table().FirstOrDefault(x => x.FoodIntaketypeID == NAM.FoodIntakeTypeID).FoodIntakeTypeDescription,
                                     EatRegularly = NAM.EatRegularly,
                                     RegularMeals = NAM.RegularMeals,
                                     Carvings = NAM.Carvings,
                                     DislikedIntake = NAM.DislikedIntake,
                                     FoodAllergies = NAM.FoodAllergies,
                                     Notes = NAM.Notes,
                                     FoodName = NAM.FoodName,
                                     Units = NAM.Units,
                                     Frequency = NAM.Frequency,
                                     NutritionNotes = NAM.NutritionNotes,
                                     recordedDuring = NAM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == NAM.RecordedDuringID).RecordedDuringDescription : "",
                                     RecordedTime = NAM.RecordedDate.TimeOfDay.ToString(),
                                     visitDateandTime = NAM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + NAM.VisitDate.TimeOfDay.ToString()

                                 }).ToList();

            foreach (var data in nutritionList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitId).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

                nutritionCollection.Add(data);
            }

            List<NutritionAssessmentModel> nutritionDataCollection = new List<NutritionAssessmentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (nutritionCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        nutritionDataCollection = (from nut in nutritionCollection
                                                   join fac in facList on nut.FacilityId equals fac.FacilityId
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on nut.VisitId equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select nut).ToList();
                    }
                    else
                    {
                        nutritionDataCollection = (from nut in nutritionCollection
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on nut.VisitId equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select nut).ToList();
                    }
                }
                else
                {
                    nutritionDataCollection = (from nut in nutritionCollection
                                               join fac in facList on nut.FacilityId equals fac.FacilityId
                                               select nut).ToList();
                }
            }
            else
            {
                nutritionDataCollection = nutritionCollection;
            }

            return nutritionDataCollection;
        }

        ///// <summary>
        ///// Get Nutrition Assessment Record for nutritionAssessmentId
        ///// </summary>
        ///// <param>int nutritionAssessmentId</param>
        ///// <returns>NutritionAssessmentModel. if Nutrition Assessment Record for Given nutritionAssessment Id = success. else = failure</returns>
        public NutritionAssessmentModel GetNutritionAssessmentRecordbyID(int nutritionAssessmentId)
        {
            var nutritionRecord = (from nutrition in this.uow.GenericRepository<NutritionAssessment>().Table().Where(x => x.NutritionAssessmentID == nutritionAssessmentId)

                                   join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                  on nutrition.VisitId equals visit.VisitId

                                   select new
                                   {
                                       nutrition.NutritionAssessmentID,
                                       nutrition.PatientId,
                                       nutrition.VisitId,
                                       nutrition.RecordedDate,
                                       nutrition.RecordedBy,
                                       nutrition.IntakeCategory,
                                       nutrition.FoodIntakeTypeID,
                                       nutrition.EatRegularly,
                                       nutrition.RegularMeals,
                                       nutrition.Carvings,
                                       nutrition.DislikedIntake,
                                       nutrition.FoodAllergies,
                                       nutrition.Notes,
                                       nutrition.FoodName,
                                       nutrition.Units,
                                       nutrition.Frequency,
                                       nutrition.NutritionNotes,
                                       visit.RecordedDuringID,
                                       visit.FacilityID,
                                       visit.VisitNo,
                                       visit.VisitDate

                                   }).AsEnumerable().Select(NAM => new NutritionAssessmentModel
                                   {
                                       NutritionAssessmentID = NAM.NutritionAssessmentID,
                                       PatientId = NAM.PatientId,
                                       VisitId = NAM.VisitId,
                                       VisitNo = NAM.VisitNo,
                                       facilityName = NAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == NAM.FacilityID).FacilityName : "",
                                       RecordedDate = NAM.RecordedDate,
                                       RecordedBy = NAM.RecordedBy,
                                       IntakeCategory = NAM.IntakeCategory,
                                       FoodIntakeTypeID = NAM.FoodIntakeTypeID,
                                       FoodIntakeTypeDesc = this.uow.GenericRepository<FoodIntakeType>().Table().FirstOrDefault(x => x.FoodIntaketypeID == NAM.FoodIntakeTypeID).FoodIntakeTypeDescription,
                                       EatRegularly = NAM.EatRegularly,
                                       RegularMeals = NAM.RegularMeals,
                                       Carvings = NAM.Carvings,
                                       DislikedIntake = NAM.DislikedIntake,
                                       FoodAllergies = NAM.FoodAllergies,
                                       Notes = NAM.Notes,
                                       FoodName = NAM.FoodName,
                                       Units = NAM.Units,
                                       Frequency = NAM.Frequency,
                                       NutritionNotes = NAM.NutritionNotes,
                                       recordedDuring = NAM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == NAM.RecordedDuringID).RecordedDuringDescription : "",
                                       RecordedTime = NAM.RecordedDate.TimeOfDay.ToString(),
                                       visitDateandTime = NAM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + NAM.VisitDate.TimeOfDay.ToString()

                                   }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == nutritionRecord.VisitId).FirstOrDefault();
            nutritionRecord.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

            return nutritionRecord;
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

        #endregion

        #region Cognitive-Patient Screen

        ///// <summary>
        ///// Get Cognitive List
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<CognitiveModel>. if list of Cognitive for given Patient ID = success. else = failure</returns>
        public List<CognitiveModel> GetCognitiveListforPatient(int PatientId)
        {
            List<CognitiveModel> cognitiveCollection = new List<CognitiveModel>();

            var cognitiveList = (from cognitive in this.uow.GenericRepository<Cognitive>().Table().Where(x => x.PatientID == PatientId & x.IsActive != false)
                                 join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                                     on cognitive.PatientID equals pat.PatientId

                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                on cognitive.VisitID equals visit.VisitId

                                 select new
                                 {
                                     cognitive.CognitiveID,
                                     cognitive.PatientID,
                                     cognitive.VisitID,
                                     cognitive.Gait,
                                     cognitive.RecordedDate,
                                     cognitive.RecordedBy,
                                     cognitive.GaitNotes,
                                     cognitive.Balance,
                                     cognitive.BalanceNotes,
                                     cognitive.NeuromuscularNotes,
                                     cognitive.Mobility,
                                     cognitive.MobilitySupportDevice,
                                     cognitive.MobilityNotes,
                                     cognitive.Functionalstatus,
                                     cognitive.Cognitivestatus,
                                     cognitive.PrimaryDiagnosisNotes,
                                     cognitive.ICD10,
                                     cognitive.PrimaryProcedure,
                                     cognitive.CPT,
                                     cognitive.Physicianname,
                                     cognitive.Hospital,
                                     visit.RecordedDuringID,
                                     visit.FacilityID,
                                     visit.VisitNo,
                                     visit.VisitDate,
                                     date = cognitive.ModifiedDate == null ? cognitive.Createddate : cognitive.ModifiedDate

                                 }).AsEnumerable().OrderByDescending(x => x.date).Select(CM => new CognitiveModel
                                 {
                                     CognitiveID = CM.CognitiveID,
                                     PatientID = CM.PatientID,
                                     VisitID = CM.VisitID,
                                     VisitNo = CM.VisitNo,
                                     FacilityId = CM.FacilityID > 0 ? CM.FacilityID.Value : 0,
                                     facilityName = CM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CM.FacilityID).FacilityName : "",
                                     Gait = CM.Gait,
                                     RecordedDate = CM.RecordedDate,
                                     RecordedBy = CM.RecordedBy,
                                     GaitNotes = CM.GaitNotes,
                                     Balance = CM.Balance,
                                     BalanceNotes = CM.BalanceNotes,
                                     NeuromuscularNotes = CM.NeuromuscularNotes,
                                     Mobility = CM.Mobility,
                                     MobilitySupportDevice = CM.MobilitySupportDevice,
                                     MobilityNotes = CM.MobilityNotes,
                                     Functionalstatus = CM.Functionalstatus,
                                     Cognitivestatus = CM.Cognitivestatus,
                                     PrimaryDiagnosisNotes = CM.PrimaryDiagnosisNotes,
                                     ICD10 = CM.ICD10,
                                     PrimaryProcedure = CM.PrimaryProcedure,
                                     CPT = CM.CPT,
                                     Physicianname = CM.Physicianname,
                                     Hospital = CM.Hospital,
                                     recordedDuring = CM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == CM.RecordedDuringID).RecordedDuringDescription : "",
                                     RecordedTime = CM.RecordedDate.TimeOfDay.ToString(),
                                     visitDateandTime = CM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + CM.VisitDate.TimeOfDay.ToString()

                                 }).ToList();

            foreach (var data in cognitiveList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitID).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

                cognitiveCollection.Add(data);
            }

            List<CognitiveModel> cognitiveDataCollection = new List<CognitiveModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (cognitiveCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        cognitiveDataCollection = (from cog in cognitiveCollection
                                                   join fac in facList on cog.FacilityId equals fac.FacilityId
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on cog.VisitID equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select cog).ToList();
                    }
                    else
                    {
                        cognitiveDataCollection = (from cog in cognitiveCollection
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on cog.VisitID equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select cog).ToList();
                    }
                }
                else
                {
                    cognitiveDataCollection = (from cog in cognitiveCollection
                                               join fac in facList on cog.FacilityId equals fac.FacilityId
                                               select cog).ToList();
                }
            }
            else
            {
                cognitiveDataCollection = cognitiveCollection;
            }

            return cognitiveDataCollection;
        }

        ///// <summary>
        ///// Get Cognitive Record for cognitiveId
        ///// </summary>
        ///// <param>int cognitiveId</param>
        ///// <returns>CognitiveModel. if Cognitive Record for Given cognitive Id = success. else = failure</returns>
        public CognitiveModel GetCognitiveRecordbyID(int cognitiveId)
        {
            var cognitiveRecord = (from cognitive in this.uow.GenericRepository<Cognitive>().Table().Where(x => x.CognitiveID == cognitiveId)
                                   join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on cognitive.VisitID equals visit.VisitId

                                   select new
                                   {
                                       cognitive.CognitiveID,
                                       cognitive.PatientID,
                                       cognitive.VisitID,
                                       cognitive.Gait,
                                       cognitive.RecordedDate,
                                       cognitive.RecordedBy,
                                       cognitive.GaitNotes,
                                       cognitive.Balance,
                                       cognitive.BalanceNotes,
                                       cognitive.NeuromuscularNotes,
                                       cognitive.Mobility,
                                       cognitive.MobilitySupportDevice,
                                       cognitive.MobilityNotes,
                                       cognitive.Functionalstatus,
                                       cognitive.Cognitivestatus,
                                       cognitive.PrimaryDiagnosisNotes,
                                       cognitive.ICD10,
                                       cognitive.PrimaryProcedure,
                                       cognitive.CPT,
                                       cognitive.Physicianname,
                                       cognitive.Hospital,
                                       visit.RecordedDuringID,
                                       visit.VisitNo,
                                       visit.FacilityID,
                                       visit.VisitDate

                                   }).AsEnumerable().Select(CM => new CognitiveModel
                                   {
                                       CognitiveID = CM.CognitiveID,
                                       PatientID = CM.PatientID,
                                       VisitID = CM.VisitID,
                                       VisitNo = CM.VisitNo,
                                       facilityName = CM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CM.FacilityID).FacilityName : "",
                                       Gait = CM.Gait,
                                       RecordedDate = CM.RecordedDate,
                                       RecordedBy = CM.RecordedBy,
                                       GaitNotes = CM.GaitNotes,
                                       Balance = CM.Balance,
                                       BalanceNotes = CM.BalanceNotes,
                                       NeuromuscularNotes = CM.NeuromuscularNotes,
                                       Mobility = CM.Mobility,
                                       MobilitySupportDevice = CM.MobilitySupportDevice,
                                       MobilityNotes = CM.MobilityNotes,
                                       Functionalstatus = CM.Functionalstatus,
                                       Cognitivestatus = CM.Cognitivestatus,
                                       PrimaryDiagnosisNotes = CM.PrimaryDiagnosisNotes,
                                       ICD10 = CM.ICD10,
                                       PrimaryProcedure = CM.PrimaryProcedure,
                                       CPT = CM.CPT,
                                       Physicianname = CM.Physicianname,
                                       Hospital = CM.Hospital,
                                       recordedDuring = CM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == CM.RecordedDuringID).RecordedDuringDescription : "",
                                       RecordedTime = CM.RecordedDate.TimeOfDay.ToString(),
                                       visitDateandTime = CM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + CM.VisitDate.TimeOfDay.ToString()

                                   }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == cognitiveRecord.VisitID).FirstOrDefault();
            cognitiveRecord.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

            return cognitiveRecord;
        }

        ///// <summary>
        ///// Delete Cognitive Record by ID
        ///// </summary>
        ///// <param>int cognitiveId</param>
        ///// <returns>Cognitive. if the record of Cognitive for given cognitiveId is deleted = success. else = failure</returns>
        public Cognitive DeleteCognitiveRecord(int cognitiveId)
        {
            var cognitive = this.uow.GenericRepository<Cognitive>().Table().Where(x => x.CognitiveID == cognitiveId).SingleOrDefault();

            if (cognitive != null)
            {
                cognitive.IsActive = false;

                this.uow.GenericRepository<Cognitive>().Update(cognitive);
                this.uow.Save();
            }

            return cognitive;
        }

        #endregion

        #region Nursing SignOff-Patient Screen

        ///// <summary>
        ///// Get NursingSignOff List for Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<NursingSignOffModel>. if NursingSignOff List for given Patient ID = success. else = failure</returns>
        public List<NursingSignOffModel> GetNursingSignedoffListforPatient(int PatientId)
        {
            List<NursingSignOffModel> nursingSignOffCollection = new List<NursingSignOffModel>();

            var nursingSignOffList = (from nursing in this.uow.GenericRepository<NursingSignOff>().Table().Where(x => x.PatientID == PatientId & x.IsActive != false)
                                      join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
                                     on nursing.PatientID equals pat.PatientId

                                      join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                     on nursing.VisitID equals visit.VisitId

                                      select new
                                      {
                                          nursing.NursingId,
                                          nursing.PatientID,
                                          nursing.VisitID,
                                          nursing.RecordedDate,
                                          nursing.RecordedBy,
                                          nursing.ObservationsNotes,
                                          nursing.FirstaidOrDressingsNotes,
                                          nursing.NursingProceduresNotes,
                                          nursing.NursingNotes,
                                          nursing.AdditionalInformation,
                                          visit.RecordedDuringID,
                                          visit.VisitNo,
                                          visit.FacilityID,
                                          visit.VisitDate,
                                          date = nursing.ModifiedDate == null ? nursing.Createddate : nursing.ModifiedDate

                                      }).AsEnumerable().OrderByDescending(x => x.date).Select(NSM => new NursingSignOffModel
                                      {
                                          NursingId = NSM.NursingId,
                                          PatientID = NSM.PatientID,
                                          VisitID = NSM.VisitID,
                                          VisitNo = NSM.VisitNo,
                                          FacilityId = NSM.FacilityID > 0 ? NSM.FacilityID.Value : 0,
                                          facilityName = NSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == NSM.FacilityID).FacilityName : "",
                                          RecordedDate = NSM.RecordedDate,
                                          RecordedBy = NSM.RecordedBy,
                                          ObservationsNotes = NSM.ObservationsNotes,
                                          FirstaidOrDressingsNotes = NSM.FirstaidOrDressingsNotes,
                                          NursingProceduresNotes = NSM.NursingProceduresNotes,
                                          NursingNotes = NSM.NursingNotes,
                                          AdditionalInformation = NSM.AdditionalInformation,
                                          recordedDuring = NSM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == NSM.RecordedDuringID).RecordedDuringDescription : "",
                                          RecordedTime = NSM.RecordedDate.TimeOfDay.ToString(),
                                          visitDateandTime = NSM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + NSM.VisitDate.TimeOfDay.ToString(),
                                          nursingFile = this.GetFile(NSM.NursingId.ToString(), "Patient/NursingSignoff")

                                      }).ToList();

            foreach (var data in nursingSignOffList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitID).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

                nursingSignOffCollection.Add(data);
            }

            List<NursingSignOffModel> nursingDataCollection = new List<NursingSignOffModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (nursingSignOffCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        nursingDataCollection = (from nurse in nursingSignOffCollection
                                                 join fac in facList on nurse.FacilityId equals fac.FacilityId
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on nurse.VisitID equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select nurse).ToList();
                    }
                    else
                    {
                        nursingDataCollection = (from nurse in nursingSignOffCollection
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on nurse.VisitID equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select nurse).ToList();
                    }
                }
                else
                {
                    nursingDataCollection = (from nurse in nursingSignOffCollection
                                             join fac in facList on nurse.FacilityId equals fac.FacilityId
                                             select nurse).ToList();
                }
            }
            else
            {
                nursingDataCollection = nursingSignOffCollection;
            }

            return nursingDataCollection;
        }

        ///// <summary>
        ///// Get NursingSignOff Record for nursingId
        ///// </summary>
        ///// <param>int nursingId</param>
        ///// <returns>NursingSignOffModel. if NursingSignOff Record for Given nursing Id = success. else = failure</returns>
        public NursingSignOffModel GetNursingSignedoffRecordbyID(int nursingId)
        {
            var nursingSignOffRecord = (from nursing in this.uow.GenericRepository<NursingSignOff>().Table().Where(x => x.NursingId == nursingId)
                                        join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                        on nursing.VisitID equals visit.VisitId

                                        select new
                                        {
                                            nursing.NursingId,
                                            nursing.PatientID,
                                            nursing.VisitID,
                                            nursing.RecordedDate,
                                            nursing.RecordedBy,
                                            nursing.ObservationsNotes,
                                            nursing.FirstaidOrDressingsNotes,
                                            nursing.NursingProceduresNotes,
                                            nursing.NursingNotes,
                                            nursing.AdditionalInformation,
                                            visit.RecordedDuringID,
                                            visit.VisitNo,
                                            visit.FacilityID,
                                            visit.VisitDate

                                        }).AsEnumerable().Select(NSM => new NursingSignOffModel
                                        {
                                            NursingId = NSM.NursingId,
                                            PatientID = NSM.PatientID,
                                            VisitID = NSM.VisitID,
                                            VisitNo = NSM.VisitNo,
                                            facilityName = NSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == NSM.FacilityID).FacilityName : "",
                                            RecordedDate = NSM.RecordedDate,
                                            RecordedBy = NSM.RecordedBy,
                                            ObservationsNotes = NSM.ObservationsNotes,
                                            FirstaidOrDressingsNotes = NSM.FirstaidOrDressingsNotes,
                                            NursingProceduresNotes = NSM.NursingProceduresNotes,
                                            NursingNotes = NSM.NursingNotes,
                                            AdditionalInformation = NSM.AdditionalInformation,
                                            recordedDuring = NSM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == NSM.RecordedDuringID).RecordedDuringDescription : "",
                                            RecordedTime = NSM.RecordedDate.TimeOfDay.ToString(),
                                            visitDateandTime = NSM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + NSM.VisitDate.TimeOfDay.ToString(),
                                            nursingFile = this.GetFile(NSM.NursingId.ToString(), "Patient/NursingSignoff")

                                        }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == nursingSignOffRecord.VisitID).FirstOrDefault();
            nursingSignOffRecord.signOffstatus = (signOff != null && signOff.Intake == true) ? "Yes" : "No";

            return nursingSignOffRecord;
        }

        ///// <summary>
        ///// Delete NursingSignOff Record by ID
        ///// </summary>
        ///// <param>int nursingId</param>
        ///// <returns>NursingSignOff. if the record of NursingSignOff for given nursingId is deleted = success. else = failure</returns>
        public NursingSignOff DeleteNursingSignOffRecord(int nursingId)
        {
            var nursing = this.uow.GenericRepository<NursingSignOff>().Table().Where(x => x.NursingId == nursingId).SingleOrDefault();

            if (nursing != null)
            {
                nursing.IsActive = false;

                this.uow.GenericRepository<NursingSignOff>().Update(nursing);
                this.uow.Save();
            }

            return nursing;
        }

        #endregion

        #region Diagnosis-Patient Screen

        ///// <summary>
        ///// Get Diagnosis List for Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<DiagnosisModel>. if Diagnosis List for given Patient ID = success. else = failure</returns>
        public List<DiagnosisModel> GetDiagnosisforPatient(int PatientId)
        {
            List<DiagnosisModel> diagnosisCollection = new List<DiagnosisModel>();

            var diagnosisList = (from diag in this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.IsActive != false)
                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                 on diag.VisitID equals visit.VisitId

                                 join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                 on visit.PatientId equals pat.PatientId

                                 select new
                                 {
                                     diag.DiagnosisId,
                                     diag.VisitID,
                                     diag.RecordedDate,
                                     diag.RecordedBy,
                                     diag.ChiefComplaint,
                                     diag.ProblemAreaID,
                                     diag.ProblemDuration,
                                     diag.PreviousHistory,
                                     diag.SymptomsID,
                                     diag.OtherSymptoms,
                                     diag.PainScale,
                                     diag.PainNotes,
                                     diag.Timings,
                                     diag.ProblemTypeID,
                                     diag.AggravatedBy,
                                     diag.Alleviatedby,
                                     diag.ProblemStatus,
                                     diag.Observationotes,
                                     diag.InteractionSummary,
                                     diag.PAdditionalNotes,
                                     diag.Prognosis,
                                     diag.AssessmentNotes,
                                     diag.ICD10,
                                     diag.DiagnosisNotes,
                                     diag.Etiology,
                                     diag.DAdditionalNotes,
                                     visit.RecordedDuringID,
                                     visit.VisitNo,
                                     visit.FacilityID,
                                     visit.VisitDate,
                                     date = diag.ModifiedDate == null ? diag.Createddate : diag.ModifiedDate

                                 }).AsEnumerable().OrderByDescending(x => x.date).Select(DM => new DiagnosisModel
                                 {
                                     DiagnosisId = DM.DiagnosisId,
                                     VisitID = DM.VisitID,
                                     VisitNo = DM.VisitNo,
                                     FacilityId = DM.FacilityID > 0 ? DM.FacilityID.Value : 0,
                                     facilityName = DM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DM.FacilityID).FacilityName : "",
                                     RecordedDate = DM.RecordedDate,
                                     RecordedBy = DM.RecordedBy,
                                     ChiefComplaint = DM.ChiefComplaint,
                                     ProblemAreaID = DM.ProblemAreaID,
                                     ProblemDuration = DM.ProblemDuration,
                                     PreviousHistory = DM.PreviousHistory,
                                     SymptomsID = DM.SymptomsID,
                                     OtherSymptoms = DM.OtherSymptoms,
                                     PainScale = DM.PainScale,
                                     PainScaleDesc = DM.PainScale > 0 ? this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == DM.PainScale).PainScaleDesc : "",
                                     PainNotes = DM.PainNotes,
                                     Timings = DM.Timings,
                                     ProblemTypeID = DM.ProblemTypeID,
                                     AggravatedBy = DM.AggravatedBy,
                                     Alleviatedby = DM.Alleviatedby,
                                     ProblemStatus = DM.ProblemStatus,
                                     Observationotes = DM.Observationotes,
                                     InteractionSummary = DM.InteractionSummary,
                                     PAdditionalNotes = DM.PAdditionalNotes,
                                     Prognosis = DM.Prognosis,
                                     AssessmentNotes = DM.AssessmentNotes,
                                     ICD10 = DM.ICD10,
                                     DiagnosisNotes = DM.DiagnosisNotes,
                                     Etiology = DM.Etiology,
                                     DAdditionalNotes = DM.DAdditionalNotes,
                                     ProblemAreaValues = this.GetProblemAreaValuesbyVisitId(DM.VisitID),
                                     ProblemAreaArray = this.GetProblemAreaArraybyVisitId(DM.VisitID),
                                     ProblemTypeValues = this.GetProblemTypeValuesbyVisitId(DM.VisitID),
                                     ProblemTypeArray = this.GetProblemTypeArraybyVisitId(DM.VisitID),
                                     SymptomsValues = this.GetSymptomsValuesbyVisitId(DM.VisitID),
                                     SymptomsValueArray = this.GetSymptomsArraybyVisitId(DM.VisitID),
                                     recordedDuring = DM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == DM.RecordedDuringID).RecordedDuringDescription : "",
                                     RecordedTime = DM.RecordedDate.TimeOfDay.ToString(),
                                     visitDateandTime = DM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + DM.VisitDate.TimeOfDay.ToString()

                                 }).ToList();

            foreach (var data in diagnosisList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitID).FirstOrDefault();

                data.filePath = this.GetFile(data.DiagnosisId.ToString(), "Patient/Diagnosis");

                data.signOffstatus = (signOff != null && signOff.CaseSheet == true) ? "Yes" : "No";

                diagnosisCollection.Add(data);
            }

            List<DiagnosisModel> diagDataCollection = new List<DiagnosisModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (diagnosisCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        diagDataCollection = (from diag in diagnosisCollection
                                              join fac in facList on diag.FacilityId equals fac.FacilityId
                                              join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                              on diag.VisitID equals vis.VisitId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on vis.ProviderID equals prov.ProviderID
                                              select diag).ToList();
                    }
                    else
                    {
                        diagDataCollection = (from diag in diagnosisCollection
                                              join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                              on diag.VisitID equals vis.VisitId
                                              join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                              on vis.ProviderID equals prov.ProviderID
                                              select diag).ToList();
                    }
                }
                else
                {
                    diagDataCollection = (from diag in diagnosisCollection
                                          join fac in facList on diag.FacilityId equals fac.FacilityId
                                          select diag).ToList();
                }
            }
            else
            {
                diagDataCollection = diagnosisCollection;
            }

            return diagDataCollection;
        }

        ///// <summary>
        ///// Get Diagnosis Record for diagnosisID
        ///// </summary>
        ///// <param>int diagnosisID</param>
        ///// <returns>DiagnosisModel. if Diagnosis Record for Given diagnosis ID = success. else = failure</returns>
        public DiagnosisModel GetDiagnosisRecordbyID(int diagnosisID)
        {
            var diagnosisRecord = (from diag in this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.DiagnosisId == diagnosisID)
                                   join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                   on diag.VisitID equals visit.VisitId

                                   select new
                                   {
                                       diag.DiagnosisId,
                                       diag.VisitID,
                                       diag.RecordedDate,
                                       diag.RecordedBy,
                                       diag.ChiefComplaint,
                                       diag.ProblemAreaID,
                                       diag.ProblemDuration,
                                       diag.PreviousHistory,
                                       diag.SymptomsID,
                                       diag.OtherSymptoms,
                                       diag.PainScale,
                                       diag.PainNotes,
                                       diag.Timings,
                                       diag.ProblemTypeID,
                                       diag.AggravatedBy,
                                       diag.Alleviatedby,
                                       diag.ProblemStatus,
                                       diag.Observationotes,
                                       diag.InteractionSummary,
                                       diag.PAdditionalNotes,
                                       diag.Prognosis,
                                       diag.AssessmentNotes,
                                       diag.ICD10,
                                       diag.DiagnosisNotes,
                                       diag.Etiology,
                                       diag.DAdditionalNotes,
                                       visit.RecordedDuringID,
                                       visit.VisitNo,
                                       visit.FacilityID,
                                       visit.VisitDate

                                   }).AsEnumerable().Select(DM => new DiagnosisModel
                                   {
                                       DiagnosisId = DM.DiagnosisId,
                                       VisitID = DM.VisitID,
                                       VisitNo = DM.VisitNo,
                                       facilityName = DM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DM.FacilityID).FacilityName : "",
                                       RecordedDate = DM.RecordedDate,
                                       RecordedBy = DM.RecordedBy,
                                       ChiefComplaint = DM.ChiefComplaint,
                                       ProblemAreaID = DM.ProblemAreaID,
                                       ProblemDuration = DM.ProblemDuration,
                                       PreviousHistory = DM.PreviousHistory,
                                       SymptomsID = DM.SymptomsID,
                                       OtherSymptoms = DM.OtherSymptoms,
                                       PainScale = DM.PainScale,
                                       PainScaleDesc = DM.PainScale > 0 ? this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == DM.PainScale).PainScaleDesc : "",
                                       PainNotes = DM.PainNotes,
                                       Timings = DM.Timings,
                                       ProblemTypeID = DM.ProblemTypeID,
                                       AggravatedBy = DM.AggravatedBy,
                                       Alleviatedby = DM.Alleviatedby,
                                       ProblemStatus = DM.ProblemStatus,
                                       Observationotes = DM.Observationotes,
                                       InteractionSummary = DM.InteractionSummary,
                                       PAdditionalNotes = DM.PAdditionalNotes,
                                       Prognosis = DM.Prognosis,
                                       AssessmentNotes = DM.AssessmentNotes,
                                       ICD10 = DM.ICD10,
                                       DiagnosisNotes = DM.DiagnosisNotes,
                                       Etiology = DM.Etiology,
                                       DAdditionalNotes = DM.DAdditionalNotes,
                                       ProblemAreaValues = this.GetProblemAreaValuesbyVisitId(DM.VisitID),
                                       ProblemAreaArray = this.GetProblemAreaArraybyVisitId(DM.VisitID),
                                       ProblemTypeValues = this.GetProblemTypeValuesbyVisitId(DM.VisitID),
                                       ProblemTypeArray = this.GetProblemTypeArraybyVisitId(DM.VisitID),
                                       SymptomsValues = this.GetSymptomsValuesbyVisitId(DM.VisitID),
                                       SymptomsValueArray = this.GetSymptomsArraybyVisitId(DM.VisitID),
                                       recordedDuring = DM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == DM.RecordedDuringID).RecordedDuringDescription : "",
                                       RecordedTime = DM.RecordedDate.TimeOfDay.ToString(),
                                       visitDateandTime = DM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + DM.VisitDate.TimeOfDay.ToString(),


                                   }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == diagnosisRecord.VisitID).FirstOrDefault();
            diagnosisRecord.filePath = this.GetFile(diagnosisRecord.DiagnosisId.ToString(), "Patient/Diagnosis");
            diagnosisRecord.signOffstatus = (signOff != null && signOff.CaseSheet == true) ? "Yes" : "No";

            return diagnosisRecord;
        }

        ///// <summary>
        ///// Delete Diagnosis Record by ID
        ///// </summary>
        ///// <param>int diagnosisID</param>
        ///// <returns>Diagnosis. if the record of Diagnosis for given diagnosisID is deleted = success. else = failure</returns>
        public Diagnosis DeleteDiagnosisRecord(int diagnosisID)
        {
            var diagnosis = this.uow.GenericRepository<Diagnosis>().Table().Where(x => x.DiagnosisId == diagnosisID).SingleOrDefault();

            if (diagnosis != null)
            {
                diagnosis.IsActive = false;

                this.uow.GenericRepository<Diagnosis>().Update(diagnosis);
                this.uow.Save();
            }

            return diagnosis;
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

        #endregion

        #region CaseSheet Procedure-Patient Screen

        ///// <summary>
        ///// Get CaseSheet Procedure List for Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<CaseSheetProcedureModel>. if CaseSheet Procedure List for given Patient ID = success. else = failure</returns>
        public List<CaseSheetProcedureModel> GetProceduresforPatient(int PatientId)
        {
            List<CaseSheetProcedureModel> procedureCollection = new List<CaseSheetProcedureModel>();

            var procedureList = (from procedure in this.uow.GenericRepository<CaseSheetProcedure>().Table().Where(x => x.IsActive != false)
                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                 on procedure.VisitID equals visit.VisitId

                                 join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                 on visit.PatientId equals pat.PatientId

                                 select new
                                 {
                                     procedure.procedureId,
                                     procedure.VisitID,
                                     procedure.RecordedDate,
                                     procedure.RecordedBy,
                                     procedure.PrimaryCPT,
                                     procedure.ChiefComplaint,
                                     procedure.DiagnosisNotes,
                                     procedure.PrimaryICD,
                                     procedure.TreatmentType,
                                     procedure.ProcedureNotes,
                                     procedure.RequestedprocedureId,
                                     procedure.Proceduredate,
                                     procedure.ProcedureStatus,
                                     procedure.IsReferred,
                                     procedure.ReferralNotes,
                                     procedure.FollowUpNotes,
                                     procedure.AdditionalNotes,
                                     visit.RecordedDuringID,
                                     visit.VisitNo,
                                     visit.FacilityID,
                                     visit.VisitDate,
                                     date = procedure.ModifiedDate == null ? procedure.Createddate : procedure.ModifiedDate

                                 }).AsEnumerable().OrderByDescending(x => x.date).Select(CPM => new CaseSheetProcedureModel
                                 {
                                     procedureId = CPM.procedureId,
                                     VisitID = CPM.VisitID,
                                     VisitNo = CPM.VisitNo,
                                     FacilityId = CPM.FacilityID > 0 ? CPM.FacilityID.Value : 0,
                                     facilityName = CPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CPM.FacilityID).FacilityName : "",
                                     RecordedDate = CPM.RecordedDate,
                                     RecordedBy = CPM.RecordedBy,
                                     PrimaryCPT = CPM.PrimaryCPT,
                                     ChiefComplaint = CPM.ChiefComplaint,
                                     DiagnosisNotes = CPM.DiagnosisNotes,
                                     PrimaryICD = CPM.PrimaryICD,
                                     TreatmentType = CPM.TreatmentType,
                                     ProcedureNotes = CPM.ProcedureNotes,
                                     RequestedprocedureId = CPM.RequestedprocedureId,
                                     Proceduredate = CPM.Proceduredate,
                                     ProcedureStatus = CPM.ProcedureStatus,
                                     IsReferred = CPM.IsReferred,
                                     ReferralNotes = CPM.ReferralNotes,
                                     FollowUpNotes = CPM.FollowUpNotes,
                                     AdditionalNotes = CPM.AdditionalNotes,
                                     requestedProcedureValues = this.GetRequestedProcedureValuesbyVisitId(CPM.VisitID),
                                     requestedProcedureArray = this.GetRequestedProcedureArraybyVisitId(CPM.VisitID),
                                     recordedDuring = CPM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == CPM.RecordedDuringID).RecordedDuringDescription : "",
                                     RecordedTime = CPM.RecordedDate.TimeOfDay.ToString(),
                                     visitDateandTime = CPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + CPM.VisitDate.TimeOfDay.ToString()

                                 }).ToList();

            foreach (var data in procedureList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitID).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.CaseSheet == true) ? "Yes" : "No";

                procedureCollection.Add(data);
            }

            List<CaseSheetProcedureModel> caseSheetProcCollection = new List<CaseSheetProcedureModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (procedureCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        caseSheetProcCollection = (from proc in procedureCollection
                                                   join fac in facList on proc.FacilityId equals fac.FacilityId
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on proc.VisitID equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select proc).ToList();
                    }
                    else
                    {
                        caseSheetProcCollection = (from proc in procedureCollection
                                                   join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                   on proc.VisitID equals vis.VisitId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on vis.ProviderID equals prov.ProviderID
                                                   select proc).ToList();
                    }
                }
                else
                {
                    caseSheetProcCollection = (from proc in procedureCollection
                                               join fac in facList on proc.FacilityId equals fac.FacilityId
                                               select proc).ToList();
                }
            }
            else
            {
                caseSheetProcCollection = procedureCollection;
            }

            return caseSheetProcCollection;
        }

        ///// <summary>
        ///// Get CaseSheet Procedure for procedureID
        ///// </summary>
        ///// <param>int procedureID</param>
        ///// <returns>CaseSheetProcedureModel. if CaseSheet Procedure Record for Given procedure ID = success. else = failure</returns>
        public CaseSheetProcedureModel GetProcedureRecordbyID(int procedureID)
        {
            var procedureRecord = (from procedure in this.uow.GenericRepository<CaseSheetProcedure>().Table().Where(x => x.procedureId == procedureID)
                                   join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                    on procedure.VisitID equals visit.VisitId

                                   select new
                                   {
                                       procedure.procedureId,
                                       procedure.VisitID,
                                       procedure.RecordedDate,
                                       procedure.RecordedBy,
                                       procedure.PrimaryCPT,
                                       procedure.ChiefComplaint,
                                       procedure.DiagnosisNotes,
                                       procedure.PrimaryICD,
                                       procedure.TreatmentType,
                                       procedure.ProcedureNotes,
                                       procedure.RequestedprocedureId,
                                       procedure.Proceduredate,
                                       procedure.ProcedureStatus,
                                       procedure.IsReferred,
                                       procedure.ReferralNotes,
                                       procedure.FollowUpNotes,
                                       procedure.AdditionalNotes,
                                       visit.RecordedDuringID,
                                       visit.VisitNo,
                                       visit.FacilityID,
                                       visit.VisitDate

                                   }).AsEnumerable().Select(CPM => new CaseSheetProcedureModel
                                   {
                                       procedureId = CPM.procedureId,
                                       VisitID = CPM.VisitID,
                                       VisitNo = CPM.VisitNo,
                                       facilityName = CPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CPM.FacilityID).FacilityName : "",
                                       RecordedDate = CPM.RecordedDate,
                                       RecordedBy = CPM.RecordedBy,
                                       PrimaryCPT = CPM.PrimaryCPT,
                                       ChiefComplaint = CPM.ChiefComplaint,
                                       DiagnosisNotes = CPM.DiagnosisNotes,
                                       PrimaryICD = CPM.PrimaryICD,
                                       TreatmentType = CPM.TreatmentType,
                                       ProcedureNotes = CPM.ProcedureNotes,
                                       RequestedprocedureId = CPM.RequestedprocedureId,
                                       Proceduredate = CPM.Proceduredate,
                                       ProcedureStatus = CPM.ProcedureStatus,
                                       IsReferred = CPM.IsReferred,
                                       ReferralNotes = CPM.ReferralNotes,
                                       FollowUpNotes = CPM.FollowUpNotes,
                                       AdditionalNotes = CPM.AdditionalNotes,
                                       requestedProcedureValues = this.GetRequestedProcedureValuesbyVisitId(CPM.VisitID),
                                       requestedProcedureArray = this.GetRequestedProcedureArraybyVisitId(CPM.VisitID),
                                       recordedDuring = CPM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == CPM.RecordedDuringID).RecordedDuringDescription : "",
                                       RecordedTime = CPM.RecordedDate.TimeOfDay.ToString(),
                                       visitDateandTime = CPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + CPM.VisitDate.TimeOfDay.ToString()

                                   }).SingleOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == procedureRecord.VisitID).FirstOrDefault();
            procedureRecord.signOffstatus = (signOff != null && signOff.CaseSheet == true) ? "Yes" : "No";

            return procedureRecord;
        }

        ///// <summary>
        ///// Delete CaseSheet Procedure Record by ID
        ///// </summary>
        ///// <param>int procedureID</param>
        ///// <returns>CaseSheetProcedure. if the record of CaseSheet Procedure for given procedureID is deleted = success. else = failure</returns>
        public CaseSheetProcedure DeleteProcedureRecord(int procedureID)
        {
            var procedure = this.uow.GenericRepository<CaseSheetProcedure>().Table().Where(x => x.procedureId == procedureID).SingleOrDefault();

            if (procedure != null)
            {
                procedure.IsActive = false;

                this.uow.GenericRepository<CaseSheetProcedure>().Update(procedure);
                this.uow.Save();
            }

            return procedure;
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

        #endregion

        #region Care Plan-Patient Screen

        ///// <summary>
        ///// Get Care Plan List for Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<CarePlanModel>. if Care Plan List for given Patient ID = success. else = failure</returns>
        public List<CarePlanModel> GetCarePlansforPatient(int PatientId)
        {
            List<CarePlanModel> carePlanCollection = new List<CarePlanModel>();

            var carePlanList = (from care in this.uow.GenericRepository<CarePlan>().Table().Where(x => x.IsActive != false)
                                join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                on care.VisitID equals visit.VisitId

                                join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == PatientId)
                                on visit.PatientId equals pat.PatientId

                                select new
                                {
                                    care.CarePlanId,
                                    care.VisitID,
                                    care.RecordedDate,
                                    care.RecordedBy,
                                    care.PlanningActivity,
                                    care.Duration,
                                    care.StartDate,
                                    care.EndDate,
                                    care.CarePlanStatus,
                                    care.Progress,
                                    care.NextVisitDate,
                                    care.AdditionalNotes,
                                    visit.RecordedDuringID,
                                    visit.FacilityID,
                                    visit.VisitNo,
                                    visit.VisitDate,
                                    date = care.ModifiedDate == null ? care.Createddate : care.ModifiedDate

                                }).AsEnumerable().OrderByDescending(x => x.date).Select(CPM => new CarePlanModel
                                {
                                    CarePlanId = CPM.CarePlanId,
                                    VisitID = CPM.VisitID,
                                    VisitNo = CPM.VisitNo,
                                    FacilityId = CPM.FacilityID > 0 ? CPM.FacilityID.Value : 0,
                                    facilityName = CPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CPM.FacilityID).FacilityName : "",
                                    RecordedDate = CPM.RecordedDate,
                                    RecordedBy = CPM.RecordedBy,
                                    PlanningActivity = CPM.PlanningActivity,
                                    Duration = CPM.Duration,
                                    StartDate = CPM.StartDate,
                                    EndDate = CPM.EndDate,
                                    CarePlanStatus = CPM.CarePlanStatus,
                                    Progress = CPM.Progress,
                                    NextVisitDate = CPM.NextVisitDate,
                                    AdditionalNotes = CPM.AdditionalNotes,
                                    recordedDuring = CPM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == CPM.RecordedDuringID).RecordedDuringDescription : "",
                                    RecordedTime = CPM.RecordedDate.TimeOfDay.ToString(),
                                    visitDateandTime = CPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + CPM.VisitDate.TimeOfDay.ToString()

                                }).ToList();

            foreach (var data in carePlanList)
            {
                var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == data.VisitID).FirstOrDefault();

                data.signOffstatus = (signOff != null && signOff.CaseSheet == true) ? "Yes" : "No";

                carePlanCollection.Add(data);
            }

            List<CarePlanModel> carePlanDataCollection = new List<CarePlanModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (carePlanCollection.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        carePlanDataCollection = (from care in carePlanCollection
                                                  join fac in facList on care.FacilityId equals fac.FacilityId
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on care.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select care).ToList();
                    }
                    else
                    {
                        carePlanDataCollection = (from care in carePlanCollection
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on care.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select care).ToList();
                    }
                }
                else
                {
                    carePlanDataCollection = (from care in carePlanCollection
                                              join fac in facList on care.FacilityId equals fac.FacilityId
                                              select care).ToList();
                }
            }
            else
            {
                carePlanDataCollection = carePlanCollection;
            }

            return carePlanDataCollection;
        }

        ///// <summary>
        ///// Get Care Plan for CarePlan Id
        ///// </summary>
        ///// <param>int carePlanID</param>
        ///// <returns>CarePlanModel. if Care Plan Record for Given carePlan ID = success. else = failure</returns>
        public CarePlanModel GetCarePlanRecordbyID(int carePlanID)
        {
            var carePlanRecord = (from care in this.uow.GenericRepository<CarePlan>().Table().Where(x => x.CarePlanId == carePlanID)
                                  join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                  on care.VisitID equals visit.VisitId

                                  select new
                                  {
                                      care.CarePlanId,
                                      care.VisitID,
                                      care.RecordedDate,
                                      care.RecordedBy,
                                      care.PlanningActivity,
                                      care.Duration,
                                      care.StartDate,
                                      care.EndDate,
                                      care.CarePlanStatus,
                                      care.Progress,
                                      care.NextVisitDate,
                                      care.AdditionalNotes,
                                      visit.RecordedDuringID,
                                      visit.VisitNo,
                                      visit.FacilityID,
                                      visit.VisitDate,
                                      date = care.ModifiedDate == null ? care.Createddate : care.ModifiedDate

                                  }).AsEnumerable().OrderByDescending(x => x.date).Select(CPM => new CarePlanModel
                                  {
                                      CarePlanId = CPM.CarePlanId,
                                      VisitID = CPM.VisitID,
                                      VisitNo = CPM.VisitNo,
                                      facilityName = CPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CPM.FacilityID).FacilityName : "",
                                      RecordedDate = CPM.RecordedDate,
                                      RecordedBy = CPM.RecordedBy,
                                      PlanningActivity = CPM.PlanningActivity,
                                      Duration = CPM.Duration,
                                      StartDate = CPM.StartDate,
                                      EndDate = CPM.EndDate,
                                      CarePlanStatus = CPM.CarePlanStatus,
                                      Progress = CPM.Progress,
                                      NextVisitDate = CPM.NextVisitDate,
                                      AdditionalNotes = CPM.AdditionalNotes,
                                      recordedDuring = CPM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == CPM.RecordedDuringID).RecordedDuringDescription : "",
                                      RecordedTime = CPM.RecordedDate.TimeOfDay.ToString(),
                                      visitDateandTime = CPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + CPM.VisitDate.TimeOfDay.ToString()

                                  }).FirstOrDefault();

            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == carePlanRecord.VisitID).FirstOrDefault();
            carePlanRecord.signOffstatus = (signOff != null && signOff.CaseSheet == true) ? "Yes" : "No";

            return carePlanRecord;
        }

        ///// <summary>
        ///// Delete Care Plan Record by ID
        ///// </summary>
        ///// <param>int carePlanID</param>
        ///// <returns>CarePlan. if the record of Care Plan for given carePlanID is deleted = success. else = failure</returns>
        public CarePlan DeleteCarePlanRecord(int carePlanID)
        {
            var care = this.uow.GenericRepository<CarePlan>().Table().Where(x => x.CarePlanId == carePlanID).SingleOrDefault();

            if (care != null)
            {
                care.IsActive = false;

                this.uow.GenericRepository<CarePlan>().Update(care);
                this.uow.Save();
            }

            return care;
        }

        #endregion

        #region Patient Admission

        ///// <summary>
        ///// Get All Admissions for a Patient 
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<AdmissionsModel>. if Collection of Admissions for given PatientId= success. else = failure</returns>
        public List<AdmissionsModel> GetPatientAdmissions(int PatientId)
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
        public AdmissionsModel GetAdmissionRecordByID(int admissionID)
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
        public Admissions DeleteAdmissionRecordbyID(int admissionID)
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

        #region Audiology - Patient Screen

        ///// <summary>
        ///// Get Audiology Requests for a Patient 
        ///// </summary>
        ///// <param>(int patientId)</param>
        ///// <returns>List<AudiologyRequestModel>. if collection of AudiologyRequestModel returns for Given patientId = success. else = failure</returns>
        public List<AudiologyRequestModel> GetAudiologyRequestsbyPatientId(int patientId)
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
                                         visit.VisitNo,
                                         visit.VisitDate,
                                         visit.FacilityID

                                     }).AsEnumerable().Select(ARM => new AudiologyRequestModel
                                     {
                                         AudiologyRequestID = ARM.AudiologyRequestID,
                                         VisitID = ARM.VisitID,
                                         FacilityId = ARM.FacilityID > 0 ? ARM.FacilityID.Value : 0,
                                         VisitNo = ARM.VisitNo,
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
        ///// Get Audiology Records in Patient
        ///// </summary>
        ///// <param>(int patientId)</param>
        ///// <returns>AudiologyDataModel. if set of AudiologyDataModel returns for Given patientId = success. else = failure</returns>
        public AudiologyDataModel GetAudiologyRecords(int patientId)
        {
            AudiologyDataModel audiologyRecords = new AudiologyDataModel();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.PatientId == patientId).LastOrDefault();

            audiologyRecords.assrTestData = this.GetAssrTestRecord(visit.VisitId);
            audiologyRecords.beraTestData = this.GetBeraTestRecord(visit.VisitId);
            audiologyRecords.electrocochleographyData = this.GetElectrocochleographyRecord(visit.VisitId);
            audiologyRecords.hearingAidData = this.GetHearingAidRecord(visit.VisitId);
            audiologyRecords.oaeTestData = this.GetOaeTestRecord(visit.VisitId);
            audiologyRecords.speechTherapyData = this.GetSpeechTherapyRecord(visit.VisitId);
            audiologyRecords.speechSpecialTestData = this.GetSpeechtherapySpecialtestRecord(visit.VisitId);
            audiologyRecords.tinnitusMaskingData = this.GetTinnitusmaskingRecord(visit.VisitId);
            audiologyRecords.tuningForkTestData = this.GetTuningForkTestRecord(visit.VisitId);
            audiologyRecords.tympanometryData = this.GetTympanometryRecord(visit.VisitId);
            audiologyRecords.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
            audiologyRecords.VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
            audiologyRecords.VisitNo = visit.VisitNo;
            audiologyRecords.recordedDuring = visit.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == visit.RecordedDuringID).RecordedDuringDescription : "";

            return audiologyRecords;
        }

        ///// <summary>
        ///// Get Audiology Records by Visit
        ///// </summary>
        ///// <param>(int visitId)</param>
        ///// <returns>AudiologyDataModel. if set of AudiologyDataModel returns for Given visitId = success. else = failure</returns>
        public AudiologyDataModel GetAudiologyRecordsbyVisit(int visitId)
        {
            AudiologyDataModel audiologyRecords = new AudiologyDataModel();
            var visit = this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == visitId).LastOrDefault();

            audiologyRecords.assrTestData = this.GetAssrTestRecord(visit.VisitId);
            audiologyRecords.beraTestData = this.GetBeraTestRecord(visit.VisitId);
            audiologyRecords.electrocochleographyData = this.GetElectrocochleographyRecord(visit.VisitId);
            audiologyRecords.hearingAidData = this.GetHearingAidRecord(visit.VisitId);
            audiologyRecords.oaeTestData = this.GetOaeTestRecord(visit.VisitId);
            audiologyRecords.speechTherapyData = this.GetSpeechTherapyRecord(visit.VisitId);
            audiologyRecords.speechSpecialTestData = this.GetSpeechtherapySpecialtestRecord(visit.VisitId);
            audiologyRecords.tinnitusMaskingData = this.GetTinnitusmaskingRecord(visit.VisitId);
            audiologyRecords.tuningForkTestData = this.GetTuningForkTestRecord(visit.VisitId);
            audiologyRecords.tympanometryData = this.GetTympanometryRecord(visit.VisitId);
            audiologyRecords.facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "";
            audiologyRecords.VisitDateandTime = visit.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visit.VisitDate.TimeOfDay.ToString();
            audiologyRecords.VisitNo = visit.VisitNo;
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
            var signOff = this.uow.GenericRepository<VisitSignOff>().Table().Where(x => x.VisitID == VisitId).FirstOrDefault();

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

        #region e Lab Order - Patient Screen


        ///// <summary>
        ///// Get e Lab Orders for patient
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<eLabOrderModel>. if Records of eLab Order for given patientId = success. else = failure</returns>
        public List<eLabOrderModel> GetELabOrdersbyPatient(int patientId)
        {
            List<eLabOrderModel> labOrderRecords = new List<eLabOrderModel>();

            var labOrders = this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.IsActive != false).ToList();

            if (labOrders.Count() > 0)
            {
                foreach (var data in labOrders)
                {
                    eLabOrderModel labOrderData = new eLabOrderModel();

                    labOrderData = this.GetELabOrderbyOrderNo(data.LabOrderNo);
                    if (!labOrderRecords.Contains(labOrderData))
                    {
                        labOrderRecords.Add(labOrderData);
                    }
                }
            }
            var Records = labOrderRecords.Where(x => x.patientId == patientId).ToList();

            List<eLabOrderModel> elabOrderCollection = new List<eLabOrderModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (Records.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        elabOrderCollection = (from lab in Records
                                               join fac in facList on lab.FacilityID equals fac.FacilityId
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on lab.ProviderId equals prov.ProviderID
                                               select lab).ToList();
                    }
                    else
                    {
                        elabOrderCollection = (from lab in Records
                                               join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                               on lab.ProviderId equals prov.ProviderID
                                               select lab).ToList();
                    }
                }
                else
                {
                    elabOrderCollection = (from lab in Records
                                           join fac in facList on lab.FacilityID equals fac.FacilityId
                                           select lab).ToList();
                }
            }
            else
            {
                elabOrderCollection = Records;
            }

            return elabOrderCollection;
        }

        ///// <summary>
        ///// Get e Lab Order by orderNo
        ///// </summary>
        ///// <param>string orderNo</param>
        ///// <returns>eLabOrderModel. if Record of eLab Order for given orderNo = success. else = failure</returns>
        public eLabOrderModel GetELabOrderbyOrderNo(string orderNo)
        {
            int patId = 0;

            var elabOrderData = (from elabOrder in this.uow.GenericRepository<eLabOrder>().Table().
                                Where(x => x.IsActive != false & x.LabOrderNo.ToLower().Trim() == orderNo.ToLower().Trim())

                                 select new
                                 {
                                     elabOrder.LabOrderID,
                                     elabOrder.LabOrderNo,
                                     elabOrder.AdmissionID,
                                     elabOrder.VisitID,
                                     elabOrder.LabPhysician,
                                     elabOrder.LabOrderStatus,
                                     elabOrder.RequestedFrom,
                                     elabOrder.SignOff,
                                     elabOrder.SignOffBy,
                                     elabOrder.SignOffDate,
                                     elabOrder.Createddate

                                 }).AsEnumerable().Select(eLOM => new eLabOrderModel
                                 {
                                     LabOrderID = eLOM.LabOrderID,
                                     LabOrderNo = eLOM.LabOrderNo,
                                     AdmissionID = eLOM.AdmissionID,
                                     VisitID = eLOM.VisitID,
                                     LabPhysician = eLOM.LabPhysician,
                                     LabOrderStatus = eLOM.LabOrderStatus,
                                     RequestedFrom = eLOM.RequestedFrom,
                                     SignOff = eLOM.SignOff,
                                     SignOffBy = eLOM.SignOffBy,
                                     SignOffDate = eLOM.SignOffDate,
                                     Createddate = eLOM.Createddate,
                                     labOrderItems = this.GetELabOrderItems(eLOM.LabOrderID)

                                 }).FirstOrDefault();

            if (elabOrderData != null)
            {

                if (elabOrderData.AdmissionID > 0)
                {
                    patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrderData.AdmissionID).PatientID;
                }
                else if (elabOrderData.VisitID > 0)
                {
                    patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrderData.VisitID).PatientId;
                }

                var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == elabOrderData.LabPhysician);
                var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == elabOrderData.VisitID);
                var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == elabOrderData.AdmissionID);

                elabOrderData.patientId = patId;
                elabOrderData.patientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                elabOrderData.physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;

                if (admdata != null)
                {
                    elabOrderData.AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                    elabOrderData.AdmissionNo = admdata.AdmissionNo;
                    elabOrderData.FacilityID = admdata.FacilityID;
                    elabOrderData.ProviderId = admdata.AdmittingPhysician;
                    elabOrderData.facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                }

                if (visitdata != null)
                {
                    elabOrderData.visitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                    elabOrderData.VisitNo = visitdata.VisitNo;
                    elabOrderData.FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                    elabOrderData.ProviderId = visitdata.ProviderID;
                    elabOrderData.facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                }
            }

            return elabOrderData;
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
                                             setupMasterDesc = eLSM.LabSubMasterID > 0 ?
                                                                (eLSM.LabMasterDesc + " - " + this.GetELabSubMasterRecord(eLSM.LabSubMasterID.Value).LabSubMasterDesc) : eLSM.LabMasterDesc

                                         }).FirstOrDefault();

            return eLabSetupMasterRecord;
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
        ///// Cancel e Lab Orders for orderNo
        ///// </summary>
        ///// <param>string orderNo</param>
        ///// <returns>List<eLabOrder>. if Records of eLab Order for given orderNo are cancelled = success. else = failure</returns>
        public List<eLabOrder> CancelLabOrdersfromPatient(string orderNo)
        {
            var eLabOrders = this.uow.GenericRepository<eLabOrder>().Table().Where(x => x.LabOrderNo.ToLower().Trim() == orderNo.ToLower().Trim()).ToList();

            if (eLabOrders.Count() > 0)
            {
                foreach (var data in eLabOrders)
                {
                    data.IsActive = false;
                    data.LabOrderStatus = "Cancelled";

                    this.uow.GenericRepository<eLabOrder>().Update(data);
                }
                this.uow.Save();
            }

            return eLabOrders;
        }

        ///// <summary>
        ///// Get e Lab Order Items for eLabOrderId
        ///// </summary>
        ///// <param>int labOrderId</param>
        ///// <returns>List<eLabOrderItemsModel>. if Records of eLab Order for given labOrderId = success. else = failure</returns>
        public List<eLabOrderItemsModel> GetELabOrderItems(int labOrderId)
        {
            var labOrderItems = (from item in this.uow.GenericRepository<eLabOrderItems>().Table().Where(x => x.LabOrderID == labOrderId)

                                 join urg in this.uow.GenericRepository<UrgencyType>().Table()
                                 on item.UrgencyCode equals urg.UrgencyTypeCode

                                 select new
                                 {
                                     item.LabOrderItemsID,
                                     item.LabOrderID,
                                     item.SetupMasterID,
                                     item.UrgencyCode,
                                     item.LabOnDate,
                                     item.LabNotes,
                                     urg.UrgencyTypeDescription

                                 }).AsEnumerable().OrderBy(x => x.LabOrderItemsID).Select(eLOI => new eLabOrderItemsModel
                                 {
                                     LabOrderItemsID = eLOI.LabOrderItemsID,
                                     LabOrderID = eLOI.LabOrderID,
                                     SetupMasterID = eLOI.SetupMasterID,
                                     setupMasterDesc = eLOI.SetupMasterID > 0 ?
                                                    (this.GetELabSetupMasterRecordbyID(eLOI.SetupMasterID) != null ?
                                                    this.GetELabSetupMasterRecordbyID(eLOI.SetupMasterID).setupMasterDesc : "") : "",
                                     UrgencyCode = eLOI.UrgencyCode,
                                     LabOnDate = eLOI.LabOnDate,
                                     LabNotes = eLOI.LabNotes,
                                     urgencyDescription = eLOI.UrgencyTypeDescription

                                 }).ToList();

            return labOrderItems;
        }

        #endregion

        #region e Prescription (Medication) - Patient Screen

        ///// <summary>
        ///// Get Medications
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<MedicationsModel>. if Medication for given patient Id = success. else = failure</returns>
        public List<MedicationsModel> GetMedicationsbyPatient(int patientId)
        {
            List<MedicationsModel> medicationRecords = new List<MedicationsModel>();

            var medications = this.uow.GenericRepository<Medications>().Table().Where(x => x.IsActive != false).ToList();

            if (medications.Count() > 0)
            {
                foreach (var data in medications)
                {
                    MedicationsModel medicationData = new MedicationsModel();

                    medicationData = this.GetMedicationRecordbyIDfromPatient(data.MedicationId);
                    if (!medicationRecords.Contains(medicationData))
                    {
                        medicationRecords.Add(medicationData);
                    }
                }
            }

            var Records = medicationRecords.Where(x => x.PatientId == patientId).ToList();

            List<MedicationsModel> medicationCollection = new List<MedicationsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (Records.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        medicationCollection = (from med in Records
                                                join fac in facList on med.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on med.ProviderId equals prov.ProviderID
                                                select med).ToList();
                    }
                    else
                    {
                        medicationCollection = (from med in Records
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on med.ProviderId equals prov.ProviderID
                                                select med).ToList();
                    }
                }
                else
                {
                    medicationCollection = (from med in Records
                                            join fac in facList on med.FacilityID equals fac.FacilityId
                                            select med).ToList();
                }
            }
            else
            {
                medicationCollection = Records;
            }

            return medicationCollection;
        }

        ///// <summary>
        ///// Get Medication Items for Medication 
        ///// </summary>
        ///// <param>int MedicationId</param>
        ///// <returns>List<MedicationItemsModel>. if Medication  Items for given Medication Id = success. else = failure</returns>
        public List<MedicationItemsModel> GetMedicationItems(int medicationId)
        {
            var medItems = (from reqItem in this.uow.GenericRepository<MedicationItems>().Table().Where(x => x.MedicationID == medicationId)

                            join route in this.uow.GenericRepository<MedicationRoute>().Table()
                            on reqItem.MedicationRouteCode equals route.RouteCode

                            select new
                            {
                                reqItem.MedicationItemsId,
                                reqItem.MedicationID,
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

                            }).AsEnumerable().OrderBy(x => x.MedicationItemsId).Select(MRIM => new MedicationItemsModel
                            {
                                MedicationItemsId = MRIM.MedicationItemsId,
                                MedicationID = MRIM.MedicationID,
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

            return medItems;
        }

        ///// <summary>
        ///// Get Medication Record by Id
        ///// </summary>
        ///// <param>int medicationId</param>
        ///// <returns>MedicationsModel. if Medication Record by Given Id = success. else = failure</returns>
        public MedicationsModel GetMedicationRecordbyIDfromPatient(int medicationId)
        {
            int patId = 0;

            var medicationRecord = (from med in this.uow.GenericRepository<Medications>().Table().Where(x => x.MedicationId == medicationId)

                                    select new
                                    {
                                        med.MedicationId,
                                        med.AdmissionID,
                                        med.VisitID,
                                        med.MedicationPhysician,
                                        med.TakeRegularMedication,
                                        med.IsHoldRegularMedication,
                                        med.HoldRegularMedicationNotes,
                                        med.IsDiscontinueDrug,
                                        med.DiscontinueDrugNotes,
                                        med.IsPharmacist,
                                        med.PharmacistNotes,
                                        med.IsRefill,
                                        med.RefillCount,
                                        med.RefillDate,
                                        med.RefillNotes,
                                        med.MedicationStatus,
                                        med.MedicationNumber,
                                        med.CreatedDate

                                    }).AsEnumerable().Select(MRM => new MedicationsModel
                                    {
                                        MedicationId = MRM.MedicationId,
                                        AdmissionID = MRM.AdmissionID,
                                        VisitID = MRM.VisitID,
                                        MedicationPhysician = MRM.MedicationPhysician,
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
                                        MedicationStatus = MRM.MedicationStatus,
                                        MedicationNumber = MRM.MedicationNumber,
                                        CreatedDate = MRM.CreatedDate,
                                        medicationItems = this.GetMedicationItems(MRM.MedicationId)

                                    }).FirstOrDefault();

            if (medicationRecord != null)
            {

                if (medicationRecord.AdmissionID > 0)
                {
                    patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRecord.AdmissionID).PatientID;
                }
                else if (medicationRecord.VisitID > 0)
                {
                    patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRecord.VisitID).PatientId;
                }

                var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == medicationRecord.MedicationPhysician);
                var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRecord.VisitID);
                var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRecord.AdmissionID);

                medicationRecord.PatientId = patId;
                medicationRecord.PatientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                medicationRecord.physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;

                if (admdata != null)
                {
                    medicationRecord.AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                    medicationRecord.FacilityID = admdata.FacilityID;
                    medicationRecord.ProviderId = admdata.AdmittingPhysician;
                    medicationRecord.facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                }

                if (visitdata != null)
                {
                    medicationRecord.VisitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                    medicationRecord.FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                    medicationRecord.ProviderId = visitdata.ProviderID;
                    medicationRecord.facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                }
            }

            return medicationRecord;
        }

        ///// <summary>
        ///// Cancel Medication  by Id
        ///// </summary>
        ///// <param>int medicationId</param>
        ///// <returns>Medications. if Medication  Deleted for given medication med Id = success. else = failure</returns>
        public Medications CancelMedicationFromPatient(int medicationId)
        {
            var med = this.uow.GenericRepository<Medications>().Table().Where(x => x.MedicationId == medicationId).FirstOrDefault();

            if (med != null)
            {
                med.IsActive = false;
                med.MedicationStatus = "Cancelled";
                this.uow.GenericRepository<Medications>().Update(med);

                this.uow.Save();
            }

            return med;
        }

        #endregion

        #region Discharge Summary - Patient Screen

        ///// <summary>
        ///// Get Discharge Summary List for Patient
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<DischargeSummaryModel>. if list of DischargeSummaryModel for given Patient = success. else = failure</returns>
        public List<DischargeSummaryModel> GetDischargeRecordsforPatient(int patientId)
        {
            var dischargeSummaryList = (from disc in this.uow.GenericRepository<DischargeSummary>().Table().Where(x => x.IsActive != false)

                                        join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                        on disc.AdmissionNumber equals adm.AdmissionNo

                                        join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == patientId)
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
                                            adm.PatientID,
                                            adm.FacilityID,
                                            preProc.ProcedureStatus,
                                            pat.PatientFirstName,
                                            pat.PatientMiddleName,
                                            pat.PatientLastName

                                        }).AsEnumerable().Select(DSM => new DischargeSummaryModel
                                        {
                                            DischargeSummaryId = DSM.DischargeSummaryId,
                                            AdmissionNumber = DSM.AdmissionNumber,
                                            FacilityId = DSM.FacilityID,
                                            facilityName = DSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DSM.FacilityID).FacilityName : "",
                                            AdmissionDate = DSM.AdmissionDate,
                                            AdmittingPhysician = DSM.AdmittingPhysician,
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
                                        facilityName = DSM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DSM.FacilityID).FacilityName : "",
                                        AdmissionDate = DSM.AdmissionDate,
                                        AdmittingPhysician = DSM.AdmittingPhysician,
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


            if (this.GetFile(dischargeSummary.DischargeSummaryId.ToString(), "Discharge").Count() > 0)
            {
                //byte[] bytes = System.IO.File.ReadAllBytes(this.GetFile(dischargeSummary.DischargeSummaryId.ToString(), "Discharge").FirstOrDefault().FileUrl);
                //dischargeSummary.DischargeImage = Convert.ToBase64String(bytes);
                dischargeSummary.DischargeImage = this.GetFile(dischargeSummary.DischargeSummaryId.ToString(), "Discharge").FirstOrDefault().ActualFile;
            }

            return dischargeSummary;
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
                                         facilityName = MRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == MRM.FacilityID).FacilityName : "",
                                         PatientId = MRM.PatientId,
                                         PatientName = MRM.PatientFirstName + " " + MRM.PatientMiddleName + " " + MRM.PatientLastName,
                                         VisitID = MRM.VisitID,
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
        ///// Get e Lab Requests for Admission
        ///// </summary>
        ///// <param>int admissionId</param>
        ///// <returns>List<eLabRequestModel>. if Records of eLab Request for given AdmissionId = success. else = failure</returns>
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

        #region Facility for Registeration Module

        ///// <summary>
        ///// Get All Facility Data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Facility>. if Collection of Facility Data = success. else = failure</returns>
        public List<Facility> GetAllFacilities()
        {
            var facList = this.utilService.GetFacilitiesforUser();
            var facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                              join record in facList
                              on fac.FacilityId equals record.FacilityId
                              select fac).ToList();
            return facilities;
        }

        ///// <summary>
        ///// Add or Update a Facility data by checking FacilityId
        ///// </summary>
        ///// <param name=FacilityModel>facData(object of FacilityModel)</param>
        ///// <returns>FacilityModel. if a Facility data added or updated = success. else = failure</returns>
        public FacilityModel AddUpdateFacility(FacilityModel facData)
        {
            Facility fac = this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == facData.FacilityId).SingleOrDefault();
            if (fac == null)
            {
                fac = new Facility();

                fac.FacilityName = facData.FacilityName;
                fac.AddressLine1 = facData.AddressLine1;
                fac.AddressLine2 = facData.AddressLine2;
                fac.City = facData.City;
                fac.State = facData.State;
                fac.Country = facData.Country;
                fac.PINCode = facData.PINCode;
                fac.Telephone = facData.Telephone;
                fac.AlternativeTelphone = facData.AlternativeTelphone;
                fac.Email = facData.Email;
                fac.CreatedDate = DateTime.Now;
                fac.Createdby = facData.Createdby;

                this.uow.GenericRepository<Facility>().Insert(fac);
            }
            else
            {

                fac.FacilityName = facData.FacilityName;
                fac.AddressLine1 = facData.AddressLine1;
                fac.AddressLine2 = facData.AddressLine2;
                fac.City = facData.City;
                fac.State = facData.State;
                fac.Country = facData.Country;
                fac.PINCode = facData.PINCode;
                fac.Telephone = facData.Telephone;
                fac.AlternativeTelphone = facData.AlternativeTelphone;
                fac.Email = facData.Email;
                fac.ModifiedDate = DateTime.Now;
                fac.Modifiedby = facData.Modifiedby;

                this.uow.GenericRepository<Facility>().Update(fac);
            }
            this.uow.Save();
            facData.FacilityId = fac.FacilityId;

            return facData;
        }

        #endregion

        #region Provider for Registeration Module

        ///// <summary>
        ///// Get All Provider Data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProviderModel>. if Collection of Provider Data = success. else = failure</returns>
        public List<ProviderModel> GetProviders()
        {
            List<ProviderModel> providers = new List<ProviderModel>();
            var ProvList = this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false).ToList();

            foreach (var prov in ProvList)
            {
                var fac = (prov.FacilityId != null && prov.FacilityId != "") ? prov.FacilityId : "";

                ProviderModel providerModel = new ProviderModel();

                providerModel.ProviderID = prov.ProviderID;
                providerModel.UserID = prov.UserID;
                providerModel.FacilityId = prov.FacilityId;
                providerModel.RoleId = prov.RoleId;
                providerModel.RoleDescription = prov.RoleId > 0 ? this.uow.GenericRepository<Roles>().Table().Where(x => x.RoleId == prov.RoleId).FirstOrDefault().RoleDescription : "";
                providerModel.FirstName = prov.FirstName;
                providerModel.MiddleName = prov.MiddleName;
                providerModel.LastName = prov.LastName;
                providerModel.NamePrefix = prov.NamePrefix;
                providerModel.NameSuffix = prov.NameSuffix;
                providerModel.Title = prov.Title;
                providerModel.BirthDate = prov.BirthDate;
                providerModel.Gender = prov.Gender;
                providerModel.PersonalEmail = prov.PersonalEmail;
                providerModel.IsActive = prov.IsActive;
                providerModel.Language = prov.Language;
                providerModel.PreferredLanguage = prov.PreferredLanguage;
                providerModel.MotherMaiden = prov.MotherMaiden;
                providerModel.WebSiteName = prov.WebSiteName;
                providerModel.FacilityName = fac.Contains(",") ? this.GetFacilitiesforProvider(fac) : (fac != "" ? (this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(fac)).FacilityName) : "");
                providerModel.FacilityArray = fac != "" ? this.GetFacilityArray(fac) : new List<int>();
                providerModel.State = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault() != null ?
                                             this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault().State : "";
                providerModel.Pincode = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault() != null ?
                                        (this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault().PinCode != null ?
                                        this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == prov.ProviderID).FirstOrDefault().PinCode.Value : 0) : 0;
                providerModel.PhoneNumber = this.uow.GenericRepository<ProviderContact>().Table().Where(x => x.ProviderID == prov.ProviderID).ToList().Count() > 0 ?
                                            this.uow.GenericRepository<ProviderContact>().Table().FirstOrDefault(x => x.ProviderID == prov.ProviderID).PhoneNumber : "";
                providerModel.providerAddresses = this.GetProviderAddresses(prov.ProviderID);
                providerModel.providerContacts = this.GetProviderContactDetails(prov.ProviderID);
                providerModel.educations = this.GetProviderEducationDetails(prov.ProviderID);
                providerModel.familyDetails = this.GetProviderfamilyDetails(prov.ProviderID);
                providerModel.languages = this.GetProviderLanguages(prov.ProviderID);
                providerModel.extraActivities = this.GetProviderExtraActivities(prov.ProviderID);

                if (!providers.Contains(providerModel))
                {
                    providers.Add(providerModel);
                }
            }

            List<ProviderModel> ProviderList = new List<ProviderModel>();
            var facList = this.utilService.GetFacilitiesforUser();

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
        ///// Get Facility names
        ///// </summary>
        ///// <param>string FacilityId</param>
        ///// <returns>string. if facility names for given FacilityId = success. else = failure</returns>
        public string GetFacilitiesforProvider(string FacilityId)
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
        ///// Get Provider Addresses by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderAddressModel>. if Provider Addresses for given Id = success. else = failure</returns>
        public List<ProviderAddressModel> GetProviderAddresses(int ProviderId)
        {
            var provAddresses = (from address in this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == ProviderId)
                                 select address).AsEnumerable().Select(PAM => new ProviderAddressModel
                                 {
                                     ProviderID = PAM.ProviderID,
                                     ProviderAddressID = PAM.ProviderAddressID,
                                     AddressType = PAM.AddressType,
                                     DoorOrApartmentNo = PAM.DoorOrApartmentNo,
                                     ApartmentNameOrHouseName = PAM.ApartmentNameOrHouseName,
                                     StreetName = PAM.StreetName,
                                     Locality = PAM.Locality,
                                     Town = PAM.Town,
                                     District = PAM.District,
                                     City = PAM.City,
                                     State = PAM.State,
                                     Country = PAM.Country,
                                     PinCode = PAM.PinCode
                                 }).ToList();

            return provAddresses;
        }

        ///// <summary>
        ///// Get Provider Contacts by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderContactModel>. if Provider Contacts for given Id = success. else = failure</returns>
        public List<ProviderContactModel> GetProviderContactDetails(int ProviderId)
        {
            var provContacts = (from contact in this.uow.GenericRepository<ProviderContact>().Table().Where(x => x.ProviderID == ProviderId)
                                select contact).AsEnumerable().Select(PCM => new ProviderContactModel
                                {
                                    ProviderID = PCM.ProviderID,
                                    ProviderContactID = PCM.ProviderContactID,
                                    CellNumber = PCM.CellNumber,
                                    PhoneNumber = PCM.PhoneNumber,
                                    WhatsAppNumber = PCM.WhatsAppNumber,
                                    EmergencyContactNumber = PCM.EmergencyContactNumber,
                                    Fax = PCM.Fax,
                                    Email = PCM.Email,
                                    TelephoneNo = PCM.TelephoneNo
                                }).ToList();
            return provContacts;
        }

        ///// <summary>
        ///// Get Provider Education details by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderEducationModel>. if Provider Education Details for given Id = success. else = failure</returns>
        public List<ProviderEducationModel> GetProviderEducationDetails(int ProviderId)
        {
            var provEducationdetails = (from education in this.uow.GenericRepository<ProviderEducation>().Table().Where(x => x.ProviderID == ProviderId)
                                        select education).AsEnumerable().Select(PEM => new ProviderEducationModel
                                        {
                                            ProviderEducationId = PEM.ProviderEducationId,
                                            ProviderID = PEM.ProviderID,
                                            EducationType = PEM.EducationType,
                                            BoardorUniversity = PEM.BoardorUniversity,
                                            MonthandYearOfPassing = PEM.MonthandYearOfPassing,
                                            NameOfSchoolorCollege = PEM.NameOfSchoolorCollege,
                                            MainSubjects = PEM.MainSubjects,
                                            PercentageofMarks = PEM.PercentageofMarks,
                                            HonoursorScholarshipHeading = PEM.HonoursorScholarshipHeading,
                                            ProjectWorkUndertakenHeading = PEM.ProjectWorkUndertakenHeading,
                                            PublicationsorPapers = PEM.PublicationsorPapers,
                                            Qualification = PEM.Qualification,
                                            DurationOfQualification = PEM.DurationOfQualification,
                                            NameOfInstitution = PEM.NameOfInstitution,
                                            PlaceOfInstitution = PEM.PlaceOfInstitution,
                                            RegisterationAuthority = PEM.RegisterationAuthority,
                                            RegisterationNumber = PEM.RegisterationNumber,
                                            ExpiryOfRegisterationNumber = PEM.ExpiryOfRegisterationNumber

                                        }).ToList();
            return provEducationdetails;
        }

        ///// <summary>
        ///// Get Provider Family details by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderFamilyDetailsModel>. if Provider Family Details for given Id = success. else = failure</returns>
        public List<ProviderFamilyDetailsModel> GetProviderfamilyDetails(int ProviderId)
        {
            var provFamilyDetails = (from family in this.uow.GenericRepository<ProviderFamilyDetails>().Table().Where(x => x.ProviderID == ProviderId)
                                     select family).AsEnumerable().Select(PFM => new ProviderFamilyDetailsModel
                                     {
                                         ProviderFamilyDetailId = PFM.ProviderFamilyDetailId,
                                         ProviderID = PFM.ProviderID,
                                         FullName = PFM.FullName,
                                         Age = PFM.Age,
                                         RelationShip = PFM.RelationShip,
                                         Occupation = PFM.Occupation,
                                         Notes = PFM.Notes

                                     }).ToList();
            return provFamilyDetails;
        }

        ///// <summary>
        ///// Get Provider Languages by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderLanguagesModel>. if Provider Languages for given Id = success. else = failure</returns>
        public List<ProviderLanguagesModel> GetProviderLanguages(int ProviderId)
        {
            var provLanguages = (from lang in this.uow.GenericRepository<ProviderLanguages>().Table().Where(x => x.ProviderID == ProviderId)
                                 select lang).AsEnumerable().Select(PLM => new ProviderLanguagesModel
                                 {
                                     ProviderLanguageId = PLM.ProviderLanguageId,
                                     ProviderID = PLM.ProviderID,
                                     Language = PLM.Language,
                                     IsSpeak = PLM.IsSpeak,
                                     SpeakingLevel = PLM.SpeakingLevel,
                                     IsRead = PLM.IsRead,
                                     ReadingLevel = PLM.ReadingLevel,
                                     IsWrite = PLM.IsWrite,
                                     WritingLevel = PLM.WritingLevel

                                 }).ToList();
            return provLanguages;
        }

        ///// <summary>
        ///// Get Provider Languages by Id
        ///// </summary>
        ///// <param>int ProviderId</param>
        ///// <returns>List<ProviderLanguagesModel>. if Provider Languages for given Id = success. else = failure</returns>
        public List<ProviderExtraActivitiesModel> GetProviderExtraActivities(int ProviderId)
        {
            var provExtraActivities = (from activity in this.uow.GenericRepository<ProviderExtraActivities>().Table().Where(x => x.ProviderID == ProviderId)
                                       select activity).AsEnumerable().Select(PEAM => new ProviderExtraActivitiesModel
                                       {
                                           ProviderActivityId = PEAM.ProviderActivityId,
                                           ProviderID = PEAM.ProviderID,
                                           NatureOfActivity = PEAM.NatureOfActivity,
                                           YearOfParticipation = PEAM.YearOfParticipation,
                                           PrizesorAwards = PEAM.PrizesorAwards,
                                           StrengthandAreaneedImprovement = PEAM.StrengthandAreaneedImprovement

                                       }).ToList();
            return provExtraActivities;
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

            if (fileLoc.Count() > 0 && screen.ToLower().Trim() == "patient")
            {
                //byte[] bytes = System.IO.File.ReadAllBytes(fileLoc.FirstOrDefault().FileUrl);
                //this.imageCode = Convert.ToBase64String(bytes);
                this.imageCode = fileLoc.FirstOrDefault().ActualFile;
            }

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

        #region Mail and SMS

        public string sendSMS()
        {
            string result;
            string apiKey = "7tNkgCCeFmo-0zR9v5DP2UDVHoJmIz0YpPAyFw5rGz";// HttpUtility.UrlEncode("7tNkgCCeFmo-0zR9v5DP2UDVHoJmIz0YpPAyFw5rGz");
            string numbers = "919150537899";// HttpUtility.UrlEncode("919150537899"); // in a comma seperated list
            string message = 1248 + " is your OTP Verification code. It is valid for 2 minutes. Do not share this OTP to anyone for security reasons.";// HttpUtility.UrlEncode(mess);
            string sender = "APPBMS";// HttpUtility.UrlEncode("SHROFF");
            //string username = HttpUtility.UrlEncode("dinesh@bmsmartware.com"); // API user name to send SMS
            //string password = HttpUtility.UrlEncode("Bms$2020");     // API password to send SMS

            string url = "https://api.textlocal.in/send/?apikey=" + apiKey + "&numbers=" + numbers + "&message=" + message + "&sender=" + sender;
            //refer to parameters to complete correct url string

            StreamWriter myWriter = null;
            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(url);

            objRequest.Method = "POST";
            objRequest.ContentLength = Encoding.UTF8.GetByteCount(url);
            objRequest.ContentType = "application/x-www-form-urlencoded";
            try
            {
                myWriter = new StreamWriter(objRequest.GetRequestStream());
                myWriter.Write(url);
            }
            catch (Exception e)
            {
                return e.Message;
            }
            finally
            {
                myWriter.Close();
            }

            HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();
            using (StreamReader sr = new StreamReader(objResponse.GetResponseStream()))
            {
                result = sr.ReadToEnd();
                // Close and clean up the StreamReader
                sr.Close();
            }
            return result;

            //string message = HttpUtility.UrlEncode("This is your message");
            //using (var wb = new WebClient())
            //{
            //    byte[] response = wb.UploadValues("https://api.textlocal.in/send/", new NameValueCollection()
            //    {
            //    {"apikey" , "7tNkgCCeFmo-0zR9v5DP2UDVHoJmIz0YpPAyFw5rGz"},
            //    {"numbers" , "919150537899"},
            //    {"message" , message},
            //    {"sender" , "SHROFF"}
            //    });
            //    result = System.Text.Encoding.UTF8.GetString(response);                
            //}
            //return result;
        }

        #endregion

    }
}
