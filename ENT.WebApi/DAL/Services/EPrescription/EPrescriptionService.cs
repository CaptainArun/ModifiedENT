using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Hosting;

namespace ENT.WebApi.DAL.Services
{
    public class EPrescriptionService : IEPrescriptionService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        private readonly IHostingEnvironment hostingEnvironment;

        public EPrescriptionService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
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
        public List<DrugCode> GetDrugCodesforEPrescription(string searchKey)
        {
            return this.utilService.GetAllDrugCodes(searchKey);
        }

        ///// <summary>
        ///// Get DiagnosisCodes (ICD codes)
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<DiagnosisCode>. if Collection of DiagnosisCode = success. else = failure</returns>
        public List<DiagnosisCode> GetDiagnosisCodesforEPrescription(string searchKey)
        {
            return this.utilService.GetAllDiagnosisCodesbySearch(searchKey);
        }

        ///// <summary>
        ///// Get Medication Routes List
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationRoute>. if Collection of MedicationRoute = success. else = failure</returns>
        public List<MedicationRoute> GetMedicationRoutesforEPrescription()
        {
            var medicationRoutes = this.iTenantMasterService.GetMedicationRouteList();
            return medicationRoutes;
        }

        ///// <summary>
        ///// Get Medication Number
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<string>. if Medication Number = success. else = failure</returns>
        public List<string> GetMedicationNumber()
        {
            List<string> medNumbers = new List<string>();

            var rXNo = this.iTenantMasterService.GetMedicationNo();

            medNumbers.Add(rXNo);

            return medNumbers;
        }

        #endregion

        #region Search and Count

        ///// <summary>
        ///// Get Patients for EPrescription
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForEPrescription(string searchKey)
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
        public List<ProviderModel> GetProvidersforEPrescription(string searchKey)
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
        ///// Get Medication Numbers for Discharge Search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<string> If Medication Numbers for given searchKey = success. else = failure</returns>
        public List<string> GetMedicationNumbersbySearch(string searchKey)
        {
            List<string> medicationNumbers = new List<string>();

            var medicationRecords = this.uow.GenericRepository<Medications>().Table().Where(x => x.IsActive != false & x.MedicationNumber.ToLower().Trim().Contains(searchKey.ToLower().Trim())).ToList();

            if (medicationRecords.Count() > 0)
            {
                foreach (var data in medicationRecords)
                {
                    if (!medicationNumbers.Contains(data.MedicationNumber))
                    {
                        medicationNumbers.Add(data.MedicationNumber);
                    }
                }
            }

            return medicationNumbers;
        }

        ///// <summary>
        ///// Get Medication status for Discharge Search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<string> If Medication status for given searchKey = success. else = failure</returns>
        public List<string> GetMedicationStatuses()
        {
            List<string> medicationStatusList = new List<string>();

            var medicationRecords = this.uow.GenericRepository<Medications>().Table().Where(x => x.IsActive != false).ToList();

            if (medicationRecords.Count() > 0)
            {
                foreach (var data in medicationRecords)
                {
                    if (!medicationStatusList.Contains(data.MedicationStatus))
                    {
                        medicationStatusList.Add(data.MedicationStatus);
                    }
                }
            }

            return medicationStatusList.Distinct().ToList(); ;
        }

        ///// <summary>
        ///// Get ePrescriptions or Medications by using SearchModel
        ///// </summary>
        ///// <param>(SearchModel searchModel)</param>
        ///// <returns>List<MedicationsModel>. if Collection of MedicationsModel = success. else = failure</returns>
        public List<MedicationsModel> GetMedicationsbySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            int patId = 0;

