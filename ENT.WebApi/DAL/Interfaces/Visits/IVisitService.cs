using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IVisitService
    {
        #region Master Data

        List<PatientArrivalCondition> GetAllArrivalConditions();
        List<UrgencyType> GetAllUrgencyTypes();
        List<VisitStatus> GetAllVisitStatuses();
        List<RecordedDuring> GetAllRecordedDuringOptions();
        List<VisitType> GetAllVisitTypes();
        List<Facility> GetFacilitiesforVisits();
        List<Provider> GetProvidersforVisits();
        List<string> GetReceiptNumber();
        List<string> GetBillNumber();
        List<string> GetVisitNo();
        List<ConsultationType> GetConsultationTypesForVisit();
        List<AppointmentBooked> GetAppointmentBookedListForVisit();
        List<PaymentType> GetPaymentTypeListforVisit();
        List<Provider> GetProvidersbyFacility(int facilityID);
        List<string> GetVisitNumbersbySearch(string searchKey);
        List<string> GetAppointmentNumbersbySearch(string searchKey);

        #endregion


        PatientVisitModel AddUpdateVisit(PatientVisitModel visitData);
        PatientVisitModel GetPatientVisitById(int PatientVisitId);
        List<PatientVisitModel> GetAllPatientVisits();

        #region Visit Search and Count

        List<Patient> GetPatientsForVisitSearch(string searchKey);
        List<ProviderModel> GetProvidersforVisitSearch(string searchKey);
        List<PatientVisitModel> GetPatientVisitsbySearch(SearchModel searchModel);
        VisitCountModel TodayVisitCounts();
        VisitCountModel VisitCountsforPatient(int patientId);

        #endregion

        List<PatientVisitModel> GetVisitsbyPatientID(int PatientID);

        #region Visit Payment

        List<BillingSetupMasterModel> GetbillingParticularsforVisitPayment(int departmentID, string searchKey);
        VisitPaymentModel AddUpdateVisitPayment(VisitPaymentModel paymentModel);
        List<VisitPaymentModel> GetAllVisitPayments();
        List<VisitPaymentModel> GetVisitPaymentsforVisit(int VisitId);
        VisitPaymentModel GetPaymentRecordforVisitbyID(int visitId);
        List<VisitPaymentModel> GetVisitPaymentsforPatient(int PatientId);
        VisitPaymentModel GetVisitPaymentRecordbyID(int visitPaymentId);

        #endregion

        #region Appointment - Visit Conversion

        List<PatientAppointmentModel> GetAppointmentsforVisitbySearch(SearchModel searchModel);
        PatientAppointmentModel GetAppointmentRecordById(int AppointmentId);
        string ConfirmVisitfromAppointment(int appointmentId);
        string CancelAppointmentfromVisit(int appointmentId);
        AppointmentCountModel TodayAppointmentCountsforVisit();

        #endregion
    }
}
