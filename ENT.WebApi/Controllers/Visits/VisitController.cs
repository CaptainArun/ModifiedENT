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
    public class VisitController : Controller
    {
        public readonly IVisitService iVisitService;

        public VisitController(IVisitService _iVisitService)
        {
            iVisitService = _iVisitService;
        }

        #region Master Data

        [HttpGet]
        public List<PatientArrivalCondition> GetAllArrivalConditions()
        {
            return this.iVisitService.GetAllArrivalConditions();
        }

        [HttpGet]
        public List<UrgencyType> GetAllUrgencyTypes()
        {
            return this.iVisitService.GetAllUrgencyTypes();
        }

        [HttpGet]
        public List<VisitStatus> GetAllVisitStatuses()
        {
            return this.iVisitService.GetAllVisitStatuses();
        }

        [HttpGet]
        public List<RecordedDuring> GetAllRecordedDuringOptions()
        {
            return this.iVisitService.GetAllRecordedDuringOptions();
        }

        [HttpGet]
        public List<VisitType> GetAllVisitTypes()
        {
            return this.iVisitService.GetAllVisitTypes();
        }

        [HttpGet]
        public List<Facility> GetFacilitiesforVisits()
        {
            return this.iVisitService.GetFacilitiesforVisits();
        }

        [HttpGet]
        public List<Provider> GetProvidersforVisits()
        {
            return this.iVisitService.GetProvidersforVisits();
        }

        [HttpGet]
        public List<string> GetReceiptNumber()
        {
            return this.iVisitService.GetReceiptNumber();
        }

        [HttpGet]
        public List<string> GetBillNumber()
        {
            return this.iVisitService.GetBillNumber();
        }

        [HttpGet]
        public List<ConsultationType> GetConsultationTypesForVisit()
        {
            return this.iVisitService.GetConsultationTypesForVisit();
        }

        [HttpGet]
        public List<AppointmentBooked> GetAppointmentBookedListForVisit()
        {
            return this.iVisitService.GetAppointmentBookedListForVisit();
        }

        [HttpGet]
        public List<PaymentType> GetPaymentTypeListforVisit()
        {
            return this.iVisitService.GetPaymentTypeListforVisit();
        }

        [HttpGet]
        public List<Provider> GetProvidersbyFacility(int facilityID)
        {
            return this.iVisitService.GetProvidersbyFacility(facilityID);
        }

        [HttpGet]
        public List<string> GetAppointmentNumbersbySearch(string searchKey)
        {
            return this.iVisitService.GetAppointmentNumbersbySearch(searchKey);
        }

        [HttpGet]
        public List<string> GetVisitNumbersbySearch(string searchKey)
        {
            return this.iVisitService.GetVisitNumbersbySearch(searchKey);
        }

        #endregion

        [HttpPost]
        public PatientVisitModel AddUpdateVisit(PatientVisitModel visitData)
        {
            return this.iVisitService.AddUpdateVisit(visitData);
        }

        [HttpGet]
        public PatientVisitModel GetPatientVisitById(int PatientVisitId)
        {
            return this.iVisitService.GetPatientVisitById(PatientVisitId);
        }

        [HttpGet]
        public List<PatientVisitModel> GetAllPatientVisits()
        {
            return this.iVisitService.GetAllPatientVisits();
        }

        #region Visit Search and Count

        [HttpGet]
        public List<Patient> GetPatientsForVisitSearch(string searchKey)
        {
            return this.iVisitService.GetPatientsForVisitSearch(searchKey);
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforVisitSearch(string searchKey)
        {
            return this.iVisitService.GetProvidersforVisitSearch(searchKey);
        }

        [HttpPost]
        public List<PatientVisitModel> GetPatientVisitsbySearch(SearchModel searchModel)
        {
            return this.iVisitService.GetPatientVisitsbySearch(searchModel);
        }

        [HttpGet]
        public VisitCountModel TodayVisitCounts()
        {
            return this.iVisitService.TodayVisitCounts();
        }

        [HttpGet]
        public VisitCountModel VisitCountsforPatient(int patientId)
        {
            return this.iVisitService.VisitCountsforPatient(patientId);
        }

        #endregion

        [HttpGet]
        public List<PatientVisitModel> GetVisitsbyPatientID(int PatientID)
        {
            return this.iVisitService.GetVisitsbyPatientID(PatientID);
        }

        #region Visit Payment

        [HttpGet]
        public List<BillingSetupMasterModel> GetbillingParticularsforVisitPayment(int departmentID, string searchKey)
        {
            return this.iVisitService.GetbillingParticularsforVisitPayment(departmentID, searchKey);
        }

        [HttpPost]
        public VisitPaymentModel AddUpdateVisitPayment(VisitPaymentModel paymentModel)
        {
            return this.iVisitService.AddUpdateVisitPayment(paymentModel);
        }

        [HttpGet]
        public List<VisitPaymentModel> GetAllVisitPayments()
        {
            return this.iVisitService.GetAllVisitPayments();
        }

        [HttpGet]
        public List<VisitPaymentModel> GetVisitPaymentsforVisit(int VisitId)
        {
            return this.iVisitService.GetVisitPaymentsforVisit(VisitId);
        }

        [HttpGet]
        public VisitPaymentModel GetPaymentRecordforVisitbyID(int visitId)
        {
            return this.iVisitService.GetPaymentRecordforVisitbyID(visitId);
        }

        [HttpGet]
        public List<VisitPaymentModel> GetVisitPaymentsforPatient(int PatientId)
        {
            return this.iVisitService.GetVisitPaymentsforPatient(PatientId);
        }

        [HttpGet]
        public VisitPaymentModel GetVisitPaymentRecordbyID(int visitPaymentId)
        {
            return this.iVisitService.GetVisitPaymentRecordbyID(visitPaymentId);
        }

        #endregion

        #region Appointment - Visit Conversion

        [HttpPost]
        public List<PatientAppointmentModel> GetAppointmentsforVisitbySearch(SearchModel searchModel)
        {
            return this.iVisitService.GetAppointmentsforVisitbySearch(searchModel);
        }

        [HttpGet]
        public PatientAppointmentModel GetAppointmentRecordById(int AppointmentId)
        {
            return this.iVisitService.GetAppointmentRecordById(AppointmentId);
        }

        [HttpGet]
        public List<string> ConfirmVisitfromAppointment(int appointmentId)
        {
            List<string> result = new List<string>();

            var status = this.iVisitService.ConfirmVisitfromAppointment(appointmentId);
            result.Add(status);

            return result;
        }

        [HttpGet]
        public List<string> CancelAppointmentfromVisit(int appointmentId)
        {
            List<string> result = new List<string>();

            var status = this.iVisitService.CancelAppointmentfromVisit(appointmentId);
            result.Add(status);

            return result;
        }

        [HttpGet]
        public AppointmentCountModel TodayAppointmentCountsforVisit()
        {
            return this.iVisitService.TodayAppointmentCountsforVisit();
        }

        #endregion

        #region Visit number Auto Generator

        [HttpGet]
        public List<string> GetVisitNo()
        {
            return this.iVisitService.GetVisitNo();
        }
        #endregion
    }
}