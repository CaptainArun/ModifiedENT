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
    public class PreProcedureService : IPreProcedureService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;

        public PreProcedureService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master Data

        ///// <summary>
        ///// Get Drug Codes for given searchKey
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<DrugCode>. if Collection of DrugCodes for given searchKey = success. else = failure</returns>
        public List<DrugCode> GetDrugCodes(string searchKey)
        {
            return this.utilService.GetAllDrugCodes(searchKey);
        }

        ///// <summary>
        ///// Get Provider List For PreProcedure 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Provider>. if Collection of Provider = success. else = failure</returns>
        public List<Provider> GetProviderListForPreProcedure()
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
        ///// Get Providers For PreProcedure Search
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for PreProcedure = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforPreProcedure(string searchKey)
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
        ///// Get Tenant Specialities for Pre Procedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<TenantSpeciality>. if collection of TenantSpeciality for PreProcedure = success. else = failure</returns>
        public List<TenantSpeciality> GetTenantSpecialitiesforPreProcedure()
        {
            var specialities = this.iTenantMasterService.GetTenantSpecialityList();

            return specialities;
        }

        ///// <summary>
        ///// Get Provider names for PreProcedure
        ///// </summary>
        ///// <param>int FacilityId</param>
        ///// <returns>List<string>. if Collection of Provider Names for given FacilityID = success. else = failure</returns>
        public List<string> GetProviderNamesforPreProcedure(int facilityId)
        {
            List<Provider> providerList = new List<Provider>();
            List<string> providerNames = new List<string>();
            if (facilityId == 0)
            {
                providerList = this.uow.GenericRepository<Provider>().Table().Where(x=>x.IsActive != false).ToList();
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
        ///// Get Recorded During options for PreProcedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RecordedDuring>. if Collection of RecordedDuring for PreProcedure = success. else = failure</returns>
        public List<RecordedDuring> GetRecordedDuringOptionsforPreProcedure()
        {
            var recDurings = this.iTenantMasterService.GetRecordedDuringList();
            return recDurings;
        }

        ///// <summary>
        ///// Get Admission Date and Time
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionsModel>. if Collection of AdmissionsModel for PreProcedure = success. else = failure</returns>
        public List<AdmissionsModel> GetAdmissionDataforDrugChart()
        {
            var admissionList = (from admission in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)

                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on admission.PatientID equals pat.PatientId

                                 select new
                                 {
                                     admission.AdmissionID,
                                     admission.FacilityID,
                                     admission.PatientID,
                                     admission.AdmittingPhysician,
                                     admission.AdmissionDateTime,
                                     admission.AdmissionNo

                                 }).AsEnumerable().OrderByDescending(x => x.AdmissionDateTime).Select(AM => new AdmissionsModel
                                 {
                                     AdmissionID = AM.AdmissionID,
                                     FacilityID = AM.FacilityID,
                                     FacilityName = AM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().Where(x => x.FacilityId == AM.FacilityID).FirstOrDefault().FacilityName : "",
                                     PatientID = AM.PatientID,
                                     AdmittingPhysician = AM.AdmittingPhysician,
                                     AdmissionDateTime = AM.AdmissionDateTime,
                                     AdmissionNo = AM.AdmissionNo,
                                     AdmissionDateandTime = AM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + AM.AdmissionDateTime.TimeOfDay.ToString()

                                 }).ToList();

            List<AdmissionsModel> admissionsCollection = new List<AdmissionsModel>();

            var facList = this.utilService.GetFacilitiesforUser();
            var user = this.utilService.GetUserIDofProvider();

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
        ///// Get Medication Routes List for Pre Procedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationRoute>. if Collection of MedicationRoute = success. else = failure</returns>
        public List<MedicationRoute> GetMedicationRoutesforPreProcedure()
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

        ///// <summary>
        ///// Get Admissions for PreProcedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AdmissionsModel>. if Collection of Admissions = success. else = failure</returns>
        public List<AdmissionsModel> GetAllAdmissionsforPreProcedure()
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
                                     ProcRequestedDate = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).ProcedureRequestedDate.ToString() : null,
                                     ProcRequestedPhysician = AM.ProcedureRequestId > 0 ? this.GetProcedureRequestforPreProcedurebyId(AM.ProcedureRequestId).AdmittingPhysicianName : null,
                                     SpecialPreparation = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).SpecialPreparationNotes : null,
                                     OtherConsults = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).OtherConsultsNotes : null,
                                     approximateDuration = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).ApproximateDuration : null,
                                     AnesthesiaFitnessClearance = AM.AnesthesiaFitnessRequired == true ? "Yes" : "Not Applicable",
                                     procedureStatus = this.uow.GenericRepository<PreProcedure>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID) != null ?
                                                        this.uow.GenericRepository<PreProcedure>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID).ProcedureStatus : "Admitted",
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

            return admissionsCollection.Where(x => x.procedureStatus.ToLower().Trim() != "cancelled").ToList();
        }

        ///// <summary>
        ///// Get Admission for PreProcedure by Id
        ///// </summary>
        ///// <param>int admissionId</param>
        ///// <returns>AdmissionsModel. if record of Admissions = success. else = failure</returns>
        public AdmissionsModel GetPreProcedureAdmissionRecordbyId(int admissionId)
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
                                       ProcRequestedDate = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).ProcedureRequestedDate.ToString() : null,
                                       ProcRequestedPhysician = AM.ProcedureRequestId > 0 ? this.GetProcedureRequestforPreProcedurebyId(AM.ProcedureRequestId).AdmittingPhysicianName : null,
                                       SpecialPreparation = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).SpecialPreparationNotes : null,
                                       OtherConsults = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).OtherConsultsNotes : null,
                                       approximateDuration = AM.ProcedureRequestId > 0 ? this.uow.GenericRepository<ProcedureRequest>().Table().FirstOrDefault(x => x.ProcedureRequestId == AM.ProcedureRequestId).ApproximateDuration : null,
                                       AnesthesiaFitnessClearance = AM.AnesthesiaFitnessRequired == true ? "Yes" : "Not Applicable",
                                       AdministrationDrugStatus = this.GetDrugChartListforPreProcedurebyAdmissionNumber(AM.AdmissionNo).Count() > 0 ?
                                                                  (this.GetDrugChartListforPreProcedurebyAdmissionNumber(AM.AdmissionNo).FirstOrDefault().AdminDrugSignOffStatus == true ? "Completed" : "Started") : "Started"

                                   }).FirstOrDefault();

            return admissionRecord;
        }

        ///// <summary>
        ///// Get Procedure Request by Id
        ///// </summary>
        ///// <param>(int procedureRequestId)</param>
        ///// <returns>ProcedureRequestModel. if set of ProcedureRequestModel for given procedureRequestId = success. else = failure</returns>
        public ProcedureRequestModel GetProcedureRequestforPreProcedurebyId(int procedureRequestId)
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
                                        providerName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName,
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
        ///// Sign off for Pre procedure
        ///// </summary>
        ///// <param>ProcedureCareSignOffModel procedureCareSignOffModel</param>
        ///// <returns>Task<ProcedureCareSignOffModel>. if ProcedureCareSignOffModel with status = success. else = failure</returns>
        public Task<SigningOffModel> SignoffUpdationforPreProcedureCare(SigningOffModel procedureCareSignOffModel)
        {
            var signOffdata = this.utilService.ProcedureCareSignOffUpdation(procedureCareSignOffModel);

            return signOffdata;
        }

        #region Anesthesia Fitness

        ///// <summary>
        ///// Add or Update Anesthesia fitness
        ///// </summary>
        ///// <param>AnesthesiafitnessModel anesthesiafitnessModel</param>
        ///// <returns>AnesthesiafitnessModel. if AnesthesiafitnessModel with ID = success. else = failure</returns>
        public AnesthesiafitnessModel AddUpdateAnesthesiaFitness(AnesthesiafitnessModel anesthesiafitnessModel)
        {
            var anesthesiaFitnessRecord = this.uow.GenericRepository<Anesthesiafitness>().Table().Where(x => x.AdmissionId == anesthesiafitnessModel.AdmissionId).FirstOrDefault();

            if (anesthesiaFitnessRecord == null)
            {
                anesthesiaFitnessRecord = new Anesthesiafitness();

                anesthesiaFitnessRecord.AdmissionId = anesthesiafitnessModel.AdmissionId;
                anesthesiaFitnessRecord.WNLRespiratory = anesthesiafitnessModel.WNLRespiratory;
                anesthesiaFitnessRecord.Cough = anesthesiafitnessModel.Cough;
                anesthesiaFitnessRecord.Dyspnea = anesthesiafitnessModel.Dyspnea;
                anesthesiaFitnessRecord.Dry = anesthesiafitnessModel.Dry;
                anesthesiaFitnessRecord.RecentURILRTI = anesthesiafitnessModel.RecentURILRTI;
                anesthesiaFitnessRecord.OSA = anesthesiafitnessModel.OSA;
                anesthesiaFitnessRecord.Productive = anesthesiafitnessModel.Productive;
                anesthesiaFitnessRecord.TB = anesthesiafitnessModel.TB;
                anesthesiaFitnessRecord.COPD = anesthesiafitnessModel.COPD;
                anesthesiaFitnessRecord.Asthma = anesthesiafitnessModel.Asthma;
                anesthesiaFitnessRecord.Pneumonia = anesthesiafitnessModel.Pneumonia;
                anesthesiaFitnessRecord.Fever = anesthesiafitnessModel.Fever;
                anesthesiaFitnessRecord.WNLNeuroMusculoskeletal = anesthesiafitnessModel.WNLNeuroMusculoskeletal;
                anesthesiaFitnessRecord.RhArthritisGOUT = anesthesiafitnessModel.RhArthritisGOUT;
                anesthesiaFitnessRecord.CVATIA = anesthesiafitnessModel.CVATIA;
                anesthesiaFitnessRecord.Seizures = anesthesiafitnessModel.Seizures;
                anesthesiaFitnessRecord.ScoliosisKyphosis = anesthesiafitnessModel.ScoliosisKyphosis;
                anesthesiaFitnessRecord.HeadInjury = anesthesiafitnessModel.HeadInjury;
                anesthesiaFitnessRecord.PsychDisorder = anesthesiafitnessModel.PsychDisorder;
                anesthesiaFitnessRecord.MuscleWeakness = anesthesiafitnessModel.MuscleWeakness;
                anesthesiaFitnessRecord.Paralysis = anesthesiafitnessModel.Paralysis;
                anesthesiaFitnessRecord.WNLCardio = anesthesiafitnessModel.WNLCardio;
                anesthesiaFitnessRecord.Hypertension = anesthesiafitnessModel.Hypertension;
                anesthesiaFitnessRecord.DOE = anesthesiafitnessModel.DOE;
                anesthesiaFitnessRecord.Pacemarker = anesthesiafitnessModel.Pacemarker;
                anesthesiaFitnessRecord.RheumaticFever = anesthesiafitnessModel.RheumaticFever;
                anesthesiaFitnessRecord.OrthopneaPND = anesthesiafitnessModel.OrthopneaPND;
                anesthesiaFitnessRecord.CADAnginaMI = anesthesiafitnessModel.CADAnginaMI;
                anesthesiaFitnessRecord.ExerciseTolerance = anesthesiafitnessModel.ExerciseTolerance;
                anesthesiaFitnessRecord.WNLRenalEndocrine = anesthesiafitnessModel.WNLRenalEndocrine;
                anesthesiaFitnessRecord.RenalInsufficiency = anesthesiafitnessModel.RenalInsufficiency;
                anesthesiaFitnessRecord.ThyroidDisease = anesthesiafitnessModel.ThyroidDisease;
                anesthesiaFitnessRecord.Diabetes = anesthesiafitnessModel.Diabetes;
                anesthesiaFitnessRecord.WNLGastrointestinal = anesthesiafitnessModel.WNLGastrointestinal;
                anesthesiaFitnessRecord.Vomiting = anesthesiafitnessModel.Vomiting;
                anesthesiaFitnessRecord.Cirrhosis = anesthesiafitnessModel.Cirrhosis;
                anesthesiaFitnessRecord.Diarrhea = anesthesiafitnessModel.Diarrhea;
                anesthesiaFitnessRecord.GERD = anesthesiafitnessModel.GERD;
                anesthesiaFitnessRecord.WNLOthers = anesthesiafitnessModel.WNLOthers;
                anesthesiaFitnessRecord.HeamatDisorder = anesthesiafitnessModel.HeamatDisorder;
                anesthesiaFitnessRecord.Radiotherapy = anesthesiafitnessModel.Radiotherapy;
                anesthesiaFitnessRecord.Immunosuppressant = anesthesiafitnessModel.Immunosuppressant;
                anesthesiaFitnessRecord.Pregnancy = anesthesiafitnessModel.Pregnancy;
                anesthesiaFitnessRecord.Chemotherapy = anesthesiafitnessModel.Chemotherapy;
                anesthesiaFitnessRecord.SteroidUse = anesthesiafitnessModel.SteroidUse;
                anesthesiaFitnessRecord.Smoking = anesthesiafitnessModel.Smoking;
                anesthesiaFitnessRecord.Alcohol = anesthesiafitnessModel.Alcohol;
                anesthesiaFitnessRecord.Allergies = anesthesiafitnessModel.Allergies;
                anesthesiaFitnessRecord.LA = anesthesiafitnessModel.LA;
                anesthesiaFitnessRecord.GA = anesthesiafitnessModel.GA;
                anesthesiaFitnessRecord.RA = anesthesiafitnessModel.RA;
                anesthesiaFitnessRecord.NA = anesthesiafitnessModel.NA;
                anesthesiaFitnessRecord.SignificantDetails = anesthesiafitnessModel.SignificantDetails;
                anesthesiaFitnessRecord.CurrentMedications = anesthesiafitnessModel.CurrentMedications;
                anesthesiaFitnessRecord.Pulse = anesthesiafitnessModel.Pulse;
                anesthesiaFitnessRecord.Clubbing = anesthesiafitnessModel.Clubbing;
                anesthesiaFitnessRecord.IntubationSimpleDifficult = anesthesiafitnessModel.IntubationSimpleDifficult;
                anesthesiaFitnessRecord.BP = anesthesiafitnessModel.BP;
                anesthesiaFitnessRecord.Cyanosis = anesthesiafitnessModel.Cyanosis;
                anesthesiaFitnessRecord.ShortNeck = anesthesiafitnessModel.ShortNeck;
                anesthesiaFitnessRecord.RR = anesthesiafitnessModel.RR;
                anesthesiaFitnessRecord.Icterus = anesthesiafitnessModel.Icterus;
                anesthesiaFitnessRecord.MouthOpening = anesthesiafitnessModel.MouthOpening;
                anesthesiaFitnessRecord.Temp = anesthesiafitnessModel.Temp;
                anesthesiaFitnessRecord.Obesity = anesthesiafitnessModel.Obesity;
                anesthesiaFitnessRecord.MPClass = anesthesiafitnessModel.MPClass;
                anesthesiaFitnessRecord.Pallor = anesthesiafitnessModel.Pallor;
                anesthesiaFitnessRecord.ODH = anesthesiafitnessModel.ODH;
                anesthesiaFitnessRecord.Thyromental = anesthesiafitnessModel.Thyromental;
                anesthesiaFitnessRecord.LooseTooth = anesthesiafitnessModel.LooseTooth;
                anesthesiaFitnessRecord.Distance = anesthesiafitnessModel.Distance;
                anesthesiaFitnessRecord.ArtificialDentures = anesthesiafitnessModel.ArtificialDentures;
                anesthesiaFitnessRecord.DifficultVenousAccess = anesthesiafitnessModel.DifficultVenousAccess;
                anesthesiaFitnessRecord.AnesthesiaFitnessCleared = anesthesiafitnessModel.AnesthesiaFitnessCleared;
                anesthesiaFitnessRecord.AnesthesiaFitnessnotes = anesthesiafitnessModel.AnesthesiaFitnessnotes;
                anesthesiaFitnessRecord.IsActive = true;
                anesthesiaFitnessRecord.Createddate = DateTime.Now;
                anesthesiaFitnessRecord.CreatedBy = "User";

                this.uow.GenericRepository<Anesthesiafitness>().Insert(anesthesiaFitnessRecord);
            }
            else
            {
                anesthesiaFitnessRecord.WNLRespiratory = anesthesiafitnessModel.WNLRespiratory;
                anesthesiaFitnessRecord.Cough = anesthesiafitnessModel.Cough;
                anesthesiaFitnessRecord.Dyspnea = anesthesiafitnessModel.Dyspnea;
                anesthesiaFitnessRecord.Dry = anesthesiafitnessModel.Dry;
                anesthesiaFitnessRecord.RecentURILRTI = anesthesiafitnessModel.RecentURILRTI;
                anesthesiaFitnessRecord.OSA = anesthesiafitnessModel.OSA;
                anesthesiaFitnessRecord.Productive = anesthesiafitnessModel.Productive;
                anesthesiaFitnessRecord.TB = anesthesiafitnessModel.TB;
                anesthesiaFitnessRecord.COPD = anesthesiafitnessModel.COPD;
                anesthesiaFitnessRecord.Asthma = anesthesiafitnessModel.Asthma;
                anesthesiaFitnessRecord.Pneumonia = anesthesiafitnessModel.Pneumonia;
                anesthesiaFitnessRecord.Fever = anesthesiafitnessModel.Fever;
                anesthesiaFitnessRecord.WNLNeuroMusculoskeletal = anesthesiafitnessModel.WNLNeuroMusculoskeletal;
                anesthesiaFitnessRecord.RhArthritisGOUT = anesthesiafitnessModel.RhArthritisGOUT;
                anesthesiaFitnessRecord.CVATIA = anesthesiafitnessModel.CVATIA;
                anesthesiaFitnessRecord.Seizures = anesthesiafitnessModel.Seizures;
                anesthesiaFitnessRecord.ScoliosisKyphosis = anesthesiafitnessModel.ScoliosisKyphosis;
                anesthesiaFitnessRecord.HeadInjury = anesthesiafitnessModel.HeadInjury;
                anesthesiaFitnessRecord.PsychDisorder = anesthesiafitnessModel.PsychDisorder;
                anesthesiaFitnessRecord.MuscleWeakness = anesthesiafitnessModel.MuscleWeakness;
                anesthesiaFitnessRecord.Paralysis = anesthesiafitnessModel.Paralysis;
                anesthesiaFitnessRecord.WNLCardio = anesthesiafitnessModel.WNLCardio;
                anesthesiaFitnessRecord.Hypertension = anesthesiafitnessModel.Hypertension;
                anesthesiaFitnessRecord.DOE = anesthesiafitnessModel.DOE;
                anesthesiaFitnessRecord.Pacemarker = anesthesiafitnessModel.Pacemarker;
                anesthesiaFitnessRecord.RheumaticFever = anesthesiafitnessModel.RheumaticFever;
                anesthesiaFitnessRecord.OrthopneaPND = anesthesiafitnessModel.OrthopneaPND;
                anesthesiaFitnessRecord.CADAnginaMI = anesthesiafitnessModel.CADAnginaMI;
                anesthesiaFitnessRecord.ExerciseTolerance = anesthesiafitnessModel.ExerciseTolerance;
                anesthesiaFitnessRecord.WNLRenalEndocrine = anesthesiafitnessModel.WNLRenalEndocrine;
                anesthesiaFitnessRecord.RenalInsufficiency = anesthesiafitnessModel.RenalInsufficiency;
                anesthesiaFitnessRecord.ThyroidDisease = anesthesiafitnessModel.ThyroidDisease;
                anesthesiaFitnessRecord.Diabetes = anesthesiafitnessModel.Diabetes;
                anesthesiaFitnessRecord.WNLGastrointestinal = anesthesiafitnessModel.WNLGastrointestinal;
                anesthesiaFitnessRecord.Vomiting = anesthesiafitnessModel.Vomiting;
                anesthesiaFitnessRecord.Cirrhosis = anesthesiafitnessModel.Cirrhosis;
                anesthesiaFitnessRecord.Diarrhea = anesthesiafitnessModel.Diarrhea;
                anesthesiaFitnessRecord.GERD = anesthesiafitnessModel.GERD;
                anesthesiaFitnessRecord.WNLOthers = anesthesiafitnessModel.WNLOthers;
                anesthesiaFitnessRecord.HeamatDisorder = anesthesiafitnessModel.HeamatDisorder;
                anesthesiaFitnessRecord.Radiotherapy = anesthesiafitnessModel.Radiotherapy;
                anesthesiaFitnessRecord.Immunosuppressant = anesthesiafitnessModel.Immunosuppressant;
                anesthesiaFitnessRecord.Pregnancy = anesthesiafitnessModel.Pregnancy;
                anesthesiaFitnessRecord.Chemotherapy = anesthesiafitnessModel.Chemotherapy;
                anesthesiaFitnessRecord.SteroidUse = anesthesiafitnessModel.SteroidUse;
                anesthesiaFitnessRecord.Smoking = anesthesiafitnessModel.Smoking;
                anesthesiaFitnessRecord.Alcohol = anesthesiafitnessModel.Alcohol;
                anesthesiaFitnessRecord.Allergies = anesthesiafitnessModel.Allergies;
                anesthesiaFitnessRecord.LA = anesthesiafitnessModel.LA;
                anesthesiaFitnessRecord.GA = anesthesiafitnessModel.GA;
                anesthesiaFitnessRecord.RA = anesthesiafitnessModel.RA;
                anesthesiaFitnessRecord.NA = anesthesiafitnessModel.NA;
                anesthesiaFitnessRecord.SignificantDetails = anesthesiafitnessModel.SignificantDetails;
                anesthesiaFitnessRecord.CurrentMedications = anesthesiafitnessModel.CurrentMedications;
                anesthesiaFitnessRecord.Pulse = anesthesiafitnessModel.Pulse;
                anesthesiaFitnessRecord.Clubbing = anesthesiafitnessModel.Clubbing;
                anesthesiaFitnessRecord.IntubationSimpleDifficult = anesthesiafitnessModel.IntubationSimpleDifficult;
                anesthesiaFitnessRecord.BP = anesthesiafitnessModel.BP;
                anesthesiaFitnessRecord.Cyanosis = anesthesiafitnessModel.Cyanosis;
                anesthesiaFitnessRecord.ShortNeck = anesthesiafitnessModel.ShortNeck;
                anesthesiaFitnessRecord.RR = anesthesiafitnessModel.RR;
                anesthesiaFitnessRecord.Icterus = anesthesiafitnessModel.Icterus;
                anesthesiaFitnessRecord.MouthOpening = anesthesiafitnessModel.MouthOpening;
                anesthesiaFitnessRecord.Temp = anesthesiafitnessModel.Temp;
                anesthesiaFitnessRecord.Obesity = anesthesiafitnessModel.Obesity;
                anesthesiaFitnessRecord.MPClass = anesthesiafitnessModel.MPClass;
                anesthesiaFitnessRecord.Pallor = anesthesiafitnessModel.Pallor;
                anesthesiaFitnessRecord.ODH = anesthesiafitnessModel.ODH;
                anesthesiaFitnessRecord.Thyromental = anesthesiafitnessModel.Thyromental;
                anesthesiaFitnessRecord.LooseTooth = anesthesiafitnessModel.LooseTooth;
                anesthesiaFitnessRecord.Distance = anesthesiafitnessModel.Distance;
                anesthesiaFitnessRecord.ArtificialDentures = anesthesiafitnessModel.ArtificialDentures;
                anesthesiaFitnessRecord.DifficultVenousAccess = anesthesiafitnessModel.DifficultVenousAccess;
                anesthesiaFitnessRecord.AnesthesiaFitnessCleared = anesthesiafitnessModel.AnesthesiaFitnessCleared;
                anesthesiaFitnessRecord.AnesthesiaFitnessnotes = anesthesiafitnessModel.AnesthesiaFitnessnotes;
                anesthesiaFitnessRecord.IsActive = true;
                anesthesiaFitnessRecord.ModifiedDate = DateTime.Now;
                anesthesiaFitnessRecord.ModifiedBy = "User";

                this.uow.GenericRepository<Anesthesiafitness>().Update(anesthesiaFitnessRecord);
            }
            this.uow.Save();
            anesthesiafitnessModel.AnesthesiafitnessId = anesthesiaFitnessRecord.AnesthesiafitnessId;

            return anesthesiafitnessModel;
        }

        ///// <summary>
        ///// Get Anesthesia fitness 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AnesthesiafitnessModel>. if list of AnesthesiafitnessModel = success. else = failure</returns>
        public List<AnesthesiafitnessModel> GetAnesthesiafitnessList()
        {
            var anesthesiaFitnessList = (from anesFitness in this.uow.GenericRepository<Anesthesiafitness>().Table().Where(x => x.IsActive != false)

                                         join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                         on anesFitness.AdmissionId equals adm.AdmissionID

                                         join pat in this.uow.GenericRepository<Patient>().Table()
                                         on adm.PatientID equals pat.PatientId

                                         select new
                                         {
                                             anesFitness.AnesthesiafitnessId,
                                             anesFitness.AdmissionId,
                                             anesFitness.WNLRespiratory,
                                             anesFitness.Cough,
                                             anesFitness.Dyspnea,
                                             anesFitness.Dry,
                                             anesFitness.RecentURILRTI,
                                             anesFitness.OSA,
                                             anesFitness.Productive,
                                             anesFitness.TB,
                                             anesFitness.COPD,
                                             anesFitness.Asthma,
                                             anesFitness.Pneumonia,
                                             anesFitness.Fever,
                                             anesFitness.WNLNeuroMusculoskeletal,
                                             anesFitness.RhArthritisGOUT,
                                             anesFitness.CVATIA,
                                             anesFitness.Seizures,
                                             anesFitness.ScoliosisKyphosis,
                                             anesFitness.HeadInjury,
                                             anesFitness.PsychDisorder,
                                             anesFitness.MuscleWeakness,
                                             anesFitness.Paralysis,
                                             anesFitness.WNLCardio,
                                             anesFitness.Hypertension,
                                             anesFitness.DOE,
                                             anesFitness.Pacemarker,
                                             anesFitness.RheumaticFever,
                                             anesFitness.OrthopneaPND,
                                             anesFitness.CADAnginaMI,
                                             anesFitness.ExerciseTolerance,
                                             anesFitness.WNLRenalEndocrine,
                                             anesFitness.RenalInsufficiency,
                                             anesFitness.ThyroidDisease,
                                             anesFitness.Diabetes,
                                             anesFitness.WNLGastrointestinal,
                                             anesFitness.Vomiting,
                                             anesFitness.Cirrhosis,
                                             anesFitness.Diarrhea,
                                             anesFitness.GERD,
                                             anesFitness.WNLOthers,
                                             anesFitness.HeamatDisorder,
                                             anesFitness.Radiotherapy,
                                             anesFitness.Immunosuppressant,
                                             anesFitness.Pregnancy,
                                             anesFitness.Chemotherapy,
                                             anesFitness.SteroidUse,
                                             anesFitness.Smoking,
                                             anesFitness.Alcohol,
                                             anesFitness.Allergies,
                                             anesFitness.LA,
                                             anesFitness.GA,
                                             anesFitness.RA,
                                             anesFitness.NA,
                                             anesFitness.SignificantDetails,
                                             anesFitness.CurrentMedications,
                                             anesFitness.Pulse,
                                             anesFitness.Clubbing,
                                             anesFitness.IntubationSimpleDifficult,
                                             anesFitness.BP,
                                             anesFitness.Cyanosis,
                                             anesFitness.ShortNeck,
                                             anesFitness.RR,
                                             anesFitness.Icterus,
                                             anesFitness.MouthOpening,
                                             anesFitness.Temp,
                                             anesFitness.Obesity,
                                             anesFitness.MPClass,
                                             anesFitness.Pallor,
                                             anesFitness.ODH,
                                             anesFitness.Thyromental,
                                             anesFitness.LooseTooth,
                                             anesFitness.Distance,
                                             anesFitness.ArtificialDentures,
                                             anesFitness.DifficultVenousAccess,
                                             anesFitness.AnesthesiaFitnessCleared,
                                             anesFitness.AnesthesiaFitnessnotes,
                                             anesFitness.SignOffBy,
                                             anesFitness.SignOffDate,
                                             anesFitness.SignOffStatus,
                                             pat.PatientFirstName,
                                             pat.PatientMiddleName,
                                             pat.PatientLastName,
                                             adm.FacilityID

                                         }).AsEnumerable().Select(AFM => new AnesthesiafitnessModel
                                         {
                                             AnesthesiafitnessId = AFM.AnesthesiafitnessId,
                                             AdmissionId = AFM.AdmissionId,
                                             FacilityId = AFM.FacilityID,
                                             facilityName = AFM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == AFM.FacilityID).FacilityName : "",
                                             WNLRespiratory = AFM.WNLRespiratory,
                                             Cough = AFM.Cough,
                                             Dyspnea = AFM.Dyspnea,
                                             Dry = AFM.Dry,
                                             RecentURILRTI = AFM.RecentURILRTI,
                                             OSA = AFM.OSA,
                                             Productive = AFM.Productive,
                                             TB = AFM.TB,
                                             COPD = AFM.COPD,
                                             Asthma = AFM.Asthma,
                                             Pneumonia = AFM.Pneumonia,
                                             Fever = AFM.Fever,
                                             WNLNeuroMusculoskeletal = AFM.WNLNeuroMusculoskeletal,
                                             RhArthritisGOUT = AFM.RhArthritisGOUT,
                                             CVATIA = AFM.CVATIA,
                                             Seizures = AFM.Seizures,
                                             ScoliosisKyphosis = AFM.ScoliosisKyphosis,
                                             HeadInjury = AFM.HeadInjury,
                                             PsychDisorder = AFM.PsychDisorder,
                                             MuscleWeakness = AFM.MuscleWeakness,
                                             Paralysis = AFM.Paralysis,
                                             WNLCardio = AFM.WNLCardio,
                                             Hypertension = AFM.Hypertension,
                                             DOE = AFM.DOE,
                                             Pacemarker = AFM.Pacemarker,
                                             RheumaticFever = AFM.RheumaticFever,
                                             OrthopneaPND = AFM.OrthopneaPND,
                                             CADAnginaMI = AFM.CADAnginaMI,
                                             ExerciseTolerance = AFM.ExerciseTolerance,
                                             WNLRenalEndocrine = AFM.WNLRenalEndocrine,
                                             RenalInsufficiency = AFM.RenalInsufficiency,
                                             ThyroidDisease = AFM.ThyroidDisease,
                                             Diabetes = AFM.Diabetes,
                                             WNLGastrointestinal = AFM.WNLGastrointestinal,
                                             Vomiting = AFM.Vomiting,
                                             Cirrhosis = AFM.Cirrhosis,
                                             Diarrhea = AFM.Diarrhea,
                                             GERD = AFM.GERD,
                                             WNLOthers = AFM.WNLOthers,
                                             HeamatDisorder = AFM.HeamatDisorder,
                                             Radiotherapy = AFM.Radiotherapy,
                                             Immunosuppressant = AFM.Immunosuppressant,
                                             Pregnancy = AFM.Pregnancy,
                                             Chemotherapy = AFM.Chemotherapy,
                                             SteroidUse = AFM.SteroidUse,
                                             Smoking = AFM.Smoking,
                                             Alcohol = AFM.Alcohol,
                                             Allergies = AFM.Allergies,
                                             LA = AFM.LA,
                                             GA = AFM.GA,
                                             RA = AFM.RA,
                                             NA = AFM.NA,
                                             SignificantDetails = AFM.SignificantDetails,
                                             CurrentMedications = AFM.CurrentMedications,
                                             Pulse = AFM.Pulse,
                                             Clubbing = AFM.Clubbing,
                                             IntubationSimpleDifficult = AFM.IntubationSimpleDifficult,
                                             BP = AFM.BP,
                                             Cyanosis = AFM.Cyanosis,
                                             ShortNeck = AFM.ShortNeck,
                                             RR = AFM.RR,
                                             Icterus = AFM.Icterus,
                                             MouthOpening = AFM.MouthOpening,
                                             Temp = AFM.Temp,
                                             Obesity = AFM.Obesity,
                                             MPClass = AFM.MPClass,
                                             Pallor = AFM.Pallor,
                                             ODH = AFM.ODH,
                                             Thyromental = AFM.Thyromental,
                                             LooseTooth = AFM.LooseTooth,
                                             Distance = AFM.Distance,
                                             ArtificialDentures = AFM.ArtificialDentures,
                                             DifficultVenousAccess = AFM.DifficultVenousAccess,
                                             AnesthesiaFitnessCleared = AFM.AnesthesiaFitnessCleared,
                                             AnesthesiaFitnessnotes = AFM.AnesthesiaFitnessnotes,
                                             SignOffBy = AFM.SignOffBy,
                                             SignOffDate = AFM.SignOffDate,
                                             SignOffStatus = AFM.SignOffStatus,
                                             PatientName = AFM.PatientFirstName + " " + AFM.PatientMiddleName + " " + AFM.PatientLastName

                                         }).ToList();

            List<AnesthesiafitnessModel> anesthesiaCollection = new List<AnesthesiafitnessModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (anesthesiaFitnessList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        anesthesiaCollection = (from anes in anesthesiaFitnessList
                                                join fac in facList on anes.FacilityId equals fac.FacilityId
                                                join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                on anes.AdmissionId equals adm.AdmissionID
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select anes).ToList();
                    }
                    else
                    {
                        anesthesiaCollection = (from anes in anesthesiaFitnessList
                                                join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                on anes.AdmissionId equals adm.AdmissionID
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select anes).ToList();
                    }
                }
                else
                {
                    anesthesiaCollection = (from anes in anesthesiaFitnessList
                                            join fac in facList on anes.FacilityId equals fac.FacilityId
                                            select anes).ToList();
                }
            }
            else
            {
                anesthesiaCollection = anesthesiaFitnessList;
            }

            return anesthesiaCollection;
        }

        ///// <summary>
        ///// Get Anesthesia fitness for Patient 
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<AnesthesiafitnessModel>. if list of AnesthesiafitnessModel = success. else = failure</returns>
        public List<AnesthesiafitnessModel> GetAnesthesiafitnessListforPatient(int patientId)
        {
            var anesthesiaFitnessList = (from anesFitness in this.uow.GenericRepository<Anesthesiafitness>().Table().Where(x => x.IsActive != false)

                                         join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                         on anesFitness.AdmissionId equals adm.AdmissionID

                                         join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == patientId)
                                         on adm.PatientID equals pat.PatientId

                                         select new
                                         {
                                             anesFitness.AnesthesiafitnessId,
                                             anesFitness.AdmissionId,
                                             anesFitness.WNLRespiratory,
                                             anesFitness.Cough,
                                             anesFitness.Dyspnea,
                                             anesFitness.Dry,
                                             anesFitness.RecentURILRTI,
                                             anesFitness.OSA,
                                             anesFitness.Productive,
                                             anesFitness.TB,
                                             anesFitness.COPD,
                                             anesFitness.Asthma,
                                             anesFitness.Pneumonia,
                                             anesFitness.Fever,
                                             anesFitness.WNLNeuroMusculoskeletal,
                                             anesFitness.RhArthritisGOUT,
                                             anesFitness.CVATIA,
                                             anesFitness.Seizures,
                                             anesFitness.ScoliosisKyphosis,
                                             anesFitness.HeadInjury,
                                             anesFitness.PsychDisorder,
                                             anesFitness.MuscleWeakness,
                                             anesFitness.Paralysis,
                                             anesFitness.WNLCardio,
                                             anesFitness.Hypertension,
                                             anesFitness.DOE,
                                             anesFitness.Pacemarker,
                                             anesFitness.RheumaticFever,
                                             anesFitness.OrthopneaPND,
                                             anesFitness.CADAnginaMI,
                                             anesFitness.ExerciseTolerance,
                                             anesFitness.WNLRenalEndocrine,
                                             anesFitness.RenalInsufficiency,
                                             anesFitness.ThyroidDisease,
                                             anesFitness.Diabetes,
                                             anesFitness.WNLGastrointestinal,
                                             anesFitness.Vomiting,
                                             anesFitness.Cirrhosis,
                                             anesFitness.Diarrhea,
                                             anesFitness.GERD,
                                             anesFitness.WNLOthers,
                                             anesFitness.HeamatDisorder,
                                             anesFitness.Radiotherapy,
                                             anesFitness.Immunosuppressant,
                                             anesFitness.Pregnancy,
                                             anesFitness.Chemotherapy,
                                             anesFitness.SteroidUse,
                                             anesFitness.Smoking,
                                             anesFitness.Alcohol,
                                             anesFitness.Allergies,
                                             anesFitness.LA,
                                             anesFitness.GA,
                                             anesFitness.RA,
                                             anesFitness.NA,
                                             anesFitness.SignificantDetails,
                                             anesFitness.CurrentMedications,
                                             anesFitness.Pulse,
                                             anesFitness.Clubbing,
                                             anesFitness.IntubationSimpleDifficult,
                                             anesFitness.BP,
                                             anesFitness.Cyanosis,
                                             anesFitness.ShortNeck,
                                             anesFitness.RR,
                                             anesFitness.Icterus,
                                             anesFitness.MouthOpening,
                                             anesFitness.Temp,
                                             anesFitness.Obesity,
                                             anesFitness.MPClass,
                                             anesFitness.Pallor,
                                             anesFitness.ODH,
                                             anesFitness.Thyromental,
                                             anesFitness.LooseTooth,
                                             anesFitness.Distance,
                                             anesFitness.ArtificialDentures,
                                             anesFitness.DifficultVenousAccess,
                                             anesFitness.AnesthesiaFitnessCleared,
                                             anesFitness.AnesthesiaFitnessnotes,
                                             anesFitness.SignOffBy,
                                             anesFitness.SignOffDate,
                                             anesFitness.SignOffStatus,
                                             pat.PatientFirstName,
                                             pat.PatientMiddleName,
                                             pat.PatientLastName,
                                             adm.FacilityID

                                         }).AsEnumerable().Select(AFM => new AnesthesiafitnessModel
                                         {
                                             AnesthesiafitnessId = AFM.AnesthesiafitnessId,
                                             AdmissionId = AFM.AdmissionId,
                                             FacilityId = AFM.FacilityID,
                                             facilityName = AFM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == AFM.FacilityID).FacilityName : "",
                                             WNLRespiratory = AFM.WNLRespiratory,
                                             Cough = AFM.Cough,
                                             Dyspnea = AFM.Dyspnea,
                                             Dry = AFM.Dry,
                                             RecentURILRTI = AFM.RecentURILRTI,
                                             OSA = AFM.OSA,
                                             Productive = AFM.Productive,
                                             TB = AFM.TB,
                                             COPD = AFM.COPD,
                                             Asthma = AFM.Asthma,
                                             Pneumonia = AFM.Pneumonia,
                                             Fever = AFM.Fever,
                                             WNLNeuroMusculoskeletal = AFM.WNLNeuroMusculoskeletal,
                                             RhArthritisGOUT = AFM.RhArthritisGOUT,
                                             CVATIA = AFM.CVATIA,
                                             Seizures = AFM.Seizures,
                                             ScoliosisKyphosis = AFM.ScoliosisKyphosis,
                                             HeadInjury = AFM.HeadInjury,
                                             PsychDisorder = AFM.PsychDisorder,
                                             MuscleWeakness = AFM.MuscleWeakness,
                                             Paralysis = AFM.Paralysis,
                                             WNLCardio = AFM.WNLCardio,
                                             Hypertension = AFM.Hypertension,
                                             DOE = AFM.DOE,
                                             Pacemarker = AFM.Pacemarker,
                                             RheumaticFever = AFM.RheumaticFever,
                                             OrthopneaPND = AFM.OrthopneaPND,
                                             CADAnginaMI = AFM.CADAnginaMI,
                                             ExerciseTolerance = AFM.ExerciseTolerance,
                                             WNLRenalEndocrine = AFM.WNLRenalEndocrine,
                                             RenalInsufficiency = AFM.RenalInsufficiency,
                                             ThyroidDisease = AFM.ThyroidDisease,
                                             Diabetes = AFM.Diabetes,
                                             WNLGastrointestinal = AFM.WNLGastrointestinal,
                                             Vomiting = AFM.Vomiting,
                                             Cirrhosis = AFM.Cirrhosis,
                                             Diarrhea = AFM.Diarrhea,
                                             GERD = AFM.GERD,
                                             WNLOthers = AFM.WNLOthers,
                                             HeamatDisorder = AFM.HeamatDisorder,
                                             Radiotherapy = AFM.Radiotherapy,
                                             Immunosuppressant = AFM.Immunosuppressant,
                                             Pregnancy = AFM.Pregnancy,
                                             Chemotherapy = AFM.Chemotherapy,
                                             SteroidUse = AFM.SteroidUse,
                                             Smoking = AFM.Smoking,
                                             Alcohol = AFM.Alcohol,
                                             Allergies = AFM.Allergies,
                                             LA = AFM.LA,
                                             GA = AFM.GA,
                                             RA = AFM.RA,
                                             NA = AFM.NA,
                                             SignificantDetails = AFM.SignificantDetails,
                                             CurrentMedications = AFM.CurrentMedications,
                                             Pulse = AFM.Pulse,
                                             Clubbing = AFM.Clubbing,
                                             IntubationSimpleDifficult = AFM.IntubationSimpleDifficult,
                                             BP = AFM.BP,
                                             Cyanosis = AFM.Cyanosis,
                                             ShortNeck = AFM.ShortNeck,
                                             RR = AFM.RR,
                                             Icterus = AFM.Icterus,
                                             MouthOpening = AFM.MouthOpening,
                                             Temp = AFM.Temp,
                                             Obesity = AFM.Obesity,
                                             MPClass = AFM.MPClass,
                                             Pallor = AFM.Pallor,
                                             ODH = AFM.ODH,
                                             Thyromental = AFM.Thyromental,
                                             LooseTooth = AFM.LooseTooth,
                                             Distance = AFM.Distance,
                                             ArtificialDentures = AFM.ArtificialDentures,
                                             DifficultVenousAccess = AFM.DifficultVenousAccess,
                                             AnesthesiaFitnessCleared = AFM.AnesthesiaFitnessCleared,
                                             AnesthesiaFitnessnotes = AFM.AnesthesiaFitnessnotes,
                                             SignOffBy = AFM.SignOffBy,
                                             SignOffDate = AFM.SignOffDate,
                                             SignOffStatus = AFM.SignOffStatus,
                                             PatientName = AFM.PatientFirstName + " " + AFM.PatientMiddleName + " " + AFM.PatientLastName

                                         }).ToList();

            List<AnesthesiafitnessModel> anesthesiaCollection = new List<AnesthesiafitnessModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (anesthesiaFitnessList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        anesthesiaCollection = (from anes in anesthesiaFitnessList
                                                join fac in facList on anes.FacilityId equals fac.FacilityId
                                                join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                on anes.AdmissionId equals adm.AdmissionID
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select anes).ToList();
                    }
                    else
                    {
                        anesthesiaCollection = (from anes in anesthesiaFitnessList
                                                join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                                on anes.AdmissionId equals adm.AdmissionID
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on adm.AdmittingPhysician equals prov.ProviderID
                                                select anes).ToList();
                    }
                }
                else
                {
                    anesthesiaCollection = (from anes in anesthesiaFitnessList
                                            join fac in facList on anes.FacilityId equals fac.FacilityId
                                            select anes).ToList();
                }
            }
            else
            {
                anesthesiaCollection = anesthesiaFitnessList;
            }

            return anesthesiaCollection;
        }

        ///// <summary>
        ///// Get Anesthesia fitness by ID
        ///// </summary>
        ///// <param>int anesthesiafitnessId</param>
        ///// <returns>AnesthesiafitnessModel. if the record of AnesthesiafitnessModel for given anesthesiafitnessId = success. else = failure</returns>
        public AnesthesiafitnessModel GetAnesthesiafitnessRecordbyID(int anesthesiafitnessId)
        {
            var anesthesiaFitnessRecord = (from anesFitness in this.uow.GenericRepository<Anesthesiafitness>().Table().Where(x => x.AnesthesiafitnessId == anesthesiafitnessId)

                                           join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                           on anesFitness.AdmissionId equals adm.AdmissionID

                                           join pat in this.uow.GenericRepository<Patient>().Table()
                                           on adm.PatientID equals pat.PatientId

                                           select new
                                           {
                                               anesFitness.AnesthesiafitnessId,
                                               anesFitness.AdmissionId,
                                               anesFitness.WNLRespiratory,
                                               anesFitness.Cough,
                                               anesFitness.Dyspnea,
                                               anesFitness.Dry,
                                               anesFitness.RecentURILRTI,
                                               anesFitness.OSA,
                                               anesFitness.Productive,
                                               anesFitness.TB,
                                               anesFitness.COPD,
                                               anesFitness.Asthma,
                                               anesFitness.Pneumonia,
                                               anesFitness.Fever,
                                               anesFitness.WNLNeuroMusculoskeletal,
                                               anesFitness.RhArthritisGOUT,
                                               anesFitness.CVATIA,
                                               anesFitness.Seizures,
                                               anesFitness.ScoliosisKyphosis,
                                               anesFitness.HeadInjury,
                                               anesFitness.PsychDisorder,
                                               anesFitness.MuscleWeakness,
                                               anesFitness.Paralysis,
                                               anesFitness.WNLCardio,
                                               anesFitness.Hypertension,
                                               anesFitness.DOE,
                                               anesFitness.Pacemarker,
                                               anesFitness.RheumaticFever,
                                               anesFitness.OrthopneaPND,
                                               anesFitness.CADAnginaMI,
                                               anesFitness.ExerciseTolerance,
                                               anesFitness.WNLRenalEndocrine,
                                               anesFitness.RenalInsufficiency,
                                               anesFitness.ThyroidDisease,
                                               anesFitness.Diabetes,
                                               anesFitness.WNLGastrointestinal,
                                               anesFitness.Vomiting,
                                               anesFitness.Cirrhosis,
                                               anesFitness.Diarrhea,
                                               anesFitness.GERD,
                                               anesFitness.WNLOthers,
                                               anesFitness.HeamatDisorder,
                                               anesFitness.Radiotherapy,
                                               anesFitness.Immunosuppressant,
                                               anesFitness.Pregnancy,
                                               anesFitness.Chemotherapy,
                                               anesFitness.SteroidUse,
                                               anesFitness.Smoking,
                                               anesFitness.Alcohol,
                                               anesFitness.Allergies,
                                               anesFitness.LA,
                                               anesFitness.GA,
                                               anesFitness.RA,
                                               anesFitness.NA,
                                               anesFitness.SignificantDetails,
                                               anesFitness.CurrentMedications,
                                               anesFitness.Pulse,
                                               anesFitness.Clubbing,
                                               anesFitness.IntubationSimpleDifficult,
                                               anesFitness.BP,
                                               anesFitness.Cyanosis,
                                               anesFitness.ShortNeck,
                                               anesFitness.RR,
                                               anesFitness.Icterus,
                                               anesFitness.MouthOpening,
                                               anesFitness.Temp,
                                               anesFitness.Obesity,
                                               anesFitness.MPClass,
                                               anesFitness.Pallor,
                                               anesFitness.ODH,
                                               anesFitness.Thyromental,
                                               anesFitness.LooseTooth,
                                               anesFitness.Distance,
                                               anesFitness.ArtificialDentures,
                                               anesFitness.DifficultVenousAccess,
                                               anesFitness.AnesthesiaFitnessCleared,
                                               anesFitness.AnesthesiaFitnessnotes,
                                               anesFitness.SignOffBy,
                                               anesFitness.SignOffDate,
                                               anesFitness.SignOffStatus,
                                               pat.PatientFirstName,
                                               pat.PatientMiddleName,
                                               pat.PatientLastName,
                                               adm.FacilityID

                                           }).AsEnumerable().Select(AFM => new AnesthesiafitnessModel
                                           {
                                               AnesthesiafitnessId = AFM.AnesthesiafitnessId,
                                               AdmissionId = AFM.AdmissionId,
                                               FacilityId = AFM.FacilityID,
                                               facilityName = AFM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == AFM.FacilityID).FacilityName : "",
                                               WNLRespiratory = AFM.WNLRespiratory,
                                               Cough = AFM.Cough,
                                               Dyspnea = AFM.Dyspnea,
                                               Dry = AFM.Dry,
                                               RecentURILRTI = AFM.RecentURILRTI,
                                               OSA = AFM.OSA,
                                               Productive = AFM.Productive,
                                               TB = AFM.TB,
                                               COPD = AFM.COPD,
                                               Asthma = AFM.Asthma,
                                               Pneumonia = AFM.Pneumonia,
                                               Fever = AFM.Fever,
                                               WNLNeuroMusculoskeletal = AFM.WNLNeuroMusculoskeletal,
                                               RhArthritisGOUT = AFM.RhArthritisGOUT,
                                               CVATIA = AFM.CVATIA,
                                               Seizures = AFM.Seizures,
                                               ScoliosisKyphosis = AFM.ScoliosisKyphosis,
                                               HeadInjury = AFM.HeadInjury,
                                               PsychDisorder = AFM.PsychDisorder,
                                               MuscleWeakness = AFM.MuscleWeakness,
                                               Paralysis = AFM.Paralysis,
                                               WNLCardio = AFM.WNLCardio,
                                               Hypertension = AFM.Hypertension,
                                               DOE = AFM.DOE,
                                               Pacemarker = AFM.Pacemarker,
                                               RheumaticFever = AFM.RheumaticFever,
                                               OrthopneaPND = AFM.OrthopneaPND,
                                               CADAnginaMI = AFM.CADAnginaMI,
                                               ExerciseTolerance = AFM.ExerciseTolerance,
                                               WNLRenalEndocrine = AFM.WNLRenalEndocrine,
                                               RenalInsufficiency = AFM.RenalInsufficiency,
                                               ThyroidDisease = AFM.ThyroidDisease,
                                               Diabetes = AFM.Diabetes,
                                               WNLGastrointestinal = AFM.WNLGastrointestinal,
                                               Vomiting = AFM.Vomiting,
                                               Cirrhosis = AFM.Cirrhosis,
                                               Diarrhea = AFM.Diarrhea,
                                               GERD = AFM.GERD,
                                               WNLOthers = AFM.WNLOthers,
                                               HeamatDisorder = AFM.HeamatDisorder,
                                               Radiotherapy = AFM.Radiotherapy,
                                               Immunosuppressant = AFM.Immunosuppressant,
                                               Pregnancy = AFM.Pregnancy,
                                               Chemotherapy = AFM.Chemotherapy,
                                               SteroidUse = AFM.SteroidUse,
                                               Smoking = AFM.Smoking,
                                               Alcohol = AFM.Alcohol,
                                               Allergies = AFM.Allergies,
                                               LA = AFM.LA,
                                               GA = AFM.GA,
                                               RA = AFM.RA,
                                               NA = AFM.NA,
                                               SignificantDetails = AFM.SignificantDetails,
                                               CurrentMedications = AFM.CurrentMedications,
                                               Pulse = AFM.Pulse,
                                               Clubbing = AFM.Clubbing,
                                               IntubationSimpleDifficult = AFM.IntubationSimpleDifficult,
                                               BP = AFM.BP,
                                               Cyanosis = AFM.Cyanosis,
                                               ShortNeck = AFM.ShortNeck,
                                               RR = AFM.RR,
                                               Icterus = AFM.Icterus,
                                               MouthOpening = AFM.MouthOpening,
                                               Temp = AFM.Temp,
                                               Obesity = AFM.Obesity,
                                               MPClass = AFM.MPClass,
                                               Pallor = AFM.Pallor,
                                               ODH = AFM.ODH,
                                               Thyromental = AFM.Thyromental,
                                               LooseTooth = AFM.LooseTooth,
                                               Distance = AFM.Distance,
                                               ArtificialDentures = AFM.ArtificialDentures,
                                               DifficultVenousAccess = AFM.DifficultVenousAccess,
                                               AnesthesiaFitnessCleared = AFM.AnesthesiaFitnessCleared,
                                               AnesthesiaFitnessnotes = AFM.AnesthesiaFitnessnotes,
                                               SignOffBy = AFM.SignOffBy,
                                               SignOffDate = AFM.SignOffDate,
                                               SignOffStatus = AFM.SignOffStatus,
                                               PatientName = AFM.PatientFirstName + " " + AFM.PatientMiddleName + " " + AFM.PatientLastName

                                           }).FirstOrDefault();

            return anesthesiaFitnessRecord;
        }

        ///// <summary>
        ///// Get Anesthesia fitness by AdmissionID
        ///// </summary>
        ///// <param>int admissionID</param>
        ///// <returns>AnesthesiafitnessModel. if the record of AnesthesiafitnessModel for given admissionID = success. else = failure</returns>
        public AnesthesiafitnessModel GetAnesthesiafitnessRecordbyAdmissionID(int admissionID)
        {
            var anesthesiaFitnessRecord = (from anesFitness in this.uow.GenericRepository<Anesthesiafitness>().Table().Where(x => x.AdmissionId == admissionID)

                                           join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                           on anesFitness.AdmissionId equals adm.AdmissionID

                                           join pat in this.uow.GenericRepository<Patient>().Table()
                                           on adm.PatientID equals pat.PatientId

                                           select new
                                           {
                                               anesFitness.AnesthesiafitnessId,
                                               anesFitness.AdmissionId,
                                               anesFitness.WNLRespiratory,
                                               anesFitness.Cough,
                                               anesFitness.Dyspnea,
                                               anesFitness.Dry,
                                               anesFitness.RecentURILRTI,
                                               anesFitness.OSA,
                                               anesFitness.Productive,
                                               anesFitness.TB,
                                               anesFitness.COPD,
                                               anesFitness.Asthma,
                                               anesFitness.Pneumonia,
                                               anesFitness.Fever,
                                               anesFitness.WNLNeuroMusculoskeletal,
                                               anesFitness.RhArthritisGOUT,
                                               anesFitness.CVATIA,
                                               anesFitness.Seizures,
                                               anesFitness.ScoliosisKyphosis,
                                               anesFitness.HeadInjury,
                                               anesFitness.PsychDisorder,
                                               anesFitness.MuscleWeakness,
                                               anesFitness.Paralysis,
                                               anesFitness.WNLCardio,
                                               anesFitness.Hypertension,
                                               anesFitness.DOE,
                                               anesFitness.Pacemarker,
                                               anesFitness.RheumaticFever,
                                               anesFitness.OrthopneaPND,
                                               anesFitness.CADAnginaMI,
                                               anesFitness.ExerciseTolerance,
                                               anesFitness.WNLRenalEndocrine,
                                               anesFitness.RenalInsufficiency,
                                               anesFitness.ThyroidDisease,
                                               anesFitness.Diabetes,
                                               anesFitness.WNLGastrointestinal,
                                               anesFitness.Vomiting,
                                               anesFitness.Cirrhosis,
                                               anesFitness.Diarrhea,
                                               anesFitness.GERD,
                                               anesFitness.WNLOthers,
                                               anesFitness.HeamatDisorder,
                                               anesFitness.Radiotherapy,
                                               anesFitness.Immunosuppressant,
                                               anesFitness.Pregnancy,
                                               anesFitness.Chemotherapy,
                                               anesFitness.SteroidUse,
                                               anesFitness.Smoking,
                                               anesFitness.Alcohol,
                                               anesFitness.Allergies,
                                               anesFitness.LA,
                                               anesFitness.GA,
                                               anesFitness.RA,
                                               anesFitness.NA,
                                               anesFitness.SignificantDetails,
                                               anesFitness.CurrentMedications,
                                               anesFitness.Pulse,
                                               anesFitness.Clubbing,
                                               anesFitness.IntubationSimpleDifficult,
                                               anesFitness.BP,
                                               anesFitness.Cyanosis,
                                               anesFitness.ShortNeck,
                                               anesFitness.RR,
                                               anesFitness.Icterus,
                                               anesFitness.MouthOpening,
                                               anesFitness.Temp,
                                               anesFitness.Obesity,
                                               anesFitness.MPClass,
                                               anesFitness.Pallor,
                                               anesFitness.ODH,
                                               anesFitness.Thyromental,
                                               anesFitness.LooseTooth,
                                               anesFitness.Distance,
                                               anesFitness.ArtificialDentures,
                                               anesFitness.DifficultVenousAccess,
                                               anesFitness.AnesthesiaFitnessCleared,
                                               anesFitness.AnesthesiaFitnessnotes,
                                               anesFitness.SignOffBy,
                                               anesFitness.SignOffDate,
                                               anesFitness.SignOffStatus,
                                               pat.PatientFirstName,
                                               pat.PatientMiddleName,
                                               pat.PatientLastName,
                                               adm.FacilityID

                                           }).AsEnumerable().Select(AFM => new AnesthesiafitnessModel
                                           {
                                               AnesthesiafitnessId = AFM.AnesthesiafitnessId,
                                               AdmissionId = AFM.AdmissionId,
                                               FacilityId = AFM.FacilityID,
                                               facilityName = AFM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == AFM.FacilityID).FacilityName : "",
                                               WNLRespiratory = AFM.WNLRespiratory,
                                               Cough = AFM.Cough,
                                               Dyspnea = AFM.Dyspnea,
                                               Dry = AFM.Dry,
                                               RecentURILRTI = AFM.RecentURILRTI,
                                               OSA = AFM.OSA,
                                               Productive = AFM.Productive,
                                               TB = AFM.TB,
                                               COPD = AFM.COPD,
                                               Asthma = AFM.Asthma,
                                               Pneumonia = AFM.Pneumonia,
                                               Fever = AFM.Fever,
                                               WNLNeuroMusculoskeletal = AFM.WNLNeuroMusculoskeletal,
                                               RhArthritisGOUT = AFM.RhArthritisGOUT,
                                               CVATIA = AFM.CVATIA,
                                               Seizures = AFM.Seizures,
                                               ScoliosisKyphosis = AFM.ScoliosisKyphosis,
                                               HeadInjury = AFM.HeadInjury,
                                               PsychDisorder = AFM.PsychDisorder,
                                               MuscleWeakness = AFM.MuscleWeakness,
                                               Paralysis = AFM.Paralysis,
                                               WNLCardio = AFM.WNLCardio,
                                               Hypertension = AFM.Hypertension,
                                               DOE = AFM.DOE,
                                               Pacemarker = AFM.Pacemarker,
                                               RheumaticFever = AFM.RheumaticFever,
                                               OrthopneaPND = AFM.OrthopneaPND,
                                               CADAnginaMI = AFM.CADAnginaMI,
                                               ExerciseTolerance = AFM.ExerciseTolerance,
                                               WNLRenalEndocrine = AFM.WNLRenalEndocrine,
                                               RenalInsufficiency = AFM.RenalInsufficiency,
                                               ThyroidDisease = AFM.ThyroidDisease,
                                               Diabetes = AFM.Diabetes,
                                               WNLGastrointestinal = AFM.WNLGastrointestinal,
                                               Vomiting = AFM.Vomiting,
                                               Cirrhosis = AFM.Cirrhosis,
                                               Diarrhea = AFM.Diarrhea,
                                               GERD = AFM.GERD,
                                               WNLOthers = AFM.WNLOthers,
                                               HeamatDisorder = AFM.HeamatDisorder,
                                               Radiotherapy = AFM.Radiotherapy,
                                               Immunosuppressant = AFM.Immunosuppressant,
                                               Pregnancy = AFM.Pregnancy,
                                               Chemotherapy = AFM.Chemotherapy,
                                               SteroidUse = AFM.SteroidUse,
                                               Smoking = AFM.Smoking,
                                               Alcohol = AFM.Alcohol,
                                               Allergies = AFM.Allergies,
                                               LA = AFM.LA,
                                               GA = AFM.GA,
                                               RA = AFM.RA,
                                               NA = AFM.NA,
                                               SignificantDetails = AFM.SignificantDetails,
                                               CurrentMedications = AFM.CurrentMedications,
                                               Pulse = AFM.Pulse,
                                               Clubbing = AFM.Clubbing,
                                               IntubationSimpleDifficult = AFM.IntubationSimpleDifficult,
                                               BP = AFM.BP,
                                               Cyanosis = AFM.Cyanosis,
                                               ShortNeck = AFM.ShortNeck,
                                               RR = AFM.RR,
                                               Icterus = AFM.Icterus,
                                               MouthOpening = AFM.MouthOpening,
                                               Temp = AFM.Temp,
                                               Obesity = AFM.Obesity,
                                               MPClass = AFM.MPClass,
                                               Pallor = AFM.Pallor,
                                               ODH = AFM.ODH,
                                               Thyromental = AFM.Thyromental,
                                               LooseTooth = AFM.LooseTooth,
                                               Distance = AFM.Distance,
                                               ArtificialDentures = AFM.ArtificialDentures,
                                               DifficultVenousAccess = AFM.DifficultVenousAccess,
                                               AnesthesiaFitnessCleared = AFM.AnesthesiaFitnessCleared,
                                               AnesthesiaFitnessnotes = AFM.AnesthesiaFitnessnotes,
                                               SignOffBy = AFM.SignOffBy,
                                               SignOffDate = AFM.SignOffDate,
                                               SignOffStatus = AFM.SignOffStatus,
                                               PatientName = AFM.PatientFirstName + " " + AFM.PatientMiddleName + " " + AFM.PatientLastName

                                           }).FirstOrDefault();

            return anesthesiaFitnessRecord;
        }

        ///// <summary>
        ///// Delete Anesthesia fitness record by ID
        ///// </summary>
        ///// <param>int anesthesiafitnessId</param>
        ///// <returns>Anesthesiafitness. if the record of Anesthesia fitness for given anesthesiafitnessId is deleted = success. else = failure</returns>
        public Anesthesiafitness DeleteAnesthesiaRecordbyId(int anesthesiafitnessId)
        {
            var anesthesiaFitnessRecord = this.uow.GenericRepository<Anesthesiafitness>().Table().Where(x => x.AnesthesiafitnessId == anesthesiafitnessId).FirstOrDefault();

            if (anesthesiaFitnessRecord != null)
            {
                anesthesiaFitnessRecord.IsActive = false;
                this.uow.GenericRepository<Anesthesiafitness>().Update(anesthesiaFitnessRecord);
                this.uow.Save();
            }

            return anesthesiaFitnessRecord;
        }

        #endregion

        #region Drug Chart

        ///// <summary>
        ///// Add or Update Drug Chart
        ///// </summary>
        ///// <param>DrugChartModel drugChartModel</param>
        ///// <returns>DrugChartModel. if DrugChartModel with ID = success. else = failure</returns>
        public DrugChartModel AddUpdateDrugChartData(DrugChartModel drugChartModel)
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
        ///// Update Drug Chart Collection
        ///// </summary>
        ///// <param>IEnumerable<DrugChartModel> drugChartCollection</param>
        ///// <returns>IEnumerable<DrugChartModel>. if DrugChartModel with ID = success. else = failure</returns>
        public IEnumerable<DrugChartModel> UpdateAdministrationDrugChart(IEnumerable<DrugChartModel> drugChartCollection)
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
        ///// Get Drug Chart List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DrugChartModel>. if list of DrugChartModel = success. else = failure</returns>
        public List<DrugChartModel> GetDrugChartList()
        {
            var drugChartList = (from chart in this.uow.GenericRepository<DrugChart>().Table().Where(x => x.IsActive != false)

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
        ///// Get Drug Chart List for PreProcedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DrugChartModel>. if list of DrugChartModel = success. else = failure</returns>
        public List<DrugChartModel> GetDrugChartListforPreProcedure()
        {
            var drugChartList = (from chart in this.uow.GenericRepository<DrugChart>().Table().Where(x => x.IsActive != false & x.ProcedureType.ToLower().Trim() == "preprocedure")

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
        ///// Get Drug Chart List for Admission Number
        ///// </summary>
        ///// <param>string admissionNo</param>
        ///// <returns>List<DrugChartModel>. if list of DrugChartModel for Admission Number = success. else = failure</returns>
        public List<DrugChartModel> GetDrugChartListforPreProcedurebyAdmissionNumber(string admissionNo)
        {
            var drugChartList = (from chart in this.uow.GenericRepository<DrugChart>().Table().
                                 Where(x => x.IsActive != false & x.AdmissionNo == admissionNo & x.ProcedureType.ToLower().Trim() == "preprocedure")

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
        ///// Get Drug Chart by ID
        ///// </summary>
        ///// <param>int drugChartId</param>
        ///// <returns>DrugChartModel. if the record of DrugChartModel for given drugChartId = success. else = failure</returns>
        public DrugChartModel GetDrugChartRecordbyId(int drugChartId)
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

                                   }).FirstOrDefault();

            return drugChartRecord;
        }

        ///// <summary>
        ///// Delete Drug Chart record by ID
        ///// </summary>
        ///// <param>int drugChartId</param>
        ///// <returns>DrugChart. if the record of Drug Chart for given drugChartId is deleted = success. else = failure</returns>
        public DrugChart DeleteDrugChartRecordbyId(int drugChartId)
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

        #region Pre Procedure 

        ///// <summary>
        ///// Add or Update Pre Procedure data
        ///// </summary>
        ///// <param>PreProcedureModel preProcedureModel</param>
        ///// <returns>PreProcedureModel. if PreProcedureModel with ID after add or update = success. else = failure</returns>
        public PreProcedureModel AddUpdatePreProcedureData(PreProcedureModel preProcedureModel)
        {
            var preProcedureRecord = this.uow.GenericRepository<PreProcedure>().Table().Where(x => x.AdmissionID == preProcedureModel.AdmissionID).FirstOrDefault();

            if (preProcedureRecord == null)
            {
                preProcedureRecord = new PreProcedure();

                preProcedureRecord.AdmissionID = preProcedureModel.AdmissionID;
                preProcedureRecord.ProcedureDate = this.utilService.GetLocalTime(preProcedureModel.ProcedureDate);
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
        ///// Get Pre Procedure for Patient
        ///// </summary>
        ///// <param>int patientID</param>
        ///// <returns>List<PreProcedureModel>. if list of PreProcedureModel = success. else = failure</returns>
        public List<PreProcedureModel> GetPreProceduresforPatient(int patientID)
        {
            var preProcedureList = (from preProc in this.uow.GenericRepository<PreProcedure>().Table().
                                    Where(x => x.ProcedureStatus.ToLower().Trim() != "cancelled")

                                    join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                                    on preProc.AdmissionID equals adm.AdmissionID

                                    join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == patientID)
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
                                        adm.FacilityID,
                                        PatName = pat.PatientFirstName + " " + pat.PatientMiddleName + " " + pat.PatientLastName,
                                        provName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName

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
                                        PatientName = PPM.PatName,
                                        ProviderName = PPM.provName,
                                        admissionModel = this.GetPreProcedureAdmissionRecordbyId(PPM.AdmissionID)

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
        ///// Get Pre Procedure 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PreProcedureModel>. if list of PreProcedureModel = success. else = failure</returns>
        public List<PreProcedureModel> GetAllPreProcedures()
        {
            var preProcedureList = (from preProc in this.uow.GenericRepository<PreProcedure>().Table().
                                    Where(x => x.ProcedureStatus.ToLower().Trim() != "cancelled")

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
                                        adm.FacilityID,
                                        PatName = pat.PatientFirstName + " " + pat.PatientMiddleName + " " + pat.PatientLastName,
                                        provName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName

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
                                        PatientName = PPM.PatName,
                                        ProviderName = PPM.provName,
                                        admissionModel = this.GetPreProcedureAdmissionRecordbyId(PPM.AdmissionID)

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
        ///// Get Pre Procedure by admissionId
        ///// </summary>
        ///// <param>int admissionId</param>
        ///// <returns>PreProcedureModel. if record of PreProcedureModel by AdmissionId = success. else = failure</returns>
        public PreProcedureModel GetPreProcedurebyAdmissionId(int admissionId)
        {
            var preProcedureRecord = (from preProc in this.uow.GenericRepository<PreProcedure>().Table().Where(x => x.AdmissionID == admissionId)

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
                                          adm.FacilityID,
                                          PatName = pat.PatientFirstName + " " + pat.PatientMiddleName + " " + pat.PatientLastName,
                                          provName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName

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
                                          PatientName = PPM.PatName,
                                          ProviderName = PPM.provName,
                                          admissionModel = this.GetPreProcedureAdmissionRecordbyId(PPM.AdmissionID)

                                      }).FirstOrDefault();

            return preProcedureRecord;
        }

        ///// <summary>
        ///// Get Pre Procedure by preProcedureId
        ///// </summary>
        ///// <param>int preProcedureId</param>
        ///// <returns>PreProcedureModel. if record of PreProcedureModel by preProcedureId = success. else = failure</returns>
        public PreProcedureModel GetPreProcedurebyId(int preProcedureId)
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
                                          adm.FacilityID,
                                          PatName = pat.PatientFirstName + " " + pat.PatientMiddleName + " " + pat.PatientLastName,
                                          provName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName

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
                                          PatientName = PPM.PatName,
                                          ProviderName = PPM.provName,
                                          admissionModel = this.GetPreProcedureAdmissionRecordbyId(PPM.AdmissionID)

                                      }).FirstOrDefault();

            return preProcedureRecord;
        }

        ///// <summary>
        ///// Cancel Pre Procedure 
        ///// </summary>
        ///// <param>int admissionId, string Reason</param>
        ///// <returns>PreProcedure. if record of PreProcedure is Cancelled for Given preProcedureId = success. else = failure</returns>
        public PreProcedure CancelPreProcedure(int admissionId, string Reason)
        {
            var preProcedureRecord = this.uow.GenericRepository<PreProcedure>().Table().Where(x => x.AdmissionID == admissionId).FirstOrDefault();

            if (preProcedureRecord != null)
            {
                preProcedureRecord.CancelReason = Reason;
                preProcedureRecord.ProcedureStatus = "Cancelled";

                this.uow.GenericRepository<PreProcedure>().Update(preProcedureRecord);
                this.uow.Save();
            }

            return preProcedureRecord;
        }

        public List<string> UserVerification(string UserName, string Password)
        {
            List<string> UserStatuses = new List<string>();
            string status = "";
            SigningOffModel signOffModel = new SigningOffModel();

            signOffModel.UserName = UserName;
            signOffModel.Password = Password;

            if ((UserName != null && UserName != "") && (Password != null && Password != ""))
            {
                status = this.utilService.UserCheck(signOffModel).Result.status;
            }
            else
            {
                status = "Username or Password is Empty. Please Fill both to Verify User";
            }
            UserStatuses.Add(status);

            return UserStatuses;
        }

        #endregion

        #region PreProcedure Search and Count

        ///// <summary>
        ///// Get Patients for PreProcedure search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForPreProcedureSearch(string searchKey)
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
        ///// Get Providers For PreProcedure Search
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for PreProcedure = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforPreProcedureSearch(string searchKey)
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
        ///// Get Counts of PreProcedure
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> If counts of PreProcedure = success. else = failure</returns>
        public PrePostProcedureCountModel GetTodayPreProcedureCount()
        {
            PrePostProcedureCountModel countModel = new PrePostProcedureCountModel();

            var admissions = this.GetAllAdmissionsforPreProcedure().Where(x => x.AdmissionDateTime.Date == DateTime.Now.Date).ToList();

            countModel.TotalRequestCount = admissions.Count();
            countModel.FitnessClearanceCount = admissions.Where(x => x.AnesthesiaFitnessRequired == true).ToList().Count();
            countModel.ScheduledCount = (from adms in admissions
                                         join preProc in this.uow.GenericRepository<PreProcedure>().Table()
                                         on adms.AdmissionID equals preProc.AdmissionID
                                         where preProc.ProcedureStatus.ToLower().Trim() == "scheduled"
                                         select adms).ToList().Count();

            return countModel;
        }

        ///// <summary>
        ///// Get Admissions by using SearchModel for Pre procedure grid
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
                                         && (searchModel.FacilityId == 0 || admission.FacilityID == searchModel.FacilityId)
                                         && ((searchModel.AdmissionNo == null || searchModel.AdmissionNo == "") || admission.AdmissionNo.ToLower().Trim() == searchModel.AdmissionNo.ToLower().Trim())
                                         //&& (searchModel.SpecialityId == 0 || admission.SpecialityID == searchModel.SpecialityId)
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
                                     procedureRequestData = this.GetProcedureRequestforPreProcedurebyId(AM.ProcedureRequestId),
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
                                     procedureStatus = this.uow.GenericRepository<PreProcedure>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID) != null ?
                                                        this.uow.GenericRepository<PreProcedure>().Table().FirstOrDefault(x => x.AdmissionID == AM.AdmissionID).ProcedureStatus : "Admitted",
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

            return admissionsCollection.Where(x => x.procedureStatus.ToLower().Trim() != "cancelled").ToList();
        }

        #endregion

    }
}
