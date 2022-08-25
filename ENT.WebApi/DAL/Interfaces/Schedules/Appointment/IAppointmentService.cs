using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IAppointmentService
    {
        #region Master Data

        List<AppointmentStatus> GetAllAppointmentStatuses();
        List<AppointmentType> GetAllAppointmentTypes();
        List<Facility> GetFacilitiesforAppointment();
        List<Provider> GetProvidersforAppointment();
        List<Provider> GetProvidersbyFacility(int facilityID);
        List<TreatmentCode> GetTreatmentCodes(string searchKey);
        List<ProviderSpecialityModel> GetProviderSpecialities();
        List<string> GetAppointmentNumber();
        List<string> GetAppointmentNumbersbySearch(string searchKey);

        #endregion

        #region Appointment Search and Count

        AppointmentCountModel TodayAppointmentCounts();
        List<PatientAppointmentModel> SearchAppointments(SearchModel searchModel);
        List<Patient> GetPatientsForAppointmentSearch(string searchKey);
        List<ProviderModel> GetProvidersforAppointmentSearch(string searchKey);

        #endregion

        List<PatientAppointmentModel> GetAllAppointments();
        PatientAppointmentModel GetAppointmentById(int AppointmentId);
        PatientAppointmentModel AddUpdateAppointment(PatientAppointmentModel appointData);
        List<PatientAppointmentModel> GetAppointmentHistoryForPatient(int PatientId);
        PatientAppointmentModel DeleteOrCancelAppointment(int AppointmentId);
        string DeleteOrCancelAppointmentSeries(IEnumerable<PatientAppointmentModel> AppointmentSeries);
        List<PatientAppointmentModel> GetToDayAppointments();
        IEnumerable<PatientAppointmentModel> AddUpdateAppointmentSeries(IEnumerable<PatientAppointmentModel> appointmentSeries);

        AvailabilityModel AvailabilityStatus(AvailabilityModel availModel);
        List<TimingModel> GetTimingsforAppointment(string AppointDate, int ProviderID, int facilityID);
        List<PatientAppointmentModel> GetAppointmentsForCalendar(string viewMode, string date);//, int providerId);
        List<DateTime> GetDatesForProvider(int ProviderId);
    }
}
