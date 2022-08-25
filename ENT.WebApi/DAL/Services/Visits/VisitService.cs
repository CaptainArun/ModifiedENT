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
    public class VisitService : IVisitService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;

        public VisitService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master for Visit

        ///// <summary>
        ///// Get All PatientArrivalConditions
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientArrivalCondition>. if Collection of PatientArrivalCondition = success. else = failure</returns>
        public List<PatientArrivalCondition> GetAllArrivalConditions()
        {
            var conditions = this.iTenantMasterService.GetPatientArrivalConditions();
            return conditions;
        }

        ///// <summary>
        ///// Get All UrgencyTypes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<UrgencyType>. if Collection of UrgencyType = success. else = failure</returns>
        public List<UrgencyType> GetAllUrgencyTypes()
        {
            var Urgencies = this.iTenantMasterService.GetUrgencyTypeList();
            return Urgencies;
        }

        ///// <summary>
        ///// Get All VisitStatuses
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<VisitStatus>. if Collection of VisitStatus = success. else = failure</returns>
        public List<VisitStatus> GetAllVisitStatuses()
        {
            var visitStatuses = this.iTenantMasterService.GetVisitStatusList();
            return visitStatuses;
        }

        ///// <summary>
        ///// Get All RecordedDuring options
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<RecordedDuring>. if Collection of RecordedDuring = success. else = failure</returns>
        public List<RecordedDuring> GetAllRecordedDuringOptions()
        {
            var recDurings = this.iTenantMasterService.GetRecordedDuringList();
            return recDurings;
        }

        ///// <summary>
        ///// Get All VisitTypes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<VisitType>. if Collection of VisitType = success. else = failure</returns>
        public List<VisitType> GetAllVisitTypes()
        {
            var visitTypes = this.iTenantMasterService.GetVisitTypeList();
            return visitTypes;
        }

        ///// <summary>
        ///// Get facilities for Visits
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Facility>. if Collection of facilities = success. else = failure</returns>
        public List<Facility> GetFacilitiesforVisits()
        {
            var facList = this.utilService.GetFacilitiesforUser();
            var facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                              join record in facList
                              on fac.FacilityId equals record.FacilityId
                              select fac).ToList();
            return facilities;
        }

        ///// <summary>
        ///// Get providers for Visits
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Provider>. if Collection of providers = success. else = failure</returns>
        public List<Provider> GetProvidersforVisits()
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
        ///// Get Receipt number for Visit Payment
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> List<string>. if Receipt number = success. else = failure</returns>
        public List<string> GetReceiptNumber()
        {
            List<string> receipts = new List<string>();

            var RcptNo = this.iTenantMasterService.GetReceiptNo();

            receipts.Add(RcptNo);

            return receipts;
        }

        ///// <summary>
        ///// Get Bill number for Visit Payment
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns> List<string>. if Bill number = success. else = failure</returns>
        public List<string> GetBillNumber()
        {
            List<string> bills = new List<string>();

            var billNo = this.iTenantMasterService.GetBillNo();

            bills.Add(billNo);

            return bills;
        }

        ///// <summary> 
        ///// Get All Consultation Type for Visit
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ConsultationType>. if Collection of Consultation Type options = success. else = failure</returns>
        public List<ConsultationType> GetConsultationTypesForVisit()
        {
            var consultationTypes = this.iTenantMasterService.GetConsultationTypeList();
            return consultationTypes;
        }

        ///// <summary> 
        ///// Get All Appointments Booked options for Visit
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AppointmentBooked>. if Collection of Appointment Booked options = success. else = failure</returns>
        public List<AppointmentBooked> GetAppointmentBookedListForVisit()
        {
            var appointmentsBooked = this.iTenantMasterService.GetAppointmentBookedList();
            return appointmentsBooked;
        }

        ///// <summary> 
        ///// Get All Payment Types for Visit
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PaymentType>. if Collection of Payment Types = success. else = failure</returns>
        public List<PaymentType> GetPaymentTypeListforVisit()
        {
            var paymentTypes = this.iTenantMasterService.GetAllPaymentTypes();

            return paymentTypes;
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
                                if (!providers.Contains(data))
                                {
                                    providers.Add(data);
                                }
                            }
                        }
                    }
                }
            }

            return providers;
        }

        //// <summary>
        ///// Get Appointment Number for search
        ///// </summary>
        ///// <param>search Key</param>
        ///// <returns>List<string>. if collection of Appointment number = success. else = failure</returns>
        public List<string> GetAppointmentNumbersbySearch(string searchKey)
        {
            var appntNumbers = this.iTenantMasterService.GetAppointmentNumbersbySearch(searchKey);
            return appntNumbers;
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

        #endregion

        ///// <summary>
        ///// Add or update a visit
        ///// </summary>
        ///// <param>PatientVisitModel visitData(visitData--> object of PatientVisitModel)</param>
        ///// <returns>PatientVisitModel. if visitData after insertion and updation = success. else = failure</returns>
        public PatientVisitModel AddUpdateVisit(PatientVisitModel visitData)
        {
            PatientVisit visit = new PatientVisit();

            var getVSTNoCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                  where common.CommonMasterCode.ToLower().Trim() == "vstno"
                                  select common).FirstOrDefault();

            var VSTNoCheck = this.uow.GenericRepository<PatientVisit>().Table()
                            .Where(x => x.VisitNo.ToLower().Trim() == getVSTNoCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var visitRecord = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == visitData.VisitId);
            if (visitRecord != null && visitRecord.VisitDate == visitData.VisitDate)
            {
                visit = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.PatientId == visitData.PatientId & x.VisitDate == visitData.VisitDate);
            }
            else if (visitRecord == null || (visitRecord != null && visitRecord.VisitDate != visitData.VisitDate))
            {
                visit = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.PatientId == visitData.PatientId & x.VisitDate == this.utilService.GetLocalTime(visitData.VisitDate));
            }

            if (visit == null)
            {
                visit = new PatientVisit();

                visit.VisitNo = VSTNoCheck != null ? visitData.VisitNo : getVSTNoCommon.CommonMasterDesc;
                visit.VisitDate = (visitRecord != null && visitRecord.VisitDate == visitData.VisitDate) ? visitData.VisitDate : this.utilService.GetLocalTime(visitData.VisitDate);
                visit.Visittime = (visitRecord != null && visitRecord.VisitDate == visitData.VisitDate) ? visitData.VisitDate.TimeOfDay.ToString() : this.utilService.GetLocalTime(visitData.VisitDate).TimeOfDay.ToString();
                visit.PatientId = visitData.PatientId;
                visit.FacilityID = visitData.FacilityID;
                //visit.FacilityID = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == visitData.ProviderID).FacilityId;
                visit.VisitReason = visitData.VisitReason;
                visit.ToConsult = visitData.ToConsult;
                visit.ProviderID = visitData.ProviderID;
                visit.AppointmentID = visitData.AppointmentID;
                visit.ReferringFacility = visitData.ReferringFacility;
                visit.ReferringProvider = visitData.ReferringProvider;
                visit.ConsultationType = visitData.ConsultationType;
                visit.ChiefComplaint = visitData.ChiefComplaint;
                visit.AccompaniedBy = visitData.AccompaniedBy;
                visit.Appointment = visitData.AppointmentID > 0 ? "Yes" : visitData.Appointment;
                visit.PatientNextConsultation = visitData.PatientNextConsultation;
                visit.TokenNumber = visitData.TokenNumber;
                visit.AdditionalInformation = visitData.AdditionalInformation;
                visit.TransitionOfCarePatient = visitData.TransitionOfCarePatient;
                visit.SkipVisitIntake = visitData.SkipVisitIntake;
                visit.Createdby = "User";
                visit.CreatedDate = DateTime.Now;
                visit.PatientArrivalConditionID = visitData.PatientArrivalConditionID;
                visit.UrgencyTypeID = visitData.UrgencyTypeID;
                visit.VisitStatusID = visitData.VisitStatusID;
                visit.RecordedDuringID = visitData.RecordedDuringID;
                visit.VisitTypeID = visitData.VisitTypeID;

                this.uow.GenericRepository<PatientVisit>().Insert(visit);
                this.uow.Save();

                getVSTNoCommon.CurrentIncNo = visit.VisitNo;
                this.uow.GenericRepository<CommonMaster>().Update(getVSTNoCommon);
                this.uow.Save();
            }
            else
            {
                //visit.VisitDate = this.utilService.GetLocalTime(visitData.VisitDate);
                //visit.Visittime = this.utilService.GetLocalTime(visitData.VisitDate).TimeOfDay.ToString();
                //visit.PatientId = visitData.PatientId;
                //visit.FacilityID = visitData.FacilityID;
                //visit.FacilityID = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == visitData.ProviderID).FacilityId;

                //visit.VisitNo = VSTNoCheck != null ? visitData.VisitNo : getVSTNoCommon.CommonMasterDesc;
                visit.VisitReason = visitData.VisitReason;
                visit.ToConsult = visitData.ToConsult;
                visit.ProviderID = visitData.ProviderID;
                visit.AppointmentID = visitData.AppointmentID;
                visit.ReferringFacility = visitData.ReferringFacility;
                visit.ReferringProvider = visitData.ReferringProvider;
                visit.ConsultationType = visitData.ConsultationType;
                visit.ChiefComplaint = visitData.ChiefComplaint;
                visit.AccompaniedBy = visitData.AccompaniedBy;
                visit.Appointment = visitData.AppointmentID > 0 ? "Yes" : visitData.Appointment;
                visit.PatientNextConsultation = visitData.PatientNextConsultation;
                visit.TokenNumber = visitData.TokenNumber;
                visit.AdditionalInformation = visitData.AdditionalInformation;
                visit.TransitionOfCarePatient = visitData.TransitionOfCarePatient;
                visit.SkipVisitIntake = visitData.SkipVisitIntake;
                visit.ModifiedBy = "User";
                visit.ModifiedDate = DateTime.Now;
                visit.PatientArrivalConditionID = visitData.PatientArrivalConditionID;
                visit.UrgencyTypeID = visitData.UrgencyTypeID;
                visit.VisitStatusID = visitData.VisitStatusID;
                visit.RecordedDuringID = visitData.RecordedDuringID;
                visit.VisitTypeID = visitData.VisitTypeID;

                this.uow.GenericRepository<PatientVisit>().Update(visit);


            }
            this.uow.Save();
            visitData.VisitId = visit.VisitId;

            return visitData;
        }

        ///// <summary>
        ///// Get PatientVisit By Id
        ///// </summary>
        ///// <param>PatientVisitId</param>
        ///// <returns>PatientVisitModel. if Patient visit for given id = success. else = failure</returns>
        public PatientVisitModel GetPatientVisitById(int PatientVisitId)
        {
            var visit = (from patVisit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.VisitId == PatientVisitId)
                         join pat in this.uow.GenericRepository<Patient>().Table()
                         on patVisit.PatientId equals pat.PatientId
                         join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                         on patVisit.ProviderID equals prov.ProviderID
                         join arrCond in this.uow.GenericRepository<PatientArrivalCondition>().Table()
                         on patVisit.PatientArrivalConditionID equals arrCond.PatientArrivalConditionId
                         join urg in this.uow.GenericRepository<UrgencyType>().Table()
                         on patVisit.UrgencyTypeID equals urg.UrgencyTypeId
                         join vstat in this.uow.GenericRepository<VisitStatus>().Table()
                         on patVisit.VisitStatusID equals vstat.VisitStatusId
                         join record in this.uow.GenericRepository<RecordedDuring>().Table()
                         on patVisit.RecordedDuringID equals record.RecordedDuringId
                         join vType in this.uow.GenericRepository<VisitType>().Table()
                         on patVisit.VisitTypeID equals vType.VisitTypeId
                         select new
                         {
                             patVisit.VisitId,
                             patVisit.VisitNo,
                             patVisit.VisitDate,
                             patVisit.Visittime,
                             patVisit.PatientId,
                             patVisit.FacilityID,
                             patVisit.VisitReason,
                             patVisit.ToConsult,
                             patVisit.ProviderID,
                             patVisit.AppointmentID,
                             patVisit.ReferringFacility,
                             patVisit.ReferringProvider,
                             patVisit.ConsultationType,
                             patVisit.ChiefComplaint,
                             patVisit.AccompaniedBy,
                             patVisit.Appointment,
                             patVisit.PatientNextConsultation,
                             patVisit.TokenNumber,
                             patVisit.AdditionalInformation,
                             patVisit.TransitionOfCarePatient,
                             patVisit.SkipVisitIntake,
                             patVisit.PatientArrivalConditionID,
                             patVisit.UrgencyTypeID,
                             patVisit.VisitStatusID,
                             patVisit.RecordedDuringID,
                             patVisit.VisitTypeID,
                             pat.PatientFirstName,
                             pat.PatientMiddleName,
                             pat.PatientLastName,
                             pat.PrimaryContactNumber,
                             pat.MRNo,
                             prov.FirstName,
                             prov.MiddleName,
                             prov.LastName,
                             arrCond.PatientArrivalconditionDescription,
                             urg.UrgencyTypeDescription,
                             vstat.VisitStatusDescription,
                             record.RecordedDuringDescription,
                             vType.VisitTypeDescription

                         }).AsEnumerable().Select(PVM => new PatientVisitModel
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
                             ProviderName = PVM.FirstName + " " + PVM.MiddleName + " " + PVM.LastName,
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
                             patientArrivalCondition = PVM.PatientArrivalconditionDescription,
                             UrgencyTypeID = PVM.UrgencyTypeID,
                             urgencyType = PVM.UrgencyTypeDescription,
                             VisitStatusID = PVM.VisitStatusID,
                             visitStatus = PVM.VisitStatusDescription,
                             RecordedDuringID = PVM.RecordedDuringID,
                             recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : "",
                             VisitTypeID = PVM.VisitTypeID,
                             visitType = PVM.VisitTypeDescription,
                             RecordedDate = this.GetLastRecordedDate(PVM.VisitId),
                             RecordedTime = this.GetLastRecordedDate(PVM.VisitId).TimeOfDay.ToString()

                         }).FirstOrDefault();

            return visit;
        }

        ///// <summary>
        ///// Get All PatientVisits 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientVisitModel>. if All Patient visits = success. else = failure</returns>
        public List<PatientVisitModel> GetAllPatientVisits()
        {
            var visits = (from patVisit in this.uow.GenericRepository<PatientVisit>().Table()
                          join pat in this.uow.GenericRepository<Patient>().Table()
                          on patVisit.PatientId equals pat.PatientId
                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                          on patVisit.ProviderID equals prov.ProviderID
                          join urg in this.uow.GenericRepository<UrgencyType>().Table()
                          on patVisit.UrgencyTypeID equals urg.UrgencyTypeId
                          join vstat in this.uow.GenericRepository<VisitStatus>().Table()
                          on patVisit.VisitStatusID equals vstat.VisitStatusId
                          join record in this.uow.GenericRepository<RecordedDuring>().Table()
                          on patVisit.RecordedDuringID equals record.RecordedDuringId
                          join vType in this.uow.GenericRepository<VisitType>().Table()
                          on patVisit.VisitTypeID equals vType.VisitTypeId
                          select new
                          {
                              patVisit.VisitId,
                              patVisit.VisitNo,
                              patVisit.VisitDate,
                              patVisit.Visittime,
                              patVisit.PatientId,
                              patVisit.FacilityID,
                              patVisit.VisitReason,
                              patVisit.ToConsult,
                              patVisit.ProviderID,
                              patVisit.AppointmentID,
                              patVisit.ReferringFacility,
                              patVisit.ReferringProvider,
                              patVisit.ConsultationType,
                              patVisit.ChiefComplaint,
                              patVisit.AccompaniedBy,
                              patVisit.Appointment,
                              patVisit.PatientNextConsultation,
                              patVisit.TokenNumber,
                              patVisit.AdditionalInformation,
                              patVisit.TransitionOfCarePatient,
                              patVisit.SkipVisitIntake,
                              patVisit.PatientArrivalConditionID,
                              patVisit.UrgencyTypeID,
                              patVisit.VisitStatusID,
                              patVisit.RecordedDuringID,
                              patVisit.VisitTypeID,
                              pat.PatientFirstName,
                              pat.PatientMiddleName,
                              pat.PatientLastName,
                              pat.PrimaryContactNumber,
                              pat.MRNo,
                              prov.FirstName,
                              prov.MiddleName,
                              prov.LastName,
                              urg.UrgencyTypeDescription,
                              vstat.VisitStatusDescription,
                              vType.VisitTypeDescription

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
                              ProviderName = PVM.FirstName + " " + PVM.MiddleName + " " + PVM.LastName,
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
                              patientArrivalCondition = (PVM.PatientArrivalConditionID != 0 && PVM.PatientArrivalConditionID != null) ? this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == PVM.PatientArrivalConditionID).PatientArrivalconditionDescription : "",
                              UrgencyTypeID = PVM.UrgencyTypeID,
                              urgencyType = PVM.UrgencyTypeDescription,
                              VisitStatusID = PVM.VisitStatusID,
                              visitStatus = PVM.VisitStatusDescription,
                              RecordedDuringID = PVM.RecordedDuringID,
                              VisitTypeID = PVM.VisitTypeID,
                              visitType = PVM.VisitTypeDescription,
                              recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : "",
                              AmountPaid = this.uow.GenericRepository<VisitPayment>().Table().LastOrDefault(x => x.VisitID == PVM.VisitId) != null ?
                                           this.uow.GenericRepository<VisitPayment>().Table().LastOrDefault(x => x.VisitID == PVM.VisitId).PaidAmount : 0

                          }).ToList();

            List<PatientVisitModel> visitsCollection = new List<PatientVisitModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visits.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        visitsCollection = (from vis in visits
                                            join fac in facList on vis.FacilityID equals fac.FacilityId
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                    else
                    {
                        visitsCollection = (from vis in visits
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                }
                else
                {
                    visitsCollection = (from vis in visits
                                        join fac in facList on vis.FacilityID equals fac.FacilityId
                                        select vis).ToList();
                }
            }
            else
            {
                visitsCollection = visits;
            }

            return visitsCollection;
        }

        #region Visit Search and Count

        ///// <summary>
        ///// Get Patients for Visit search
        ///// </summary>
        ///// <param>string searchKey</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForVisitSearch(string searchKey)
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
        ///// Get Providers For Visit Search
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for Visit = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforVisitSearch(string searchKey)
        {
            List<ProviderModel> ProviderList = new List<ProviderModel>();
            var facList = this.utilService.GetFacilitiesforUser();
            var providerList = (from prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)

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

            foreach (var prov in providerList)
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
        ///// Get PatientVisits by Search
        ///// </summary>
        ///// <param>SearchModel searchModel</param>
        ///// <returns>List<PatientVisitModel>. if All Patient visits for given Search Fields = success. else = failure</returns>
        public List<PatientVisitModel> GetPatientVisitsbySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            var visits = (from patVisit in this.uow.GenericRepository<PatientVisit>().Table()
                          join pat in this.uow.GenericRepository<Patient>().Table()
                          on patVisit.PatientId equals pat.PatientId
                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                          on patVisit.ProviderID equals prov.ProviderID
                          join urg in this.uow.GenericRepository<UrgencyType>().Table()
                          on patVisit.UrgencyTypeID equals urg.UrgencyTypeId
                          join vstat in this.uow.GenericRepository<VisitStatus>().Table()
                          on patVisit.VisitStatusID equals vstat.VisitStatusId
                          join record in this.uow.GenericRepository<RecordedDuring>().Table()
                          on patVisit.RecordedDuringID equals record.RecordedDuringId
                          join vType in this.uow.GenericRepository<VisitType>().Table()
                          on patVisit.VisitTypeID equals vType.VisitTypeId

                          where
                                (Fromdate.Date <= patVisit.VisitDate.Date
                                      && (Todate.Date >= Fromdate.Date && patVisit.VisitDate.Date <= Todate.Date)
                                      && (searchModel.PatientId == 0 || searchModel.PatientId == patVisit.PatientId)
                                      && (searchModel.ProviderId == 0 || searchModel.ProviderId == patVisit.ProviderID)
                                      && (searchModel.FacilityId == 0 || patVisit.FacilityID == searchModel.FacilityId)
                                      && ((searchModel.VisitNo == null || searchModel.VisitNo == "") || patVisit.VisitNo.ToLower().Trim() == searchModel.VisitNo.ToLower().Trim())
                                      )

                          select new
                          {
                              patVisit.VisitId,
                              patVisit.VisitNo,
                              patVisit.VisitDate,
                              patVisit.Visittime,
                              patVisit.PatientId,
                              patVisit.FacilityID,
                              patVisit.VisitReason,
                              patVisit.ToConsult,
                              patVisit.ProviderID,
                              patVisit.AppointmentID,
                              patVisit.ReferringFacility,
                              patVisit.ReferringProvider,
                              patVisit.ConsultationType,
                              patVisit.ChiefComplaint,
                              patVisit.AccompaniedBy,
                              patVisit.Appointment,
                              patVisit.PatientNextConsultation,
                              patVisit.TokenNumber,
                              patVisit.AdditionalInformation,
                              patVisit.TransitionOfCarePatient,
                              patVisit.SkipVisitIntake,
                              patVisit.PatientArrivalConditionID,
                              patVisit.UrgencyTypeID,
                              patVisit.VisitStatusID,
                              patVisit.RecordedDuringID,
                              patVisit.VisitTypeID,
                              pat.PatientFirstName,
                              pat.PatientMiddleName,
                              pat.PatientLastName,
                              pat.PrimaryContactNumber,
                              pat.MRNo,
                              prov.FirstName,
                              prov.MiddleName,
                              prov.LastName,
                              urg.UrgencyTypeDescription,
                              vstat.VisitStatusDescription,
                              vType.VisitTypeDescription

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
                              ProviderName = PVM.FirstName + " " + PVM.MiddleName + " " + PVM.LastName,
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
                              patientArrivalCondition = (PVM.PatientArrivalConditionID != 0 && PVM.PatientArrivalConditionID != null) ? this.uow.GenericRepository<PatientArrivalCondition>().Table().FirstOrDefault(x => x.PatientArrivalConditionId == PVM.PatientArrivalConditionID).PatientArrivalconditionDescription : "",
                              UrgencyTypeID = PVM.UrgencyTypeID,
                              urgencyType = PVM.UrgencyTypeDescription,
                              VisitStatusID = PVM.VisitStatusID,
                              visitStatus = PVM.VisitStatusDescription,
                              RecordedDuringID = PVM.RecordedDuringID,
                              VisitTypeID = PVM.VisitTypeID,
                              visitType = PVM.VisitTypeDescription,
                              recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : "",
                              AmountPaid = this.uow.GenericRepository<VisitPayment>().Table().LastOrDefault(x => x.VisitID == PVM.VisitId) != null ?
                                           this.uow.GenericRepository<VisitPayment>().Table().LastOrDefault(x => x.VisitID == PVM.VisitId).PaidAmount : 0

                          }).ToList();

            List<PatientVisitModel> visitsCollection = new List<PatientVisitModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visits.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            visitsCollection = (from vis in visits
                                                join fac in facList on vis.FacilityID equals fac.FacilityId
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on vis.ProviderID equals prov.ProviderID
                                                select vis).ToList();
                        }
                        else
                        {
                            visitsCollection = (from vis in visits
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on vis.ProviderID equals prov.ProviderID
                                                select vis).ToList();
                        }
                    }
                    else
                    {
                        visitsCollection = (from vis in visits.Where(x => x.FacilityID == searchModel.FacilityId)
                                            join fac in facList on vis.FacilityID equals fac.FacilityId
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                }
                else
                {
                    visitsCollection = (from vis in visits
                                        join fac in facList on vis.FacilityID equals fac.FacilityId
                                        select vis).ToList();
                }
            }
            else
            {
                visitsCollection = visits;
            }

            return visitsCollection;
        }

        ///// <summary>
        ///// Get counts of Current Date visits for different conditions
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>VisitCountModel. if Current Date visit counts for different conditions = success. else = failure</returns>
        public VisitCountModel TodayVisitCounts()
        {
            VisitCountModel patVisitCount = new VisitCountModel();
            var VisitsToday = this.GetAllPatientVisits().Where(a => a.VisitDate.Date == DateTime.Now.Date).ToList();
            if (VisitsToday.Count() > 0)
            {
                var completeStatus = this.uow.GenericRepository<VisitStatus>().Table().FirstOrDefault(a => a.VisitStatusDescription.ToLower().Trim() == "completed");

                patVisitCount.TotalVisitCount = VisitsToday.Count();
                patVisitCount.CompletedCount = VisitsToday.Where(a => a.VisitStatusID == completeStatus.VisitStatusId).ToList().Count();
                patVisitCount.WalkinCount = VisitsToday.Where(a => a.AppointmentID == 0).ToList().Count();
                patVisitCount.AppointCount = VisitsToday.Where(a => a.AppointmentID > 0).ToList().Count();
            }

            return patVisitCount;
        }

        ///// <summary>
        ///// Get counts of visits for a patient
        ///// </summary>
        ///// <param>int patientId</param>
        ///// <returns>VisitCountModel. if Current Date visit counts for given patientId = success. else = failure</returns>
        public VisitCountModel VisitCountsforPatient(int patientId)
        {
            VisitCountModel patVisitCount = new VisitCountModel();
            var patVisits = this.GetAllPatientVisits().Where(a => a.PatientId == patientId).ToList();
            if (patVisits.Count() > 0)
            {
                var completeStatus = this.uow.GenericRepository<VisitStatus>().Table().FirstOrDefault(a => a.VisitStatusDescription.ToLower().Trim() == "completed");

                patVisitCount.TotalVisitCount = patVisits.Count();
                patVisitCount.CompletedCount = patVisits.Where(a => a.VisitStatusID == completeStatus.VisitStatusId).ToList().Count();
                patVisitCount.WalkinCount = patVisits.Where(a => a.AppointmentID == 0).ToList().Count();
                patVisitCount.AppointCount = patVisits.Where(a => a.AppointmentID > 0).ToList().Count();
            }

            return patVisitCount;
        }

        #endregion

        ///// <summary>
        ///// Get PatientVisit by ID
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientVisitModel>. if Patient visit of Selected Patient = success. else = failure</returns>
        public List<PatientVisitModel> GetVisitsbyPatientID(int PatientID)
        {
            var visits = (from patVisit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.PatientId == PatientID)
                          join pat in this.uow.GenericRepository<Patient>().Table()
                          on patVisit.PatientId equals pat.PatientId
                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                          on patVisit.ProviderID equals prov.ProviderID
                          join urg in this.uow.GenericRepository<UrgencyType>().Table()
                          on patVisit.UrgencyTypeID equals urg.UrgencyTypeId
                          join vstat in this.uow.GenericRepository<VisitStatus>().Table()
                          on patVisit.VisitStatusID equals vstat.VisitStatusId
                          join vType in this.uow.GenericRepository<VisitType>().Table()
                          on patVisit.VisitTypeID equals vType.VisitTypeId
                          select new
                          {
                              patVisit.VisitId,
                              patVisit.VisitNo,
                              patVisit.VisitDate,
                              patVisit.Visittime,
                              patVisit.PatientId,
                              patVisit.FacilityID,
                              patVisit.VisitReason,
                              patVisit.ToConsult,
                              patVisit.ProviderID,
                              patVisit.AppointmentID,
                              patVisit.ReferringFacility,
                              patVisit.ReferringProvider,
                              patVisit.ConsultationType,
                              patVisit.ChiefComplaint,
                              patVisit.AccompaniedBy,
                              patVisit.Appointment,
                              patVisit.PatientNextConsultation,
                              patVisit.TokenNumber,
                              patVisit.AdditionalInformation,
                              patVisit.TransitionOfCarePatient,
                              patVisit.SkipVisitIntake,
                              patVisit.PatientArrivalConditionID,
                              patVisit.UrgencyTypeID,
                              patVisit.VisitStatusID,
                              patVisit.RecordedDuringID,
                              patVisit.VisitTypeID,
                              patVisit.Createdby,
                              pat.PatientFirstName,
                              pat.PatientMiddleName,
                              pat.PatientLastName,
                              pat.PrimaryContactNumber,
                              pat.MRNo,
                              prov.FirstName,
                              prov.MiddleName,
                              prov.LastName,
                              urg.UrgencyTypeDescription,
                              vstat.VisitStatusDescription,
                              vType.VisitTypeDescription

                          }).AsEnumerable().OrderByDescending(x => x.VisitDate).Select(PVM => new PatientVisitModel
                          {
                              VisitId = PVM.VisitId,
                              VisitNo = PVM.VisitNo,
                              VisitDate = PVM.VisitDate,
                              Visittime = PVM.Visittime,
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
                              ProviderName = PVM.FirstName + " " + PVM.MiddleName + " " + PVM.LastName,
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
                              urgencyType = PVM.UrgencyTypeDescription,
                              VisitStatusID = PVM.VisitStatusID,
                              visitStatus = PVM.VisitStatusDescription,
                              RecordedDuringID = PVM.RecordedDuringID,
                              VisitTypeID = PVM.VisitTypeID,
                              visitType = PVM.VisitTypeDescription,
                              recordedDuring = PVM.RecordedDuringID > 0 ? this.uow.GenericRepository<RecordedDuring>().Table().FirstOrDefault(x => x.RecordedDuringId == PVM.RecordedDuringID).RecordedDuringDescription : "",
                              Createdby = PVM.Createdby,
                              VisitDateandTime = PVM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PVM.VisitDate.TimeOfDay.ToString(),
                              RecordedDate = this.GetLastRecordedDate(PVM.VisitId),
                              RecordedTime = this.GetLastRecordedDate(PVM.VisitId).TimeOfDay.ToString(),
                              AmountPaid = this.uow.GenericRepository<VisitPayment>().Table().LastOrDefault(x => x.VisitID == PVM.VisitId) != null ?
                                           this.uow.GenericRepository<VisitPayment>().Table().LastOrDefault(x => x.VisitID == PVM.VisitId).PaidAmount : 0

                          }).ToList();

            List<PatientVisitModel> visitsCollection = new List<PatientVisitModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visits.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        visitsCollection = (from vis in visits
                                            join fac in facList on vis.FacilityID equals fac.FacilityId
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                    else
                    {
                        visitsCollection = (from vis in visits
                                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                            on vis.ProviderID equals prov.ProviderID
                                            select vis).ToList();
                    }
                }
                else
                {
                    visitsCollection = (from vis in visits
                                        join fac in facList on vis.FacilityID equals fac.FacilityId
                                        select vis).ToList();
                }
            }
            else
            {
                visitsCollection = visits;
            }

            return visitsCollection;
        }

        ///// <summary>
        ///// Get Last Recorded Date for Visit
        ///// </summary>
        ///// <param>int VisitId</param>
        ///// <returns>DateTime. if Last Recorded Date of given VisitId = success. else = failure</returns>
        public DateTime GetLastRecordedDate(int VisitId)
        {
            DateTime LastRecordedDate = new DateTime();

            var nursing = this.uow.GenericRepository<NursingSignOff>().Table().Where(x => x.VisitID == VisitId).LastOrDefault();
            var cognitive = this.uow.GenericRepository<Cognitive>().Table().Where(x => x.VisitID == VisitId).LastOrDefault();
            var nutrition = this.uow.GenericRepository<NutritionAssessment>().Table().Where(x => x.VisitId == VisitId).LastOrDefault();
            var ros = this.uow.GenericRepository<ROS>().Table().Where(x => x.VisitID == VisitId).LastOrDefault();
            var social = this.uow.GenericRepository<PatientSocialHistory>().Table().Where(x => x.VisitId == VisitId).LastOrDefault();
            var medication = this.uow.GenericRepository<PatientMedicationHistory>().Table().Where(x => x.VisitId == VisitId).LastOrDefault();
            var problem = this.uow.GenericRepository<PatientProblemList>().Table().Where(x => x.VisitId == VisitId).LastOrDefault();
            var allergy = this.uow.GenericRepository<PatientAllergy>().Table().Where(x => x.VisitId == VisitId).LastOrDefault();
            var vital = this.uow.GenericRepository<PatientVitals>().Table().Where(x => x.VisitId == VisitId).LastOrDefault();

            if (nursing != null)
            {
                LastRecordedDate = nursing.RecordedDate;
            }
            else
            {
                if (cognitive != null)
                {
                    LastRecordedDate = cognitive.RecordedDate;
                }
                else
                {
                    if (nutrition != null)
                    {
                        LastRecordedDate = nutrition.RecordedDate;
                    }
                    else
                    {
                        if (ros != null)
                        {
                            LastRecordedDate = ros.RecordedDate;
                        }
                        else
                        {
                            if (social != null)
                            {
                                LastRecordedDate = social.RecordedDate;
                            }
                            else
                            {
                                if (medication != null)
                                {
                                    LastRecordedDate = medication.RecordedDate;
                                }
                                else
                                {
                                    if (problem != null)
                                    {
                                        LastRecordedDate = problem.RecordedDate;
                                    }
                                    else
                                    {
                                        if (allergy != null)
                                        {
                                            LastRecordedDate = allergy.RecordedDate;
                                        }
                                        else
                                        {
                                            if (vital != null)
                                            {
                                                LastRecordedDate = vital.RecordedDate;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return LastRecordedDate;
        }

        #region Visit Payment

        ///// <summary>
        ///// Get Billing particulars from Billing Sub Master
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<BillingSetupMasterModel>. if Collection of BillingSetupMaster from Billing Master = success. else = failure</returns>
        public List<BillingSetupMasterModel> GetbillingParticularsforVisitPayment(int departmentID, string searchKey)
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
        ///// Add or update a visit payment
        ///// </summary>
        ///// <param>VisitPaymentModel paymentModel(paymentModel--> object of VisitPaymentModel)</param>
        ///// <returns>VisitPaymentModel. if visit payment after insertion and updation = success. else = failure</returns>
        public VisitPaymentModel AddUpdateVisitPayment(VisitPaymentModel paymentModel)
        {
            var visitPayment = this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitID == paymentModel.VisitID & x.IsActive != false).FirstOrDefault();

            var getRCPTCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "recno"
                                 select common).FirstOrDefault();

            var rcptCheck = this.uow.GenericRepository<VisitPayment>().Table()
                            .Where(x => x.ReceiptNo.ToLower().Trim() == getRCPTCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var admsnrcptCheck = this.uow.GenericRepository<AdmissionPayment>().Table()
                            .Where(x => x.ReceiptNo.ToLower().Trim() == getRCPTCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var getBILLCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                 where common.CommonMasterCode.ToLower().Trim() == "bilno"
                                 select common).FirstOrDefault();

            var billCheck = this.uow.GenericRepository<VisitPayment>().Table()
                            .Where(x => x.BillNo.ToLower().Trim() == getBILLCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var admsnbillCheck = this.uow.GenericRepository<AdmissionPayment>().Table()
                            .Where(x => x.BillNo.ToLower().Trim() == getBILLCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            if (visitPayment == null)
            {
                visitPayment = new VisitPayment();

                visitPayment.VisitID = paymentModel.VisitID;
                visitPayment.ReceiptNo = rcptCheck != null ? paymentModel.ReceiptNo : (admsnrcptCheck != null ? paymentModel.ReceiptNo : getRCPTCommon.CommonMasterDesc);
                visitPayment.ReceiptDate = this.utilService.GetLocalTime(paymentModel.ReceiptDate);
                visitPayment.BillNo = billCheck != null ? paymentModel.BillNo : (admsnbillCheck != null ? paymentModel.BillNo : getBILLCommon.CommonMasterDesc);
                visitPayment.MiscAmount = paymentModel.MiscAmount;
                visitPayment.DiscountPercentage = paymentModel.DiscountPercentage;
                visitPayment.DiscountAmount = paymentModel.DiscountAmount;
                visitPayment.GrandTotal = paymentModel.GrandTotal;
                visitPayment.NetAmount = paymentModel.NetAmount;
                visitPayment.PaidAmount = paymentModel.PaidAmount;
                visitPayment.PaymentMode = paymentModel.PaymentMode;
                visitPayment.Notes = paymentModel.Notes;
                visitPayment.IsActive = true;
                visitPayment.Createddate = DateTime.Now;
                visitPayment.CreatedBy = "User";

                this.uow.GenericRepository<VisitPayment>().Insert(visitPayment);

                this.uow.Save();

                getRCPTCommon.CurrentIncNo = visitPayment.ReceiptNo;
                this.uow.GenericRepository<CommonMaster>().Update(getRCPTCommon);

                getBILLCommon.CurrentIncNo = visitPayment.BillNo;
                this.uow.GenericRepository<CommonMaster>().Update(getBILLCommon);
                this.uow.Save();
            }
            else
            {
                visitPayment.ReceiptDate = this.utilService.GetLocalTime(paymentModel.ReceiptDate);
                visitPayment.MiscAmount = paymentModel.MiscAmount;
                visitPayment.DiscountPercentage = paymentModel.DiscountPercentage;
                visitPayment.DiscountAmount = paymentModel.DiscountAmount;
                visitPayment.GrandTotal = paymentModel.GrandTotal;
                visitPayment.NetAmount = paymentModel.NetAmount;
                visitPayment.PaidAmount = paymentModel.PaidAmount;
                visitPayment.PaymentMode = paymentModel.PaymentMode;
                visitPayment.Notes = paymentModel.Notes;
                visitPayment.IsActive = true;
                visitPayment.ModifiedDate = DateTime.Now;
                visitPayment.ModifiedBy = "User";

                this.uow.GenericRepository<VisitPayment>().Update(visitPayment);
                this.uow.Save();
            }
            paymentModel.VisitPaymentID = visitPayment.VisitPaymentID;

            if (visitPayment.VisitPaymentID > 0)
            {
                if (paymentModel.paymentDetailsItem.Count() > 0)
                {
                    var paymentDetails = this.uow.GenericRepository<VisitPaymentDetails>().Table()
                                        .Where(x => x.VisitPaymentID == visitPayment.VisitPaymentID).ToList();

                    if (paymentDetails.Count() > 0)
                    {
                        foreach (var item in paymentDetails)
                        {
                            this.uow.GenericRepository<VisitPaymentDetails>().Delete(item);
                        }
                        this.uow.Save();

                        foreach (var detail in paymentModel.paymentDetailsItem)
                        {
                            VisitPaymentDetails paymentItem = new VisitPaymentDetails();

                            paymentItem.VisitPaymentID = visitPayment.VisitPaymentID;
                            paymentItem.SetupMasterID = detail.SetupMasterID;
                            paymentItem.Charges = detail.Charges;
                            paymentItem.IsActive = true;
                            paymentItem.Createddate = DateTime.Now;
                            paymentItem.CreatedBy = "User";

                            this.uow.GenericRepository<VisitPaymentDetails>().Insert(paymentItem);
                        }
                    }
                    else
                    {
                        foreach (var detail in paymentModel.paymentDetailsItem)
                        {
                            VisitPaymentDetails paymentItem = new VisitPaymentDetails();

                            paymentItem.VisitPaymentID = visitPayment.VisitPaymentID;
                            paymentItem.SetupMasterID = detail.SetupMasterID;
                            paymentItem.Charges = detail.Charges;
                            paymentItem.IsActive = true;
                            paymentItem.Createddate = DateTime.Now;
                            paymentItem.CreatedBy = "User";

                            this.uow.GenericRepository<VisitPaymentDetails>().Insert(paymentItem);
                        }
                    }
                    this.uow.Save();
                }

                //if (paymentModel.paymentDetailsItem.Count() > 0)
                //{
                //    VisitPaymentDetails paymentItem = new VisitPaymentDetails();

                //    foreach (var detail in paymentModel.paymentDetailsItem)
                //    {
                //        paymentItem = this.uow.GenericRepository<VisitPaymentDetails>().Table().FirstOrDefault(x => x.VisitPaymentDetailsID == detail.VisitPaymentDetailsID);
                //        if (paymentItem == null)
                //        {
                //            paymentItem = new VisitPaymentDetails();

                //            paymentItem.VisitPaymentID = visitPayment.VisitPaymentID;
                //            paymentItem.SetupMasterID = detail.SetupMasterID;
                //            paymentItem.Charges = detail.Charges;
                //            paymentItem.IsActive = true;
                //            paymentItem.Createddate = DateTime.Now;
                //            paymentItem.CreatedBy = "User";

                //            this.uow.GenericRepository<VisitPaymentDetails>().Insert(paymentItem);
                //        }
                //        else
                //        {
                //            paymentItem.SetupMasterID = detail.SetupMasterID;
                //            paymentItem.Charges = detail.Charges;
                //            paymentItem.IsActive = true;
                //            paymentItem.Createddate = DateTime.Now;
                //            paymentItem.CreatedBy = "User";

                //            this.uow.GenericRepository<VisitPaymentDetails>().Update(paymentItem);
                //        }
                //        this.uow.Save();
                //        detail.VisitPaymentID = paymentItem.VisitPaymentID;
                //        detail.VisitPaymentDetailsID = paymentItem.VisitPaymentDetailsID;
                //    }
                //}
            }

            return paymentModel;
        }

        ///// <summary>
        ///// Get All VisitPayments 
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<VisitPaymentModel>. if All visit payments = success. else = failure</returns>
        public List<VisitPaymentModel> GetAllVisitPayments()
        {
            var visitPayments = (from visitPay in this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.IsActive != false)

                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                 on visitPay.VisitID equals visit.VisitId

                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on visit.PatientId equals pat.PatientId

                                 select new
                                 {
                                     visitPay.VisitPaymentID,
                                     visitPay.VisitID,
                                     visitPay.ReceiptNo,
                                     visitPay.ReceiptDate,
                                     visitPay.BillNo,
                                     visitPay.MiscAmount,
                                     visitPay.DiscountPercentage,
                                     visitPay.DiscountAmount,
                                     visitPay.GrandTotal,
                                     visitPay.NetAmount,
                                     visitPay.PaidAmount,
                                     visitPay.PaymentMode,
                                     visitPay.Notes,
                                     visit.VisitDate,
                                     visit.FacilityID,
                                     pat.PatientId,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     pat.PrimaryContactNumber,
                                     pat.MRNo

                                 }).AsEnumerable().Select(VPM => new VisitPaymentModel
                                 {
                                     VisitPaymentID = VPM.VisitPaymentID,
                                     VisitID = VPM.VisitID,
                                     FacilityId = VPM.FacilityID > 0 ? VPM.FacilityID.Value : 0,
                                     facilityName = VPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == VPM.FacilityID).FacilityName : "",
                                     ReceiptNo = VPM.ReceiptNo,
                                     ReceiptDate = VPM.ReceiptDate,
                                     BillNo = VPM.BillNo,
                                     MiscAmount = VPM.MiscAmount,
                                     DiscountPercentage = VPM.DiscountPercentage,
                                     DiscountAmount = VPM.DiscountAmount,
                                     GrandTotal = VPM.GrandTotal,
                                     NetAmount = VPM.NetAmount,
                                     PaidAmount = VPM.PaidAmount,
                                     PaymentMode = VPM.PaymentMode,
                                     Notes = VPM.Notes,
                                     PatientId = VPM.PatientId,
                                     PatientName = VPM.PatientFirstName + " " + VPM.PatientMiddleName + " " + VPM.PatientLastName,
                                     PatientContactNumber = VPM.PrimaryContactNumber,
                                     MRNumber = VPM.MRNo,
                                     VisitDateandTime = VPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + VPM.VisitDate.TimeOfDay.ToString(),
                                     paymentDetailsItem = this.GetVisitPaymentDetailsbyID(VPM.VisitPaymentID)

                                 }).ToList();

            List<VisitPaymentModel> visitPaymentCollection = new List<VisitPaymentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visitPayments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        visitPaymentCollection = (from visPay in visitPayments
                                                  join fac in facList on visPay.FacilityId equals fac.FacilityId
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on visPay.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select visPay).ToList();
                    }
                    else
                    {
                        visitPaymentCollection = (from visPay in visitPayments
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on visPay.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select visPay).ToList();
                    }
                }
                else
                {
                    visitPaymentCollection = (from visPay in visitPayments
                                              join fac in facList on visPay.FacilityId equals fac.FacilityId
                                              select visPay).ToList();
                }
            }
            else
            {
                visitPaymentCollection = visitPayments;
            }

            return visitPaymentCollection;
        }

        ///// <summary>
        ///// Get Payments for a Visit
        ///// </summary>
        ///// <param>int VisitId</param>
        ///// <returns>List<VisitPaymentModel>. if payments for given visit id = success. else = failure</returns>
        public List<VisitPaymentModel> GetVisitPaymentsforVisit(int VisitId)
        {
            var visitPayments = (from visitPay in this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.IsActive != false & x.VisitID == VisitId)

                                 join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                 on visitPay.VisitID equals visit.VisitId

                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on visit.PatientId equals pat.PatientId

                                 select new
                                 {
                                     visitPay.VisitPaymentID,
                                     visitPay.VisitID,
                                     visitPay.ReceiptNo,
                                     visitPay.ReceiptDate,
                                     visitPay.BillNo,
                                     visitPay.MiscAmount,
                                     visitPay.DiscountPercentage,
                                     visitPay.DiscountAmount,
                                     visitPay.GrandTotal,
                                     visitPay.NetAmount,
                                     visitPay.PaidAmount,
                                     visitPay.PaymentMode,
                                     visitPay.Notes,
                                     visit.VisitDate,
                                     visit.FacilityID,
                                     pat.PatientId,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     pat.PrimaryContactNumber,
                                     pat.MRNo

                                 }).AsEnumerable().Select(VPM => new VisitPaymentModel
                                 {
                                     VisitPaymentID = VPM.VisitPaymentID,
                                     VisitID = VPM.VisitID,
                                     FacilityId = VPM.FacilityID > 0 ? VPM.FacilityID.Value : 0,
                                     facilityName = VPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == VPM.FacilityID).FacilityName : "",
                                     ReceiptNo = VPM.ReceiptNo,
                                     ReceiptDate = VPM.ReceiptDate,
                                     BillNo = VPM.BillNo,
                                     MiscAmount = VPM.MiscAmount,
                                     DiscountPercentage = VPM.DiscountPercentage,
                                     DiscountAmount = VPM.DiscountAmount,
                                     GrandTotal = VPM.GrandTotal,
                                     NetAmount = VPM.NetAmount,
                                     PaidAmount = VPM.PaidAmount,
                                     PaymentMode = VPM.PaymentMode,
                                     Notes = VPM.Notes,
                                     PatientId = VPM.PatientId,
                                     PatientName = VPM.PatientFirstName + " " + VPM.PatientMiddleName + " " + VPM.PatientLastName,
                                     PatientContactNumber = VPM.PrimaryContactNumber,
                                     MRNumber = VPM.MRNo,
                                     VisitDateandTime = VPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + VPM.VisitDate.TimeOfDay.ToString(),
                                     paymentDetailsItem = this.GetVisitPaymentDetailsbyID(VPM.VisitPaymentID)

                                 }).ToList();

            List<VisitPaymentModel> visitPaymentCollection = new List<VisitPaymentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visitPayments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        visitPaymentCollection = (from visPay in visitPayments
                                                  join fac in facList on visPay.FacilityId equals fac.FacilityId
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on visPay.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select visPay).ToList();
                    }
                    else
                    {
                        visitPaymentCollection = (from visPay in visitPayments
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on visPay.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select visPay).ToList();
                    }
                }
                else
                {
                    visitPaymentCollection = (from visPay in visitPayments
                                              join fac in facList on visPay.FacilityId equals fac.FacilityId
                                              select visPay).ToList();
                }
            }
            else
            {
                visitPaymentCollection = visitPayments;
            }

            return visitPaymentCollection;
        }

        ///// <summary>
        ///// Get Payment record by visitId
        ///// </summary>
        ///// <param>int visitId</param>
        ///// <returns>VisitPaymentModel. if payment record for given visitId = success. else = failure</returns>
        public VisitPaymentModel GetPaymentRecordforVisitbyID(int visitId)
        {
            var visitPaymentRecord = (from visitPay in this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitID == visitId & x.IsActive != false)

                                      join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                      on visitPay.VisitID equals visit.VisitId

                                      join pat in this.uow.GenericRepository<Patient>().Table()
                                      on visit.PatientId equals pat.PatientId

                                      select new
                                      {
                                          visitPay.VisitPaymentID,
                                          visitPay.VisitID,
                                          visitPay.ReceiptNo,
                                          visitPay.ReceiptDate,
                                          visitPay.BillNo,
                                          visitPay.MiscAmount,
                                          visitPay.DiscountPercentage,
                                          visitPay.DiscountAmount,
                                          visitPay.GrandTotal,
                                          visitPay.NetAmount,
                                          visitPay.PaidAmount,
                                          visitPay.PaymentMode,
                                          visitPay.Notes,
                                          visit.VisitDate,
                                          visit.FacilityID,
                                          pat.PatientId,
                                          pat.PatientFirstName,
                                          pat.PatientMiddleName,
                                          pat.PatientLastName,
                                          pat.PrimaryContactNumber,
                                          pat.MRNo

                                      }).AsEnumerable().Select(VPM => new VisitPaymentModel
                                      {
                                          VisitPaymentID = VPM.VisitPaymentID,
                                          VisitID = VPM.VisitID,
                                          FacilityId = VPM.FacilityID > 0 ? VPM.FacilityID.Value : 0,
                                          facilityName = VPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == VPM.FacilityID).FacilityName : "",
                                          ReceiptNo = VPM.ReceiptNo,
                                          ReceiptDate = VPM.ReceiptDate,
                                          BillNo = VPM.BillNo,
                                          MiscAmount = VPM.MiscAmount,
                                          DiscountPercentage = VPM.DiscountPercentage,
                                          DiscountAmount = VPM.DiscountAmount,
                                          GrandTotal = VPM.GrandTotal,
                                          NetAmount = VPM.NetAmount,
                                          PaidAmount = VPM.PaidAmount,
                                          PaymentMode = VPM.PaymentMode,
                                          Notes = VPM.Notes,
                                          PatientId = VPM.PatientId,
                                          PatientName = VPM.PatientFirstName + " " + VPM.PatientMiddleName + " " + VPM.PatientLastName,
                                          PatientContactNumber = VPM.PrimaryContactNumber,
                                          MRNumber = VPM.MRNo,
                                          VisitDateandTime = VPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + VPM.VisitDate.TimeOfDay.ToString(),
                                          paymentDetailsItem = this.GetVisitPaymentDetailsbyID(VPM.VisitPaymentID)

                                      }).LastOrDefault();

            return visitPaymentRecord;
        }

        ///// <summary>
        ///// Get Payments for a Patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<VisitPaymentModel>. if payments for given Patient Id = success. else = failure</returns>
        public List<VisitPaymentModel> GetVisitPaymentsforPatient(int PatientId)
        {
            var visitPayments = (from visitPay in this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.IsActive != false)

                                 join visit in this.uow.GenericRepository<PatientVisit>().Table().Where(x => x.PatientId == PatientId)
                                 on visitPay.VisitID equals visit.VisitId

                                 join pat in this.uow.GenericRepository<Patient>().Table()
                                 on visit.PatientId equals pat.PatientId

                                 select new
                                 {
                                     visitPay.VisitPaymentID,
                                     visitPay.VisitID,
                                     visitPay.ReceiptNo,
                                     visitPay.ReceiptDate,
                                     visitPay.BillNo,
                                     visitPay.MiscAmount,
                                     visitPay.DiscountPercentage,
                                     visitPay.DiscountAmount,
                                     visitPay.GrandTotal,
                                     visitPay.NetAmount,
                                     visitPay.PaidAmount,
                                     visitPay.PaymentMode,
                                     visitPay.Notes,
                                     visit.VisitDate,
                                     visit.FacilityID,
                                     pat.PatientId,
                                     pat.PatientFirstName,
                                     pat.PatientMiddleName,
                                     pat.PatientLastName,
                                     pat.PrimaryContactNumber,
                                     pat.MRNo

                                 }).AsEnumerable().Select(VPM => new VisitPaymentModel
                                 {
                                     VisitPaymentID = VPM.VisitPaymentID,
                                     VisitID = VPM.VisitID,
                                     FacilityId = VPM.FacilityID > 0 ? VPM.FacilityID.Value : 0,
                                     facilityName = VPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == VPM.FacilityID).FacilityName : "",
                                     ReceiptNo = VPM.ReceiptNo,
                                     ReceiptDate = VPM.ReceiptDate,
                                     BillNo = VPM.BillNo,
                                     MiscAmount = VPM.MiscAmount,
                                     DiscountPercentage = VPM.DiscountPercentage,
                                     DiscountAmount = VPM.DiscountAmount,
                                     GrandTotal = VPM.GrandTotal,
                                     NetAmount = VPM.NetAmount,
                                     PaidAmount = VPM.PaidAmount,
                                     PaymentMode = VPM.PaymentMode,
                                     Notes = VPM.Notes,
                                     PatientId = VPM.PatientId,
                                     PatientName = VPM.PatientFirstName + " " + VPM.PatientMiddleName + " " + VPM.PatientLastName,
                                     PatientContactNumber = VPM.PrimaryContactNumber,
                                     MRNumber = VPM.MRNo,
                                     VisitDateandTime = VPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + VPM.VisitDate.TimeOfDay.ToString(),
                                     paymentDetailsItem = this.GetVisitPaymentDetailsbyID(VPM.VisitPaymentID)

                                 }).ToList();

            List<VisitPaymentModel> visitPaymentCollection = new List<VisitPaymentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (visitPayments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        visitPaymentCollection = (from visPay in visitPayments
                                                  join fac in facList on visPay.FacilityId equals fac.FacilityId
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on visPay.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select visPay).ToList();
                    }
                    else
                    {
                        visitPaymentCollection = (from visPay in visitPayments
                                                  join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                  on visPay.VisitID equals vis.VisitId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on vis.ProviderID equals prov.ProviderID
                                                  select visPay).ToList();
                    }
                }
                else
                {
                    visitPaymentCollection = (from visPay in visitPayments
                                              join fac in facList on visPay.FacilityId equals fac.FacilityId
                                              select visPay).ToList();
                }
            }
            else
            {
                visitPaymentCollection = visitPayments;
            }

            return visitPaymentCollection;
        }

        ///// <summary>
        ///// Get Payment record by id
        ///// </summary>
        ///// <param>int visitPaymentId</param>
        ///// <returns>VisitPaymentModel. if payment record for given id = success. else = failure</returns>
        public VisitPaymentModel GetVisitPaymentRecordbyID(int visitPaymentId)
        {
            var visitPaymentRecord = (from visitPay in this.uow.GenericRepository<VisitPayment>().Table().Where(x => x.VisitPaymentID == visitPaymentId)

                                      join visit in this.uow.GenericRepository<PatientVisit>().Table()
                                      on visitPay.VisitID equals visit.VisitId

                                      join pat in this.uow.GenericRepository<Patient>().Table()
                                      on visit.PatientId equals pat.PatientId

                                      select new
                                      {
                                          visitPay.VisitPaymentID,
                                          visitPay.VisitID,
                                          visitPay.ReceiptNo,
                                          visitPay.ReceiptDate,
                                          visitPay.BillNo,
                                          visitPay.MiscAmount,
                                          visitPay.DiscountPercentage,
                                          visitPay.DiscountAmount,
                                          visitPay.GrandTotal,
                                          visitPay.NetAmount,
                                          visitPay.PaidAmount,
                                          visitPay.PaymentMode,
                                          visitPay.Notes,
                                          visit.VisitDate,
                                          visit.FacilityID,
                                          pat.PatientId,
                                          pat.PatientFirstName,
                                          pat.PatientMiddleName,
                                          pat.PatientLastName,
                                          pat.PrimaryContactNumber,
                                          pat.MRNo

                                      }).AsEnumerable().Select(VPM => new VisitPaymentModel
                                      {
                                          VisitPaymentID = VPM.VisitPaymentID,
                                          VisitID = VPM.VisitID,
                                          FacilityId = VPM.FacilityID > 0 ? VPM.FacilityID.Value : 0,
                                          facilityName = VPM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == VPM.FacilityID).FacilityName : "",
                                          ReceiptNo = VPM.ReceiptNo,
                                          ReceiptDate = VPM.ReceiptDate,
                                          BillNo = VPM.BillNo,
                                          MiscAmount = VPM.MiscAmount,
                                          DiscountPercentage = VPM.DiscountPercentage,
                                          DiscountAmount = VPM.DiscountAmount,
                                          GrandTotal = VPM.GrandTotal,
                                          NetAmount = VPM.NetAmount,
                                          PaidAmount = VPM.PaidAmount,
                                          PaymentMode = VPM.PaymentMode,
                                          Notes = VPM.Notes,
                                          PatientId = VPM.PatientId,
                                          PatientName = VPM.PatientFirstName + " " + VPM.PatientMiddleName + " " + VPM.PatientLastName,
                                          PatientContactNumber = VPM.PrimaryContactNumber,
                                          MRNumber = VPM.MRNo,
                                          VisitDateandTime = VPM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + VPM.VisitDate.TimeOfDay.ToString(),
                                          paymentDetailsItem = this.GetVisitPaymentDetailsbyID(VPM.VisitPaymentID)

                                      }).FirstOrDefault();

            return visitPaymentRecord;
        }

        ///// <summary>
        ///// Get All Visit Payment Detail for visitPaymentId
        ///// </summary>
        ///// <param>int visitPaymentId</param>
        ///// <returns>List<VisitPaymentDetailsModel>. if All visit payment Detail for given visitPaymentId = success. else = failure</returns>
        public List<VisitPaymentDetailsModel> GetVisitPaymentDetailsbyID(int visitPaymentId)
        {
            var paymentDetails = (from detail in this.uow.GenericRepository<VisitPaymentDetails>().Table().Where(x => x.IsActive != false & x.VisitPaymentID == visitPaymentId)

                                  join setup in this.uow.GenericRepository<BillingSetupMaster>().Table()
                                  on detail.SetupMasterID equals setup.SetupMasterID

                                  join depart in this.uow.GenericRepository<Departments>().Table()
                                  on setup.DepartmentID equals depart.DepartmentID

                                  select new
                                  {
                                      detail.VisitPaymentDetailsID,
                                      detail.VisitPaymentID,
                                      detail.SetupMasterID,
                                      detail.Charges,
                                      setup.DepartmentID,
                                      depart.DepartmentDesc

                                  }).AsEnumerable().Select(VPDM => new VisitPaymentDetailsModel
                                  {
                                      VisitPaymentDetailsID = VPDM.VisitPaymentDetailsID,
                                      VisitPaymentID = VPDM.VisitPaymentID,
                                      SetupMasterID = VPDM.SetupMasterID,
                                      Charges = VPDM.Charges,
                                      DepartmentId = VPDM.DepartmentID,
                                      DepartmentName = VPDM.DepartmentDesc,
                                      billingParticular = this.GetbillingParticularsforVisitPayment(VPDM.DepartmentID, null).FirstOrDefault().billingparticularName

                                  }).ToList();

            return paymentDetails;
        }

        #endregion

        #region Appointment - Visit Conversion

        ///// <summary>
        ///// Get Appointments for Visit by search
        ///// </summary>
        ///// <param>SearchModel searchModel</param>
        ///// <returns>List<PatientAppointment>. if Collection of PatientAppointments for Visit by searchmodel = success. else = failure</returns>
        public List<PatientAppointmentModel> GetAppointmentsforVisitbySearch(SearchModel searchModel)
        {
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            var appReqStatus = this.uow.GenericRepository<AppointmentStatus>().Table().FirstOrDefault(x => x.AppointmentStatusDescription.ToLower().Trim() == "requested");
            var appRechedStatus = this.uow.GenericRepository<AppointmentStatus>().Table().FirstOrDefault(x => x.AppointmentStatusDescription.ToLower().Trim() == "rescheduled");

            List<PatientAppointmentModel> Appointments = (from app in this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.AppointmentStatusID == appReqStatus.AppointmentStatusId || x.AppointmentStatusID == appRechedStatus.AppointmentStatusId)
                                                          join pat in this.uow.GenericRepository<Patient>().Table()
                                                          on app.PatientID equals pat.PatientId
                                                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                                          on app.ProviderID equals prov.ProviderID

                                                          where (Fromdate.Date <= app.AppointmentDate.Date
                                                             && (Todate.Date >= Fromdate.Date && app.AppointmentDate.Date <= Todate.Date)
                                                             && (searchModel.PatientId == 0 || app.PatientID == searchModel.PatientId)
                                                             && (searchModel.ProviderId == 0 || app.ProviderID == searchModel.ProviderId)
                                                             && (searchModel.FacilityId == 0 || app.FacilityID == searchModel.FacilityId)
                                                             && ((searchModel.AppointmentNo == null || searchModel.AppointmentNo == "") || app.AppointmentNo.ToLower().Trim() == searchModel.AppointmentNo.ToLower().Trim())
                                                             )

                                                          select new
                                                          {
                                                              pat.PatientFirstName,
                                                              pat.PatientMiddleName,
                                                              pat.PatientLastName,
                                                              pat.PrimaryContactNumber,
                                                              pat.MRNo,
                                                              prov.FirstName,
                                                              prov.MiddleName,
                                                              prov.LastName,
                                                              app.AppointmentID,
                                                              app.AppointmentDate,
                                                              app.AppointmentNo,
                                                              app.PatientID,
                                                              app.Duration,
                                                              app.Reason,
                                                              app.ProviderID,
                                                              app.FacilityID,
                                                              app.ToConsult,
                                                              app.AppointmentStatusID,
                                                              app.AppointmentTypeID,
                                                              app.CPTCode,
                                                              app.IsRecurrence,
                                                              app.AddToWaitList,
                                                              app.RecurrenceId,
                                                              app.CreatedDate

                                                          }).AsEnumerable().OrderByDescending(x => x.AppointmentDate).Select(PAM => new PatientAppointmentModel
                                                          {
                                                              AppointmentID = PAM.AppointmentID,
                                                              AppointmentDate = PAM.AppointmentDate,
                                                              AppointmentTime = PAM.AppointmentDate.ToString("hh:mm:ss tt"),
                                                              AppointmentNo = PAM.AppointmentNo,
                                                              PatientID = PAM.PatientID,
                                                              PatientName = PAM.PatientFirstName + " " + PAM.PatientMiddleName + " " + PAM.PatientLastName,
                                                              PatientContactNumber = PAM.PrimaryContactNumber,
                                                              MRNumber = PAM.MRNo,
                                                              Reason = PAM.Reason,
                                                              Duration = PAM.Duration,
                                                              ProviderID = PAM.ProviderID,
                                                              ProviderName = PAM.FirstName + " " + PAM.MiddleName + " " + PAM.LastName,
                                                              FacilityID = PAM.FacilityID,
                                                              FacilityName = PAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PAM.FacilityID).FacilityName : "",
                                                              ToConsult = PAM.ToConsult,
                                                              AppointmentStatusID = PAM.AppointmentStatusID,
                                                              Appointmentstatus = PAM.AppointmentStatusID > 0 ? this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusId == PAM.AppointmentStatusID).FirstOrDefault().AppointmentStatusDescription : "",
                                                              AppointmentTypeID = PAM.AppointmentTypeID,
                                                              Appointmenttype = PAM.AppointmentTypeID > 0 ? this.uow.GenericRepository<AppointmentType>().Table().Where(x => x.AppointmentTypeId == PAM.AppointmentTypeID).FirstOrDefault().AppointmentTypeDescription : "",
                                                              CPTCode = PAM.CPTCode,
                                                              IsRecurrence = PAM.IsRecurrence,
                                                              AddToWaitList = PAM.AddToWaitList,
                                                              RecurrenceId = PAM.RecurrenceId,
                                                              CreatedDate = PAM.CreatedDate

                                                          }).ToList();
            List<PatientAppointmentModel> appointmentsCollection = new List<PatientAppointmentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (Appointments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            appointmentsCollection = (from appt in Appointments
                                                      join fac in facList on appt.FacilityID equals fac.FacilityId
                                                      join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                      on appt.ProviderID equals prov.ProviderID
                                                      select appt).ToList();
                        }
                        else
                        {
                            appointmentsCollection = (from appt in Appointments
                                                      join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                      on appt.ProviderID equals prov.ProviderID
                                                      select appt).ToList();
                        }
                    }
                    else
                    {
                        appointmentsCollection = (from appt in Appointments.Where(x => x.FacilityID == searchModel.FacilityId)
                                                  join fac in facList on appt.FacilityID equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on appt.ProviderID equals prov.ProviderID
                                                  select appt).ToList();
                    }
                }
                else
                {
                    appointmentsCollection = (from appt in Appointments
                                              join fac in facList on appt.FacilityID equals fac.FacilityId
                                              select appt).ToList();
                }
            }
            else
            {
                appointmentsCollection = Appointments;
            }

            return appointmentsCollection;
        }

        ///// <summary>
        ///// Get Appointments for Visit
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientAppointment>. if Collection of PatientAppointments for Visit = success. else = failure</returns>
        public List<PatientAppointmentModel> GetAppointmentsforVisits()
        {
            List<PatientAppointmentModel> Appointments = (from app in this.uow.GenericRepository<PatientAppointment>().Table()
                                                          join pat in this.uow.GenericRepository<Patient>().Table()
                                                          on app.PatientID equals pat.PatientId
                                                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                                          on app.ProviderID equals prov.ProviderID

                                                          select new
                                                          {
                                                              pat.PatientFirstName,
                                                              pat.PatientMiddleName,
                                                              pat.PatientLastName,
                                                              pat.PrimaryContactNumber,
                                                              pat.MRNo,
                                                              prov.FirstName,
                                                              prov.MiddleName,
                                                              prov.LastName,
                                                              app.AppointmentID,
                                                              app.AppointmentDate,
                                                              app.AppointmentNo,
                                                              app.PatientID,
                                                              app.Duration,
                                                              app.Reason,
                                                              app.ProviderID,
                                                              app.FacilityID,
                                                              app.ToConsult,
                                                              app.AppointmentStatusID,
                                                              app.AppointmentTypeID,
                                                              app.CPTCode,
                                                              app.IsRecurrence,
                                                              app.AddToWaitList,
                                                              app.RecurrenceId,
                                                              app.CreatedDate

                                                          }).AsEnumerable().OrderByDescending(x => x.AppointmentDate).Select(PAM => new PatientAppointmentModel
                                                          {
                                                              AppointmentID = PAM.AppointmentID,
                                                              AppointmentDate = PAM.AppointmentDate,
                                                              AppointmentTime = PAM.AppointmentDate.ToString("hh:mm:ss tt"),
                                                              AppointmentNo = PAM.AppointmentNo,
                                                              PatientID = PAM.PatientID,
                                                              PatientName = PAM.PatientFirstName + " " + PAM.PatientMiddleName + " " + PAM.PatientLastName,
                                                              PatientContactNumber = PAM.PrimaryContactNumber,
                                                              MRNumber = PAM.MRNo,
                                                              Reason = PAM.Reason,
                                                              Duration = PAM.Duration,
                                                              ProviderID = PAM.ProviderID,
                                                              ProviderName = PAM.FirstName + " " + PAM.MiddleName + " " + PAM.LastName,
                                                              FacilityID = PAM.FacilityID,
                                                              FacilityName = PAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PAM.FacilityID).FacilityName : "",
                                                              ToConsult = PAM.ToConsult,
                                                              AppointmentStatusID = PAM.AppointmentStatusID,
                                                              Appointmentstatus = PAM.AppointmentStatusID > 0 ? this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusId == PAM.AppointmentStatusID).FirstOrDefault().AppointmentStatusDescription : "",
                                                              AppointmentTypeID = PAM.AppointmentTypeID,
                                                              Appointmenttype = PAM.AppointmentTypeID > 0 ? this.uow.GenericRepository<AppointmentType>().Table().Where(x => x.AppointmentTypeId == PAM.AppointmentTypeID).FirstOrDefault().AppointmentTypeDescription : "",
                                                              CPTCode = PAM.CPTCode,
                                                              IsRecurrence = PAM.IsRecurrence,
                                                              AddToWaitList = PAM.AddToWaitList,
                                                              RecurrenceId = PAM.RecurrenceId,
                                                              CreatedDate = PAM.CreatedDate

                                                          }).ToList();
            List<PatientAppointmentModel> appointmentsCollection = new List<PatientAppointmentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (Appointments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        appointmentsCollection = (from appt in Appointments
                                                  join fac in facList on appt.FacilityID equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on appt.ProviderID equals prov.ProviderID
                                                  select appt).ToList();
                    }
                    else
                    {
                        appointmentsCollection = (from appt in Appointments
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on appt.ProviderID equals prov.ProviderID
                                                  select appt).ToList();
                    }
                }
                else
                {
                    appointmentsCollection = (from appt in Appointments
                                              join fac in facList on appt.FacilityID equals fac.FacilityId
                                              select appt).ToList();
                }
            }
            else
            {
                appointmentsCollection = Appointments;
            }

            return appointmentsCollection;
        }

        ///// <summary>
        ///// Get Appointment Record by Id
        ///// </summary>
        ///// <param>int AppointmentId</param>
        ///// <returns>PatientAppointmentModel. if patient appointment for given AppointmentId = success. else = failure</returns>
        public PatientAppointmentModel GetAppointmentRecordById(int AppointmentId)
        {
            PatientAppointmentModel Appointment = (from app in this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.AppointmentID == AppointmentId)
                                                   join pat in this.uow.GenericRepository<Patient>().Table()
                                                   on app.PatientID equals pat.PatientId
                                                   join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                                   on app.ProviderID equals prov.ProviderID

                                                   select new
                                                   {
                                                       pat.PatientFirstName,
                                                       pat.PatientMiddleName,
                                                       pat.PatientLastName,
                                                       pat.PrimaryContactNumber,
                                                       pat.MRNo,
                                                       prov.FirstName,
                                                       prov.MiddleName,
                                                       prov.LastName,
                                                       app.AppointmentID,
                                                       app.AppointmentDate,
                                                       app.AppointmentNo,
                                                       app.PatientID,
                                                       app.Duration,
                                                       app.Reason,
                                                       app.ProviderID,
                                                       app.FacilityID,
                                                       app.ToConsult,
                                                       app.AppointmentStatusID,
                                                       app.AppointmentTypeID,
                                                       app.CPTCode,
                                                       app.IsRecurrence,
                                                       app.AddToWaitList,
                                                       app.RecurrenceId

                                                   }).AsEnumerable().Select(PAM => new PatientAppointmentModel
                                                   {
                                                       AppointmentID = PAM.AppointmentID,
                                                       AppointmentDate = PAM.AppointmentDate,
                                                       AppointmentTime = PAM.AppointmentDate.ToString("hh:mm:ss tt"),
                                                       AppointmentNo = PAM.AppointmentNo,
                                                       PatientID = PAM.PatientID,
                                                       PatientName = PAM.PatientFirstName + " " + PAM.PatientMiddleName + " " + PAM.PatientLastName,
                                                       PatientContactNumber = PAM.PrimaryContactNumber,
                                                       MRNumber = PAM.MRNo,
                                                       Duration = PAM.Duration,
                                                       Reason = PAM.Reason,
                                                       ProviderID = PAM.ProviderID,
                                                       ProviderName = PAM.FirstName + " " + PAM.MiddleName + " " + PAM.LastName,
                                                       FacilityID = PAM.FacilityID,
                                                       FacilityName = PAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PAM.FacilityID).FacilityName : "",
                                                       ToConsult = PAM.ToConsult,
                                                       AppointmentStatusID = PAM.AppointmentStatusID,
                                                       Appointmentstatus = PAM.AppointmentStatusID > 0 ? this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusId == PAM.AppointmentStatusID).FirstOrDefault().AppointmentStatusDescription : "",
                                                       AppointmentTypeID = PAM.AppointmentTypeID,
                                                       Appointmenttype = PAM.AppointmentTypeID > 0 ? this.uow.GenericRepository<AppointmentType>().Table().Where(x => x.AppointmentTypeId == PAM.AppointmentTypeID).FirstOrDefault().AppointmentTypeDescription : "",
                                                       CPTCode = PAM.CPTCode,
                                                       IsRecurrence = PAM.IsRecurrence,
                                                       AddToWaitList = PAM.AddToWaitList,
                                                       RecurrenceId = PAM.RecurrenceId

                                                   }).SingleOrDefault();

            return Appointment;
        }

        ///// <summary>
        ///// Convert appointment to Visit
        ///// </summary>
        ///// <param>int appointmentId</param>
        ///// <returns>string. if Appointment Converted to Visit = success. else = failure</returns>
        public string ConfirmVisitfromAppointment(int appointmentId)
        {
            string status = "";

            var appointRecord = this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.AppointmentID == appointmentId).FirstOrDefault();

            if (appointRecord != null)
            {
                var appStatus = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusDescription.ToLower().Trim() == "confirmed").FirstOrDefault();

                appointRecord.AppointmentStatusID = appStatus.AppointmentStatusId;
                appointRecord.ModifiedDate = DateTime.Now;
                appointRecord.ModifiedBy = "User";

                this.uow.GenericRepository<PatientAppointment>().Update(appointRecord);
                this.uow.Save();

                status = "Visit Confirmed Successfully";
            }
            else
            {
                status = "No record found";
            }

            return status;
        }

        ///// <summary>
        ///// Cancel appointment from Visit
        ///// </summary>
        ///// <param>int appointmentId</param>
        ///// <returns>string. if Appointment Cancelled = success. else = failure</returns>
        public string CancelAppointmentfromVisit(int appointmentId)
        {
            string status = "";

            var appointRecord = this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.AppointmentID == appointmentId).FirstOrDefault();

            if (appointRecord != null)
            {
                var appStatus = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusDescription.ToLower().Trim() == "cancelled").FirstOrDefault();

                appointRecord.AppointmentStatusID = appStatus.AppointmentStatusId;
                appointRecord.ModifiedDate = DateTime.Now;
                appointRecord.ModifiedBy = "User";

                this.uow.GenericRepository<PatientAppointment>().Update(appointRecord);
                this.uow.Save();

                status = "Appointment Cancelled";
            }
            else
            {
                status = "No record found";
            }

            return status;
        }

        ///// <summary>
        ///// Get current day's Appointment counts
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<int>. if Appoinment counts for present date = success. else = failure</returns>
        public AppointmentCountModel TodayAppointmentCountsforVisit()
        {
            AppointmentCountModel Counts = new AppointmentCountModel();
            var appointments = this.GetAppointmentsforVisits().Where(x => x.AppointmentDate.Date == DateTime.Now.Date).ToList();
            if (appointments.Count() > 0)
            {
                Counts.totalCount = appointments.Count();

                Counts.ScheduledCount = (from appt in appointments
                                             //join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                             //on appt.AppointmentStatusID equals status.AppointmentStatusId
                                             //where status.AppointmentStatusDescription.ToLower().Trim() == "confirmed"
                                         where appt.CreatedDate.Date == DateTime.Now.Date
                                         select appt).ToList().Count();

                Counts.CancelledCount = (from appt in appointments
                                         join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                         on appt.AppointmentStatusID equals status.AppointmentStatusId
                                         where status.AppointmentStatusDescription.ToLower().Trim() == "cancelled"
                                         select appt).ToList().Count();

                Counts.PendingAppointmentCount = (from appt in appointments
                                                  join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                                  on appt.AppointmentStatusID equals status.AppointmentStatusId
                                                  where status.AppointmentStatusDescription.ToLower().Trim() == "requested" || status.AppointmentStatusDescription.ToLower().Trim() == "rescheduled"
                                                  select appt).ToList().Count();

                Counts.VisitConvertedAppointmentCount = (from appt in appointments
                                                         join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                         on appt.AppointmentID equals vis.AppointmentID
                                                         select appt).ToList().Count();

                //Counts.waitCount = (from appt in appointments
                //join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                //on appt.AppointmentStatusID equals status.AppointmentStatusId
                //where status.AppointmentStatusDescription.ToLower().Trim() == "arrived"
                //where appt.AddToWaitList == true
                //select appt).Count();

            }

            return Counts;
        }

        #endregion

        #region   Auto generated Visit No
        //// <summary>
        ///// Get Auto - generated Visit No or (VST No)
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated Visit number = success. else = failure</returns>
        public List<string> GetVisitNo()
        {
            List<string> VSTNo = new List<string>();

            var VST = this.iTenantMasterService.GetVisitNo();

            VSTNo.Add(VST);

            return VSTNo;
        }
        #endregion

    }
}
