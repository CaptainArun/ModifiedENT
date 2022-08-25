using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Authorization;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AppointmentController : Controller
    {
        public readonly IAppointmentService iAppointmentService;

        public AppointmentController(IAppointmentService _iAppointmentService)
        {
            iAppointmentService = _iAppointmentService;
        }

        #region Master Data

        [HttpGet]
        public List<AppointmentStatus> GetAllAppointmentStatuses()
        {
            return this.iAppointmentService.GetAllAppointmentStatuses();
        }

        [HttpGet]
        public List<AppointmentType> GetAllAppointmentTypes()
        {
            return this.iAppointmentService.GetAllAppointmentTypes();
        }

        [HttpGet]
        public List<Facility> GetFacilitiesforAppointment()
        {
            return this.iAppointmentService.GetFacilitiesforAppointment();
        }

        [HttpGet]
        public List<Provider> GetProvidersforAppointment()
        {
            return this.iAppointmentService.GetProvidersforAppointment();
        }

        [HttpGet]
        public List<Provider> GetProvidersbyFacility(int facilityID)
        {
            return this.iAppointmentService.GetProvidersbyFacility(facilityID);
        }

        [HttpGet] 
        public List<TreatmentCode> GetTreatmentCodes(string searchKey)
        {
            return this.iAppointmentService.GetTreatmentCodes(searchKey);
        }

        [HttpGet]
        public List<string> GetAppointmentNumbersbySearch(string searchKey)
        {
            return this.iAppointmentService.GetAppointmentNumbersbySearch(searchKey);
        }

        #endregion

        [HttpGet]
        public List<PatientAppointmentModel> GetAllAppointments()
        {
            return this.iAppointmentService.GetAllAppointments();
        }

        [HttpGet]
        public PatientAppointmentModel GetAppointmentById(int AppointmentId)
        {
            return this.iAppointmentService.GetAppointmentById(AppointmentId);
        }

        [HttpPost]
        public PatientAppointmentModel AddUpdateAppointment(PatientAppointmentModel appointData)
        {
            return this.iAppointmentService.AddUpdateAppointment(appointData);
        }

        #region Appointment Search and Count

        [HttpGet]
        public AppointmentCountModel TodayAppointmentCounts()
        {
            return this.iAppointmentService.TodayAppointmentCounts();
        }

        [HttpPost]
        public List<PatientAppointmentModel> SearchAppointments(SearchModel searchModel)
        {
            return this.iAppointmentService.SearchAppointments(searchModel);
        }

        [HttpGet]
        public List<Patient> GetPatientsForAppointmentSearch(string searchKey)
        {
            return this.iAppointmentService.GetPatientsForAppointmentSearch(searchKey);
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforAppointmentSearch(string searchKey)
        {
            return this.iAppointmentService.GetProvidersforAppointmentSearch(searchKey);
        }

        #endregion

        [HttpGet]
        public List<PatientAppointmentModel> GetAppointmentHistoryForPatient(int PatientId)
        {
            return this.iAppointmentService.GetAppointmentHistoryForPatient(PatientId);
        }

        [HttpGet]
        public PatientAppointmentModel DeleteOrCancelAppointment(int AppointmentId)
        {
            return this.iAppointmentService.DeleteOrCancelAppointment(AppointmentId);
        }

        [HttpGet]
        public List<PatientAppointmentModel> GetToDayAppointments()
        {
            return this.iAppointmentService.GetToDayAppointments();
        }

        [HttpPost]
        public string DeleteOrCancelAppointmentSeries(IEnumerable<PatientAppointmentModel> AppointmentSeries)
        {
            return this.iAppointmentService.DeleteOrCancelAppointmentSeries(AppointmentSeries);
        }

        [HttpPost]
        public IEnumerable<PatientAppointmentModel> AddUpdateAppointmentSeries(IEnumerable<PatientAppointmentModel> appointmentSeries)
        {
            return this.iAppointmentService.AddUpdateAppointmentSeries(appointmentSeries);
        }

        [HttpGet]
        public List<ProviderSpecialityModel> GetProviderSpecialities()
        {
            return this.iAppointmentService.GetProviderSpecialities();
        }

        [HttpPost]
        public AvailabilityModel AvailabilityStatus(AvailabilityModel availModel)
        {                       
            return this.iAppointmentService.AvailabilityStatus(availModel);
        }

        [HttpGet]
        public List<TimingModel> GetTimingsforAppointment(string AppointDate, int ProviderID, int facilityID)
        {
            return this.iAppointmentService.GetTimingsforAppointment(AppointDate, ProviderID, facilityID);
        }

        [HttpGet]
        public List<PatientAppointmentModel> GetAppointmentsForCalendar(string viewMode, string date)//, int providerId)
        {
            return this.iAppointmentService.GetAppointmentsForCalendar(viewMode, date);//, providerId);
        }

        [HttpGet]
        public List<DateTime> GetDatesForProvider(int ProviderId)
        {
            return this.iAppointmentService.GetDatesForProvider(ProviderId);
        }

        [HttpGet]
        public List<string> GetAppointmentNumber()
        {
            return this.iAppointmentService.GetAppointmentNumber();
        }
    }
}