            var medicationRecords = (from med in this.uow.GenericRepository<Medications>().Table().Where(X => X.IsActive != false)

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

                                     }).ToList();

            if (medicationRecords.Count() > 0)
            {
                for (int i = 0; i < medicationRecords.Count(); i++)
                {
                    if (medicationRecords[i].AdmissionID > 0)
                    {
                        patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRecords[i].AdmissionID).PatientID;
                    }
                    else if (medicationRecords[i].VisitID > 0)
                    {
                        patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRecords[i].VisitID).PatientId;
                    }

                    var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                    var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == medicationRecords[i].MedicationPhysician);
                    var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRecords[i].VisitID);
                    var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRecords[i].AdmissionID);

                    medicationRecords[i].PatientId = patId;
                    medicationRecords[i].PatientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                    medicationRecords[i].physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;

                    if (admdata != null)
                    {
                        medicationRecords[i].AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                        medicationRecords[i].AdmissionNo = admdata.AdmissionNo;
                        medicationRecords[i].FacilityID = admdata.FacilityID;
                        medicationRecords[i].ProviderId = admdata.AdmittingPhysician;
                        medicationRecords[i].facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                    }

                    if (visitdata != null)
                    {
                        medicationRecords[i].VisitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                        medicationRecords[i].VisitNo = visitdata.VisitNo;
                        medicationRecords[i].FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                        medicationRecords[i].ProviderId = visitdata.ProviderID;
                        medicationRecords[i].facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                    }
                }
            }

            var medicationList = (from medics in medicationRecords
                                  where (Fromdate.Date <= medics.CreatedDate.Date
                                        && (Todate.Date >= Fromdate.Date && medics.CreatedDate.Date <= Todate.Date)
                                        && (searchModel.PatientId == 0 || medics.PatientId == searchModel.PatientId)
                                        && (searchModel.ProviderId == 0 || medics.MedicationPhysician == searchModel.ProviderId)
                                        && (searchModel.FacilityId == 0 || medics.FacilityID == searchModel.FacilityId)
                                        && ((searchModel.MedicationNo == null || searchModel.MedicationNo == "")
                                            || medics.MedicationNumber.ToLower().Trim() == searchModel.MedicationNo.ToLower().Trim())
                                        && ((searchModel.status == null || searchModel.status == "")
                                            || medics.MedicationStatus.ToLower().Trim() == searchModel.status.ToLower().Trim()))
                                  select medics).ToList();

            List<MedicationsModel> medicationCollection = new List<MedicationsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (medicationList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            medicationCollection = (from med in medicationList
                                                    join fac in facList on med.FacilityID equals fac.FacilityId
                                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                    on med.ProviderId equals prov.ProviderID
                                                    select med).ToList();
                        }
                        else
                        {
                            medicationCollection = (from med in medicationList
                                                    join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                    on med.ProviderId equals prov.ProviderID
                                                    select med).ToList();
                        }
                    }
                    else
                    {
                        medicationCollection = (from med in medicationList.Where(x => x.FacilityID == searchModel.FacilityId)
                                                join fac in facList on med.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on med.ProviderId equals prov.ProviderID
                                                select med).ToList();
                    }
                }
                else
                {
                    medicationCollection = (from med in medicationList
                                            join fac in facList on med.FacilityID equals fac.FacilityId
                                            select med).ToList();
                }
            }
            else
            {
                medicationCollection = medicationList;
            }

            return medicationCollection;
        }

        ///// <summary>
        ///// Get Medication counts
        ///// </summary>
        ///// <param>Nil</param>
        ///// <returns>EPrescriptionCountModel. if counts Medications and Medication Requests  = success. else = failure</returns>
        public EPrescriptionCountModel GetMedicationCounts()
        {
            EPrescriptionCountModel medicationCountModel = new EPrescriptionCountModel();

            medicationCountModel.TodaymedicationCount = this.GetAllMedications().Where(x => x.CreatedDate.Date == DateTime.Now.Date).ToList().Count();
            medicationCountModel.TodaymedicationRequestCount = this.GetAllMedicationRequestsforMedication().Where(x => x.RequestedDate.Value.Date == DateTime.Now.Date & x.MedicationRequestStatus.ToLower().Trim() == "requested").ToList().Count();

            return medicationCountModel;
        }

        #endregion

        #region Patient data

        ///// <summary>
        ///// Get Patient DetailBy Id
        ///// </summary>
        ///// <param>PatientId</param>
        ///// <returns>PatientDemographicModel. if Patient Data for given PatientId = success. else = failure</returns>
        public PatientDemographicModel GetPatientRecordByPatientId(int PatientId)
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

        #endregion

        #region Medication Request

        ///// <summary>
        ///// Get Medication Requests
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>MedicationRequestsModel. if Medication Request for selected Patient Id = success. else = failure</returns>
        public List<MedicationRequestsModel> GetAllMedicationRequestsforPatient(int patientId)
        {
            int patId = 0;

            var medicationRequests = (from medRequest in this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.IsActive != false
                                      & x.MedicationRequestStatus.ToLower().Trim() == "requested")

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
                                          medRequest.RequestedBy

                                      }).AsEnumerable().Select(MRM => new MedicationRequestsModel
                                      {
                                          MedicationRequestId = MRM.MedicationRequestId,
                                          AdmissionID = MRM.AdmissionID,
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
                                          medicationRequestItems = this.GetMedicationRequestItems(MRM.MedicationRequestId)

                                      }).ToList();

            if (medicationRequests.Count() > 0)
            {
                for (int i = 0; i < medicationRequests.Count(); i++)
                {
                    if (medicationRequests[i].AdmissionID > 0)
                    {
                        patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRequests[i].AdmissionID).PatientID;
                    }
                    else if (medicationRequests[i].VisitID > 0)
                    {
                        patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRequests[i].VisitID).PatientId;
                    }

                    var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                    var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRequests[i].VisitID);
                    var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRequests[i].AdmissionID);

                    medicationRequests[i].PatientId = patId;
                    medicationRequests[i].PatientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;

                    if (admdata != null)
                    {
                        medicationRequests[i].AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                        medicationRequests[i].providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().ProviderID;
                        medicationRequests[i].FacilityId = admdata.FacilityID;
                        medicationRequests[i].facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                        medicationRequests[i].RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().FirstName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().MiddleName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().LastName;
                    }

                    if (visitdata != null)
                    {
                        medicationRequests[i].VisitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                        medicationRequests[i].providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().ProviderID;
                        medicationRequests[i].FacilityId = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                        medicationRequests[i].facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                        medicationRequests[i].RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().FirstName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().MiddleName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().LastName;
                    }
                }
            }

            List<MedicationRequestsModel> medicationReqCollection = new List<MedicationRequestsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (medicationRequests.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        medicationReqCollection = (from med in medicationRequests
                                                   join fac in facList on med.FacilityId equals fac.FacilityId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on med.providerId equals prov.ProviderID
                                                   select med).ToList();
                    }
                    else
                    {
                        medicationReqCollection = (from med in medicationRequests
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on med.providerId equals prov.ProviderID
                                                   select med).ToList();
                    }
                }
                else
                {
                    medicationReqCollection = (from med in medicationRequests
                                               join fac in facList on med.FacilityId equals fac.FacilityId
                                               select med).ToList();
                }
            }
            else
            {
                medicationReqCollection = medicationRequests;
            }

            return medicationReqCollection.Where(x => x.PatientId == patientId).ToList();
        }

        ///// <summary>
        ///// Get All Medication Requests
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>MedicationRequestsModel. if All Medication Requests = success. else = failure</returns>
        public List<MedicationRequestsModel> GetAllMedicationRequestsforMedication()
        {
            int patId = 0;

            var medicationRequests = (from medRequest in this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.IsActive != false
                                      & x.MedicationRequestStatus.ToLower().Trim() == "requested")

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
                                          medRequest.RequestedBy

                                      }).AsEnumerable().Select(MRM => new MedicationRequestsModel
                                      {
                                          MedicationRequestId = MRM.MedicationRequestId,
                                          AdmissionID = MRM.AdmissionID,
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
                                          RequestedDate = MRM.RequestedDate,
                                          RequestedBy = MRM.RequestedBy,
                                          MedicationRequestStatus = MRM.MedicationRequestStatus,
                                          medicationRequestItems = this.GetMedicationRequestItems(MRM.MedicationRequestId)

                                      }).ToList();

            if (medicationRequests.Count() > 0)
            {
                for (int i = 0; i < medicationRequests.Count(); i++)
                {
                    if (medicationRequests[i].AdmissionID > 0)
                    {
                        patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRequests[i].AdmissionID).PatientID;
                    }
                    else if (medicationRequests[i].VisitID > 0)
                    {
                        patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRequests[i].VisitID).PatientId;
                    }

                    var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                    var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRequests[i].VisitID);
                    var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRequests[i].AdmissionID);

                    medicationRequests[i].PatientId = patId;
                    medicationRequests[i].PatientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;

                    if (admdata != null)
                    {
                        medicationRequests[i].AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                        medicationRequests[i].providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().ProviderID;
                        medicationRequests[i].FacilityId = admdata.FacilityID;
                        medicationRequests[i].facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                        medicationRequests[i].RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().FirstName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().MiddleName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().LastName;
                    }

                    if (visitdata != null)
                    {
                        medicationRequests[i].VisitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                        medicationRequests[i].providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().ProviderID;
                        medicationRequests[i].FacilityId = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                        medicationRequests[i].facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                        medicationRequests[i].RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().FirstName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().MiddleName + " " +
                                                                    this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().LastName;
                    }
                }
            }

            List<MedicationRequestsModel> medicationReqCollection = new List<MedicationRequestsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (medicationRequests.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        medicationReqCollection = (from med in medicationRequests
                                                   join fac in facList on med.FacilityId equals fac.FacilityId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on med.providerId equals prov.ProviderID
                                                   select med).ToList();
                    }
                    else
                    {
                        medicationReqCollection = (from med in medicationRequests
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                   on med.providerId equals prov.ProviderID
                                                   select med).ToList();
                    }
                }
                else
                {
                    medicationReqCollection = (from med in medicationRequests
                                               join fac in facList on med.FacilityId equals fac.FacilityId
                                               select med).ToList();
                }
            }
            else
            {
                medicationReqCollection = medicationRequests;
            }

            return medicationReqCollection;
        }

        ///// <summary>
        ///// Get Medication Request by Id
        ///// </summary>
        ///// <param>int medicationRequestId</param>
        ///// <returns>MedicationRequestsModel. if Medication Request for selected Admission Id = success. else = failure</returns>
        public MedicationRequestsModel GetMedicationRequestbyId(int medicationRequestId)
        {
            int patId = 0;

            var medicationRequest = (from medRequest in this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.MedicationRequestId == medicationRequestId)

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
                                         medRequest.RequestedBy

                                     }).AsEnumerable().Select(MRM => new MedicationRequestsModel
                                     {
                                         MedicationRequestId = MRM.MedicationRequestId,
                                         AdmissionID = MRM.AdmissionID,
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
                                         medicationRequestItems = this.GetMedicationRequestItems(MRM.MedicationRequestId)

                                     }).FirstOrDefault();

            if (medicationRequest != null)
            {

                if (medicationRequest.AdmissionID > 0)
                {
                    patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRequest.AdmissionID).PatientID;
                }
                else if (medicationRequest.VisitID > 0)
                {
                    patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRequest.VisitID).PatientId;
                }

                var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRequest.VisitID);
                var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRequest.AdmissionID);

                medicationRequest.PatientId = patId;
                medicationRequest.PatientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                if (admdata != null)
                {
                    medicationRequest.AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                    medicationRequest.providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().ProviderID;
                    medicationRequest.FacilityId = admdata.FacilityID;
                    medicationRequest.facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                    medicationRequest.RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().FirstName + " " +
                                                                this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().MiddleName + " " +
                                                                this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == admdata.AdmittingPhysician).FirstOrDefault().LastName;
                }

                if (visitdata != null)
                {
                    medicationRequest.VisitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                    medicationRequest.providerId = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().ProviderID;
                    medicationRequest.FacilityId = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                    medicationRequest.facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                    medicationRequest.RequestingPhysician = this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().FirstName + " " +
                                                                this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().MiddleName + " " +
                                                                this.uow.GenericRepository<Provider>().Table().Where(x => x.ProviderID == visitdata.ProviderID).FirstOrDefault().LastName;
                }
            }

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
        ///// Confirm Medication Request status
        ///// </summary>
        ///// <param>(int medicationRequestId)</param>
        ///// <returns>MedicationRequests. if record of medication Request by ID = success. else = failure</returns>
        public MedicationRequests ConfirmMedicationStatus(int medicationRequestId)
        {
            var medicationRequest = this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.MedicationRequestId == medicationRequestId).FirstOrDefault();

            if (medicationRequest != null)
            {
                medicationRequest.MedicationRequestStatus = "Confirmed";

                this.uow.GenericRepository<MedicationRequests>().Update(medicationRequest);
                this.uow.Save();
            }

            return medicationRequest;
        }

        ///// <summary>
        ///// Cancel Medication Request status
        ///// </summary>
        ///// <param>(int medicationRequestId)</param>
        ///// <returns>MedicationRequests. if record of medication Request by ID is cancelled = success. else = failure</returns>
        public MedicationRequests CancelMedicationStatus(int medicationRequestId)
        {
            var medicationRequest = this.uow.GenericRepository<MedicationRequests>().Table().Where(x => x.MedicationRequestId == medicationRequestId).FirstOrDefault();

            if (medicationRequest != null)
            {
                medicationRequest.MedicationRequestStatus = "Cancelled";

                this.uow.GenericRepository<MedicationRequests>().Update(medicationRequest);
                this.uow.Save();
            }

            return medicationRequest;
        }

        ///// <summary>
        ///// Verifying whether the user is valid or not
        ///// </summary>
        ///// <param>(string userName, string Password)</param>
        ///// <returns>string. if string value = success. else = failure</returns>
        public string UserVerification(string userName, string Password)
        {
            string status = "";

            SigningOffModel signOffModel = new SigningOffModel();

            signOffModel.UserName = userName;
            signOffModel.Password = Password;

            if ((signOffModel.UserName != null && signOffModel.UserName != "") && (signOffModel.Password != null && signOffModel.Password != ""))
            {
                status = this.utilService.UserCheck(signOffModel).Result.status;
            }
            else
            {
                status = "Please fill both UserName and Password to Verify the User";
            }
            return status;
        }

        #endregion

        #region Medications (E Prescription)        

        ///// <summary>
        ///// Get Visit details by Patient Id
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientVisitModel>. if list of Visits for given Patient Id = success. else = failure</returns>
        public List<PatientVisitModel> GetVisitsbyPatientforMedication(int PatientId)
        {
            var visitList = (from visit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.PatientId == PatientId)
                             join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientStatus.ToLower().Trim() == "active")
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

                             }).AsEnumerable().OrderByDescending(x => x.VisitDate).Select(PVM => new PatientVisitModel
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
        ///// Add or Update Medications
        ///// </summary>
        ///// <param>(MedicationsModel medicationsModel)</param>
        ///// <returns>MedicationsModel. if Record of Medication added or Updated = success. else = failure</returns>
        public MedicationsModel AddUpdateMedicationforEPrescription(MedicationsModel medicationsModel)
        {
            var getRXCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                               where common.CommonMasterCode.ToLower().Trim() == "rxno"
                               select common).FirstOrDefault();

            var rxCheck = this.uow.GenericRepository<Medications>().Table()
                            .Where(x => x.MedicationNumber.ToLower().Trim() == getRXCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            SigningOffModel signOffModel = new SigningOffModel();

            signOffModel.UserName = medicationsModel.UserName;
            signOffModel.Password = medicationsModel.Password;

            if ((signOffModel.UserName != null && signOffModel.UserName != "") && (signOffModel.Password != null && signOffModel.Password != ""))
            {
                var result = this.utilService.UserCheck(signOffModel);

                if (result.Result.status.ToLower().Trim() == "valid user")
                {
                    var medication = this.uow.GenericRepository<Medications>().Table().Where(x => x.MedicationNumber.ToLower().Trim() == medicationsModel.MedicationNumber.ToLower().Trim()).FirstOrDefault();

                    if (medication == null)
                    {
                        medication = new Medications();

                        medication.MedicationNumber = rxCheck != null ? medicationsModel.MedicationNumber : getRXCommon.CommonMasterDesc;
                        medication.VisitID = medicationsModel.VisitID;
                        medication.AdmissionID = medicationsModel.AdmissionID;
                        medication.MedicationPhysician = medicationsModel.MedicationPhysician;
                        medication.TakeRegularMedication = medicationsModel.TakeRegularMedication;
                        medication.IsHoldRegularMedication = medicationsModel.IsHoldRegularMedication;
                        medication.HoldRegularMedicationNotes = medicationsModel.HoldRegularMedicationNotes;
                        medication.IsDiscontinueDrug = medicationsModel.IsDiscontinueDrug;
                        medication.DiscontinueDrugNotes = medicationsModel.DiscontinueDrugNotes;
                        medication.IsPharmacist = medicationsModel.IsPharmacist;
                        medication.PharmacistNotes = medicationsModel.PharmacistNotes;
                        medication.IsRefill = medicationsModel.IsRefill;
                        medication.RefillCount = medicationsModel.RefillCount;
                        medication.RefillDate = medicationsModel.RefillDate != null ? this.utilService.GetLocalTime(medicationsModel.RefillDate.Value) : medicationsModel.RefillDate;
                        medication.RefillNotes = medicationsModel.RefillNotes;
                        medication.MedicationStatus = "Ordered";
                        medication.IsActive = true;
                        medication.Createdby = "User";
                        medication.CreatedDate = DateTime.Now;

                        this.uow.GenericRepository<Medications>().Insert(medication);
                        this.uow.Save();

                        getRXCommon.CurrentIncNo = medication.MedicationNumber;
                        this.uow.GenericRepository<CommonMaster>().Update(getRXCommon);
                    }
                    else
                    {
                        medication.TakeRegularMedication = medicationsModel.TakeRegularMedication;
                        medication.IsHoldRegularMedication = medicationsModel.IsHoldRegularMedication;
                        medication.HoldRegularMedicationNotes = medicationsModel.HoldRegularMedicationNotes;
                        medication.IsDiscontinueDrug = medicationsModel.IsDiscontinueDrug;
                        medication.DiscontinueDrugNotes = medicationsModel.DiscontinueDrugNotes;
                        medication.IsPharmacist = medicationsModel.IsPharmacist;
                        medication.PharmacistNotes = medicationsModel.PharmacistNotes;
                        medication.IsRefill = medicationsModel.IsRefill;
                        medication.RefillCount = medicationsModel.RefillCount;
                        medication.RefillDate = medicationsModel.RefillDate != null ? this.utilService.GetLocalTime(medicationsModel.RefillDate.Value) : medicationsModel.RefillDate;
                        medication.RefillNotes = medicationsModel.RefillNotes;
                        medication.MedicationStatus = "Ordered";
                        medication.IsActive = true;
                        medication.Modifiedby = "User";
                        medication.ModifiedDate = DateTime.Now;

                        this.uow.GenericRepository<Medications>().Update(medication);
                    }
                    this.uow.Save();
                    medicationsModel.MedicationId = medication.MedicationId;
                    medicationsModel.ValidationStatus = "Valid User";

                    if (medication.MedicationId > 0 && medicationsModel.medicationItems.Count() > 0)
                    {
                        var meds = this.uow.GenericRepository<MedicationItems>().Table().Where(x => x.MedicationID == medication.MedicationId).ToList();

                        if (meds.Count() < 1)
                        {
                            for (int i = 0; i < medicationsModel.medicationItems.Count(); i++)
                            {
                                MedicationItems medItem = new MedicationItems();

                                medItem.MedicationID = medication.MedicationId;
                                medItem.DrugName = medicationsModel.medicationItems[i].DrugName;
                                medItem.MedicationRouteCode = medicationsModel.medicationItems[i].MedicationRouteCode;
                                medItem.ICDCode = medicationsModel.medicationItems[i].ICDCode;
                                medItem.TotalQuantity = medicationsModel.medicationItems[i].TotalQuantity;
                                medItem.NoOfDays = medicationsModel.medicationItems[i].NoOfDays;
                                medItem.Morning = medicationsModel.medicationItems[i].Morning;
                                medItem.Brunch = medicationsModel.medicationItems[i].Brunch;
                                medItem.Noon = medicationsModel.medicationItems[i].Noon;
                                medItem.Evening = medicationsModel.medicationItems[i].Evening;
                                medItem.Night = medicationsModel.medicationItems[i].Night;
                                medItem.Before = medicationsModel.medicationItems[i].Before;
                                medItem.After = medicationsModel.medicationItems[i].After;
                                medItem.Start = medicationsModel.medicationItems[i].Start;
                                medItem.Hold = medicationsModel.medicationItems[i].Hold;
                                medItem.Continued = medicationsModel.medicationItems[i].Continued;
                                medItem.DisContinue = medicationsModel.medicationItems[i].DisContinue;
                                medItem.SIG = medicationsModel.medicationItems[i].SIG;
                                medItem.IsActive = true;
                                medItem.Createdby = "User";
                                medItem.CreatedDate = DateTime.Now;

                                this.uow.GenericRepository<MedicationItems>().Insert(medItem);
                                medicationsModel.medicationItems[i].MedicationID = medItem.MedicationID;
                            }
                        }
                        else
                        {
                            foreach (var item in meds)
                            {
                                this.uow.GenericRepository<MedicationItems>().Delete(item);
                            }
                            this.uow.Save();

                            for (int i = 0; i < medicationsModel.medicationItems.Count(); i++)
                            {
                                MedicationItems medItem = new MedicationItems();

                                medItem.MedicationID = medication.MedicationId;
                                medItem.DrugName = medicationsModel.medicationItems[i].DrugName;
                                medItem.MedicationRouteCode = medicationsModel.medicationItems[i].MedicationRouteCode;
                                medItem.ICDCode = medicationsModel.medicationItems[i].ICDCode;
                                medItem.TotalQuantity = medicationsModel.medicationItems[i].TotalQuantity;
                                medItem.NoOfDays = medicationsModel.medicationItems[i].NoOfDays;
                                medItem.Morning = medicationsModel.medicationItems[i].Morning;
                                medItem.Brunch = medicationsModel.medicationItems[i].Brunch;
                                medItem.Noon = medicationsModel.medicationItems[i].Noon;
                                medItem.Evening = medicationsModel.medicationItems[i].Evening;
                                medItem.Night = medicationsModel.medicationItems[i].Night;
                                medItem.Before = medicationsModel.medicationItems[i].Before;
                                medItem.After = medicationsModel.medicationItems[i].After;
                                medItem.Start = medicationsModel.medicationItems[i].Start;
                                medItem.Hold = medicationsModel.medicationItems[i].Hold;
                                medItem.Continued = medicationsModel.medicationItems[i].Continued;
                                medItem.DisContinue = medicationsModel.medicationItems[i].DisContinue;
                                medItem.SIG = medicationsModel.medicationItems[i].SIG;
                                medItem.IsActive = true;
                                medItem.Createdby = "User";
                                medItem.CreatedDate = DateTime.Now;

                                this.uow.GenericRepository<MedicationItems>().Insert(medItem);
                                medicationsModel.medicationItems[i].MedicationID = medItem.MedicationID;
                            }
                        }
                        this.uow.Save();

                        //MedicationItems medItem = new MedicationItems();

                        //    for (int i = 0; i < medicationsModel.medicationItems.Count(); i++)
                        //    {
                        //        medItem = this.uow.GenericRepository<MedicationItems>().Table().FirstOrDefault(x => x.MedicationItemsId == medicationsModel.medicationItems[i].MedicationItemsId);
                        //        if (medItem == null)
                        //        {
                        //            medItem = new MedicationItems();

                        //            medItem.MedicationID = medication.MedicationId;
                        //            medItem.DrugName = medicationsModel.medicationItems[i].DrugName;
                        //            medItem.MedicationRouteCode = medicationsModel.medicationItems[i].MedicationRouteCode;
                        //            medItem.ICDCode = medicationsModel.medicationItems[i].ICDCode;
                        //            medItem.TotalQuantity = medicationsModel.medicationItems[i].TotalQuantity;
                        //            medItem.NoOfDays = medicationsModel.medicationItems[i].NoOfDays;
                        //            medItem.Morning = medicationsModel.medicationItems[i].Morning;
                        //            medItem.Brunch = medicationsModel.medicationItems[i].Brunch;
                        //            medItem.Noon = medicationsModel.medicationItems[i].Noon;
                        //            medItem.Evening = medicationsModel.medicationItems[i].Evening;
                        //            medItem.Night = medicationsModel.medicationItems[i].Night;
                        //            medItem.Before = medicationsModel.medicationItems[i].Before;
                        //            medItem.After = medicationsModel.medicationItems[i].After;
                        //            medItem.Start = medicationsModel.medicationItems[i].Start;
                        //            medItem.Hold = medicationsModel.medicationItems[i].Hold;
                        //            medItem.Continued = medicationsModel.medicationItems[i].Continued;
                        //            medItem.DisContinue = medicationsModel.medicationItems[i].DisContinue;
                        //            medItem.SIG = medicationsModel.medicationItems[i].SIG;
                        //            medItem.IsActive = true;
                        //            medItem.Createdby = "User";
                        //            medItem.CreatedDate = DateTime.Now;

                        //            this.uow.GenericRepository<MedicationItems>().Insert(medItem);
                        //        }
                        //        else
                        //        {
                        //            medItem.DrugName = medicationsModel.medicationItems[i].DrugName;
                        //            medItem.MedicationRouteCode = medicationsModel.medicationItems[i].MedicationRouteCode;
                        //            medItem.ICDCode = medicationsModel.medicationItems[i].ICDCode;
                        //            medItem.TotalQuantity = medicationsModel.medicationItems[i].TotalQuantity;
                        //            medItem.NoOfDays = medicationsModel.medicationItems[i].NoOfDays;
                        //            medItem.Morning = medicationsModel.medicationItems[i].Morning;
                        //            medItem.Brunch = medicationsModel.medicationItems[i].Brunch;
                        //            medItem.Noon = medicationsModel.medicationItems[i].Noon;
                        //            medItem.Evening = medicationsModel.medicationItems[i].Evening;
                        //            medItem.Night = medicationsModel.medicationItems[i].Night;
                        //            medItem.Before = medicationsModel.medicationItems[i].Before;
                        //            medItem.After = medicationsModel.medicationItems[i].After;
                        //            medItem.Start = medicationsModel.medicationItems[i].Start;
                        //            medItem.Hold = medicationsModel.medicationItems[i].Hold;
                        //            medItem.Continued = medicationsModel.medicationItems[i].Continued;
                        //            medItem.DisContinue = medicationsModel.medicationItems[i].DisContinue;
                        //            medItem.SIG = medicationsModel.medicationItems[i].SIG;
                        //            medItem.IsActive = true;
                        //            medItem.Modifiedby = "User";
                        //            medItem.ModifiedDate = DateTime.Now;

                        //            this.uow.GenericRepository<MedicationItems>().Update(medItem);
                        //        }
                        //        this.uow.Save();
                        //        medicationsModel.medicationItems[i].MedicationID = medItem.MedicationID;
                        //        medicationsModel.medicationItems[i].MedicationItemsId = medItem.MedicationItemsId;
                        //    }
                    }
                }
                else
                {
                    medicationsModel.ValidationStatus = "Invalid User";
                }
            }
            else
            {
                medicationsModel.ValidationStatus = "Please fill both UserName and Password to Verify the User";
            }

            return medicationsModel;
        }

        ///// <summary>
        ///// Get Medications
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>List<MedicationsModel>. if Medication for given patient Id = success. else = failure</returns>
        public List<MedicationsModel> GetMedicationsforPatient(int patientId)
        {
            List<MedicationsModel> medicationRecords = new List<MedicationsModel>();

            var medications = this.uow.GenericRepository<Medications>().Table().Where(x => x.IsActive != false).ToList();

            if (medications.Count() > 0)
            {
                foreach (var data in medications)
                {
                    MedicationsModel medicationData = new MedicationsModel();

                    if (data.AdmissionID > 0)
                    {
                        medicationData = this.GetMedicationForAdmission(data.AdmissionID, patientId);
                    }
                    else if (data.VisitID > 0)
                    {
                        medicationData = this.GetMedicationForVisit(data.VisitID, patientId);
                    }

                    if (!medicationRecords.Contains(medicationData))
                    {
                        medicationRecords.Add(medicationData);
                    }
                }
            }

            List<MedicationsModel> medicationCollection = new List<MedicationsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (medicationRecords.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        medicationCollection = (from med in medicationRecords
                                                join fac in facList on med.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on med.ProviderId equals prov.ProviderID
                                                select med).ToList();
                    }
                    else
                    {
                        medicationCollection = (from med in medicationRecords
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on med.ProviderId equals prov.ProviderID
                                                select med).ToList();
                    }
                }
                else
                {
                    medicationCollection = (from med in medicationRecords
                                            join fac in facList on med.FacilityID equals fac.FacilityId
                                            select med).ToList();
                }
            }
            else
            {
                medicationCollection = medicationRecords;
            }

            return medicationCollection;
        }

        ///// <summary>
        ///// Get Medications
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<MedicationsModel>. if Medication collection = success. else = failure</returns>
        public List<MedicationsModel> GetAllMedications()
        {
            int patId = 0;

            var medicationRecords = (from med in this.uow.GenericRepository<Medications>().Table().Where(X => X.IsActive != false)

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

                                     }).ToList();

            if (medicationRecords.Count() > 0)
            {
                for (int i = 0; i < medicationRecords.Count(); i++)
                {
                    if (medicationRecords[i].AdmissionID > 0)
                    {
                        patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRecords[i].AdmissionID).PatientID;
                    }
                    else if (medicationRecords[i].VisitID > 0)
                    {
                        patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRecords[i].VisitID).PatientId;
                    }

                    var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                    var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == medicationRecords[i].MedicationPhysician);
                    var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRecords[i].VisitID);
                    var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRecords[i].AdmissionID);

                    medicationRecords[i].PatientId = patId;
                    medicationRecords[i].PatientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                    medicationRecords[i].physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;

                    if (admdata != null)
                    {
                        medicationRecords[i].AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                        medicationRecords[i].FacilityID = admdata.FacilityID;
                        medicationRecords[i].ProviderId = admdata.AdmittingPhysician;
                        medicationRecords[i].facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                    }

                    if (visitdata != null)
                    {
                        medicationRecords[i].VisitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                        medicationRecords[i].FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                        medicationRecords[i].ProviderId = visitdata.ProviderID;
                        medicationRecords[i].facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                    }
                }
            }

            List<MedicationsModel> medicationCollection = new List<MedicationsModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (medicationRecords.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        medicationCollection = (from med in medicationRecords
                                                join fac in facList on med.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on med.ProviderId equals prov.ProviderID
                                                select med).ToList();
                    }
                    else
                    {
                        medicationCollection = (from med in medicationRecords
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on med.ProviderId equals prov.ProviderID
                                                select med).ToList();
                    }
                }
                else
                {
                    medicationCollection = (from med in medicationRecords
                                            join fac in facList on med.FacilityID equals fac.FacilityId
                                            select med).ToList();
                }
            }
            else
            {
                medicationCollection = medicationRecords;
            }

            return medicationCollection;
        }

        ///// <summary>
        ///// Get Medication Record by Id
        ///// </summary>
        ///// <param>int medicationId</param>
        ///// <returns>MedicationsModel. if Medication Record by Given Id = success. else = failure</returns>
        public MedicationsModel GetMedicationRecordbyID(int medicationId)
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
        ///// Get Medication Record for Print preview
        ///// </summary>
        ///// <param>int medicationId</param>
        ///// <returns>MedicationsModel. if Medication Record by Given Id = success. else = failure</returns>
        public MedicationsModel GetMedicationRecordforPreview(int medicationId)
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
                var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medicationRecord.VisitID);
                var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medicationRecord.AdmissionID);

                medicationRecord.PatientId = patdata.PatientId;
                medicationRecord.MRNumber = patdata.MRNo;
                medicationRecord.Age = patdata.PatientAge;
                medicationRecord.Sex = patdata.Gender;
                medicationRecord.PatientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                medicationRecord.PatientContactNumber = patdata.PrimaryContactNumber;
                var patDemo = this.uow.GenericRepository<PatientDemographic>().Table().FirstOrDefault(x => x.PatientId == patdata.PatientId);
                medicationRecord.PatientAddress = (((patDemo.Address1 != null && patDemo.Address1 != "" && patDemo.Address1 != " ") ? (patDemo.Address1.Trim()) : "") +
                                 ((patDemo.Address2 != null && patDemo.Address2 != "" && patDemo.Address2 != " ") ? (", " + patDemo.Address2.Trim()) : "") +
                                 ((patDemo.Village != null && patDemo.Village != "" && patDemo.Village != " ") ? (", " + patDemo.Village.Trim()) : "") +
                                 ((patDemo.Town != null && patDemo.Town != "" && patDemo.Town != " ") ? (", " + patDemo.Town.Trim()) : "") +
                                 ((patDemo.City != null && patDemo.City != "" && patDemo.City != " ") ? (", " + patDemo.City.Trim()) : "") +
                                 ((patDemo.State != null && patDemo.State != "" && patDemo.State != " ") ? (", " + patDemo.State.Trim()) : "") +
                                 ((patDemo.Country != null && patDemo.Country != "" && patDemo.Country != " ") ? (", " + patDemo.Country.Trim()) : "") +
                                 (patDemo.Pincode >0 ? (" - " + patDemo.Pincode) : "")).Trim();

                if (admdata != null)
                {
                    medicationRecord.AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                    medicationRecord.ProviderId = admdata.AdmittingPhysician;
                    medicationRecord.FacilityID = admdata.FacilityID;
                    medicationRecord.facilityName = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName;
                }

                if (visitdata != null)
                {
                    medicationRecord.VisitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                    medicationRecord.FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                    medicationRecord.ProviderId = visitdata.ProviderID;
                    medicationRecord.facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                }

                var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == medicationRecord.ProviderId);
                medicationRecord.physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;
                medicationRecord.ProviderContactNumber = this.uow.GenericRepository<ProviderContact>().Table().Where(x => x.ProviderID == provdata.ProviderID).ToList().Count() > 0 ?
                                                         this.uow.GenericRepository<ProviderContact>().Table().FirstOrDefault(x => x.ProviderID == provdata.ProviderID).PhoneNumber : "";
                var ProvAddresses = this.uow.GenericRepository<ProviderAddress>().Table().Where(x => x.ProviderID == provdata.ProviderID).ToList();
                medicationRecord.ProviderAddress = ProvAddresses.Count() > 0 ?
                    (((ProvAddresses.FirstOrDefault().DoorOrApartmentNo != null && ProvAddresses.FirstOrDefault().DoorOrApartmentNo != "") ? ProvAddresses.FirstOrDefault().DoorOrApartmentNo.Trim() : "")
                    + ((ProvAddresses.FirstOrDefault().ApartmentNameOrHouseName != null && ProvAddresses.FirstOrDefault().ApartmentNameOrHouseName != "") ? (", " + ProvAddresses.FirstOrDefault().ApartmentNameOrHouseName.Trim()) : "")
                    + ((ProvAddresses.FirstOrDefault().StreetName != null && ProvAddresses.FirstOrDefault().StreetName != "" && ProvAddresses.FirstOrDefault().StreetName != " ") ? (", " + ProvAddresses.FirstOrDefault().StreetName.Trim()) : "")
                    + ((ProvAddresses.FirstOrDefault().Town != null && ProvAddresses.FirstOrDefault().Town != "" && ProvAddresses.FirstOrDefault().Town != " ") ? (", " + ProvAddresses.FirstOrDefault().Town.Trim()) : "")
                    + ((ProvAddresses.FirstOrDefault().City != null && ProvAddresses.FirstOrDefault().City != "" && ProvAddresses.FirstOrDefault().City != " ") ? (", " + ProvAddresses.FirstOrDefault().City.Trim()) : "")
                    + ((ProvAddresses.FirstOrDefault().District != null && ProvAddresses.FirstOrDefault().District != "" && ProvAddresses.FirstOrDefault().District != " ") ? (", " + ProvAddresses.FirstOrDefault().District.Trim()) : "")
                    + ((ProvAddresses.FirstOrDefault().State != null && ProvAddresses.FirstOrDefault().State != "" && ProvAddresses.FirstOrDefault().State != " ") ? (", " + ProvAddresses.FirstOrDefault().State.Trim()) : "")
                    + ((ProvAddresses.FirstOrDefault().Country != null && ProvAddresses.FirstOrDefault().Country != "" && ProvAddresses.FirstOrDefault().Country != " ") ? (", " + ProvAddresses.FirstOrDefault().Country.Trim()) : "")
                    + (ProvAddresses.FirstOrDefault().PinCode > 0 ? (" - " + ProvAddresses.FirstOrDefault().PinCode) : "")).Trim() : "";
                var provSpecialities = this.uow.GenericRepository<ProviderSpeciality>().Table().Where(x => x.ProviderID == provdata.ProviderID).ToList();
                var specialityList = this.utilService.GetAllSpecialities();
                string Specialitynames = "";
                if (provSpecialities.Count() > 0)
                {
                    for (int i = 0; i < provSpecialities.Count(); i++)
                    {
                        if (provSpecialities[i].SpecialityID > 0)
                        {
                            if (i + 1 == provSpecialities.Count())
                            {
                                if (Specialitynames == null || Specialitynames == "")
                                {
                                    Specialitynames = specialityList.FirstOrDefault(x => x.SpecialityID == provSpecialities[i].SpecialityID).SpecialityDescription;
                                }
                                else
                                {
                                    Specialitynames = Specialitynames + specialityList.FirstOrDefault(x => x.SpecialityID == provSpecialities[i].SpecialityID).SpecialityDescription;
                                }
                            }
                            else
                            {
                                if (Specialitynames == null || Specialitynames == "")
                                {
                                    Specialitynames = specialityList.FirstOrDefault(x => x.SpecialityID == provSpecialities[i].SpecialityID).SpecialityDescription + ", ";
                                }
                                else
                                {
                                    Specialitynames = Specialitynames + specialityList.FirstOrDefault(x => x.SpecialityID == provSpecialities[i].SpecialityID).SpecialityDescription + ", ";
                                }
                            }
                        }
                    }
                }
                medicationRecord.ProviderSpecialities = provSpecialities.Count() > 0 ? Specialitynames : "";

                string moduleName = "";
                if (string.IsNullOrWhiteSpace(hostingEnvironment.WebRootPath))
                {
                    hostingEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                moduleName = hostingEnvironment.WebRootPath + "\\Documents\\Provider\\Signature\\" + provdata.ProviderID.ToString();
                medicationRecord.ProviderSign = this.iTenantMasterService.GetFiles(moduleName).Count() > 0? this.iTenantMasterService.GetFiles(moduleName).FirstOrDefault().ActualFile : "";

                var facData = this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == medicationRecord.FacilityID);
                if (facData != null)
                {
                    medicationRecord.facilityAddress = (((facData.AddressLine1 != null && facData.AddressLine1 != "" && facData.AddressLine1 != " ") ? facData.AddressLine1.Trim() : "")
                                                    + ((facData.AddressLine2 != null && facData.AddressLine2 != "" && facData.AddressLine2 != " ") ? (", " + facData.AddressLine2.Trim()) : "")
                                                    + ((facData.City != null && facData.City != "" && facData.City != " ") ? (", " + facData.City.Trim()) : "")
                                                    + ((facData.State != null && facData.State != "" && facData.State != " ") ? (", " + facData.State.Trim()) : "")
                                                    + ((facData.Country != null && facData.Country != "" && facData.Country != " ") ? (", " + facData.Country.Trim()) : "")
                                                    + ((facData.PINCode != null && facData.PINCode != "" && facData.PINCode != " ") ? (" - " + facData.PINCode.Trim()) : "")).Trim();
                    medicationRecord.facilityContactNumber = facData.Telephone;
                    medicationRecord.facilityNumber = facData.FacilityNumber;
                    medicationRecord.facilitySpecialities = (facData.SpecialityId != null && facData.SpecialityId != "") ? (facData.SpecialityId.Contains(",") ? this.iTenantMasterService.GetSpecialitiesforFacility(facData.SpecialityId) :
                                                                specialityList.FirstOrDefault(x => x.SpecialityID == Convert.ToInt32(facData.SpecialityId)).SpecialityDescription) : "";
                }
            }

            return medicationRecord;
        }

        ///// <summary>
        ///// Get Medications for Admission
        ///// </summary>
        ///// <param>int AdmissionId, int patientId</param>
        ///// <returns>MedicationsModel. if Medication  for selected Admission Id = success. else = failure</returns>
        public MedicationsModel GetMedicationForAdmission(int admissionId, int patientId)
        {
            var medication = (from med in this.uow.GenericRepository<Medications>().Table().Where(x => x.AdmissionID == admissionId)

                              join adm in this.uow.GenericRepository<Admissions>().Table().Where(x => x.IsActive != false)
                              on med.AdmissionID equals adm.AdmissionID

                              join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == patientId)
                              on adm.PatientID equals pat.PatientId

                              join prov in this.uow.GenericRepository<Provider>().Table()
                              on med.MedicationPhysician equals prov.ProviderID

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
                                  med.CreatedDate,
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

                              }).AsEnumerable().Select(MRM => new MedicationsModel
                              {
                                  MedicationId = MRM.MedicationId,
                                  AdmissionID = MRM.AdmissionID,
                                  FacilityID = MRM.FacilityID,
                                  ProviderId = MRM.AdmittingPhysician,
                                  facilityName = MRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == MRM.FacilityID).FacilityName : "",
                                  PatientId = MRM.PatientId,
                                  PatientName = MRM.PatientFirstName + " " + MRM.PatientMiddleName + " " + MRM.PatientLastName,
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
                                  AdmissionDateandTime = MRM.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + MRM.AdmissionDateTime.TimeOfDay.ToString(),
                                  medicationItems = this.GetMedicationItems(MRM.MedicationId),
                                  physicianName = MRM.FirstName + " " + MRM.MiddleName + " " + MRM.LastName

                              }).FirstOrDefault();

            return medication;
        }

        ///// <summary>
        ///// Get Medications for visit
        ///// </summary>
        ///// <param>int visitId, int patientId</param>
        ///// <returns>MedicationsModel. if Medication for selected visit Id = success. else = failure</returns>
        public MedicationsModel GetMedicationForVisit(int visitId, int patientId)
        {
            var medication = (from med in this.uow.GenericRepository<Medications>().Table().Where(x => x.VisitID == visitId)

                              join visit in this.uow.GenericRepository<PatientVisit>().Table()
                              on med.VisitID equals visit.VisitId

                              join pat in this.uow.GenericRepository<Patient>().Table().Where(x => x.PatientId == patientId)
                              on visit.PatientId equals pat.PatientId

                              join prov in this.uow.GenericRepository<Provider>().Table()
                              on med.MedicationPhysician equals prov.ProviderID

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
                                  med.CreatedDate,
                                  visit.VisitDate,
                                  visit.FacilityID,
                                  visit.ProviderID,
                                  pat.PatientId,
                                  pat.PatientFirstName,
                                  pat.PatientMiddleName,
                                  pat.PatientLastName,
                                  prov.FirstName,
                                  prov.MiddleName,
                                  prov.LastName

                              }).AsEnumerable().Select(MRM => new MedicationsModel
                              {
                                  MedicationId = MRM.MedicationId,
                                  AdmissionID = MRM.AdmissionID,
                                  PatientId = MRM.PatientId,
                                  PatientName = MRM.PatientFirstName + " " + MRM.PatientMiddleName + " " + MRM.PatientLastName,
                                  VisitID = MRM.VisitID,
                                  ProviderId = MRM.ProviderID,
                                  FacilityID = MRM.FacilityID > 0 ? MRM.FacilityID.Value : 0,
                                  facilityName = MRM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == MRM.FacilityID).FacilityName : "",
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
                                  VisitDateandTime = MRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + MRM.VisitDate.TimeOfDay.ToString(),
                                  medicationItems = this.GetMedicationItems(MRM.MedicationId),
                                  physicianName = MRM.FirstName + " " + MRM.MiddleName + " " + MRM.LastName

                              }).FirstOrDefault();

            return medication;
        }

        ///// <summary>
        ///// Get Medications for mediationNo
        ///// </summary>
        ///// <param>string mediationNo</param>
        ///// <returns>MedicationsModel. if Medication for selected mediationNo = success. else = failure</returns>
        public MedicationsModel GetMedicationbyMedicationNumber(string medicationNo)
        {
            int patId = 0;

            var medication = (from med in this.uow.GenericRepository<Medications>().Table().Where(x => x.MedicationNumber.ToLower().Trim() == medicationNo.ToLower().Trim())

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

            if (medication != null)
            {

                if (medication.AdmissionID > 0)
                {
                    patId = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medication.AdmissionID).PatientID;
                }
                else if (medication.VisitID > 0)
                {
                    patId = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medication.VisitID).PatientId;
                }

                var patdata = this.uow.GenericRepository<Patient>().Table().FirstOrDefault(x => x.PatientId == patId);
                var provdata = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == medication.MedicationPhysician);
                var visitdata = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == medication.VisitID);
                var admdata = this.uow.GenericRepository<Admissions>().Table().FirstOrDefault(x => x.AdmissionID == medication.AdmissionID);

                medication.PatientId = patId;
                medication.PatientName = patdata.PatientFirstName + " " + patdata.PatientMiddleName + " " + patdata.PatientLastName;
                medication.physicianName = provdata.FirstName + " " + provdata.MiddleName + " " + provdata.LastName;

                if (admdata != null)
                {
                    medication.AdmissionDateandTime = admdata.AdmissionDateTime.Date.ToString("dd/MM/yyyy") + " " + admdata.AdmissionDateTime.TimeOfDay.ToString();
                    medication.FacilityID = admdata.FacilityID;
                    medication.ProviderId = admdata.AdmittingPhysician;
                    medication.facilityName = admdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == admdata.FacilityID).FacilityName : "";
                }

                if (visitdata != null)
                {
                    medication.VisitDateandTime = visitdata.VisitDate.Date.ToString("dd/MM/yyyy") + " " + visitdata.VisitDate.TimeOfDay.ToString();
                    medication.FacilityID = visitdata.FacilityID > 0 ? visitdata.FacilityID.Value : 0;
                    medication.ProviderId = visitdata.ProviderID;
                    medication.facilityName = visitdata.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visitdata.FacilityID).FacilityName : "";
                }
            }

            return medication;
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
                                MorningValue = MRIM.Morning == true ? "1" : "0",
                                Brunch = MRIM.Brunch,
                                BrunchValue = MRIM.Brunch == true ? "1" : "0",
                                Noon = MRIM.Noon,
                                NoonValue = MRIM.Noon == true ? "1" : "0",
                                Evening = MRIM.Evening,
                                EveningValue = MRIM.Evening == true ? "1" : "0",
                                Night = MRIM.Night,
                                NightValue = MRIM.Night == true ? "1" : "0",
                                Before = MRIM.Before,
                                BeforeValue = MRIM.Before == true ? "Yes" : "No",
                                After = MRIM.After,
                                AfterValue = MRIM.After == true ? "Yes" : "No",
                                Start = MRIM.Start,
                                Hold = MRIM.Hold,
                                Continued = MRIM.Continued,
                                DisContinue = MRIM.DisContinue,
                                SIG = MRIM.SIG

                            }).ToList();

            return medItems;
        }

        ///// <summary>
        ///// Cancel Medication  by Id
        ///// </summary>
        ///// <param>int medicationId</param>
        ///// <returns>Medications. if Medication  Deleted for given medication med Id = success. else = failure</returns>
        public Medications CancelMedicationFromEPrescription(int medicationId)
        {
            var med = this.uow.GenericRepository<Medications>().Table().Where(x => x.MedicationId == medicationId).FirstOrDefault();

            if (med != null)
            {
                //med.IsActive = false;
                med.MedicationStatus = "Cancelled";
                this.uow.GenericRepository<Medications>().Update(med);

                this.uow.Save();
            }

            return med;
        }

        ///// <summary>
        ///// Cancel Medication  by Id
        ///// </summary>
        ///// <param>int medicationId</param>
        ///// <returns>Medications. if Medication Deleted for given medication med Id = success. else = failure</returns>
        public Medications DeleteMedicationRecordbyId(int medicationId)
        {
            var med = this.uow.GenericRepository<Medications>().Table().Where(x => x.MedicationId == medicationId).FirstOrDefault();

            if (med != null)
            {
                med.IsActive = false;
                //med.MedicationStatus = "Cancelled";
                this.uow.GenericRepository<Medications>().Update(med);

                this.uow.Save();
            }

            return med;
        }

        #endregion

    }
}
