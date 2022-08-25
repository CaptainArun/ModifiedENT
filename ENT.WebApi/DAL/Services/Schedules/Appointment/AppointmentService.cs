using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.Data.ORM;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.DAL.Services
{
    public class AppointmentService : IAppointmentService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;
        public readonly IHttpContextAccessor httpContextAccessor;

        public AppointmentService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService, IHttpContextAccessor _httpContextAccessor)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
            httpContextAccessor = _httpContextAccessor;
        }

        #region Master for Appointment

        ///// <summary>
        ///// Get All AppointmentStatuses
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AppointmentStatus>. if Collection of AppointmentStatus = success. else = failure</returns>
        public List<AppointmentStatus> GetAllAppointmentStatuses()
        {
            var AppointStatuses = this.iTenantMasterService.GetAppointmentStatusList();
            return AppointStatuses;
        }

        ///// <summary>
        ///// Get All AppointmentTypes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AppointmentType>. if Collection of AppointmentTypes = success. else = failure</returns>
        public List<AppointmentType> GetAllAppointmentTypes()
        {
            var AppointTypes = this.iTenantMasterService.GetAppointmentTypeList();
            return AppointTypes;
        }

        ///// <summary>
        ///// Get facilities for Appointments
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Facility>. if Collection of facilities = success. else = failure</returns>
        public List<Facility> GetFacilitiesforAppointment()
        {
            var facList = this.utilService.GetFacilitiesforUser();
            var facilities = (from fac in this.uow.GenericRepository<Facility>().Table()
                              join record in facList 
                              on fac.FacilityId equals record.FacilityId
                              select fac).ToList();
            return facilities;
        }

        ///// <summary>
        ///// Get providers for Appointments
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Provider>. if Collection of providers = success. else = failure</returns>
        public List<Provider> GetProvidersforAppointment()
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

        ///// <summary>
        ///// Get All TreatmentCodes
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<TreatmentCode>. if Collection of TreatmentCodes = success. else = failure</returns>
        public List<TreatmentCode> GetTreatmentCodes(string searchKey)
        {
            return this.utilService.GetTreatmentCodesbySearch(searchKey);
        }

        ///// <summary>
        ///// Get Appointment number by search
        ///// </summary>
        ///// <param>searchKey</param>
        ///// <returns>List<string>. if Collection of Appointment Numbers = success. else = failure</returns>
        public List<string> GetAppointmentNumbersbySearch(string searchKey)
        {
            var appNumbers = this.iTenantMasterService.GetAppointmentNumbersbySearch(searchKey);
            return appNumbers;
        }

        #endregion

        ///// <summary>
        ///// Get All Appointments
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientAppointment>. if Collection of PatientAppointments = success. else = failure</returns>
        public List<PatientAppointmentModel> GetAllAppointments()
        {
            //var appStatus = this.uow.GenericRepository<AppointmentStatus>().Table().SingleOrDefault(x => x.AppointmentStatusDescription.ToLower().Trim() == "cancelled");

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

            var facList = this.utilService.GetFacilitiesforUser();
            var user = this.utilService.GetUserIDofProvider();

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
        ///// Get Appointment by Id
        ///// </summary>
        ///// <param>AppointmentId</param>
        ///// <returns>PatientAppointmentModel. if patient appointment for given AppointmentId = success. else = failure</returns>
        public PatientAppointmentModel GetAppointmentById(int AppointmentId)
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
        ///// Add or Update a patient Appointment by checking AppointmentId
        ///// </summary>
        ///// <param name = PatientAppointmentModel>appointData(object of PatientAppointmentModel)</param>
        ///// <returns>PatientAppointmentModel. if a patient Appointment added or updated = success. else = failure</returns>
        public PatientAppointmentModel AddUpdateAppointment(PatientAppointmentModel appointData)
        {
            var getAptNoCommon = (from common in this.uow.GenericRepository<CommonMaster>().Table()
                                  where common.CommonMasterCode.ToLower().Trim() == "aptno"
                                  select common).FirstOrDefault();

            var AptNoCheck = this.uow.GenericRepository<PatientAppointment>().Table()
                            .Where(x => x.AppointmentNo.ToLower().Trim() == getAptNoCommon.CommonMasterDesc.ToLower().Trim()).FirstOrDefault();

            var appointment = this.uow.GenericRepository<PatientAppointment>().Table().SingleOrDefault(x => x.AppointmentID == appointData.AppointmentID);
            var durationTime = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == appointData.ProviderID & x.FacilityID == appointData.FacilityID & x.TerminationDate.Value.Date > DateTime.Now.Date).FirstOrDefault();

            if (appointment == null)
            {
                appointment = new PatientAppointment();

                appointment.AppointmentNo = AptNoCheck != null ? appointData.AppointmentNo : getAptNoCommon.CommonMasterDesc;
                appointment.AppointmentDate = this.utilService.GetLocalTime(appointData.AppointmentDate);
                appointment.PatientID = appointData.PatientID;
                appointment.Reason = appointData.Reason;
                appointment.Duration = durationTime != null ? durationTime.TimeSlotDuration.ToString() : ((appointData.Duration == null || appointData.Duration == "") ? "0" : appointData.Duration);
                appointment.FacilityID = appointData.FacilityID;
                appointment.ToConsult = appointData.ToConsult;
                appointment.ProviderID = appointData.ProviderID;
                appointment.AppointmentStatusID = appointData.AppointmentStatusID;
                appointment.AppointmentTypeID = appointData.AppointmentTypeID;
                appointment.CPTCode = appointData.CPTCode;
                appointment.IsRecurrence = false;
                appointment.AddToWaitList = appointData.AddToWaitList;
                appointment.RecurrenceId = 0;
                appointment.CreatedDate = DateTime.Now;
                appointment.Createdby = "User";

                this.uow.GenericRepository<PatientAppointment>().Insert(appointment);
                this.uow.Save();

                getAptNoCommon.CurrentIncNo = appointment.AppointmentNo;
                this.uow.GenericRepository<CommonMaster>().Update(getAptNoCommon);
                this.uow.Save();
            }
            else
            {
                var appStatus = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusDescription.ToLower().Trim() == "rescheduled").FirstOrDefault();


                appointment.AppointmentDate = this.utilService.GetLocalTime(appointData.AppointmentDate);
                appointment.PatientID = appointData.PatientID;
                appointment.Reason = appointData.Reason;
                appointment.Duration = durationTime != null ? durationTime.TimeSlotDuration.ToString() : ((appointData.Duration == null || appointData.Duration == "") ? "0" : appointData.Duration);
                appointment.FacilityID = appointData.FacilityID;
                appointment.ToConsult = appointData.ToConsult;
                appointment.ProviderID = appointData.ProviderID;
                appointment.AppointmentStatusID = appStatus.AppointmentStatusId;
                appointment.AppointmentTypeID = appointData.AppointmentTypeID;
                appointment.CPTCode = appointData.CPTCode;
                appointment.IsRecurrence = false;
                appointment.AddToWaitList = appointData.AddToWaitList;
                appointment.RecurrenceId = 0;
                appointment.ModifiedDate = DateTime.Now;
                appointment.ModifiedBy = "User";

                this.uow.GenericRepository<PatientAppointment>().Update(appointment);


            }
            this.uow.Save();

            return appointData;
        }

        ///// <summary>
        ///// Get Appointment History of A patient by PatientId
        ///// </summary>
        ///// <param>PatientId</param>
        ///// <returns>List<PatientAppointmentModel>. if collection of appointments for particular Patient = success. else = failure</returns>
        public List<PatientAppointmentModel> GetAppointmentHistoryForPatient(int PatientId)
        {
            List<PatientAppointmentModel> Appointments = (from app in this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.PatientID == PatientId)
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
                                                              app.Reason,
                                                              app.Duration,
                                                              app.ProviderID,
                                                              app.FacilityID,
                                                              app.ToConsult,
                                                              app.AppointmentStatusID,
                                                              app.AppointmentTypeID,
                                                              app.CPTCode,
                                                              app.IsRecurrence,
                                                              app.AddToWaitList,
                                                              app.RecurrenceId

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
                                                              Appointmentstatus = PAM.AppointmentStatusID > 0 ? this.uow.GenericRepository<AppointmentStatus>().Table().FirstOrDefault(x => x.AppointmentStatusId == PAM.AppointmentStatusID).AppointmentStatusDescription : "",
                                                              AppointmentTypeID = PAM.AppointmentTypeID,
                                                              Appointmenttype = PAM.AppointmentTypeID > 0 ? this.uow.GenericRepository<AppointmentType>().Table().FirstOrDefault(x => x.AppointmentTypeId == PAM.AppointmentTypeID).AppointmentTypeDescription : "",
                                                              CPTCode = PAM.CPTCode,
                                                              IsRecurrence = PAM.IsRecurrence,
                                                              AddToWaitList = PAM.AddToWaitList,
                                                              RecurrenceId = PAM.RecurrenceId

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

        #region Appointment Search and Count 

        ///// <summary>
        ///// Get Appointments for search process by using SearchModel
        ///// </summary>
        ///// <param>searchModel - object of SearchModel</param>
        ///// <returns>List<PatientAppointmentModel>. if the collection of Appointments related to the searchModel fields = success. else = failure</returns>
        public List<PatientAppointmentModel> SearchAppointments(SearchModel searchModel)
        {
            //var canStatus = this.uow.GenericRepository<AppointmentStatus>().Table().SingleOrDefault(x => x.AppointmentStatusDescription.ToLower().Trim() == "cancelled");
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            List<PatientAppointmentModel> Appointments = new List<PatientAppointmentModel>();

            Appointments = (from app in this.uow.GenericRepository<PatientAppointment>().Table()
                            join pat in this.uow.GenericRepository<Patient>().Table()
                            on app.PatientID equals pat.PatientId
                            join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                            on app.ProviderID equals prov.ProviderID

                            where
                            (Fromdate.Date <= app.AppointmentDate.Date
                                  && (Todate.Date >= Fromdate.Date && app.AppointmentDate.Date <= Todate.Date)
                                  && (searchModel.PatientId == 0 || searchModel.PatientId == app.PatientID)
                                  && (searchModel.ProviderId == 0 || searchModel.ProviderId == app.ProviderID)
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
                                prov.UserID,
                                prov.FirstName,
                                prov.MiddleName,
                                prov.LastName,
                                app.AppointmentID,
                                app.AppointmentDate,
                                app.AppointmentNo,
                                app.PatientID,
                                app.Reason,
                                app.Duration,
                                app.ProviderID,
                                app.FacilityID,
                                app.ToConsult,
                                app.AppointmentStatusID,
                                app.AppointmentTypeID,
                                app.CPTCode,
                                app.IsRecurrence,
                                app.AddToWaitList,
                                app.RecurrenceId

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
                                Duration = PAM.Duration,
                                Reason = PAM.Reason,
                                ProviderID = PAM.ProviderID,
                                ProviderName = PAM.FirstName + " " + PAM.MiddleName + " " + PAM.LastName,//((PAM.specDesc == "" || PAM.specDesc == null) ? (PAM.LastName + "") : (PAM.LastName + "/ " + PAM.specDesc)),
                                ProvSpeciality = this.uow.GenericRepository<ProviderSpeciality>().Table().FirstOrDefault(x => x.ProviderID == PAM.ProviderID) != null ?
                                                (this.uow.GenericRepository<ProviderSpeciality>().Table().FirstOrDefault(x => x.ProviderID == PAM.ProviderID).SpecialityDescription) : "",
                                FacilityID = PAM.FacilityID,
                                FacilityName = PAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PAM.FacilityID).FacilityName : "",
                                ToConsult = PAM.ToConsult,
                                AppointmentStatusID = PAM.AppointmentStatusID,
                                Appointmentstatus = PAM.AppointmentStatusID > 0 ? this.uow.GenericRepository<AppointmentStatus>().Table().FirstOrDefault(x => x.AppointmentStatusId == PAM.AppointmentStatusID).AppointmentStatusDescription : "",
                                AppointmentTypeID = PAM.AppointmentTypeID,
                                Appointmenttype = PAM.AppointmentTypeID > 0 ? this.uow.GenericRepository<AppointmentType>().Table().FirstOrDefault(x => x.AppointmentTypeId == PAM.AppointmentTypeID).AppointmentTypeDescription : "",
                                CPTCode = PAM.CPTCode,
                                IsRecurrence = PAM.IsRecurrence,
                                AddToWaitList = PAM.AddToWaitList,
                                RecurrenceId = PAM.RecurrenceId

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
        ///// Get Patients for Appointment search
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForAppointmentSearch(string searchKey)
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
        ///// Get Providers For Appointment Search
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for Appointment = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforAppointmentSearch(string searchKey)
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
        ///// Get Present day's Appointment counts
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<int>. if Appoinment counts for present date = success. else = failure</returns>
        public AppointmentCountModel TodayAppointmentCounts()
        {
            AppointmentCountModel Counts = new AppointmentCountModel();
            var appointments = this.GetAllAppointments().Where(x => x.AppointmentDate.Date == DateTime.Now.Date).ToList();
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
                //select appt).ToList().Count();

            }

            return Counts;
        }

        #endregion

        ///// <summary>
        ///// Delete or Cancel Appointment
        ///// </summary>
        ///// <param>int AppointmentId - Id of the Appointment to be deleted</param>
        ///// <returns>PatientAppointmentModel. if the Appointment which is Cancelled = success. else = failure</returns>
        public PatientAppointmentModel DeleteOrCancelAppointment(int AppointmentId)
        {
            var status = this.uow.GenericRepository<AppointmentStatus>().Table().SingleOrDefault(x => x.AppointmentStatusDescription.ToLower().Trim() == "cancelled");
            var appoint = this.uow.GenericRepository<PatientAppointment>().Table().SingleOrDefault(x => x.AppointmentID == AppointmentId);

            appoint.AppointmentStatusID = status.AppointmentStatusId;
            appoint.ModifiedDate = DateTime.Now;
            appoint.ModifiedBy = "User";

            this.uow.GenericRepository<PatientAppointment>().Update(appoint);
            this.uow.Save();
            return this.GetAppointmentById(appoint.AppointmentID);
        }

        ///// <summary>
        ///// Delete or Cancel Appointment Series
        ///// </summary>
        ///// <param>List<PatientAppointmentModel> AppointmentSeries - Series of the Appointments to be deleted</param>
        ///// <returns>string. if the message which is mentioned = success. else = failure</returns>
        public string DeleteOrCancelAppointmentSeries(IEnumerable<PatientAppointmentModel> AppointmentSeries)
        {
            PatientAppointment appoint = new PatientAppointment();
            var status = this.uow.GenericRepository<AppointmentStatus>().Table().SingleOrDefault(x => x.AppointmentStatusDescription.ToLower().Trim() == "cancelled");
            var AppointCollection = AppointmentSeries.Where(x => x.AppointmentDate.Date >= DateTime.Now.Date).ToList();

            if (AppointCollection.Count() > 0)
            {
                var recurrence = this.uow.GenericRepository<RecurrenceAppointment>().Table().SingleOrDefault(x => x.RecurrenceId == AppointCollection[0].RecurrenceId);

                foreach (var appnt in AppointCollection)
                {
                    appoint = this.uow.GenericRepository<PatientAppointment>().Table().SingleOrDefault(x => x.AppointmentID == appnt.AppointmentID);

                    appoint.AppointmentStatusID = status.AppointmentStatusId;
                    appoint.ModifiedDate = DateTime.Now;
                    appoint.ModifiedBy = "User";

                    this.uow.GenericRepository<PatientAppointment>().Update(appoint);
                }
                this.uow.Save();
                var leftappoints = this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.RecurrenceId == AppointCollection[0].RecurrenceId &
                                     x.AppointmentStatusID != status.AppointmentStatusId).ToList();

                var lastAppnt = AppointCollection.LastOrDefault().AppointmentDate;

                if (leftappoints == null || leftappoints.Count() == 0)
                {
                    recurrence.Deleted = true;
                    recurrence.ModifiedDate = DateTime.Now;
                    recurrence.ModifiedBy = "User";
                    this.uow.GenericRepository<RecurrenceAppointment>().Update(recurrence);
                }
                else if (leftappoints[leftappoints.Count() - 1].AppointmentDate < lastAppnt)
                {
                    recurrence.RecurrenceTo = lastAppnt.AddDays(-1);
                    recurrence.ModifiedDate = DateTime.Now;
                    recurrence.ModifiedBy = "User";
                    this.uow.GenericRepository<RecurrenceAppointment>().Update(recurrence);
                }
            }
            this.uow.Save();
            return "Deleted or Cancelled the Series";
        }

        ///// <summary>
        ///// Get Today's Appointments
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<PatientAppointmentModel>. if the appointmentCollection for Current Date which is mentioned = success. else = failure</returns>
        public List<PatientAppointmentModel> GetToDayAppointments()
        {
            List<PatientAppointmentModel> TodayAppointments = new List<PatientAppointmentModel>();
            var appStatus = this.uow.GenericRepository<AppointmentStatus>().Table().SingleOrDefault(x => x.AppointmentStatusDescription.ToLower().Trim() == "cancelled");
            var appointments = this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.AppointmentDate.Date == DateTime.Now.Date).ToList();

            foreach (var appoint in appointments)
            {
                var pat = this.uow.GenericRepository<Patient>().Table().SingleOrDefault(x => x.PatientId == appoint.PatientID);
                var Prov = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == appoint.ProviderID);

                PatientAppointmentModel appointModel = new PatientAppointmentModel();

                appointModel.AppointmentID = appoint.AppointmentID;
                appointModel.AppointmentDate = appoint.AppointmentDate;
                appointModel.AppointmentTime = appoint.AppointmentDate.ToString("hh:mm:ss tt");
                appointModel.AppointmentNo = appoint.AppointmentNo;
                appointModel.ToConsult = appoint.ToConsult;
                appointModel.AppointmentStatusID = appoint.AppointmentStatusID;
                appointModel.Appointmentstatus = appoint.AppointmentStatusID > 0 ? this.uow.GenericRepository<AppointmentStatus>().Table().FirstOrDefault(x => x.AppointmentStatusId == appoint.AppointmentStatusID).AppointmentStatusDescription : "";
                appointModel.AppointmentTypeID = appoint.AppointmentTypeID;
                appointModel.Appointmenttype = appoint.AppointmentTypeID > 0 ? this.uow.GenericRepository<AppointmentType>().Table().FirstOrDefault(x => x.AppointmentTypeId == appoint.AppointmentTypeID).AppointmentTypeDescription : "";
                appointModel.CPTCode = appoint.CPTCode;
                appointModel.IsRecurrence = appoint.IsRecurrence;
                appointModel.AddToWaitList = appoint.AddToWaitList;
                appointModel.RecurrenceId = appoint.RecurrenceId;
                appointModel.Reason = appoint.Reason;
                appointModel.PatientID = appoint.PatientID;
                appointModel.PatientName = pat.PatientFirstName + " " + pat.PatientMiddleName + " " + pat.PatientLastName;
                appointModel.PatientContactNumber = pat.PrimaryContactNumber;
                appointModel.MRNumber = pat.MRNo;
                appointModel.ProviderID = appoint.ProviderID;
                appointModel.ProviderName = Prov.FirstName + " " + Prov.MiddleName + " " + Prov.LastName;
                appointModel.FacilityID = appoint.FacilityID;
                appointModel.FacilityName = appoint.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == appoint.FacilityID).FacilityName : "";
                
                if (!TodayAppointments.Contains(appointModel))
                {
                    TodayAppointments.Add(appointModel);
                }
            }

            List<PatientAppointmentModel> appointmentsCollection = new List<PatientAppointmentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (TodayAppointments.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        appointmentsCollection = (from appt in TodayAppointments
                                                  join fac in facList on appt.FacilityID equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on appt.ProviderID equals prov.ProviderID
                                                  select appt).ToList();
                    }
                    else
                    {
                        appointmentsCollection = (from appt in TodayAppointments
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on appt.ProviderID equals prov.ProviderID
                                                  select appt).ToList();
                    }
                }
                else
                {
                    appointmentsCollection = (from appt in TodayAppointments
                                              join fac in facList on appt.FacilityID equals fac.FacilityId
                                              select appt).ToList();
                }
            }
            else
            {
                appointmentsCollection = TodayAppointments;
            }

            return appointmentsCollection.OrderByDescending(x => x.AppointmentDate).ToList();
        }

        ///// <summary>
        ///// Add or Update patient Appointment Series 
        ///// </summary>
        ///// <param name = IEnumerable<PatientAppointmentModel> appointData >(object of IEnumerable<PatientAppointmentModel>)</param>
        ///// <returns>IEnumerable<PatientAppointmentModel>. if a patient Appointmentseries added or updated = success. else = failure</returns>
        public IEnumerable<PatientAppointmentModel> AddUpdateAppointmentSeries(IEnumerable<PatientAppointmentModel> appointmentSeries)
        {
            if (appointmentSeries.FirstOrDefault().IsRecurrence == false)
            {
                this.AddUpdateAppointment(appointmentSeries.FirstOrDefault());
            }
            else //if (appointmentSeries.Count() > 0)
            {
                RecurrenceAppointment recurrence = new RecurrenceAppointment();
                recurrence.RecurrenceFrom = this.utilService.GetLocalTime(appointmentSeries.FirstOrDefault().AppointmentFrom);
                recurrence.RecurrenceTo = this.utilService.GetLocalTime(appointmentSeries.FirstOrDefault().AppointmentTo);
                recurrence.Deleted = false;
                recurrence.CreatedDate = DateTime.Now;
                recurrence.Createdby = "User";

                this.uow.GenericRepository<RecurrenceAppointment>().Insert(recurrence);
                this.uow.Save();

                foreach (var appointData in appointmentSeries)
                {
                    var appointment = this.uow.GenericRepository<PatientAppointment>().Table().SingleOrDefault(x => x.AppointmentID == appointData.AppointmentID);
                    var durationTime = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == appointData.ProviderID & x.FacilityID == appointData.FacilityID & x.TerminationDate.Value.Date > DateTime.Now.Date).FirstOrDefault();

                    if (appointment == null)
                    {
                        appointment = new PatientAppointment();

                        appointment.AppointmentDate = this.utilService.GetLocalTime(appointData.AppointmentDate);
                        appointment.PatientID = appointData.PatientID;
                        appointment.Reason = appointData.Reason;
                        appointment.Duration = durationTime != null ? durationTime.TimeSlotDuration.ToString() : ((appointData.Duration == null || appointData.Duration == "") ? "0" : appointData.Duration);
                        appointment.FacilityID = appointData.FacilityID;
                        appointment.ToConsult = appointData.ToConsult;
                        appointment.ProviderID = appointData.ProviderID;
                        appointment.AppointmentStatusID = appointData.AppointmentStatusID;
                        appointment.AppointmentTypeID = appointData.AppointmentTypeID;
                        appointment.CPTCode = appointData.CPTCode;
                        appointment.IsRecurrence = true;
                        appointment.AddToWaitList = appointData.AddToWaitList;
                        appointment.RecurrenceId = recurrence.RecurrenceId;
                        appointment.CreatedDate = DateTime.Now;
                        appointment.Createdby = "User";

                        this.uow.GenericRepository<PatientAppointment>().Insert(appointment);
                    }
                    else
                    {
                        var appStatus = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusDescription.ToLower().Trim() == "rescheduled").FirstOrDefault();

                        appointment.AppointmentDate = this.utilService.GetLocalTime(appointData.AppointmentDate);
                        appointment.PatientID = appointData.PatientID;
                        appointment.Reason = appointData.Reason;
                        appointment.Duration = durationTime != null ? durationTime.TimeSlotDuration.ToString() : ((appointData.Duration == null || appointData.Duration == "") ? "0" : appointData.Duration);
                        appointment.FacilityID = appointData.FacilityID;
                        appointment.ToConsult = appointData.ToConsult;
                        appointment.ProviderID = appointData.ProviderID;
                        appointment.AppointmentStatusID = appStatus.AppointmentStatusId;
                        appointment.AppointmentTypeID = appointData.AppointmentTypeID;
                        appointment.CPTCode = appointData.CPTCode;
                        appointment.IsRecurrence = true;
                        appointment.AddToWaitList = appointData.AddToWaitList;
                        appointment.RecurrenceId = recurrence.RecurrenceId;
                        appointment.ModifiedDate = DateTime.Now;
                        appointment.ModifiedBy = "User";

                        this.uow.GenericRepository<PatientAppointment>().Update(appointment);
                    }
                }
            }

            this.uow.Save();

            return appointmentSeries;
        }

        ///// <summary>
        ///// Get All Provider Specialities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProviderSpecialityModel>. if Collection of Provider Specialities = success. else = failure</returns>
        public List<ProviderSpecialityModel> GetProviderSpecialities()
        {
            List<ProviderSpecialityModel> Specialities = new List<ProviderSpecialityModel>();
            var provSpecialities = this.uow.GenericRepository<ProviderSpeciality>().Table().ToList();

            foreach (var special in provSpecialities)
            {
                var prov = this.uow.GenericRepository<Provider>().Table().FirstOrDefault(x => x.ProviderID == special.ProviderID);
                ProviderSpecialityModel SpecialModel = new ProviderSpecialityModel();

                SpecialModel.ProviderSpecialtyID = special.ProviderSpecialtyID;
                SpecialModel.SpecialityID = special.SpecialityID;
                SpecialModel.SpecialityCode = special.SpecialityCode;
                SpecialModel.SpecialityDescription = special.SpecialityDescription;
                SpecialModel.EffectiveDate = special.EffectiveDate;
                SpecialModel.TerminationDate = special.TerminationDate;
                SpecialModel.ProviderID = special.ProviderID;
                SpecialModel.ProviderName = prov.FirstName + " " + prov.MiddleName + " " + prov.LastName;

                if (!Specialities.Contains(SpecialModel))
                {
                    Specialities.Add(SpecialModel);
                }
            }
            return Specialities;
        }

        ///// <summary>
        ///// Get Availability Status For selected Date by checking Provider and facility
        ///// </summary>
        ///// <param>(int ProviderId, int FacilityId, DateTime AppointDate)</param>
        ///// <returns>string. if status of availability for given Date, Facility, Provider = success. else = failure</returns>
        public AvailabilityModel AvailabilityStatus(AvailabilityModel availModel)
        {
            var schedule = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.FacilityID == availModel.FacilityId & x.ProviderID == availModel.ProviderId & x.TerminationDate.Value.Date > DateTime.Now.Date).ToList();

            var Date = this.utilService.GetLocalTime(availModel.AppointDate);
            string Message = "";
            if (schedule.Count() == 0)
            {
                Message = "No Schedules for this Provider";
            }
            else if (schedule.Count() > 0)
            {
                var Data = schedule.FirstOrDefault(x => x.AppointmentDay == Date.DayOfWeek.ToString() && x.EffectiveDate <= Date
                                                    && x.TerminationDate >= Date);
                var vacation = this.uow.GenericRepository<ProviderVacation>().Table().FirstOrDefault(x => x.ProviderID == availModel.ProviderId
                                                                            && x.StartDate <= Date && x.EndDate >= Date);

                if (Data == null)
                    Message = "No Schedule available on this Day for this Provider";
                else if (vacation != null)
                    Message = "Provider is on Vacation, Not Available";
                else
                    Message = "Yes, Available";

            }
            availModel.AppointDate = Date;
            availModel.ProviderId = availModel.ProviderId;
            availModel.FacilityId = availModel.FacilityId;
            availModel.availability = Message;

            return availModel;
        }

        ///// <summary>
        ///// Get Timings For selected Date
        ///// </summary>
        ///// <param>(string AppointDate, int ProviderID)</param>
        ///// <returns>List<TimingModel>. if Available timings for given Date = success. else = failure</returns>
        public List<TimingModel> GetTimingsforAppointment(string AppointDate, int ProviderID, int facilityID)
        {
            var appointDate = Convert.ToDateTime(AppointDate);
            List<TimingModel> AvailableTimings = new List<TimingModel>();
            List<string> Timings = new List<string>();
            List<string> times = new List<string>();

            var Schedule = this.uow.GenericRepository<ProviderSchedule>().Table().FirstOrDefault(x => x.ProviderID == ProviderID & x.FacilityID == facilityID & x.TerminationDate.Value.Date > DateTime.Now.Date & x.AppointmentDay == appointDate.DayOfWeek.ToString());

            TimeSpan time = new TimeSpan();
            TimeSpan timeSet = new TimeSpan();
            TimeSpan duration = new TimeSpan(0, Schedule.TimeSlotDuration, 0);

            //if (this.GetRailwayTimeForSchedule(Schedule.RegularWorkHrsFrom) < this.GetRailwayTimeForSchedule(Schedule.RegularWorkHrsTo))
            //{
            time = (Schedule.RegularWorkHrsFrom == "12:00:00 am" || Schedule.RegularWorkHrsFrom == "12:00 am") ? this.GetRailwayTimeForSchedule("00:00 am") : this.GetRailwayTimeForSchedule(Schedule.RegularWorkHrsFrom);

            if ((Schedule.BreakHrsFrom1 != null && Schedule.BreakHrsFrom1 != "")
                && (Schedule.BreakHrsTo1 != null && Schedule.BreakHrsTo1 != ""))
            {
                timeSet = (Schedule.BreakHrsFrom1 == "12:00:00 am" || Schedule.BreakHrsFrom1 == "12:00 am") ? this.GetRailwayTimeForSchedule("00:00 am") : this.GetRailwayTimeForSchedule(Schedule.BreakHrsFrom1);

                while (time < timeSet)
                {
                    if (time + duration <= timeSet)
                    {
                        if (!Timings.Contains(time.ToString()))
                        {
                            Timings.Add(time.ToString());
                        }
                    }
                    time = time + duration;
                }

                timeSet = (Schedule.BreakHrsTo1 == "12:00:00 am" || Schedule.BreakHrsTo1 == "12:00 am") ? this.GetRailwayTimeForSchedule("00:00 am") : this.GetRailwayTimeForSchedule(Schedule.BreakHrsTo1);

                time = timeSet;
            }

            if ((Schedule.BreakHrsFrom2 != null && Schedule.BreakHrsFrom2 != "")
                && (Schedule.BreakHrsTo2 != null && Schedule.BreakHrsTo2 != ""))
            {
                timeSet = (Schedule.BreakHrsFrom2 == "12:00:00 am" || Schedule.BreakHrsFrom2 == "12:00 am") ? this.GetRailwayTimeForSchedule("00:00 am") : this.GetRailwayTimeForSchedule(Schedule.BreakHrsFrom2);

                while (time < timeSet)
                {
                    if (time + duration <= timeSet)
                    {
                        if (!Timings.Contains(time.ToString()))
                        {
                            Timings.Add(time.ToString());
                        }
                    }
                    time = time + duration;
                }

                timeSet = (Schedule.BreakHrsTo2 == "12:00:00 am" || Schedule.BreakHrsTo2 == "12:00 am") ? this.GetRailwayTimeForSchedule("00:00 am") : this.GetRailwayTimeForSchedule(Schedule.BreakHrsTo2);

                time = timeSet;
            }

            timeSet = (Schedule.RegularWorkHrsTo == "12:00:00 am" || Schedule.RegularWorkHrsTo == "12:00 am") ? this.GetRailwayTimeForSchedule("00:00 am") : this.GetRailwayTimeForSchedule(Schedule.RegularWorkHrsTo);

            while (time < timeSet)
            {
                if (time + duration <= timeSet)
                {
                    if (!Timings.Contains(time.ToString()))
                    {
                        Timings.Add(time.ToString());
                    }
                }
                time = time + duration;
            }
            //}

            var appStatus = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusDescription.ToLower().Trim() == "cancelled").FirstOrDefault();

            var takentime = (from appnt in this.uow.GenericRepository<PatientAppointment>().Table().
                            Where(x => x.ProviderID == ProviderID & x.AppointmentDate.Date == appointDate.Date & x.AppointmentStatusID != appStatus.AppointmentStatusId)
                             select appnt.AppointmentDate.TimeOfDay.ToString()).ToList();

            if (takentime.Count() > 0)
            {
                if (Schedule.BookingPerSlot <= takentime.Count())
                {
                    times = Timings.Except(takentime).ToList();
                }
                else
                {
                    times = Timings;
                }
            }
            else
            {
                times = Timings;
            }

            foreach (var set in times)
            {
                TimingModel model = new TimingModel();

                var AppointedTime = this.uow.GenericRepository<PatientAppointment>().Table().FirstOrDefault(x => x.AppointmentDate.Date == appointDate.Date
                                        & x.AppointmentDate.TimeOfDay.ToString() == set & x.AppointmentStatusID != appStatus.AppointmentStatusId & x.ProviderID == ProviderID);

                if (AppointedTime == null || (AppointedTime != null && AppointedTime.AppointmentStatusID == appStatus.AppointmentStatusId))
                {
                    model.IsAvailable = true;
                }
                else
                {
                    var appRecord = this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.AppointmentDate.Date == appointDate.Date & x.AppointmentStatusID != appStatus.AppointmentStatusId
                    & x.AppointmentDate.TimeOfDay.ToString() == set & x.ProviderID == ProviderID).ToList();

                    if (appRecord.Count() < Schedule.BookingPerSlot)
                        model.IsAvailable = true;
                    else
                        model.IsAvailable = false;
                }
                model.ScheduleTime = this.GetTimewithTiming(set);
                model.duration = duration.Minutes.ToString();
                
                if (!AvailableTimings.Contains(model))
                {
                    AvailableTimings.Add(model);
                }
            }

            return AvailableTimings;
        }

        ///// <summary>
        ///// Get Time For Schedule as Railway Date
        ///// </summary>
        ///// <param>(string scheduledTime)</param>
        ///// <returns>TimeSpan. if Railway time for given value = success. else = failure</returns>
        public TimeSpan GetRailwayTimeForSchedule(string scheduledTime)
        {
            int Hours = 0;
            int Mins = 0;
            TimeSpan time = new TimeSpan(0, 0, 0);

            string timeSet = scheduledTime.Split(' ')[0];

            if (scheduledTime.ToLower().Trim().Contains("pm") && timeSet.Split(':')[0] != "12")
            {
                Hours = Int32.Parse(timeSet.Split(':')[0]) + 12;
                Mins = Int32.Parse(timeSet.Split(':')[1]);
            }
            else
            {
                Hours = Int32.Parse(timeSet.Split(':')[0]);
                Mins = Int32.Parse(timeSet.Split(':')[1]);
            }
            time = new TimeSpan(Hours, Mins, 0);

            return time;
        }

        ///// <summary>
        ///// Get Time returns with AM or PM
        ///// </summary>
        ///// <param>(string Daytime)</param>
        ///// <returns>TimeSpan. if time with AM or PM for given value = success. else = failure</returns>
        public string GetTimewithTiming(string Daytime)
        {
            TimeSpan midTime = new TimeSpan(12, 00, 00);
            TimeSpan timeData = new TimeSpan(Int32.Parse(Daytime.Split(':')[0]), Int32.Parse(Daytime.Split(':')[1]), Int32.Parse(Daytime.Split(':')[2]));
            TimeSpan timeResult = new TimeSpan();
            string Timing = "";
            if (midTime <= timeData)
            {
                timeResult = timeData - midTime;
                if (timeResult.Hours == 0)
                {
                    var span = new TimeSpan(12, timeResult.Minutes, timeResult.Seconds);
                    Timing = span + " " + "PM";
                }
                else
                {
                    Timing = timeResult + " " + "PM";
                }
            }
            else
            {
                Timing = timeData + " " + "AM";
            }
            return Timing;
        }

        ///// <summary>
        ///// Get Appointments for Calendar Data with View mode,date
        ///// </summary>
        ///// <param>(string viewMode, string date, int providerId)</param>
        ///// <returns>List<PatientAppointmentModel>. if appointments for given viewmode and date = success. else = failure</returns>
        public List<PatientAppointmentModel> GetAppointmentsForCalendar(string viewMode, string date)//, int providerId)
        {
            DateTime selectedDate = this.utilService.GetLocalTime(Convert.ToDateTime(date));
            //DateTime selectedDate = Convert.ToDateTime(date);
            DateTime startDate = new DateTime();
            DateTime endDate = new DateTime();
            if (viewMode.ToLower().Trim() == "day")
            {
                startDate = Convert.ToDateTime(selectedDate.ToShortDateString());
                endDate = startDate.AddDays(1);
            }
            else if (viewMode.ToLower().Trim() == "week")
            {
                startDate = selectedDate.AddDays(selectedDate.DayOfWeek.GetHashCode() * -1);
                endDate = startDate.AddDays(7);
            }
            else if (viewMode.ToLower().Trim() == "month")
            {
                startDate = new DateTime(selectedDate.Year, selectedDate.Month, 1);
                endDate = startDate.AddMonths(1);
            }

            List<PatientAppointmentModel> appointments = new List<PatientAppointmentModel>();

            appointments = (from app in this.uow.GenericRepository<PatientAppointment>().Table()//.Where(x => x.ProviderID == providerId)

                            join prov in this.uow.GenericRepository<Provider>().Table()
                            on app.ProviderID equals prov.ProviderID

                            join pat in this.uow.GenericRepository<Patient>().Table()
                            on app.PatientID equals pat.PatientId
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

                            }).AsEnumerable().OrderByDescending(x => x.AppointmentDate).Select(PAM => new PatientAppointmentModel
                            {
                                AppointmentID = PAM.AppointmentID,
                                AppointmentDate = PAM.AppointmentDate,
                                AppointmentTime = PAM.AppointmentDate.ToString("hh:mm:ss tt"),
                                AppointmentStartTime = PAM.AppointmentDate,
                                AppointmentEndTime = (PAM.Duration != null && Convert.ToInt32(PAM.Duration) > 0) ? PAM.AppointmentDate.AddMinutes(Convert.ToInt32(PAM.Duration)) : PAM.AppointmentDate.AddMinutes(0),
                                AppointmentNo = PAM.AppointmentNo,
                                PatientID = PAM.PatientID,
                                PatientName = PAM.PatientFirstName + " " + PAM.PatientMiddleName + " " + PAM.PatientLastName,
                                PatientContactNumber = PAM.PrimaryContactNumber,
                                MRNumber = PAM.MRNo,
                                Reason = PAM.Reason,
                                Duration = (PAM.Duration != null && Convert.ToInt32(PAM.Duration) > 0) ? PAM.Duration : "0",
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

                            }).ToList();

            var appointmentList = (from data in appointments.Where(x => x.Appointmentstatus.ToLower().Trim() != "cancelled")

                                       //join schedule in this.uow.GenericRepository<ProviderSchedule>().Table()
                                       //on data.ProviderID equals schedule.ProviderID

                                   where (//schedule.EffectiveDate.Value.Date <= data.AppointmentDate.Date && schedule.TerminationDate.Value.Date >= data.AppointmentDate.Date && 
                                   (startDate.Date > new DateTime().Date && data.AppointmentDate.Date >= startDate.Date) &&
                                   (endDate.Date > new DateTime().Date && endDate >= startDate && data.AppointmentDate.Date < endDate))

                                   select data).GroupBy(obj => new { obj.ProviderID, obj.AppointmentDate }).Select(data => data.OrderByDescending(set => set.AppointmentDate).FirstOrDefault()).ToList();

            List<PatientAppointmentModel> appointmentsCollection = new List<PatientAppointmentModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (appointmentList.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        appointmentsCollection = (from appt in appointmentList
                                                  join fac in facList on appt.FacilityID equals fac.FacilityId
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on appt.ProviderID equals prov.ProviderID
                                                  select appt).ToList();
                    }
                    else
                    {
                        appointmentsCollection = (from appt in appointmentList
                                                  join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                  on appt.ProviderID equals prov.ProviderID
                                                  select appt).ToList();
                    }
                }
                else
                {
                    appointmentsCollection = (from appt in appointmentList
                                              join fac in facList on appt.FacilityID equals fac.FacilityId
                                              select appt).ToList();
                }
            }
            else
            {
                appointmentsCollection = appointmentList;
            }

            return appointmentsCollection;
        }

        ///// <summary>
        ///// Get Dates for Given Provider
        ///// </summary>
        ///// <param>(int ProviderId)</param>
        ///// <returns>List<DateTime> collection of Dates when The given provider is available = success. else = failure</returns>
        public List<DateTime> GetDatesForProvider(int ProviderId)
        {
            List<DateTime> Dates = new List<DateTime>();
            List<DateTime> vacationDates = new List<DateTime>();
            List<DateTime> availableDates = new List<DateTime>();

            var schedule = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == ProviderId & x.TerminationDate.Value.Date > DateTime.Now.Date).ToList();

            if (schedule.Count() > 0)
            {
                var startDate = schedule.FirstOrDefault().EffectiveDate;

                var endDate = schedule.FirstOrDefault().TerminationDate;

                var vacation = this.uow.GenericRepository<ProviderVacation>().Table().
                                Where(x => x.ProviderID == ProviderId & x.StartDate >= startDate & x.EndDate <= endDate).FirstOrDefault();

                if (vacation != null)
                {
                    for (var date = vacation.StartDate; date <= vacation.EndDate; date.Value.AddDays(1))
                    {
                        vacationDates.Add(date.Value);
                        date = date.Value.AddDays(1);
                    }
                }

                foreach (var day in schedule)
                {
                    for (var Scheduleddate = startDate; Scheduleddate <= endDate; Scheduleddate.Value.AddDays(1))
                    {
                        if (day.AppointmentDay == Scheduleddate.Value.DayOfWeek.ToString())
                        {
                            Dates.Add(Scheduleddate.Value);
                        }
                        Scheduleddate = Scheduleddate.Value.AddDays(1);
                    }
                }
            }

            if (vacationDates.Count() > 0)
            {
                var dateRecords = (from dat in Dates join vac in vacationDates on dat.Date equals vac.Date select dat).ToList();

                availableDates = Dates.Except(dateRecords).ToList();
            }
            else
            {
                availableDates = Dates;
            }
            return availableDates;
        }

        //// <summary>
        ///// Get Auto - generated Appointment No or (APT No)
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>string. if value of Auto - generated Appointment number = success. else = failure</returns>
        public List<string> GetAppointmentNumber()
        {
            List<string> APTNo = new List<string>();

            var APT = this.iTenantMasterService.GetAppointmentNo();

            APTNo.Add(APT);

            return APTNo;
        }
    }
}