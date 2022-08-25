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
    public class PostProcedureService : IPostProcedureService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        private readonly IHostingEnvironment hostingEnvironment;

        public PostProcedureService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
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
        public List<DrugCode> GetDrugCodesforPostProcedureCasesheet(string searchKey)
        {
            return this.utilService.GetAllDrugCodes(searchKey);
        }

        ///// <summary>
        ///// Get Recorded During options for Post Procedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RecordedDuring>. if Collection of RecordedDuring for Post Procedure = success. else = failure</returns>
        public List<RecordedDuring> GetRecordedDuringOptionsforPostProcedure()
        {
            var recDurings = this.iTenantMasterService.GetRecordedDuringList();
            return recDurings;
        }

        ///// <summary>
        ///// Get Treatment Codes (CPT codes)
        ///// </summary>
        ///// <param>string CPTCode</param>
        ///// <returns>List<TreatmentCode>. if collection of TreatmentCodes = success. else = failure</returns>
        public List<TreatmentCode> GetProcedureCodes(string searchKey)
        {
            return this.utilService.GetTreatmentCodesbySearch(searchKey);
        }

        //// <summary>
        ///// Get All Procedures for Post Procedure
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<Procedures>. if Collection of Procedures for Admission by searchKey = success. else = failure</returns>
        public List<Procedures> GetProceduresforPostProcedure(string searchKey)
        {
            var procedures = this.iTenantMasterService.GetAllProcedures(searchKey);

            return procedures;
        }

        ///// <summary>
        ///// Get Tenant Specialities for Post Procedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<TenantSpeciality>. if collection of TenantSpeciality for PreProcedure = success. else = failure</returns>
        public List<TenantSpeciality> GetTenantSpecialitiesforPostProcedure()
        {
            var specialities = this.iTenantMasterService.GetTenantSpecialityList();

            return specialities;
        }

        ///// <summary>
        ///// Get PatientArrivalConditions for PostProcedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientArrivalCondition>. if Collection of PatientArrivalCondition = success. else = failure</returns>
        public List<PatientArrivalCondition> GetPatientArrivalConditionsforPostProcedure()
        {
            var conditions = this.iTenantMasterService.GetPatientArrivalConditions();
            return conditions;
        }

        //// <summary>
        ///// Get Pain Scales for Post Procedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PainScale>. if Collection of Pain Scales for Intake = success. else = failure</returns>
        public List<PainScale> GetPainLevelsforPostProcedure()
        {
            var painScales = this.iTenantMasterService.GetAllPainScales();

            return painScales;
        }

        ///// <summary>
        ///// Get Providers For PreProcedure Search
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for PreProcedure = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforPostProcedure(string searchKey)
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
        ///// Get Medication Routes List for Post Procedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationRoute>. if Collection of MedicationRoute = success. else = failure</returns>
        public List<MedicationRoute> GetMedicationRoutesforPostProcedure()
        {
            var medicationRoutes = this.iTenantMasterService.GetMedicationRouteList();
            return medicationRoutes;
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

        #region Drug Chart

        ///// <summary>
        ///// Add or Update Drug Chart from Post Procedure
        ///// </summary>
        ///// <param>DrugChartModel drugChartModel</param>
        ///// <returns>DrugChartModel. if DrugChartModel with ID = success. else = failure</returns>
        public DrugChartModel AddUpdateDrugChartDatafromPostProcedure(DrugChartModel drugChartModel)
        {
            DrugChart drugRecord = new DrugChart();
            if (drugChartModel.DrugTimes != null && drugChartModel.DrugTimes.Count() > 0)
            {
                var drugData = this.uow.GenericRepository<DrugChart>().Table().Where(x => x.AdmissionNo == drugChartModel.AdmissionNo).ToList();
                if (drugData.Count() == 0)
                {
                    foreach (var time in drugChartModel.DrugTimes)
                    {
                        drugRecord = new DrugChart();

                        drugRecord.PatientID = drugChartModel.PatientID;
                        drugRecord.AdmissionNo = drugChartModel.AdmissionNo;
                        drugRecord.RecordedDuringID = drugChartModel.RecordedDuringID;
                        drugRecord.RecordedBy = drugChartModel.RecordedBy;
                        drugRecord.DrugDate = this.utilService.GetLocalTime(drugChartModel.DrugDate);
                        drugRecord.DrugName = drugChartModel.DrugName;
                        drugRecord.DrugRoute = drugChartModel.DrugRoute;
                        drugRecord.DosageDesc = drugChartModel.DosageDesc;
                        drugRecord.DrugTime = time;
                        drugRecord.RateOfInfusion = drugChartModel.RateOfInfusion;
                        drugRecord.Frequency = drugChartModel.Frequency;
                        drugRecord.OrderingPhysician = drugChartModel.OrderingPhysician;
                        drugRecord.StopMedicationOn = drugChartModel.StopMedicationOn;
                        drugRecord.AdditionalInfo = drugChartModel.AdditionalInfo;
                        drugRecord.ProcedureType = drugChartModel.ProcedureType;
                        drugRecord.IsActive = true;
                        drugRecord.CreatedDate = DateTime.Now;
                        drugRecord.Createdby = "User";

                        this.uow.GenericRepository<DrugChart>().Insert(drugRecord);
                    }
                }
                else
                {
                    drugRecord = this.uow.GenericRepository<DrugChart>().Table().Where(x => x.DrugChartID == drugChartModel.DrugChartID).FirstOrDefault();
                    if (drugRecord != null)
                    {
                        drugRecord.PatientID = drugChartModel.PatientID;
                        drugRecord.AdmissionNo = drugChartModel.AdmissionNo;
                        drugRecord.RecordedDuringID = drugChartModel.RecordedDuringID;
                        drugRecord.RecordedBy = drugChartModel.RecordedBy;
                        drugRecord.DrugDate = this.utilService.GetLocalTime(drugChartModel.DrugDate);
                        drugRecord.DrugName = drugChartModel.DrugName;
                        drugRecord.DrugRoute = drugChartModel.DrugRoute;
                        drugRecord.DosageDesc = drugChartModel.DosageDesc;
                        drugRecord.DrugTime = drugChartModel.DrugTimes[0];
                        drugRecord.RateOfInfusion = drugChartModel.RateOfInfusion;
                        drugRecord.Frequency = drugChartModel.Frequency;
                        drugRecord.OrderingPhysician = drugChartModel.OrderingPhysician;
                        drugRecord.StopMedicationOn = drugChartModel.StopMedicationOn;
                        drugRecord.AdditionalInfo = drugChartModel.AdditionalInfo;
                        drugRecord.ProcedureType = drugChartModel.ProcedureType;
                        drugRecord.IsActive = true;
                        drugRecord.CreatedDate = DateTime.Now;
                        drugRecord.Createdby = "User";

                        this.uow.GenericRepository<DrugChart>().Update(drugRecord);

                        for (int i = 1; i < drugChartModel.DrugTimes.Count(); i++)
                        {
                            drugRecord = new DrugChart();

                            drugRecord.PatientID = drugChartModel.PatientID;
                            drugRecord.AdmissionNo = drugChartModel.AdmissionNo;
                            drugRecord.RecordedDuringID = drugChartModel.RecordedDuringID;
                            drugRecord.RecordedBy = drugChartModel.RecordedBy;
                            drugRecord.DrugDate = this.utilService.GetLocalTime(drugChartModel.DrugDate);
                            drugRecord.DrugName = drugChartModel.DrugName;
                            drugRecord.DrugRoute = drugChartModel.DrugRoute;
                            drugRecord.DosageDesc = drugChartModel.DosageDesc;
                            drugRecord.DrugTime = drugChartModel.DrugTimes[i];
                            drugRecord.RateOfInfusion = drugChartModel.RateOfInfusion;
                            drugRecord.Frequency = drugChartModel.Frequency;
                            drugRecord.OrderingPhysician = drugChartModel.OrderingPhysician;
                            drugRecord.StopMedicationOn = drugChartModel.StopMedicationOn;
                            drugRecord.AdditionalInfo = drugChartModel.AdditionalInfo;
                            drugRecord.ProcedureType = drugChartModel.ProcedureType;
                            drugRecord.IsActive = true;
                            drugRecord.CreatedDate = DateTime.Now;
                            drugRecord.Createdby = "User";

                            this.uow.GenericRepository<DrugChart>().Insert(drugRecord);
                        }
                        this.uow.Save();
                    }
                    else
                    {
                        drugRecord = new DrugChart();

                        drugRecord.PatientID = drugChartModel.PatientID;
                        drugRecord.AdmissionNo = drugChartModel.AdmissionNo;
                        drugRecord.RecordedDuringID = drugChartModel.RecordedDuringID;
                        drugRecord.RecordedBy = drugChartModel.RecordedBy;
                        drugRecord.DrugDate = this.utilService.GetLocalTime(drugChartModel.DrugDate);
                        drugRecord.DrugName = drugChartModel.DrugName;
                        drugRecord.DrugRoute = drugChartModel.DrugRoute;
                        drugRecord.DosageDesc = drugChartModel.DosageDesc;
                        drugRecord.DrugTime = drugChartModel.DrugTimes[0];
                        drugRecord.RateOfInfusion = drugChartModel.RateOfInfusion;
                        drugRecord.Frequency = drugChartModel.Frequency;
                        drugRecord.OrderingPhysician = drugChartModel.OrderingPhysician;
                        drugRecord.StopMedicationOn = drugChartModel.StopMedicationOn;
                        drugRecord.AdditionalInfo = drugChartModel.AdditionalInfo;
                        drugRecord.ProcedureType = drugChartModel.ProcedureType;
                        drugRecord.IsActive = true;
                        drugRecord.CreatedDate = DateTime.Now;
                        drugRecord.Createdby = "User";

                        this.uow.GenericRepository<DrugChart>().Insert(drugRecord);

                        for (int i = 1; i < drugChartModel.DrugTimes.Count(); i++)
                        {
                            drugRecord = new DrugChart();

                            drugRecord.PatientID = drugChartModel.PatientID;
                            drugRecord.AdmissionNo = drugChartModel.AdmissionNo;
                            drugRecord.RecordedDuringID = drugChartModel.RecordedDuringID;
                            drugRecord.RecordedBy = drugChartModel.RecordedBy;
                            drugRecord.DrugDate = this.utilService.GetLocalTime(drugChartModel.DrugDate);
                            drugRecord.DrugName = drugChartModel.DrugName;
                            drugRecord.DrugRoute = drugChartModel.DrugRoute;
                            drugRecord.DosageDesc = drugChartModel.DosageDesc;
                            drugRecord.DrugTime = drugChartModel.DrugTimes[i];
                            drugRecord.RateOfInfusion = drugChartModel.RateOfInfusion;
                            drugRecord.Frequency = drugChartModel.Frequency;
                            drugRecord.OrderingPhysician = drugChartModel.OrderingPhysician;
                            drugRecord.StopMedicationOn = drugChartModel.StopMedicationOn;
                            drugRecord.AdditionalInfo = drugChartModel.AdditionalInfo;
                            drugRecord.ProcedureType = drugChartModel.ProcedureType;
                            drugRecord.IsActive = true;
                            drugRecord.CreatedDate = DateTime.Now;
                            drugRecord.Createdby = "User";

                            this.uow.GenericRepository<DrugChart>().Insert(drugRecord);
                        }
                    }
                    this.uow.Save();
                }
                this.uow.Save();
            }
            else if (drugChartModel.DrugTimes == null && (drugChartModel.DrugTime != null && drugChartModel.DrugTime != ""))
            {
                drugRecord = this.uow.GenericRepository<DrugChart>().Table().Where(x => x.DrugChartID == drugChartModel.DrugChartID).FirstOrDefault();

                if (drugRecord != null)
                {
                    drugRecord.RecordedDuringID = drugChartModel.RecordedDuringID;
                    drugRecord.RecordedBy = drugChartModel.RecordedBy;
                    drugRecord.DrugDate = this.utilService.GetLocalTime(drugChartModel.DrugDate);
                    drugRecord.DrugName = drugChartModel.DrugName;
                    drugRecord.DrugRoute = drugChartModel.DrugRoute;
                    drugRecord.DosageDesc = drugChartModel.DosageDesc;
                    drugRecord.DrugTime = drugChartModel.DrugTime;
                    drugRecord.RateOfInfusion = drugChartModel.RateOfInfusion;
                    drugRecord.Frequency = drugChartModel.Frequency;
                    drugRecord.OrderingPhysician = drugChartModel.OrderingPhysician;
                    drugRecord.StopMedicationOn = drugChartModel.StopMedicationOn;
                    drugRecord.AdditionalInfo = drugChartModel.AdditionalInfo;
                    drugRecord.ProcedureType = drugChartModel.ProcedureType;
                    drugRecord.IsActive = true;
                    drugRecord.ModifiedDate = DateTime.Now;
                    drugRecord.Modifiedby = "User";

                    this.uow.GenericRepository<DrugChart>().Update(drugRecord);
                }

                this.uow.Save();
            }

            return drugChartModel;
        }

        ///// <summary>
        ///// Update Drug Chart Collection from Post Procedure
        ///// </summary>
        ///// <param>IEnumerable<DrugChartModel> drugChartCollection</param>
        ///// <returns>IEnumerable<DrugChartModel>. if DrugChartModel with ID = success. else = failure</returns>
        public IEnumerable<DrugChartModel> UpdateAdministrationDrugChartfromPostProcedure(IEnumerable<DrugChartModel> drugChartCollection)
        {
            DrugChart drugRecord = new DrugChart();
            if (drugChartCollection.Count() > 0)
            {
                foreach (var drug in drugChartCollection)
                {
                    drugRecord = this.uow.GenericRepository<DrugChart>().Table().FirstOrDefault(x => x.DrugChartID == drug.DrugChartID);

                    drugRecord.RecordedDuringID = drug.RecordedDuringID;
                    drugRecord.RecordedBy = drug.RecordedBy;
                    drugRecord.DrugDate = this.utilService.GetLocalTime(drug.DrugDate);
                    drugRecord.DrugName = drug.DrugName;
                    drugRecord.DrugRoute = drug.DrugRoute;
                    drugRecord.DosageDesc = drug.DosageDesc;
                    drugRecord.DrugTime = drug.DrugTime;
                    drugRecord.RateOfInfusion = drug.RateOfInfusion;
                    drugRecord.Frequency = drug.Frequency;
                    drugRecord.OrderingPhysician = drug.OrderingPhysician;
                    drugRecord.StopMedicationOn = drug.StopMedicationOn;
                    drugRecord.AdditionalInfo = drug.AdditionalInfo;
                    drugRecord.ProcedureType = drug.ProcedureType;
                    drugRecord.AdministratedBy = (drug.AdministratedBy == 0 || drug.AdministratedBy == null) ? 0 : drug.AdministratedBy;
                    drugRecord.AdministratedRemarks = drug.AdministratedRemarks;
                    drugRecord.IsActive = true;
                    drugRecord.ModifiedDate = DateTime.Now;
                    drugRecord.Modifiedby = "User";

                    this.uow.GenericRepository<DrugChart>().Update(drugRecord);
                }
                this.uow.Save();
            }

            return drugChartCollection;
        }

        ///// <summary>
        ///// Get Drug Chart List for PostProcedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DrugChartModel>. if list of DrugChartModel = success. else = failure</returns>
        public List<DrugChartModel> GetDrugChartListforPostProcedure()
        {
            var drugChartList = (from chart in this.uow.GenericRepository<DrugChart>().Table().Where(x => x.IsActive != false & x.ProcedureType.ToLower().Trim() == "postprocedure")

                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on chart.PatientID equals pat.PatientId

                                 join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                 on chart.AdmissionNo equals adm.AdmissionNo

                                 select new
                                 {
                                     chart.DrugChartID,
                                     chart.PatientID,
                                     chart.AdmissionNo,
                                     chart.RecordedDuringID,
                                     chart.RecordedBy,
                                     chart.DrugDate,
                                     chart.DrugName,
                                     chart.DrugRoute,
                                     chart.DosageDesc,
                                     chart.DrugTime,
                                     chart.RateOfInfusion,
                                     chart.Frequency,
                                     chart.OrderingPhysician,
                                     chart.StopMedicationOn,
                                     chart.AdditionalInfo,
                                     chart.ProcedureType,
                                     chart.DrugSignOffBy,
                                     chart.DrugSignOffDate,
                                     chart.DrugSignOffStatus,
                                     chart.AdministratedBy,
                                     chart.AdministratedRemarks,
                                     chart.AdminDrugSignOffBy,
                                     chart.AdminDrugSignOffDate,
                                     chart.AdminDrugSignOffStatus,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     adm.AdmissionDateTime,
                                     adm.FacilityID

                                 }).AsEnumerable().Select(DCM => new DrugChartModel
                                 {
                                     DrugChartID = DCM.DrugChartID,
                                     PatientID = DCM.PatientID,
                                     patientName = DCM.PatientFirstName + " " + DCM.PatientMiddleName + " " + DCM.PatientLastName,
                                     AdmissionNo = DCM.AdmissionNo,
                                     FacilityId = DCM.FacilityID,
                                     facilityName = DCM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DCM.FacilityID).FacilityName : "",
                                     RecordedDuringID = DCM.RecordedDuringID,
                                     RecordedBy = DCM.RecordedBy,
                                     DrugDate = DCM.DrugDate,
                                     DrugName = DCM.DrugName,
                                     DrugRoute = DCM.DrugRoute,
                                     DosageDesc = DCM.DosageDesc,
                                     DrugTime = DCM.DrugTime,
                                     RateOfInfusion = DCM.RateOfInfusion,
                                     Frequency = DCM.Frequency,
                                     OrderingPhysician = DCM.OrderingPhysician,
                                     StopMedicationOn = DCM.StopMedicationOn,
                                     AdditionalInfo = DCM.AdditionalInfo,
                                     ProcedureType = DCM.ProcedureType,
                                     DrugSignOffBy = DCM.DrugSignOffBy,
                                     DrugSignOffDate = DCM.DrugSignOffDate,
                                     DrugSignOffStatus = DCM.DrugSignOffStatus,
                                     AdministratedBy = DCM.AdministratedBy,
                                     AdministratedByName = (DCM.AdministratedBy == 0 || DCM.AdministratedBy == null) ? "" :
                                                            this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == DCM.AdministratedBy).FirstName + " "
                                                            + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == DCM.AdministratedBy).MiddleName + " "
                                                            + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == DCM.AdministratedBy).LastName,
                                     AdministratedRemarks = DCM.AdministratedRemarks,
                                     AdminDrugSignOffBy = DCM.AdminDrugSignOffBy,
                                     AdminDrugSignOffDate = DCM.AdminDrugSignOffDate,
                                     AdminDrugSignOffStatus = DCM.AdminDrugSignOffStatus,
                                     recordedDuring = DCM.RecordedDuringID == 0 ? "" : this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == DCM.RecordedDuringID).RecordedDuringDescription,
                                     AdmissionDateandTime = DCM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + DCM.AdmissionDateTime.TimeOfDay.ToString()

                                 }).ToList();

            List<DrugChartModel> drugCollection = new List<DrugChartModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (drugChartList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        drugCollection = (from drug in drugChartList
                                          join fac in facList on drug.FacilityId equals fac.FacilityId
                                          join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                          on drug.AdmissionNo.ToLower().Trim() equals adm.AdmissionNo.ToLower().Trim()
                                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                          on adm.AdmittingPhysician equals prov.ProviderID
                                          select drug).ToList();
                    }
                    else
                    {
                        drugCollection = (from drug in drugChartList
                                          join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                          on drug.AdmissionNo.ToLower().Trim() equals adm.AdmissionNo.ToLower().Trim()
                                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                          on adm.AdmittingPhysician equals prov.ProviderID
                                          select drug).ToList();
                    }
                }
                else
                {
                    drugCollection = (from drug in drugChartList
                                      join fac in facList on drug.FacilityId equals fac.FacilityId
                                      select drug).ToList();
                }
            }
            else
            {
                drugCollection = drugChartList;
            }

            return drugCollection;
        }

        ///// <summary>
        ///// Get Drug Chart List for PostProcedure Admission Number
        ///// </summary>
        ///// <param>string admissionNo</param>
        ///// <returns>List<DrugChartModel>. if list of DrugChartModel for PostProcedure by Admission Number = success. else = failure</returns>
        public List<DrugChartModel> GetDrugChartListforPostProcedurebyAdmissionNumber(string admissionNo)
        {
            var drugChartList = (from chart in this.uow.GenericRepository<DrugChart>().Table().
                                 Where(x => x.IsActive != false & x.AdmissionNo == admissionNo & x.ProcedureType.ToLower().Trim() == "postprocedure")

                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on chart.PatientID equals pat.PatientId

                                 join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                 on chart.AdmissionNo equals adm.AdmissionNo

                                 select new
                                 {
                                     chart.DrugChartID,
                                     chart.PatientID,
                                     chart.AdmissionNo,
                                     chart.RecordedDuringID,
                                     chart.RecordedBy,
                                     chart.DrugDate,
                                     chart.DrugName,
                                     chart.DrugRoute,
                                     chart.DosageDesc,
                                     chart.DrugTime,
                                     chart.RateOfInfusion,
                                     chart.Frequency,
                                     chart.OrderingPhysician,
                                     chart.StopMedicationOn,
                                     chart.AdditionalInfo,
                                     chart.ProcedureType,
                                     chart.DrugSignOffBy,
                                     chart.DrugSignOffDate,
                                     chart.DrugSignOffStatus,
                                     chart.AdministratedBy,
                                     chart.AdministratedRemarks,
                                     chart.AdminDrugSignOffBy,
                                     chart.AdminDrugSignOffDate,
                                     chart.AdminDrugSignOffStatus,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     adm.AdmissionDateTime,
                                     adm.FacilityID

                                 }).AsEnumerable().Select(DCM => new DrugChartModel
                                 {
                                     DrugChartID = DCM.DrugChartID,
                                     PatientID = DCM.PatientID,
                                     patientName = DCM.PatientFirstName + " " + DCM.PatientMiddleName + " " + DCM.PatientLastName,
                                     AdmissionNo = DCM.AdmissionNo,
                                     FacilityId = DCM.FacilityID,
                                     facilityName = DCM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DCM.FacilityID).FacilityName : "",
                                     RecordedDuringID = DCM.RecordedDuringID,
                                     RecordedBy = DCM.RecordedBy,
                                     DrugDate = DCM.DrugDate,
                                     DrugName = DCM.DrugName,
                                     DrugRoute = DCM.DrugRoute,
                                     DosageDesc = DCM.DosageDesc,
                                     DrugTime = DCM.DrugTime,
                                     RateOfInfusion = DCM.RateOfInfusion,
                                     Frequency = DCM.Frequency,
                                     OrderingPhysician = DCM.OrderingPhysician,
                                     StopMedicationOn = DCM.StopMedicationOn,
                                     AdditionalInfo = DCM.AdditionalInfo,
                                     ProcedureType = DCM.ProcedureType,
                                     DrugSignOffBy = DCM.DrugSignOffBy,
                                     DrugSignOffDate = DCM.DrugSignOffDate,
                                     DrugSignOffStatus = DCM.DrugSignOffStatus,
                                     AdministratedBy = DCM.AdministratedBy,
                                     AdministratedByName = (DCM.AdministratedBy == 0 || DCM.AdministratedBy == null) ? "" :
                                                            this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == DCM.AdministratedBy).FirstName + " "
                                                            + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == DCM.AdministratedBy).MiddleName + " "
                                                            + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == DCM.AdministratedBy).LastName,
                                     AdministratedRemarks = DCM.AdministratedRemarks,
                                     AdminDrugSignOffBy = DCM.AdminDrugSignOffBy,
                                     AdminDrugSignOffDate = DCM.AdminDrugSignOffDate,
                                     AdminDrugSignOffStatus = DCM.AdminDrugSignOffStatus,
                                     recordedDuring = DCM.RecordedDuringID == 0 ? "" : this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == DCM.RecordedDuringID).RecordedDuringDescription,
                                     AdmissionDateandTime = DCM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + DCM.AdmissionDateTime.TimeOfDay.ToString()

                                 }).ToList();

            List<DrugChartModel> drugCollection = new List<DrugChartModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (drugChartList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        drugCollection = (from drug in drugChartList
                                          join fac in facList on drug.FacilityId equals fac.FacilityId
                                          join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                          on drug.AdmissionNo.ToLower().Trim() equals adm.AdmissionNo.ToLower().Trim()
                                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                          on adm.AdmittingPhysician equals prov.ProviderID
                                          select drug).ToList();
                    }
                    else
                    {
                        drugCollection = (from drug in drugChartList
                                          join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                          on drug.AdmissionNo.ToLower().Trim() equals adm.AdmissionNo.ToLower().Trim()
                                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                          on adm.AdmittingPhysician equals prov.ProviderID
                                          select drug).ToList();
                    }
                }
                else
                {
                    drugCollection = (from drug in drugChartList
                                      join fac in facList on drug.FacilityId equals fac.FacilityId
                                      select drug).ToList();
                }
            }
            else
            {
                drugCollection = drugChartList;
            }

            return drugCollection;
        }

        ///// <summary>
        ///// Get Drug Chart by ID from Post Procedure 
        ///// </summary>
        ///// <param>int drugChartId</param>
        ///// <returns>DrugChartModel. if the record of DrugChartModel for given drugChartId = success. else = failure</returns>
        public DrugChartModel GetDrugChartRecordfromPostProcedurebyId(int drugChartId)
        {
            var drugChartRecord = (from chart in this.uow.GenericRepository<DrugChart>().Table().Where(x => x.DrugChartID == drugChartId)

                                   join pat in this.uow.GenericRepository<Patient>().Table()
                                   on chart.PatientID equals pat.PatientId

                                   join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                   on chart.AdmissionNo equals adm.AdmissionNo

                                   select new
                                   {
                                       chart.DrugChartID,
                                       chart.PatientID,
                                       chart.AdmissionNo,
                                       chart.RecordedDuringID,
                                       chart.RecordedBy,
                                       chart.DrugDate,
                                       chart.DrugName,
                                       chart.DrugRoute,
                                       chart.DosageDesc,
                                       chart.DrugTime,
                                       chart.RateOfInfusion,
                                       chart.Frequency,
                                       chart.OrderingPhysician,
                                       chart.StopMedicationOn,
                                       chart.AdditionalInfo,
                                       chart.ProcedureType,
                                       chart.DrugSignOffBy,
                                       chart.DrugSignOffDate,
                                       chart.DrugSignOffStatus,
                                       chart.AdministratedBy,
                                       chart.AdministratedRemarks,
                                       pat.PatientFirstName,
                                       pat.PatientMiddleName,
                                       pat.PatientLastName,
                                       adm.AdmissionDateTime,
                                       adm.FacilityID

                                   }).AsEnumerable().Select(DCM => new DrugChartModel
                                   {
                                       DrugChartID = DCM.DrugChartID,
                                       PatientID = DCM.PatientID,
                                       patientName = DCM.PatientFirstName + " " + DCM.PatientMiddleName + " " + DCM.PatientLastName,
                                       AdmissionNo = DCM.AdmissionNo,
                                       FacilityId = DCM.FacilityID,
                                       facilityName = DCM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == DCM.FacilityID).FacilityName : "",
                                       RecordedDuringID = DCM.RecordedDuringID,
                                       RecordedBy = DCM.RecordedBy,
                                       DrugDate = DCM.DrugDate,
                                       DrugName = DCM.DrugName,
                                       DrugRoute = DCM.DrugRoute,
                                       DosageDesc = DCM.DosageDesc,
                                       DrugTime = DCM.DrugTime,
                                       RateOfInfusion = DCM.RateOfInfusion,
                                       Frequency = DCM.Frequency,
                                       OrderingPhysician = DCM.OrderingPhysician,
                                       StopMedicationOn = DCM.StopMedicationOn,
                                       AdditionalInfo = DCM.AdditionalInfo,
                                       ProcedureType = DCM.ProcedureType,
                                       DrugSignOffBy = DCM.DrugSignOffBy,
                                       DrugSignOffDate = DCM.DrugSignOffDate,
                                       DrugSignOffStatus = DCM.DrugSignOffStatus,
                                       AdministratedBy = DCM.AdministratedBy,
                                       AdministratedByName = (DCM.AdministratedBy == 0 || DCM.AdministratedBy == null) ? "" :
                                                            this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == DCM.AdministratedBy).FirstName + " "
                                                            + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == DCM.AdministratedBy).MiddleName + " "
                                                            + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == DCM.AdministratedBy).LastName,
                                       AdministratedRemarks = DCM.AdministratedRemarks,
                                       recordedDuring = DCM.RecordedDuringID == 0 ? "" : this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == DCM.RecordedDuringID).RecordedDuringDescription,
                                       AdmissionDateandTime = DCM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + DCM.AdmissionDateTime.TimeOfDay.ToString()

                                   }).FirstOrDefault();

            return drugChartRecord;
        }

        ///// <summary>
        ///// Delete Drug Chart record by ID from Post Procedure 
        ///// </summary>
        ///// <param>int drugChartId</param>
        ///// <returns>DrugChart. if the record of Drug Chart for given drugChartId is deleted = success. else = failure</returns>
        public DrugChart DeleteDrugChartRecordfromPostProcedurebyId(int drugChartId)
        {
            var drugChart = this.uow.GenericRepository<DrugChart>().Table().Where(x => x.DrugChartID == drugChartId).FirstOrDefault();

            if (drugChart != null)
            {
                drugChart.IsActive = false;
                this.uow.GenericRepository<DrugChart>().Update(drugChart);
                this.uow.Save();
            }
            return drugChart;
        }

        #endregion

        #region Post Procedure Case Sheet

        ///// <summary>
        ///// Add or Update Post Procedure Case Sheet
        ///// </summary>
        ///// <param>PostProcedureCaseSheetModel postProcedureCaseSheetModel</param>
        ///// <returns>PostProcedureCaseSheetModel. if PostProcedureCaseSheetModel with ID after add or update = success. else = failure</returns>
        public PostProcedureCaseSheetModel AddUpdatePostProcedureCaseSheetData(PostProcedureCaseSheetModel postProcedureCaseSheetModel)
        {
            var postProcedureCaseSheetRecord = this.uow.GenericRepository<PostProcedureCaseSheet>().Table().Where(x => x.PreProcedureID == postProcedureCaseSheetModel.PreProcedureID).FirstOrDefault();

            if (postProcedureCaseSheetRecord == null)
            {
                postProcedureCaseSheetRecord = new PostProcedureCaseSheet();

                postProcedureCaseSheetRecord.PreProcedureID = postProcedureCaseSheetModel.PreProcedureID;
                postProcedureCaseSheetRecord.RecordedDate = this.utilService.GetLocalTime(postProcedureCaseSheetModel.RecordedDate);
                postProcedureCaseSheetRecord.RecordedDuring = postProcedureCaseSheetModel.RecordedDuring;
                postProcedureCaseSheetRecord.RecordedBy = postProcedureCaseSheetModel.RecordedBy;
                postProcedureCaseSheetRecord.ProcedureStartDate = this.utilService.GetLocalTime(postProcedureCaseSheetModel.ProcedureStartDate);
                postProcedureCaseSheetRecord.ProcedureEndDate = this.utilService.GetLocalTime(postProcedureCaseSheetModel.ProcedureEndDate);
                postProcedureCaseSheetRecord.AttendingPhysician = postProcedureCaseSheetModel.AttendingPhysician;
                postProcedureCaseSheetRecord.ProcedureNotes = postProcedureCaseSheetModel.ProcedureNotes;
                postProcedureCaseSheetRecord.ProcedureName = postProcedureCaseSheetModel.ProcedureName;
                postProcedureCaseSheetRecord.PrimaryCPT = postProcedureCaseSheetModel.PrimaryCPT;
                postProcedureCaseSheetRecord.Specimens = postProcedureCaseSheetModel.Specimens;
                postProcedureCaseSheetRecord.DiagnosisNotes = postProcedureCaseSheetModel.DiagnosisNotes;
                postProcedureCaseSheetRecord.Complications = postProcedureCaseSheetModel.Complications;
                postProcedureCaseSheetRecord.BloodLossTransfusion = postProcedureCaseSheetModel.BloodLossTransfusion;
                postProcedureCaseSheetRecord.AdditionalInfo = postProcedureCaseSheetModel.AdditionalInfo;
                postProcedureCaseSheetRecord.ProcedureStatus = postProcedureCaseSheetModel.ProcedureStatus;
                postProcedureCaseSheetRecord.ProcedureStatusNotes = postProcedureCaseSheetModel.ProcedureStatusNotes;
                postProcedureCaseSheetRecord.PatientCondition = postProcedureCaseSheetModel.PatientCondition;
                postProcedureCaseSheetRecord.PainLevel = postProcedureCaseSheetModel.PainLevel;
                postProcedureCaseSheetRecord.PainSleepMedication = postProcedureCaseSheetModel.PainSleepMedication;
                postProcedureCaseSheetRecord.Createddate = DateTime.Now;
                postProcedureCaseSheetRecord.CreatedBy = "User";

                this.uow.GenericRepository<PostProcedureCaseSheet>().Insert(postProcedureCaseSheetRecord);
            }
            else
            {
                postProcedureCaseSheetRecord.RecordedDate = this.utilService.GetLocalTime(postProcedureCaseSheetModel.RecordedDate);
                postProcedureCaseSheetRecord.RecordedDuring = postProcedureCaseSheetModel.RecordedDuring;
                postProcedureCaseSheetRecord.RecordedBy = postProcedureCaseSheetModel.RecordedBy;
                postProcedureCaseSheetRecord.ProcedureStartDate = this.utilService.GetLocalTime(postProcedureCaseSheetModel.ProcedureStartDate);
                postProcedureCaseSheetRecord.ProcedureEndDate = this.utilService.GetLocalTime(postProcedureCaseSheetModel.ProcedureEndDate);
                postProcedureCaseSheetRecord.AttendingPhysician = postProcedureCaseSheetModel.AttendingPhysician;
                postProcedureCaseSheetRecord.ProcedureNotes = postProcedureCaseSheetModel.ProcedureNotes;
                postProcedureCaseSheetRecord.ProcedureName = postProcedureCaseSheetModel.ProcedureName;
                postProcedureCaseSheetRecord.PrimaryCPT = postProcedureCaseSheetModel.PrimaryCPT;
                postProcedureCaseSheetRecord.Specimens = postProcedureCaseSheetModel.Specimens;
                postProcedureCaseSheetRecord.DiagnosisNotes = postProcedureCaseSheetModel.DiagnosisNotes;
                postProcedureCaseSheetRecord.Complications = postProcedureCaseSheetModel.Complications;
                postProcedureCaseSheetRecord.BloodLossTransfusion = postProcedureCaseSheetModel.BloodLossTransfusion;
                postProcedureCaseSheetRecord.AdditionalInfo = postProcedureCaseSheetModel.AdditionalInfo;
                postProcedureCaseSheetRecord.ProcedureStatus = postProcedureCaseSheetModel.ProcedureStatus;
                postProcedureCaseSheetRecord.ProcedureStatusNotes = postProcedureCaseSheetModel.ProcedureStatusNotes;
                postProcedureCaseSheetRecord.PatientCondition = postProcedureCaseSheetModel.PatientCondition;
                postProcedureCaseSheetRecord.PainLevel = postProcedureCaseSheetModel.PainLevel;
                postProcedureCaseSheetRecord.PainSleepMedication = postProcedureCaseSheetModel.PainSleepMedication;
                postProcedureCaseSheetRecord.ModifiedDate = DateTime.Now;
                postProcedureCaseSheetRecord.ModifiedBy = "User";

                this.uow.GenericRepository<PostProcedureCaseSheet>().Update(postProcedureCaseSheetRecord);
            }
            this.uow.Save();
            postProcedureCaseSheetModel.PostProcedureID = postProcedureCaseSheetRecord.PostProcedureID;

            return postProcedureCaseSheetModel;
        }

        ///// <summary>
        ///// Get Post Procedure Case Sheet for Patient
        ///// </summary>
        ///// <param>int patientID</param>
        ///// <returns>List<PostProcedureCaseSheetModel>. if list of PostProcedureCaseSheetModel = success. else = failure</returns>
        public List<PostProcedureCaseSheetModel> GetPostProcedureCaseSheetsforPatient(int patientID)
        {
            var postProcedureCaseSheetList = (from postProc in this.uow.GenericRepository<PostProcedureCaseSheet>().Table()

                                              join preProc in this.uow.GenericRepository<PreProcedure>().Table()
                                              .Where(x => x.ProcedureStatus.ToLower().Trim() != "admitted" & x.ProcedureStatus.ToLower().Trim() != "cancelled")
                                              on postProc.PreProcedureID equals preProc.PreProcedureID

                                              join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                              on preProc.AdmissionID equals adm.AdmissionID

                                              join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == patientID)
                                              on adm.PatientID equals pat.PatientId

                                              select new
                                              {
                                                  postProc.PostProcedureID,
                                                  postProc.PreProcedureID,
                                                  postProc.RecordedDate,
                                                  postProc.RecordedDuring,
                                                  postProc.RecordedBy,
                                                  postProc.ProcedureStartDate,
                                                  postProc.ProcedureEndDate,
                                                  postProc.AttendingPhysician,
                                                  postProc.ProcedureNotes,
                                                  postProc.ProcedureName,
                                                  postProc.PrimaryCPT,
                                                  postProc.Specimens,
                                                  postProc.DiagnosisNotes,
                                                  postProc.Complications,
                                                  postProc.BloodLossTransfusion,
                                                  postProc.AdditionalInfo,
                                                  postProc.ProcedureStatus,
                                                  postProc.ProcedureStatusNotes,
                                                  postProc.PatientCondition,
                                                  postProc.PainLevel,
                                                  postProc.PainSleepMedication,
                                                  postProc.SignOffDate,
                                                  postProc.SignOffUser,
                                                  postProc.SignOffStatus,
                                                  adm.AdmissionNo,
                                                  adm.FacilityID,
                                                  pat.PatientId,
                                                  pat.PatientFirstName,
                                                  pat.PatientMiddleName,
                                                  pat.PatientLastName

                                              }).AsEnumerable().OrderByDescending(x => x.ProcedureStartDate).Select(PPM => new PostProcedureCaseSheetModel
                                              {
                                                  PostProcedureID = PPM.PostProcedureID,
                                                  PreProcedureID = PPM.PreProcedureID,
                                                  admissionNo = PPM.AdmissionNo,
                                                  FacilityId = PPM.FacilityID,
                                                  facilityName = PPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PPM.FacilityID).FacilityName : "",
                                                  PatientId = PPM.PatientId,
                                                  PatientName = PPM.PatientFirstName + " " + PPM.PatientMiddleName + " " + PPM.PatientLastName,
                                                  RecordedDate = PPM.RecordedDate,
                                                  RecordedDuring = PPM.RecordedDuring,
                                                  recordedDuringValue = PPM.RecordedDuring == 0 ? "" : this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PPM.RecordedDuring).RecordedDuringDescription,
                                                  RecordedBy = PPM.RecordedBy,
                                                  ProcedureStartDate = PPM.ProcedureStartDate,
                                                  ProcedureEndDate = PPM.ProcedureEndDate,
                                                  AttendingPhysician = PPM.AttendingPhysician,
                                                  attendingPhysicianName = PPM.AttendingPhysician == 0 ? "" :
                                                                              this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).FirstName + " "
                                                                              + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).MiddleName + " "
                                                                              + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).LastName,
                                                  ProcedureNotes = PPM.ProcedureNotes,
                                                  ProcedureName = PPM.ProcedureName,
                                                  procedureNameDesc = PPM.ProcedureName == 0 ? "" :
                                                                          this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == PPM.ProcedureName).ProcedureDesc,
                                                  PrimaryCPT = PPM.PrimaryCPT,
                                                  Specimens = PPM.Specimens,
                                                  DiagnosisNotes = PPM.DiagnosisNotes,
                                                  Complications = PPM.Complications,
                                                  BloodLossTransfusion = PPM.BloodLossTransfusion,
                                                  AdditionalInfo = PPM.AdditionalInfo,
                                                  ProcedureStatus = PPM.ProcedureStatus,
                                                  ProcedureStatusNotes = PPM.ProcedureStatusNotes,
                                                  PatientCondition = PPM.PatientCondition,
                                                  patientConditionDesc = (PPM.PatientCondition == 0 || PPM.PatientCondition == null) ? "" :
                                                                          this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == PPM.PatientCondition).PatientArrivalconditionDescription,
                                                  PainLevel = PPM.PainLevel,
                                                  painLevelDesc = (PPM.PainLevel == 0 || PPM.PainLevel == null) ? "" :
                                                                          this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == PPM.PainLevel).PainScaleDesc,
                                                  PainSleepMedication = PPM.PainSleepMedication,
                                                  SignOffDate = PPM.SignOffDate,
                                                  SignOffUser = PPM.SignOffUser,
                                                  SignOffStatus = PPM.SignOffStatus,
                                                  preProcedureModel = this.GetPreProcedureforPostProcedurebyId(PPM.PreProcedureID),
                                                  PostProcedureFile = this.GetFile(PPM.PostProcedureID.ToString(), "PostProcedure/CaseSheet").Count() > 0 ? this.GetFile(PPM.PostProcedureID.ToString(), "PostProcedure/CaseSheet") : new List<clsViewFile>()

                                              }).ToList();

            List<PostProcedureCaseSheetModel> postProcCaseCollection = new List<PostProcedureCaseSheetModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (postProcedureCaseSheetList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        postProcCaseCollection = (from post in postProcedureCaseSheetList
                                                  join fac in facList on post.FacilityId equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on post.AttendingPhysician equals prov.ProviderID
                                                  select post).ToList();
                    }
                    else
                    {
                        postProcCaseCollection = (from post in postProcedureCaseSheetList
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on post.AttendingPhysician equals prov.ProviderID
                                                  select post).ToList();
                    }
                }
                else
                {
                    postProcCaseCollection = (from post in postProcedureCaseSheetList
                                              join fac in facList on post.FacilityId equals fac.FacilityId
                                              select post).ToList();
                }
            }
            else
            {
                postProcCaseCollection = postProcedureCaseSheetList;
            }

            return postProcCaseCollection;
        }

        ///// <summary>
        ///// Get Post Procedure 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PostProcedureModel>. if list of PostProcedureModel = success. else = failure</returns>
        public List<PostProcedureCaseSheetModel> GetAllPostProcedureCaseSheetData()
        {
            var postProcedureCaseSheetList = (from postProc in this.uow.GenericRepository<PostProcedureCaseSheet>().Table()

                                              join preProc in this.uow.GenericRepository<PreProcedure>().Table()
                                              .Where(x => x.ProcedureStatus.ToLower().Trim() != "admitted" & x.ProcedureStatus.ToLower().Trim() != "cancelled")
                                              on postProc.PreProcedureID equals preProc.PreProcedureID

                                              join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                              on preProc.AdmissionID equals adm.AdmissionID

                                              join pat in this.uow.GenericRepository<Patient>().Table()
                                              on adm.PatientID equals pat.PatientId

                                              select new
                                              {
                                                  postProc.PostProcedureID,
                                                  postProc.PreProcedureID,
                                                  postProc.RecordedDate,
                                                  postProc.RecordedDuring,
                                                  postProc.RecordedBy,
                                                  postProc.ProcedureStartDate,
                                                  postProc.ProcedureEndDate,
                                                  postProc.AttendingPhysician,
                                                  postProc.ProcedureNotes,
                                                  postProc.ProcedureName,
                                                  postProc.PrimaryCPT,
                                                  postProc.Specimens,
                                                  postProc.DiagnosisNotes,
                                                  postProc.Complications,
                                                  postProc.BloodLossTransfusion,
                                                  postProc.AdditionalInfo,
                                                  postProc.ProcedureStatus,
                                                  postProc.ProcedureStatusNotes,
                                                  postProc.PatientCondition,
                                                  postProc.PainLevel,
                                                  postProc.PainSleepMedication,
                                                  postProc.SignOffDate,
                                                  postProc.SignOffUser,
                                                  postProc.SignOffStatus,
                                                  adm.AdmissionNo,
                                                  adm.AdmissionDateTime,
                                                  adm.FacilityID,
                                                  pat.PatientId,
                                                  pat.PatientFirstName,
                                                  pat.PatientMiddleName,
                                                  pat.PatientLastName

                                              }).AsEnumerable().OrderByDescending(x => x.ProcedureStartDate).Select(PPM => new PostProcedureCaseSheetModel
                                              {
                                                  PostProcedureID = PPM.PostProcedureID,
                                                  PreProcedureID = PPM.PreProcedureID,
                                                  admissionNo = PPM.AdmissionNo,
                                                  FacilityId = PPM.FacilityID,
                                                  facilityName = PPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PPM.FacilityID).FacilityName : "",
                                                  PatientId = PPM.PatientId,
                                                  PatientName = PPM.PatientFirstName + " " + PPM.PatientMiddleName + " " + PPM.PatientLastName,
                                                  RecordedDate = PPM.RecordedDate,
                                                  RecordedDuring = PPM.RecordedDuring,
                                                  recordedDuringValue = PPM.RecordedDuring == 0 ? "" : this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PPM.RecordedDuring).RecordedDuringDescription,
                                                  RecordedBy = PPM.RecordedBy,
                                                  ProcedureStartDate = PPM.ProcedureStartDate,
                                                  ProcedureEndDate = PPM.ProcedureEndDate,
                                                  AttendingPhysician = PPM.AttendingPhysician,
                                                  attendingPhysicianName = PPM.AttendingPhysician == 0 ? "" :
                                                                              this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).FirstName + " "
                                                                              + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).MiddleName + " "
                                                                              + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).LastName,
                                                  ProcedureNotes = PPM.ProcedureNotes,
                                                  ProcedureName = PPM.ProcedureName,
                                                  procedureNameDesc = PPM.ProcedureName == 0 ? "" : this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == PPM.ProcedureName).ProcedureDesc,
                                                  PrimaryCPT = PPM.PrimaryCPT,
                                                  Specimens = PPM.Specimens,
                                                  DiagnosisNotes = PPM.DiagnosisNotes,
                                                  Complications = PPM.Complications,
                                                  BloodLossTransfusion = PPM.BloodLossTransfusion,
                                                  AdditionalInfo = PPM.AdditionalInfo,
                                                  ProcedureStatus = PPM.ProcedureStatus,
                                                  ProcedureStatusNotes = PPM.ProcedureStatusNotes,
                                                  PatientCondition = PPM.PatientCondition,
                                                  patientConditionDesc = (PPM.PatientCondition == 0 || PPM.PatientCondition == null) ? "" :
                                                                    this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == PPM.PatientCondition).PatientArrivalconditionDescription,
                                                  PainLevel = PPM.PainLevel,
                                                  painLevelDesc = (PPM.PainLevel == 0 || PPM.PainLevel == null) ? "" :
                                                                    this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == PPM.PainLevel).PainScaleDesc,
                                                  PainSleepMedication = PPM.PainSleepMedication,
                                                  SignOffDate = PPM.SignOffDate,
                                                  SignOffUser = PPM.SignOffUser,
                                                  SignOffStatus = PPM.SignOffStatus,
                                                  AdmissionDateandTime = PPM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + PPM.AdmissionDateTime.TimeOfDay.ToString(),
                                                  preProcedureModel = this.GetPreProcedureforPostProcedurebyId(PPM.PreProcedureID),
                                                  PostProcedureFile = this.GetFile(PPM.PostProcedureID.ToString(), "PostProcedure/CaseSheet").Count() > 0 ? this.GetFile(PPM.PostProcedureID.ToString(), "PostProcedure/CaseSheet") : new List<clsViewFile>()

                                              }).ToList();

            List<PostProcedureCaseSheetModel> postProcCaseCollection = new List<PostProcedureCaseSheetModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (postProcedureCaseSheetList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        postProcCaseCollection = (from post in postProcedureCaseSheetList
                                                  join fac in facList on post.FacilityId equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on post.AttendingPhysician equals prov.ProviderID
                                                  select post).ToList();
                    }
                    else
                    {
                        postProcCaseCollection = (from post in postProcedureCaseSheetList
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on post.AttendingPhysician equals prov.ProviderID
                                                  select post).ToList();
                    }
                }
                else
                {
                    postProcCaseCollection = (from post in postProcedureCaseSheetList
                                              join fac in facList on post.FacilityId equals fac.FacilityId
                                              select post).ToList();
                }
            }
            else
            {
                postProcCaseCollection = postProcedureCaseSheetList;
            }
            return postProcCaseCollection;
        }

        ///// <summary>
        ///// Get Post Procedure by admissionId
        ///// </summary>
        ///// <param>int admissionId</param>
        ///// <returns>PostProcedureModel. if record of PostProcedureModel by AdmissionId = success. else = failure</returns>
        public PostProcedureCaseSheetModel GetPostProcedureCaseSheetbyAdmissionId(int admissionId)
        {
            var postProcedureCaseSheetrecord = (from postProc in this.uow.GenericRepository<PostProcedureCaseSheet>().Table()

                                                join preProc in this.uow.GenericRepository<PreProcedure>().Table()
                                                on postProc.PreProcedureID equals preProc.PreProcedureID

                                                join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionID == admissionId & x.IsActive != false)
                                                on preProc.AdmissionID equals adm.AdmissionID

                                                join pat in this.uow.GenericRepository<Patient>().Table()
                                                on adm.PatientID equals pat.PatientId

                                                select new
                                                {
                                                    postProc.PostProcedureID,
                                                    postProc.PreProcedureID,
                                                    postProc.RecordedDate,
                                                    postProc.RecordedDuring,
                                                    postProc.RecordedBy,
                                                    postProc.ProcedureStartDate,
                                                    postProc.ProcedureEndDate,
                                                    postProc.AttendingPhysician,
                                                    postProc.ProcedureNotes,
                                                    postProc.ProcedureName,
                                                    postProc.PrimaryCPT,
                                                    postProc.Specimens,
                                                    postProc.DiagnosisNotes,
                                                    postProc.Complications,
                                                    postProc.BloodLossTransfusion,
                                                    postProc.AdditionalInfo,
                                                    postProc.ProcedureStatus,
                                                    postProc.ProcedureStatusNotes,
                                                    postProc.PatientCondition,
                                                    postProc.PainLevel,
                                                    postProc.PainSleepMedication,
                                                    postProc.SignOffDate,
                                                    postProc.SignOffUser,
                                                    postProc.SignOffStatus,
                                                    adm.AdmissionNo,
                                                    adm.AdmissionDateTime,
                                                    adm.FacilityID,
                                                    pat.PatientId,
                                                    pat.PatientFirstName,
                                                    pat.PatientMiddleName,
                                                    pat.PatientLastName

                                                }).AsEnumerable().Select(PPM => new PostProcedureCaseSheetModel
                                                {
                                                    PostProcedureID = PPM.PostProcedureID,
                                                    PreProcedureID = PPM.PreProcedureID,
                                                    admissionNo = PPM.AdmissionNo,
                                                    FacilityId = PPM.FacilityID,
                                                    facilityName = PPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PPM.FacilityID).FacilityName : "",
                                                    PatientId = PPM.PatientId,
                                                    PatientName = PPM.PatientFirstName + " " + PPM.PatientMiddleName + " " + PPM.PatientLastName,
                                                    RecordedDate = PPM.RecordedDate,
                                                    RecordedDuring = PPM.RecordedDuring,
                                                    recordedDuringValue = PPM.RecordedDuring == 0 ? "" : this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PPM.RecordedDuring).RecordedDuringDescription,
                                                    RecordedBy = PPM.RecordedBy,
                                                    ProcedureStartDate = PPM.ProcedureStartDate,
                                                    ProcedureEndDate = PPM.ProcedureEndDate,
                                                    AttendingPhysician = PPM.AttendingPhysician,
                                                    attendingPhysicianName = PPM.AttendingPhysician == 0 ? "" :
                                                                                this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).FirstName + " "
                                                                                + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).MiddleName + " "
                                                                                + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).LastName,
                                                    ProcedureNotes = PPM.ProcedureNotes,
                                                    ProcedureName = PPM.ProcedureName,
                                                    procedureNameDesc = PPM.ProcedureName == 0 ? "" : this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == PPM.ProcedureName).ProcedureDesc,
                                                    PrimaryCPT = PPM.PrimaryCPT,
                                                    Specimens = PPM.Specimens,
                                                    DiagnosisNotes = PPM.DiagnosisNotes,
                                                    Complications = PPM.Complications,
                                                    BloodLossTransfusion = PPM.BloodLossTransfusion,
                                                    AdditionalInfo = PPM.AdditionalInfo,
                                                    ProcedureStatus = PPM.ProcedureStatus,
                                                    ProcedureStatusNotes = PPM.ProcedureStatusNotes,
                                                    PatientCondition = PPM.PatientCondition,
                                                    patientConditionDesc = (PPM.PatientCondition == 0 || PPM.PatientCondition == null) ? "" : this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == PPM.PatientCondition).PatientArrivalconditionDescription,
                                                    PainLevel = PPM.PainLevel,
                                                    painLevelDesc = (PPM.PainLevel == 0 || PPM.PainLevel == null) ? "" :
                                                                    this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == PPM.PainLevel).PainScaleDesc,
                                                    PainSleepMedication = PPM.PainSleepMedication,
                                                    SignOffDate = PPM.SignOffDate,
                                                    SignOffUser = PPM.SignOffUser,
                                                    SignOffStatus = PPM.SignOffStatus,
                                                    AdmissionDateandTime = PPM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + PPM.AdmissionDateTime.TimeOfDay.ToString(),
                                                    preProcedureModel = this.GetPreProcedureforPostProcedurebyId(PPM.PreProcedureID),
                                                    PostProcedureFile = this.GetFile(PPM.PostProcedureID.ToString(), "PostProcedure/CaseSheet").Count() > 0 ? this.GetFile(PPM.PostProcedureID.ToString(), "PostProcedure/CaseSheet") : new List<clsViewFile>()

                                                }).FirstOrDefault();

            return postProcedureCaseSheetrecord;
        }

        ///// <summary>
        ///// Get Post Procedure by postProcedureId
        ///// </summary>
        ///// <param>int postProcedureId</param>
        ///// <returns>PostProcedureModel. if record of PostProcedureModel by postProcedureId = success. else = failure</returns>
        public PostProcedureCaseSheetModel GetPostProcedureCaseSheetbyId(int postProcedureId)
        {
            var postProcedureCaseSheetrecord = (from postProc in this.uow.GenericRepository<PostProcedureCaseSheet>().Table().Where(x => x.PostProcedureID == postProcedureId)

                                                join preProc in this.uow.GenericRepository<PreProcedure>().Table()
                                                on postProc.PreProcedureID equals preProc.PreProcedureID

                                                join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                on preProc.AdmissionID equals adm.AdmissionID

                                                join pat in this.uow.GenericRepository<Patient>().Table()
                                                on adm.PatientID equals pat.PatientId

                                                select new
                                                {
                                                    postProc.PostProcedureID,
                                                    postProc.PreProcedureID,
                                                    postProc.RecordedDate,
                                                    postProc.RecordedDuring,
                                                    postProc.RecordedBy,
                                                    postProc.ProcedureStartDate,
                                                    postProc.ProcedureEndDate,
                                                    postProc.AttendingPhysician,
                                                    postProc.ProcedureNotes,
                                                    postProc.ProcedureName,
                                                    postProc.PrimaryCPT,
                                                    postProc.Specimens,
                                                    postProc.DiagnosisNotes,
                                                    postProc.Complications,
                                                    postProc.BloodLossTransfusion,
                                                    postProc.AdditionalInfo,
                                                    postProc.ProcedureStatus,
                                                    postProc.ProcedureStatusNotes,
                                                    postProc.PatientCondition,
                                                    postProc.PainLevel,
                                                    postProc.PainSleepMedication,
                                                    postProc.SignOffDate,
                                                    postProc.SignOffUser,
                                                    postProc.SignOffStatus,
                                                    adm.AdmissionNo,
                                                    adm.FacilityID,
                                                    pat.PatientId,
                                                    pat.PatientFirstName,
                                                    pat.PatientMiddleName,
                                                    pat.PatientLastName

                                                }).AsEnumerable().Select(PPM => new PostProcedureCaseSheetModel
                                                {
                                                    PostProcedureID = PPM.PostProcedureID,
                                                    PreProcedureID = PPM.PreProcedureID,
                                                    admissionNo = PPM.AdmissionNo,
                                                    FacilityId = PPM.FacilityID,
                                                    facilityName = PPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PPM.FacilityID).FacilityName : "",
                                                    PatientId = PPM.PatientId,
                                                    PatientName = PPM.PatientFirstName + " " + PPM.PatientMiddleName + " " + PPM.PatientLastName,
                                                    RecordedDate = PPM.RecordedDate,
                                                    RecordedDuring = PPM.RecordedDuring,
                                                    recordedDuringValue = PPM.RecordedDuring == 0 ? "" : this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PPM.RecordedDuring).RecordedDuringDescription,
                                                    RecordedBy = PPM.RecordedBy,
                                                    ProcedureStartDate = PPM.ProcedureStartDate,
                                                    ProcedureEndDate = PPM.ProcedureEndDate,
                                                    AttendingPhysician = PPM.AttendingPhysician,
                                                    attendingPhysicianName = PPM.AttendingPhysician == 0 ? "" :
                                                                                this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).FirstName + " "
                                                                                + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).MiddleName + " "
                                                                                + this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == PPM.AttendingPhysician).LastName,
                                                    ProcedureNotes = PPM.ProcedureNotes,
                                                    ProcedureName = PPM.ProcedureName,
                                                    procedureNameDesc = PPM.ProcedureName == 0 ? "" : this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == PPM.ProcedureName).ProcedureDesc,
                                                    PrimaryCPT = PPM.PrimaryCPT,
                                                    Specimens = PPM.Specimens,
                                                    DiagnosisNotes = PPM.DiagnosisNotes,
                                                    Complications = PPM.Complications,
                                                    BloodLossTransfusion = PPM.BloodLossTransfusion,
                                                    AdditionalInfo = PPM.AdditionalInfo,
                                                    ProcedureStatus = PPM.ProcedureStatus,
                                                    ProcedureStatusNotes = PPM.ProcedureStatusNotes,
                                                    PatientCondition = PPM.PatientCondition,
                                                    patientConditionDesc = (PPM.PatientCondition == 0 || PPM.PatientCondition == null) ? "" : this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == PPM.PatientCondition).PatientArrivalconditionDescription,
                                                    PainLevel = PPM.PainLevel,
                                                    painLevelDesc = (PPM.PainLevel == 0 || PPM.PainLevel == null) ? "" : this.uow.GenericRepository<PainScale>().Table().FirstOrDefault(x => x.PainScaleID == PPM.PainLevel).PainScaleDesc,
                                                    PainSleepMedication = PPM.PainSleepMedication,
                                                    SignOffDate = PPM.SignOffDate,
                                                    SignOffUser = PPM.SignOffUser,
                                                    SignOffStatus = PPM.SignOffStatus,
                                                    preProcedureModel = this.GetPreProcedureforPostProcedurebyId(PPM.PreProcedureID),
                                                    PostProcedureFile = this.GetFile(PPM.PostProcedureID.ToString(), "PostProcedure/CaseSheet").Count() > 0 ? this.GetFile(PPM.PostProcedureID.ToString(), "PostProcedure/CaseSheet") : new List<clsViewFile>()

                                                }).FirstOrDefault();

            return postProcedureCaseSheetrecord;
        }

        #endregion

        #region Post Procedure Search and Count

        ///// <summary>
        ///// Get Patients for Post Procedure search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForPostProcedureSearch(string searchKey)
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
        ///// Get Providers For Post Procedure Search
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for PreProcedure = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforPostProcedureSearch(string searchKey)
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
        ///// Get Counts of Post Procedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> If counts of PreProcedure = success. else = failure</returns>
        public PrePostProcedureCountModel GetTodayPostProcedureCount()
        {
            PrePostProcedureCountModel countModel = new PrePostProcedureCountModel();

            var preProcedures = this.GetPreProceduresforPostProcedure().Where(x => x.ProcedureDate.Date == DateTime.Now.Date).ToList();

            countModel.TotalRequestCount = preProcedures.Count();
            countModel.FitnessClearanceCount = preProcedures.Where(x => x.AnesthesiaFitnessRequired == true).ToList().Count();
            countModel.ScheduledCount = preProcedures.Where(x => x.ProcedureStatus.ToLower().Trim() == "scheduled").ToList().Count();

            return countModel;
        }

        ///// <summary>
        ///// Get pre procedures by using SearchModel
        ///// </summary>
        ///// <param>(SearchModel searchModel)</param>
        ///// <returns>List<PreProcedureModel>. if Collection of AdmissionsModel = success. else = failure</returns>
        public List<PreProcedureModel> GetPreProceduresBySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            var preProcedureList = (from preProc in this.uow.GenericRepository<PreProcedure>().Table().
                                    Where(x => x.ProcedureStatus.ToLower().Trim() != "admitted" & x.ProcedureStatus.ToLower().Trim() != "cancelled")

                                    join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                    on preProc.AdmissionID equals adm.AdmissionID

                                    join pat in this.uow.GenericRepository<Patient>().Table()
                                    on adm.PatientID equals pat.PatientId

                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                    on preProc.ScheduleApprovedBy equals prov.ProviderID

                                    where
                                      (Fromdate.Date <= preProc.ProcedureDate.Date
                                            && (Todate.Date >= Fromdate.Date && preProc.ProcedureDate.Date <= Todate.Date)
                                            && (searchModel.PatientId == 0 || adm.PatientID == searchModel.PatientId)
                                            && (searchModel.ProviderId == 0 || preProc.ScheduleApprovedBy == searchModel.ProviderId)
                                            && (searchModel.FacilityId == 0 || adm.FacilityID == searchModel.FacilityId)
                                            && ((searchModel.AdmissionNo == null || searchModel.AdmissionNo == "") || adm.AdmissionNo.ToLower().Trim() == searchModel.AdmissionNo.ToLower().Trim())
                                            //&& (searchModel.SpecialityId == 0 || adm.SpecialityID == searchModel.SpecialityId)
                                            )
                                    select new
                                    {
                                        preProc.PreProcedureID,
                                        preProc.AdmissionID,
                                        preProc.ProcedureDate,
                                        preProc.ScheduleApprovedBy,
                                        preProc.ProcedureStatus,
                                        preProc.CancelReason,
                                        pat.PatientId,
                                        adm.AdmissionNo,
                                        adm.FacilityID,
                                        pat.PatientFirstName,
                                        pat.PatientMiddleName,
                                        pat.PatientLastName,
                                        prov.FirstName,
                                        prov.MiddleName,
                                        prov.LastName

                                    }).AsEnumerable().Select(PPM => new PreProcedureModel
                                    {
                                        PreProcedureID = PPM.PreProcedureID,
                                        AdmissionID = PPM.AdmissionID,
                                        FacilityId = PPM.FacilityID,
                                        facilityName = PPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PPM.FacilityID).FacilityName : "",
                                        ProcedureDate = PPM.ProcedureDate,
                                        ScheduleApprovedBy = PPM.ScheduleApprovedBy,
                                        ProcedureStatus = PPM.ProcedureStatus,
                                        CancelReason = PPM.CancelReason,
                                        PatientId = PPM.PatientId,
                                        PatientName = PPM.PatientFirstName + " " + PPM.PatientMiddleName + " " + PPM.PatientLastName,
                                        ProviderName = PPM.FirstName + " " + PPM.MiddleName + " " + PPM.LastName,
                                        AdmissionNo = PPM.AdmissionNo,
                                        AdmissionDateandTime = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == PPM.AdmissionID).AdmissionDateTime.ToString(),
                                        urgencyType = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == PPM.AdmissionID).UrgencyID > 0 ?
                                                        (this.uow.GenericRepository<UrgencyType>().Table().FirstOrDefault(x => x.UrgencyTypeId == this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(a => a.AdmissionID == PPM.AdmissionID).UrgencyID).UrgencyTypeDescription) : "",
                                        procedureNameDesc = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == PPM.AdmissionID).ProcedureName > 0 ?
                                                        (this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(a => a.AdmissionID == PPM.AdmissionID).ProcedureName).ProcedureDesc) : "",
                                        admissionModel = this.GetAdmissionRecordbyId(PPM.AdmissionID)

                                    }).ToList();

            List<PreProcedureModel> preProcCollection = new List<PreProcedureModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (preProcedureList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            preProcCollection = (from preProc in preProcedureList
                                                 join fac in facList on preProc.FacilityId equals fac.FacilityId
                                                 join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                 on preProc.AdmissionID equals adm.AdmissionID
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on adm.AdmittingPhysician equals prov.ProviderID
                                                 select preProc).ToList();
                        }
                        else
                        {
                            preProcCollection = (from preProc in preProcedureList
                                                 join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                 on preProc.AdmissionID equals adm.AdmissionID
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on adm.AdmittingPhysician equals prov.ProviderID
                                                 select preProc).ToList();
                        }
                    }
                    else
                    {
                        preProcCollection = (from preProc in preProcedureList.Where(x => x.FacilityId == searchModel.FacilityId)
                                             join fac in facList on preProc.FacilityId equals fac.FacilityId
                                             join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                             on preProc.AdmissionID equals adm.AdmissionID
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on adm.AdmittingPhysician equals prov.ProviderID
                                             select preProc).ToList();
                    }
                }
                else
                {
                    preProcCollection = (from preProc in preProcedureList
                                         join fac in facList on preProc.FacilityId equals fac.FacilityId
                                         select preProc).ToList();
                }
            }
            else
            {
                preProcCollection = preProcedureList;
            }

            return preProcCollection;
        }

        #endregion

        ///// <summary>
        ///// Get Pre Procedures for Post Procedure Case sheet
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PreProcedureModel>. if list of PreProcedureModel = success. else = failure</returns>
        public List<PreProcedureModel> GetPreProceduresforPostProcedure()
        {
            var preProcedureList = (from preProc in this.uow.GenericRepository<PreProcedure>().Table().
                                    Where(x => x.ProcedureStatus.ToLower().Trim() != "admitted" & x.ProcedureStatus.ToLower().Trim() != "cancelled")

                                    join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                    on preProc.AdmissionID equals adm.AdmissionID

                                    join pat in this.uow.GenericRepository<Patient>().Table()
                                    on adm.PatientID equals pat.PatientId

                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                    on preProc.ScheduleApprovedBy equals prov.ProviderID

                                    select new
                                    {
                                        preProc.PreProcedureID,
                                        preProc.AdmissionID,
                                        preProc.ProcedureDate,
                                        preProc.ScheduleApprovedBy,
                                        preProc.ProcedureStatus,
                                        preProc.CancelReason,
                                        pat.PatientId,
                                        adm.AdmissionNo,
                                        adm.AnesthesiaFitnessRequired,
                                        adm.FacilityID,
                                        pat.PatientFirstName,
                                        pat.PatientMiddleName,
                                        pat.PatientLastName,
                                        prov.FirstName,
                                        prov.MiddleName,
                                        prov.LastName

                                    }).AsEnumerable().Select(PPM => new PreProcedureModel
                                    {
                                        PreProcedureID = PPM.PreProcedureID,
                                        AdmissionID = PPM.AdmissionID,
                                        FacilityId = PPM.FacilityID,
                                        facilityName = PPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PPM.FacilityID).FacilityName : "",
                                        ProcedureDate = PPM.ProcedureDate,
                                        ScheduleApprovedBy = PPM.ScheduleApprovedBy,
                                        ProcedureStatus = PPM.ProcedureStatus,
                                        CancelReason = PPM.CancelReason,
                                        PatientId = PPM.PatientId,
                                        PatientName = PPM.PatientFirstName + " " + PPM.PatientMiddleName + " " + PPM.PatientLastName,
                                        ProviderName = PPM.FirstName + " " + PPM.MiddleName + " " + PPM.LastName,
                                        AdmissionNo = PPM.AdmissionNo,
                                        AnesthesiaFitnessRequired = PPM.AnesthesiaFitnessRequired != null ? PPM.AnesthesiaFitnessRequired.Value : false,
                                        AdmissionDateandTime = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == PPM.AdmissionID).AdmissionDateTime.ToString(),
                                        urgencyType = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == PPM.AdmissionID).UrgencyID > 0 ?
                                                        (this.uow.GenericRepository<UrgencyType>().Table().FirstOrDefault(x => x.UrgencyTypeId == this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(a => a.AdmissionID == PPM.AdmissionID).UrgencyID).UrgencyTypeDescription) : "",
                                        procedureNameDesc = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == PPM.AdmissionID).ProcedureName > 0 ?
                                                        (this.uow.GenericRepository<Procedures>().Table().FirstOrDefault(x => x.ProcedureID == this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(a => a.AdmissionID == PPM.AdmissionID).ProcedureName).ProcedureDesc) : "",
                                        admissionModel = this.GetAdmissionRecordbyId(PPM.AdmissionID)

                                    }).ToList();

            List<PreProcedureModel> preProcCollection = new List<PreProcedureModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (preProcedureList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        preProcCollection = (from preProc in preProcedureList
                                             join fac in facList on preProc.FacilityId equals fac.FacilityId
                                             join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                             on preProc.AdmissionID equals adm.AdmissionID
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on adm.AdmittingPhysician equals prov.ProviderID
                                             select preProc).ToList();
                    }
                    else
                    {
                        preProcCollection = (from preProc in preProcedureList
                                             join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                             on preProc.AdmissionID equals adm.AdmissionID
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on adm.AdmittingPhysician equals prov.ProviderID
                                             select preProc).ToList();
                    }
                }
                else
                {
                    preProcCollection = (from preProc in preProcedureList
                                         join fac in facList on preProc.FacilityId equals fac.FacilityId
                                         select preProc).ToList();
                }
            }
            else
            {
                preProcCollection = preProcedureList;
            }

            return preProcCollection;
        }

        ///// <summary>
        ///// Get Pre Procedure by preProcedureId
        ///// </summary>
        ///// <param>int preProcedureId</param>
        ///// <returns>PreProcedureModel. if record of PreProcedureModel by preProcedureId = success. else = failure</returns>
        public PreProcedureModel GetPreProcedureforPostProcedurebyId(int preProcedureId)
        {
            var preProcedureRecord = (from preProc in this.uow.GenericRepository<PreProcedure>().Table().Where(x => x.PreProcedureID == preProcedureId)

                                      join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                      on preProc.AdmissionID equals adm.AdmissionID

                                      join pat in this.uow.GenericRepository<Patient>().Table()
                                      on adm.PatientID equals pat.PatientId

                                      join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                      on preProc.ScheduleApprovedBy equals prov.ProviderID

                                      select new
                                      {
                                          preProc.PreProcedureID,
                                          preProc.AdmissionID,
                                          preProc.ProcedureDate,
                                          preProc.ScheduleApprovedBy,
                                          preProc.ProcedureStatus,
                                          preProc.CancelReason,
                                          pat.PatientId,
                                          adm.AdmissionNo,
                                          adm.FacilityID,
                                          pat.PatientFirstName,
                                          pat.PatientMiddleName,
                                          pat.PatientLastName,
                                          prov.FirstName,
                                          prov.MiddleName,
                                          prov.LastName

                                      }).AsEnumerable().Select(PPM => new PreProcedureModel
                                      {
                                          PreProcedureID = PPM.PreProcedureID,
                                          AdmissionID = PPM.AdmissionID,
                                          FacilityId = PPM.FacilityID,
                                          facilityName = PPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PPM.FacilityID).FacilityName : "",
                                          ProcedureDate = PPM.ProcedureDate,
                                          ScheduleApprovedBy = PPM.ScheduleApprovedBy,
                                          ProcedureStatus = PPM.ProcedureStatus,
                                          CancelReason = PPM.CancelReason,
                                          PatientId = PPM.PatientId,
                                          PatientName = PPM.PatientFirstName + " " + PPM.PatientMiddleName + " " + PPM.PatientLastName,
                                          ProviderName = PPM.FirstName + " " + PPM.MiddleName + " " + PPM.LastName,
                                          AdmissionNo = PPM.AdmissionNo,
                                          admissionModel = this.GetAdmissionRecordbyId(PPM.AdmissionID)

                                      }).FirstOrDefault();

            return preProcedureRecord;
        }

        ///// <summary>
        ///// Get Admission for PostProcedure by Id
        ///// </summary>
        ///// <param>int admissionId</param>
        ///// <returns>AdmissionsModel. if Record of Admissions = success. else = failure</returns>
        public AdmissionsModel GetAdmissionRecordbyId(int admissionId)
        {
            var admissionRecord = (from admission in this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionID == admissionId)
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
                                       ProcRequestedDate = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x=>x.ProcedureRequestId == AM.ProcedureRequestId).ProcedureRequestedDate.ToString() : null,
                                       ProcRequestedPhysician = AM.ProcedureRequestId > 0 ? this.GetProcedureRequestbyId(AM.ProcedureRequestId).AdmittingPhysicianName : null,
                                       SpecialPreparation = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).SpecialPreparationNotes : null,
                                       OtherConsults = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).OtherConsultsNotes : null,
                                       approximateDuration = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).ApproximateDuration : null,
                                       AnesthesiaFitnessClearance = AM.AnesthesiaFitnessRequired == true ? "Yes" : "Not Applicable",
                                       procedureStatus = this.uow.GenericRepository<PreProcedure>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID) != null ?
                                                        this.uow.GenericRepository<PreProcedure>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID).ProcedureStatus : "Started",
                                       AdministrationDrugStatus = this.GetDrugChartListforPostProcedurebyAdmissionNumber(AM.AdmissionNo).Count() > 0 ?
                                                                  (this.GetDrugChartListforPostProcedurebyAdmissionNumber(AM.AdmissionNo).FirstOrDefault().AdminDrugSignOffStatus == true ? "Completed" : "Started") : "Started"

                                   }).FirstOrDefault();

            return admissionRecord;
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
                                        procRqst.BloodRequired,
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
                                        procRqst.AdmissionStatus,
                                        date = procRqst.ModifiedDate == null ? procRqst.Createddate : procRqst.ModifiedDate,
                                        visit.VisitDate,
                                        procType.ProcedureTypeDesc,
                                        prov.FirstName,
                                        prov.MiddleName,
                                        prov.LastName,
                                        urgency.UrgencyTypeDescription,
                                        admType.AdmissionTypeDesc,
                                        procedure.ProcedureDesc

                                    }).AsEnumerable().Select(PRM => new ProcedureRequestModel
                                    {
                                        ProcedureRequestId = PRM.ProcedureRequestId,
                                        VisitID = PRM.VisitID,
                                        PatientId = PRM.PatientId,
                                        ProcedureRequestedDate = PRM.ProcedureRequestedDate,
                                        ProcedureReqTime = PRM.ProcedureRequestedDate.ToString("hh:mm tt"),
                                        ProcedureType = PRM.ProcedureType,
                                        ProcedureTypeName = PRM.ProcedureTypeDesc,
                                        AdmittingPhysician = PRM.AdmittingPhysician,
                                        AdmittingPhysicianName = PRM.FirstName + " " + PRM.MiddleName + " " + PRM.LastName,
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
                                        BloodRequired = PRM.BloodRequired,
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
                                        AdmissionStatus = PRM.AdmissionStatus,
                                        VisitDateandTime = PRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PRM.VisitDate.TimeOfDay.ToString()

                                    }).FirstOrDefault();

            return procedureRequest;
        }

        ///// <summary>
        ///// Sign off for Post procedure
        ///// </summary>
        ///// <param>ProcedureCareSignOffModel procedureCareSignOffModel</param>
        ///// <returns>Task<ProcedureCareSignOffModel>. if ProcedureCareSignOffModel with status = success. else = failure</returns>
        public Task<SigningOffModel> SignoffUpdationforPostProcedureCare(SigningOffModel procedureCareSignOffModel)
        {
            var signOffdata = this.utilService.ProcedureCareSignOffUpdation(procedureCareSignOffModel);

            if (signOffdata != null && signOffdata.Result.AdmissionId > 0 && signOffdata.Result.status.ToLower().Trim().Contains("success"))
            {
                this.AddDischargeRecord(signOffdata.Result.AdmissionId);
            }
            return signOffdata;
        }

        ///// <summary>
        ///// Add Discharge Summary Grid Data
        ///// </summary>
        ///// <param>int admissionId</param>
        ///// <returns>List<DischargeSummaryModel>. if list of DischargeSummaryModel = success. else = failure</returns>
        public void AddDischargeRecord(int admissionId)
        {
            var admData = this.uow.GenericRepository<Admissions>().Table().Where(x => x.AdmissionID == admissionId).FirstOrDefault();

            if (admData != null)
            {
                var postProcedureRecord = this.GetAllPostProcedureCaseSheetData().Where(x => x.admissionNo.ToLower().Trim() == admData.AdmissionNo.ToLower().Trim()
                                                & x.preProcedureModel.ProcedureStatus.ToLower().Trim() == "completed").FirstOrDefault();

                if (postProcedureRecord != null)
                {
                    DischargeSummaryModel discharge = new DischargeSummaryModel();

                    discharge.AdmissionNumber = postProcedureRecord.admissionNo;
                    discharge.AdmissionDate = postProcedureRecord.preProcedureModel.ProcedureDate;
                    discharge.AdmittingPhysician = postProcedureRecord.preProcedureModel.admissionModel.ProviderName;
                    discharge.RecommendedProcedure = postProcedureRecord.procedureNameDesc;
                    discharge.PreProcedureDiagnosis = postProcedureRecord.preProcedureModel.admissionModel.PreProcedureDiagnosis;
                    discharge.PlannedProcedure = postProcedureRecord.preProcedureModel.admissionModel.PlannedProcedure;
                    discharge.Urgency = postProcedureRecord.preProcedureModel.admissionModel.UrgencyType;
                    discharge.AnesthesiaFitnessNotes = postProcedureRecord.preProcedureModel.admissionModel.AnesthesiaFitnessRequiredDesc;
                    discharge.OtherConsults = postProcedureRecord.preProcedureModel.admissionModel.OtherConsults;
                    discharge.PostOperativeDiagnosis = postProcedureRecord.DiagnosisNotes;
                    discharge.BloodLossInfo = postProcedureRecord.BloodLossTransfusion;
                    discharge.Specimens = postProcedureRecord.Specimens;
                    discharge.PainLevelNotes = postProcedureRecord.painLevelDesc;
                    discharge.Complications = postProcedureRecord.Complications;
                    discharge.ProcedureNotes = postProcedureRecord.ProcedureNotes;

                    this.AddUpdateDischargeSummary(discharge);
                }
            }
        }

        ///// <summary>
        ///// Add or Update Discharge Summary Record
        ///// </summary>
        ///// <param>(DischargeSummaryModel dischargeSummaryModel)</param>
        ///// <returns>DischargeSummaryModel. if Record of Discharge Summary added or Updated = success. else = failure</returns>
        public DischargeSummaryModel AddUpdateDischargeSummary(DischargeSummaryModel dischargeSummaryModel)
        {
            var dischargeData = this.uow.GenericRepository<DischargeSummary>().Table().Where(x => x.AdmissionNumber.ToLower().Trim() == dischargeSummaryModel.AdmissionNumber.ToLower().Trim()).FirstOrDefault();

            if (dischargeData == null)
            {
                dischargeData = new DischargeSummary();

                dischargeData.AdmissionNumber = dischargeSummaryModel.AdmissionNumber;
                dischargeData.AdmissionDate = dischargeSummaryModel.AdmissionDate != null ? this.utilService.GetLocalTime(dischargeSummaryModel.AdmissionDate.Value) : dischargeSummaryModel.AdmissionDate;
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

            return dischargeSummaryModel;
        }

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

    }
}
