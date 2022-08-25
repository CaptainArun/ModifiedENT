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
    public class CallCenterService : ICallCenterService
    {
        public readonly IUnitOfWork uow;
        public readonly IUtilityService utilService;
        public readonly ITenantMasterService iTenantMasterService;

        public CallCenterService(IUnitOfWork _uow, IUtilityService _utilService, ITenantMasterService _iTenantMasterService)
        {
            uow = _uow;
            utilService = _utilService;
            iTenantMasterService = _iTenantMasterService;
        }

        ///// <summary>
        ///// Get All Counts for Call Centers
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>AppointmentCountModel. if Counts of Appointments Different Statuses= success. else = failure</returns>
        public AppointmentCountModel GetCallCenterCount()
        {
            AppointmentCountModel CallCenterCount = new AppointmentCountModel();
            var appoints = this.AppointmentsforCallCenter().Where(x => x.AppointmentDate.Date == DateTime.Now.Date).ToList();

            CallCenterCount.totalCount = appoints.Count();

            CallCenterCount.CancelledCount = (from appt in appoints
                                              join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                              on appt.AppointmentStatusID equals status.AppointmentStatusId
                                              where status.AppointmentStatusDescription.ToLower().Trim() == "cancelled"
                                              select appt).ToList().Count();

            CallCenterCount.ConfirmedCount = (from appt in appoints
                                              join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                              on appt.AppointmentStatusID equals status.AppointmentStatusId
                                              where status.AppointmentStatusDescription.ToLower().Trim() == "confirmed"
                                              select appt).ToList().Count();

            CallCenterCount.waitCount = (from appt in appoints
                                         join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                         on appt.AppointmentStatusID equals status.AppointmentStatusId
                                         where status.AppointmentStatusDescription.ToLower().Trim() == "arrived"
                                         select appt).ToList().Count();

            CallCenterCount.ReScheduledCount = (from appt in appoints
                                                join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                                on appt.AppointmentStatusID equals status.AppointmentStatusId
                                                where status.AppointmentStatusDescription.ToLower().Trim() == "rescheduled"
                                                select appt).ToList().Count();

            CallCenterCount.PendingAppointmentCount = (from appt in appoints
                                                       join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                                       on appt.AppointmentStatusID equals status.AppointmentStatusId
                                                       where status.AppointmentStatusDescription.ToLower().Trim() == "requested" || status.AppointmentStatusDescription.ToLower().Trim() == "rescheduled"
                                                       select appt).ToList().Count();

            CallCenterCount.VisitConvertedAppointmentCount = (from appt in appoints
                                                              join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                              on appt.AppointmentID equals vis.AppointmentID
                                                              select appt).ToList().Count();

            return CallCenterCount;
        }

        ///// <summary>
        ///// Get Appointment number by search
        ///// </summary>
        ///// <param>searchKey</param>
        ///// <returns>List<string>. if Collection of Appointment Numbers = success. else = failure</returns>
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
            var visNumbers = this.iTenantMasterService.GetVisitNumbersbySearch(searchKey);
            return visNumbers;
        }

        #region Patient Appointment

        ///// <summary>
        ///// Get Data related to search
        ///// </summary>
        ///// <param>SearchModel searchModel</param>
        ///// <returns>List<PatientAppointmentModel>. if data for the given Search model = success. else = failure</returns>
        public List<PatientAppointmentModel> SearchCallCenterAppointments(SearchModel searchModel)
        {
            var canStatus = this.uow.GenericRepository<AppointmentStatus>().Table().SingleOrDefault(x => x.AppointmentStatusDescription.ToLower().Trim() == "cancelled");
            DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.FromDate.Value);
            //DateTime Fromdate = searchModel.FromDate == null ? DateTime.Now : searchModel.FromDate.Value;
            DateTime Todate = searchModel.ToDate == null ? DateTime.Now : this.utilService.GetLocalTime(searchModel.ToDate.Value);
            //DateTime Todate = searchModel.ToDate == null ? DateTime.Now : searchModel.ToDate.Value;

            List<PatientAppointmentModel> Appointments = (from app in this.uow.GenericRepository<PatientAppointment>().Table()
                                                          where app.AppointmentStatusID != canStatus.AppointmentStatusId
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
                                                              prov.FirstName,
                                                              prov.MiddleName,
                                                              prov.LastName,
                                                              app.AppointmentID,
                                                              app.AppointmentDate,
                                                              app.AppointmentNo,
                                                              app.PatientID,
                                                              app.Reason,
                                                              app.ProviderID,
                                                              app.FacilityID,
                                                              app.AppointmentStatusID,
                                                              app.AppointmentTypeID,
                                                              app.CPTCode,
                                                              app.IsRecurrence,
                                                              app.RecurrenceId

                                                          }).AsEnumerable().Select(PAM => new PatientAppointmentModel
                                                          {
                                                              AppointmentID = PAM.AppointmentID,
                                                              AppointmentDate = PAM.AppointmentDate,
                                                              AppointmentTime = PAM.AppointmentDate.ToString("hh:mm:ss tt"),
                                                              AppointmentNo = PAM.AppointmentNo,
                                                              PatientID = PAM.PatientID,
                                                              PatientName = PAM.PatientFirstName + " " + PAM.PatientMiddleName + " " + PAM.PatientLastName,
                                                              Reason = PAM.Reason,
                                                              ProviderID = PAM.ProviderID,
                                                              ProviderName = PAM.FirstName + " " + PAM.MiddleName + " " + PAM.LastName,
                                                              FacilityID = PAM.FacilityID,
                                                              FacilityName = PAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PAM.FacilityID).FacilityName : "",
                                                              AppointmentStatusID = PAM.AppointmentStatusID,
                                                              Appointmentstatus = PAM.AppointmentStatusID > 0 ? this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusId == PAM.AppointmentStatusID).FirstOrDefault().AppointmentStatusDescription : "",
                                                              AppointmentTypeID = PAM.AppointmentTypeID,
                                                              Appointmenttype = PAM.AppointmentTypeID > 0 ? this.uow.GenericRepository<AppointmentType>().Table().Where(x => x.AppointmentTypeId == PAM.AppointmentTypeID).FirstOrDefault().AppointmentTypeDescription : "",
                                                              CPTCode = PAM.CPTCode,
                                                              IsRecurrence = PAM.IsRecurrence,
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
        ///// Get Data related to search
        ///// </summary>
        ///// <param>SearchModel searchModel</param>
        ///// <returns>List<PatientAppointmentModel>. if collection of appointments = success. else = failure</returns>
        public List<PatientAppointmentModel> AppointmentsforCallCenter()
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
                                                              prov.FirstName,
                                                              prov.MiddleName,
                                                              prov.LastName,
                                                              app.AppointmentID,
                                                              app.AppointmentDate,
                                                              app.AppointmentNo,
                                                              app.PatientID,
                                                              app.Reason,
                                                              app.ProviderID,
                                                              app.FacilityID,
                                                              app.AppointmentStatusID,
                                                              app.AppointmentTypeID,
                                                              app.CPTCode,
                                                              app.IsRecurrence,
                                                              app.RecurrenceId

                                                          }).AsEnumerable().Select(PAM => new PatientAppointmentModel
                                                          {
                                                              AppointmentID = PAM.AppointmentID,
                                                              AppointmentDate = PAM.AppointmentDate,
                                                              AppointmentTime = PAM.AppointmentDate.ToString("hh:mm:ss tt"),
                                                              AppointmentNo = PAM.AppointmentNo,
                                                              PatientID = PAM.PatientID,
                                                              PatientName = PAM.PatientFirstName + " " + PAM.PatientMiddleName + " " + PAM.PatientLastName,
                                                              Reason = PAM.Reason,
                                                              ProviderID = PAM.ProviderID,
                                                              ProviderName = PAM.FirstName + " " + PAM.MiddleName + " " + PAM.LastName,
                                                              FacilityID = PAM.FacilityID,
                                                              FacilityName = PAM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == PAM.FacilityID).FacilityName : "",
                                                              AppointmentStatusID = PAM.AppointmentStatusID,
                                                              Appointmentstatus = PAM.AppointmentStatusID > 0 ? this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusId == PAM.AppointmentStatusID).FirstOrDefault().AppointmentStatusDescription : "",
                                                              AppointmentTypeID = PAM.AppointmentTypeID,
                                                              Appointmenttype = PAM.AppointmentTypeID > 0 ? this.uow.GenericRepository<AppointmentType>().Table().Where(x => x.AppointmentTypeId == PAM.AppointmentTypeID).FirstOrDefault().AppointmentTypeDescription : "",
                                                              CPTCode = PAM.CPTCode,
                                                              IsRecurrence = PAM.IsRecurrence,
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

        ///// <summary>
        ///// Get Appointment Counts for patient
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>AppointmentCountModel. if Counts of Appointments Different Statuses= success. else = failure</returns>
        public AppointmentCountModel GetAppointmentCountsforPatient(int PatientId)
        {
            AppointmentCountModel appointCount = new AppointmentCountModel();
            var appoints = this.AppointmentsforCallCenter().Where(x => x.PatientID == PatientId & x.AppointmentDate <= DateTime.Now).ToList();

            appointCount.totalCount = appoints.Count();

            appointCount.CancelledCount = (from appt in appoints
                                           join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                           on appt.AppointmentStatusID equals status.AppointmentStatusId
                                           where status.AppointmentStatusDescription.ToLower().Trim() == "cancelled"
                                           select appt).ToList().Count();

            appointCount.ConfirmedCount = (from appt in appoints
                                           join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                           on appt.AppointmentStatusID equals status.AppointmentStatusId
                                           where status.AppointmentStatusDescription.ToLower().Trim() == "confirmed"
                                           select appt).ToList().Count();

            appointCount.waitCount = (from appt in appoints
                                      join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                      on appt.AppointmentStatusID equals status.AppointmentStatusId
                                      where status.AppointmentStatusDescription.ToLower().Trim() == "arrived"
                                      select appt).ToList().Count();

            appointCount.ReScheduledCount = (from appt in appoints
                                             join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                             on appt.AppointmentStatusID equals status.AppointmentStatusId
                                             where status.AppointmentStatusDescription.ToLower().Trim() == "rescheduled"
                                             select appt).ToList().Count();

            appointCount.PendingAppointmentCount = (from appt in appoints
                                                    join status in this.uow.GenericRepository<AppointmentStatus>().Table()
                                                    on appt.AppointmentStatusID equals status.AppointmentStatusId
                                                    where status.AppointmentStatusDescription.ToLower().Trim() == "requested" || status.AppointmentStatusDescription.ToLower().Trim() == "rescheduled"
                                                    select appt).ToList().Count();

            appointCount.VisitConvertedAppointmentCount = (from appt in appoints
                                                           join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                           on appt.AppointmentID equals vis.AppointmentID
                                                           select appt).ToList().Count();

            return appointCount;
        }

        ///// <summary>
        ///// Get previous Appointment History of A patient by PatientId
        ///// </summary>
        ///// <param>int PatientId</param>
        ///// <returns>List<PatientAppointmentModel>. if collection of previous appointments for particular Patient = success. else = failure</returns>
        public List<PatientAppointmentModel> GetPreviousAppointmentHistoryForPatient(int PatientId)
        {
            List<PatientAppointmentModel> Appointments = (from app in this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.PatientID == PatientId)
                                                          join pat in this.uow.GenericRepository<Patient>().Table()
                                                          on app.PatientID equals pat.PatientId
                                                          join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.IsActive != false)
                                                          on app.ProviderID equals prov.ProviderID

                                                          where app.AppointmentDate <= DateTime.Now

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

        ///// <summary>
        ///// Get Appointment by Id
        ///// </summary>
        ///// <param>appointmentId</param>
        ///// <returns>PatientAppointmentModel. if patient appointment for given AppointmentId = success. else = failure</returns>
        public PatientAppointmentModel GetAppointmentfromCallCenterbyID(int appointmentId)
        {
            PatientAppointmentModel Appointment = (from app in this.uow.GenericRepository<PatientAppointment>().Table().Where(x => x.AppointmentID == appointmentId)
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
        ///// Add or Update a patient Appointment by AppointmentId
        ///// </summary>
        ///// <param>appointData(object of PatientAppointmentModel)</param>
        ///// <returns>PatientAppointmentModel. if a patient Appointment added or updated = success. else = failure</returns>
        public PatientAppointmentModel UpdateAppointmentfromCallCenter(PatientAppointmentModel appointData)
        {
            var appointment = this.uow.GenericRepository<PatientAppointment>().Table().SingleOrDefault(x => x.AppointmentID == appointData.AppointmentID);
            var durationTime = this.uow.GenericRepository<ProviderSchedule>().Table().Where(x => x.ProviderID == appointData.ProviderID).FirstOrDefault();
            var appStatus = this.uow.GenericRepository<AppointmentStatus>().Table().Where(x => x.AppointmentStatusDescription.ToLower().Trim() == "rescheduled").FirstOrDefault();

            if (appointment != null)
            {
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
                this.uow.Save();
            }

            return appointData;
        }

        #endregion

        ///// <summary>
        ///// Get All Provider Specialities
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<ProviderSpecialityModel>. if Collection of Provider Specialities = success. else = failure</returns>
        public List<ProviderSpecialityModel> GetSpecialitiesForCallCenter()
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
        ///// Add or Update Call Center Data
        ///// </summary>
        ///// <param>CallCenterModel CenterData</param>
        ///// <returns>CallCenterModel. if the added CallCenterModel data = success. else = failure</returns>
        public CallCenterModel AddUpdateCallCenterData(CallCenterModel CenterData)
        {
            var CallData = this.uow.GenericRepository<CallCenter>().Table().SingleOrDefault(x => x.CallCenterId == CenterData.CallCenterId);

            if (CallData == null)
            {
                CallData = new CallCenter();

                CallData.PatientId = CenterData.PatientId;
                CallData.AppointmentID = CenterData.AppointmentID;
                CallData.ProcedureReqID = CenterData.ProcedureReqID;
                CallData.NumberCalled = CenterData.NumberCalled;
                CallData.WhomAnswered = CenterData.WhomAnswered;
                CallData.CallStatus = CenterData.CallStatus;
                CallData.AppProcStatus = CenterData.AppProcStatus;
                CallData.MessagePassed = CenterData.MessagePassed;
                CallData.AdditionalInformation = CenterData.AdditionalInformation;
                CallData.CreatedDate = DateTime.Now;
                CallData.CreatedBy = "User";

                this.uow.GenericRepository<CallCenter>().Insert(CallData);
            }
            else
            {
                CallData.PatientId = CenterData.PatientId;
                CallData.AppointmentID = CenterData.AppointmentID;
                CallData.ProcedureReqID = CenterData.ProcedureReqID;
                CallData.NumberCalled = CenterData.NumberCalled;
                CallData.WhomAnswered = CenterData.WhomAnswered;
                CallData.CallStatus = CenterData.CallStatus;
                CallData.AppProcStatus = CenterData.AppProcStatus;
                CallData.MessagePassed = CenterData.MessagePassed;
                CallData.AdditionalInformation = CenterData.AdditionalInformation;
                CallData.ModifiedDate = DateTime.Now;
                CallData.ModifiedBy = "User";

                this.uow.GenericRepository<CallCenter>().Update(CallData);
            }
            this.uow.Save();
            CenterData.CallCenterId = CallData.CallCenterId;

            return CenterData;
        }

        ///// <summary>
        ///// Get All Call Center data
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<CallCenterModel>. if Collection of CallCenter data = success. else = failure</returns>
        public List<CallCenterModel> GetAllCallCenterData()
        {
            var callCenterdata = (from call in this.uow.GenericRepository<CallCenter>().Table()
                                  join pat in this.uow.GenericRepository<Patient>().Table()
                                  on call.PatientId equals pat.PatientId
                                  join appt in this.uow.GenericRepository<PatientAppointment>().Table()
                                  on call.AppointmentID equals appt.AppointmentID
                                  select new
                                  {
                                      call.CallCenterId,
                                      call.PatientId,
                                      call.AppointmentID,
                                      call.NumberCalled,
                                      call.WhomAnswered,
                                      call.CallStatus,
                                      call.AppProcStatus,
                                      call.MessagePassed,
                                      call.AdditionalInformation,
                                      appt.FacilityID,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName

                                  }).AsEnumerable().Select(CCM => new CallCenterModel
                                  {
                                      CallCenterId = CCM.CallCenterId,
                                      PatientId = CCM.PatientId,
                                      PatientName = CCM.PatientFirstName + "" + CCM.PatientMiddleName + "" + CCM.PatientLastName,
                                      AppointmentID = CCM.AppointmentID,
                                      FacilityId = CCM.FacilityID,
                                      facilityName = CCM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CCM.FacilityID).FacilityName : "",
                                      NumberCalled = CCM.NumberCalled,
                                      WhomAnswered = CCM.WhomAnswered,
                                      CallStatus = CCM.CallStatus,
                                      AppProcStatus = CCM.AppProcStatus,
                                      MessagePassed = CCM.MessagePassed,
                                      AdditionalInformation = CCM.AdditionalInformation

                                  }).ToList();

            List<CallCenterModel> callCenterCollection = new List<CallCenterModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (callCenterdata.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (facList.Count() > 0)
                    {
                        callCenterCollection = (from call in callCenterdata
                                                join fac in facList on call.FacilityId equals fac.FacilityId
                                                join appt in this.uow.GenericRepository<PatientAppointment>().Table()
                                                on call.AppointmentID equals appt.AppointmentID
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on appt.ProviderID equals prov.ProviderID
                                                select call).ToList();
                    }
                    else
                    {
                        callCenterCollection = (from call in callCenterdata
                                                join appt in this.uow.GenericRepository<PatientAppointment>().Table()
                                                on call.AppointmentID equals appt.AppointmentID
                                                join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                on appt.ProviderID equals prov.ProviderID
                                                select call).ToList();
                    }
                }
                else
                {
                    callCenterCollection = (from call in callCenterdata
                                            join fac in facList on call.FacilityId equals fac.FacilityId
                                            select call).ToList();
                }
            }
            else
            {
                callCenterCollection = callCenterdata;
            }

            return callCenterCollection;
        }

        ///// <summary>
        ///// Get Call Center data for given Id
        ///// </summary>
        ///// <param>int appointmentId</param>
        ///// <returns>List<CallCenterModel>. if CallCenter data for given appointmentId = success. else = failure</returns>
        public CallCenterModel GetCallCenterDataByAppointmentId(int appointmentId)
        {
            var callCenterdata = (from call in this.uow.GenericRepository<CallCenter>().Table().Where(x => x.AppointmentID == appointmentId)
                                  join pat in this.uow.GenericRepository<Patient>().Table()
                                  on call.PatientId equals pat.PatientId
                                  join appt in this.uow.GenericRepository<PatientAppointment>().Table()
                                  on call.AppointmentID equals appt.AppointmentID
                                  select new
                                  {
                                      call.CallCenterId,
                                      call.PatientId,
                                      call.AppointmentID,
                                      call.NumberCalled,
                                      call.WhomAnswered,
                                      call.CallStatus,
                                      call.AppProcStatus,
                                      call.MessagePassed,
                                      call.AdditionalInformation,
                                      appt.FacilityID,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName

                                  }).AsEnumerable().Select(CCM => new CallCenterModel
                                  {
                                      CallCenterId = CCM.CallCenterId,
                                      PatientId = CCM.PatientId,
                                      PatientName = CCM.PatientFirstName + "" + CCM.PatientMiddleName + "" + CCM.PatientLastName,
                                      AppointmentID = CCM.AppointmentID,
                                      FacilityId = CCM.FacilityID,
                                      facilityName = CCM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CCM.FacilityID).FacilityName : "",
                                      NumberCalled = CCM.NumberCalled,
                                      WhomAnswered = CCM.WhomAnswered,
                                      CallStatus = CCM.CallStatus,
                                      AppProcStatus = CCM.AppProcStatus,
                                      MessagePassed = CCM.MessagePassed,
                                      AdditionalInformation = CCM.AdditionalInformation

                                  }).FirstOrDefault();

            return callCenterdata;
        }

        ///// <summary>
        ///// Get Call Center data for given Id
        ///// </summary>
        ///// <param>int callCenterId</param>
        ///// <returns>List<CallCenterModel>. if CallCenter data for given callCenterId = success. else = failure</returns>
        public CallCenterModel GetCallCenterDataById(int callCenterId)
        {
            var callCenterdata = (from call in this.uow.GenericRepository<CallCenter>().Table().Where(x => x.CallCenterId == callCenterId)
                                  join pat in this.uow.GenericRepository<Patient>().Table()
                                  on call.PatientId equals pat.PatientId
                                  join appt in this.uow.GenericRepository<PatientAppointment>().Table()
                                  on call.AppointmentID equals appt.AppointmentID
                                  select new
                                  {
                                      call.CallCenterId,
                                      call.PatientId,
                                      call.AppointmentID,
                                      call.NumberCalled,
                                      call.WhomAnswered,
                                      call.CallStatus,
                                      call.AppProcStatus,
                                      call.MessagePassed,
                                      call.AdditionalInformation,
                                      appt.FacilityID,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName

                                  }).AsEnumerable().Select(CCM => new CallCenterModel
                                  {
                                      CallCenterId = CCM.CallCenterId,
                                      PatientId = CCM.PatientId,
                                      PatientName = CCM.PatientFirstName + "" + CCM.PatientMiddleName + "" + CCM.PatientLastName,
                                      AppointmentID = CCM.AppointmentID,
                                      FacilityId = CCM.FacilityID,
                                      facilityName = CCM.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == CCM.FacilityID).FacilityName : "",
                                      NumberCalled = CCM.NumberCalled,
                                      WhomAnswered = CCM.WhomAnswered,
                                      CallStatus = CCM.CallStatus,
                                      AppProcStatus = CCM.AppProcStatus,
                                      MessagePassed = CCM.MessagePassed,
                                      AdditionalInformation = CCM.AdditionalInformation

                                  }).SingleOrDefault();

            return callCenterdata;
        }

        ///// <summary>
        ///// Get Providers For Call center
        ///// </summary>
        ///// <param>(string searchKey)</param>
        ///// <returns>List<ProviderModel>. if collection of Providers for PreProcedure = success. else = failure</returns>
        public List<ProviderModel> GetProvidersforCallCenter(string searchKey)
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
        ///// Get Patients for Call Center
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<Patient> If Patient table data collection returns = success. else = failure</returns>
        public List<Patient> GetPatientsForCallCenter(string searchKey)
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
        ///// Get AppointmentStatuses for Call Center
        ///// </summary>
        ///// <param>NiL</param>
        ///// <returns>List<AppointmentStatus>. if Collection of AppointmentStatus for Call Center = success. else = failure</returns>
        public List<AppointmentStatus> GetAppointmentStatusesforCallCenter()
        {
            var AppointStatuses = this.uow.GenericRepository<AppointmentStatus>().Table().ToList();
            return AppointStatuses;
        }

        #region Procedure Request

        ///// <summary>
        ///// Get Procedure Requests for CallCenter by search
        ///// </summary>
        ///// <param>SearchModel searchModel</param>
        ///// <returns>List<ProcedureRequestModel>. if collection of ProcedureRequestModel for CallCenter = success. else = failure</returns>
        public List<ProcedureRequestModel> SearchProcedureRequestsforCallCenter(SearchModel searchModel)
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

                                     where (Fromdate.Date <= procRqst.ProcedureRequestedDate.Date
                                           && (Todate.Date >= Fromdate.Date && procRqst.ProcedureRequestedDate.Date <= Todate.Date)
                                           && (searchModel.PatientId == 0 || pat.PatientId == searchModel.PatientId)
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
                                         //procRqst.ApproximateDuration,
                                         procRqst.UrgencyID,
                                         //procRqst.PreProcedureDiagnosis,
                                         //procRqst.ICDCode,
                                         //procRqst.PlannedProcedure,
                                         procRqst.ProcedureName,
                                         //procRqst.CPTCode,
                                         //procRqst.AnesthesiaFitnessRequired,
                                         //procRqst.AnesthesiaFitnessRequiredDesc,
                                         //procRqst.BloodRequired,
                                         //procRqst.BloodRequiredDesc,
                                         //procRqst.ContinueMedication,
                                         //procRqst.StopMedication,
                                         //procRqst.SpecialPreparation,
                                         //procRqst.SpecialPreparationNotes,
                                         //procRqst.DietInstructions,
                                         //procRqst.DietInstructionsNotes,
                                         //procRqst.OtherInstructions,
                                         //procRqst.OtherInstructionsNotes,
                                         //procRqst.Cardiology,
                                         //procRqst.Nephrology,
                                         //procRqst.Neurology,
                                         //procRqst.OtherConsults,
                                         //procRqst.OtherConsultsNotes,
                                         procRqst.AdmissionType,
                                         //procRqst.PatientExpectedStay,
                                         //procRqst.InstructionToPatient,
                                         //procRqst.AdditionalInfo,
                                         procRqst.ProcedureRequestStatus,
                                         procRqst.AdmissionStatus,
                                         date = procRqst.ModifiedDate == null ? procRqst.Createddate : procRqst.ModifiedDate,
                                         visit.VisitNo,
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
                                         //ApproximateDuration = PRM.ApproximateDuration,
                                         UrgencyID = PRM.UrgencyID,
                                         UrgencyType = PRM.UrgencyTypeDescription,
                                         //PreProcedureDiagnosis = PRM.PreProcedureDiagnosis,
                                         //ICDCode = PRM.ICDCode,
                                         //PlannedProcedure = PRM.PlannedProcedure,
                                         ProcedureName = PRM.ProcedureName,
                                         ProcedureNameDesc = PRM.ProcedureDesc,
                                         //CPTCode = PRM.CPTCode,
                                         //AnesthesiaFitnessRequired = PRM.AnesthesiaFitnessRequired,
                                         //AnesthesiaFitnessRequiredDesc = PRM.AnesthesiaFitnessRequiredDesc,
                                         //BloodRequired = PRM.BloodRequired,
                                         //BloodRequiredDesc = PRM.BloodRequiredDesc,
                                         //ContinueMedication = PRM.ContinueMedication,
                                         //StopMedication = PRM.StopMedication,
                                         //SpecialPreparation = PRM.SpecialPreparation,
                                         //SpecialPreparationNotes = PRM.SpecialPreparationNotes,
                                         //DietInstructions = PRM.DietInstructions,
                                         //DietInstructionsNotes = PRM.DietInstructionsNotes,
                                         //OtherInstructions = PRM.OtherInstructions,
                                         //OtherInstructionsNotes = PRM.OtherInstructionsNotes,
                                         //Cardiology = PRM.Cardiology,
                                         //Nephrology = PRM.Nephrology,
                                         //Neurology = PRM.Neurology,
                                         //OtherConsults = PRM.OtherConsults,
                                         //OtherConsultsNotes = PRM.OtherConsultsNotes,
                                         //AdmissionType = PRM.AdmissionType,
                                         //AdmissionTypeName = PRM.AdmissionTypeDesc,
                                         //PatientExpectedStay = PRM.PatientExpectedStay,
                                         //InstructionToPatient = PRM.InstructionToPatient,
                                         //AdditionalInfo = PRM.AdditionalInfo,
                                         ProcedureRequestStatus = PRM.ProcedureRequestStatus,
                                         AdmissionStatus = PRM.AdmissionStatus,
                                         AdmissionStatusDesc = this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == PRM.AdmissionStatus).AdmissionStatusDesc,
                                         VisitDateandTime = PRM.VisitDate.Date.ToString("dd/MM/yyyy") + " " + PRM.VisitDate.TimeOfDay.ToString()

                                     }).ToList();

            List<ProcedureRequestModel> procReqCollection = new List<ProcedureRequestModel>();
            var user = this.utilService.GetUserIDofProvider();
            var facList = this.utilService.GetFacilitiesforUser();

            if (procedureRequests.Count() > 0)
            {
                if (user != "" && user != null)
                {
                    if (searchModel.FacilityId == 0)
                    {
                        if (facList.Count() > 0)
                        {
                            procReqCollection = (from proReq in procedureRequests
                                                 join fac in facList on proReq.FacilityId equals fac.FacilityId
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on proReq.VisitID equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select proReq).ToList();
                        }
                        else
                        {
                            procReqCollection = (from proReq in procedureRequests
                                                 join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                                 on proReq.VisitID equals vis.VisitId
                                                 join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                                 on vis.ProviderID equals prov.ProviderID
                                                 select proReq).ToList();
                        }
                    }
                    else
                    {
                        procReqCollection = (from proReq in procedureRequests.Where(x => x.FacilityId == searchModel.FacilityId)
                                             join fac in facList on proReq.FacilityId equals fac.FacilityId
                                             join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                             on proReq.VisitID equals vis.VisitId
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on vis.ProviderID equals prov.ProviderID
                                             select proReq).ToList();
                    }
                }
                else
                {
                    procReqCollection = (from proReq in procedureRequests
                                         join fac in facList on proReq.FacilityId equals fac.FacilityId
                                         select proReq).ToList();
                }
            }
            else
            {
                procReqCollection = procedureRequests;
            }

            return procReqCollection;
        }

        ///// <summary>
        ///// Get Procedure Request list for CallCenter
        ///// </summary>
        ///// <param>Nil</param>
        ///// <returns>List<ProcedureRequestModel>. if collection of ProcedureRequestModel for CallCenter = success. else = failure</returns>
        public List<ProcedureRequestModel> ProcedureRequestListforCallCenter()
        {
            var procedureRequests = (from procRqst in this.uow.GenericRepository<ProcedureRequest>().Table().Where(x => x.IsActive != false)

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
                                         procRqst.UrgencyID,
                                         procRqst.ProcedureName,
                                         procRqst.AdmissionType,
                                         procRqst.ProcedureRequestStatus,
                                         procRqst.AdmissionStatus,
                                         date = procRqst.ModifiedDate == null ? procRqst.Createddate : procRqst.ModifiedDate,
                                         visit.VisitNo,
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
                                         UrgencyID = PRM.UrgencyID,
                                         UrgencyType = PRM.UrgencyTypeDescription,
                                         ProcedureName = PRM.ProcedureName,
                                         ProcedureNameDesc = PRM.ProcedureDesc,
                                         ProcedureRequestStatus = PRM.ProcedureRequestStatus,
                                         AdmissionStatus = PRM.AdmissionStatus,
                                         AdmissionStatusDesc = this.uow.GenericRepository<AdmissionStatus>().Table().FirstOrDefault(x => x.AdmissionStatusID == PRM.AdmissionStatus).AdmissionStatusDesc,
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
                        procReqCollection = (from proReq in procedureRequests
                                             join fac in facList on proReq.FacilityId equals fac.FacilityId
                                             join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                             on proReq.VisitID equals vis.VisitId
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on vis.ProviderID equals prov.ProviderID
                                             select proReq).ToList();
                    }
                    else
                    {
                        procReqCollection = (from proReq in procedureRequests
                                             join vis in this.uow.GenericRepository<PatientVisit>().Table()
                                             on proReq.VisitID equals vis.VisitId
                                             join prov in this.uow.GenericRepository<Provider>().Table().Where(x => x.UserID.ToLower().Trim() == user.ToLower().Trim())
                                             on vis.ProviderID equals prov.ProviderID
                                             select proReq).ToList();
                    }
                }
                else
                {
                    procReqCollection = (from proReq in procedureRequests
                                         join fac in facList on proReq.FacilityId equals fac.FacilityId
                                         select proReq).ToList();
                }
            }
            else
            {
                procReqCollection = procedureRequests;
            }

            return procReqCollection;
        }

        ///// <summary>
        ///// Get Procedure Request Counts for CallCenter
        ///// </summary>
        ///// <param>Nil</param>
        ///// <returns>RequestCountModel. if Counts of Procedure Request with Different Statuses= success. else = failure</returns>
        public RequestCountModel GetRequestCountsforCallCenter()
        {
            RequestCountModel requestCounts = new RequestCountModel();
            var procRequests = this.ProcedureRequestListforCallCenter().Where(x => x.ProcedureRequestStatus.ToLower().Trim() == "requested").ToList();

            requestCounts.Totalcount = procRequests.Count();
            requestCounts.TodayRequestedcount = procRequests.Where(x => x.ProcedureRequestedDate.Date == DateTime.Now.Date).ToList().Count();

            return requestCounts;
        }

        ///// <summary>
        ///// Get Call Center data for given Id
        ///// </summary>
        ///// <param>int procedureRequestId</param>
        ///// <returns>List<CallCenterModel>. if CallCenter data for given procedureRequestId = success. else = failure</returns>
        public CallCenterModel GetCallCenterDataByProcedureRequestId(int procedureRequestId)
        {
            var procReqRecord = this.uow.GenericRepository<ProcedureRequest>().Table().Where(x => x.ProcedureRequestId == procedureRequestId).FirstOrDefault();

            var visit = this.uow.GenericRepository<PatientVisit>().Table().FirstOrDefault(x => x.VisitId == procReqRecord.VisitID);

            var callCenterdata = (from call in this.uow.GenericRepository<CallCenter>().Table().Where(x => x.ProcedureReqID == procedureRequestId)
                                  join pat in this.uow.GenericRepository<Patient>().Table()
                                  on call.PatientId equals pat.PatientId
                                  join proReq in this.uow.GenericRepository<ProcedureRequest>().Table()
                                  on call.ProcedureReqID equals proReq.ProcedureRequestId
                                  select new
                                  {
                                      call.CallCenterId,
                                      call.PatientId,
                                      call.AppointmentID,
                                      call.NumberCalled,
                                      call.WhomAnswered,
                                      call.CallStatus,
                                      call.AppProcStatus,
                                      call.MessagePassed,
                                      call.AdditionalInformation,
                                      pat.PatientFirstName,
                                      pat.PatientMiddleName,
                                      pat.PatientLastName

                                  }).AsEnumerable().Select(CCM => new CallCenterModel
                                  {
                                      CallCenterId = CCM.CallCenterId,
                                      PatientId = CCM.PatientId,
                                      PatientName = CCM.PatientFirstName + "" + CCM.PatientMiddleName + "" + CCM.PatientLastName,
                                      AppointmentID = CCM.AppointmentID,
                                      FacilityId = visit.FacilityID > 0 ? visit.FacilityID.Value : 0,
                                      facilityName = visit.FacilityID > 0 ? this.uow.GenericRepository<Facility>().Table().FirstOrDefault(x => x.FacilityId == visit.FacilityID).FacilityName : "",
                                      NumberCalled = CCM.NumberCalled,
                                      WhomAnswered = CCM.WhomAnswered,
                                      CallStatus = CCM.CallStatus,
                                      AppProcStatus = CCM.AppProcStatus,
                                      MessagePassed = CCM.MessagePassed,
                                      AdditionalInformation = CCM.AdditionalInformation

                                  }).FirstOrDefault();

            return callCenterdata;
        }

        #endregion

    }
}
