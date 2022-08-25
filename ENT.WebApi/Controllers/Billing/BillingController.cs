using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Authorization;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class BillingController : Controller
    {
        public readonly IBillingService iBillingService;

        public BillingController(IBillingService _iBillingService)
        {
            iBillingService = _iBillingService;
        }

        #region Master Data

        [HttpGet]
        public List<Departments> GetDepartmentList(string searchKey)
        {
            return this.iBillingService.GetDepartmentList(searchKey);
        }

        [HttpGet]
        public List<Departments> GetDepartmentsfromMaster(string searchKey)
        {
            return this.iBillingService.GetDepartmentsfromMaster(searchKey);
        }

        [HttpGet]
        public List<BillingMasterStatus> GetAllBillingStatuses()
        {
            return this.iBillingService.GetAllBillingStatuses();
        }

        [HttpGet]
        public List<string> GetReceiptNumberforBilling()
        {
            return this.iBillingService.GetReceiptNumberforBilling();
        }

        [HttpGet]
        public List<string> GetBillNumberforBilling()
        {
            return this.iBillingService.GetBillNumberforBilling();
        }

        [HttpGet]
        public List<PaymentType> GetPaymentTypeListforBilling()
        {
            return this.iBillingService.GetPaymentTypeListforBilling();
        }

        #endregion

        #region Billing Master
        [HttpGet]
        public List<BillingMasterModel> GetSubMasterallowedBillingTypes(int departmentID, string searchKey)
        {
            return this.iBillingService.GetSubMasterallowedBillingTypes(departmentID, searchKey);
        }

        [HttpGet]
        public List<BillingMasterModel> GetMasterBillingTypes(int departmentID, string searchKey)
        {
            return this.iBillingService.GetMasterBillingTypes(departmentID, searchKey);
        }

        [HttpPost]
        public BillingMasterModel AddUpdateBillingMasterData(BillingMasterModel billingMasterModel)
        {
            return this.iBillingService.AddUpdateBillingMasterData(billingMasterModel);
        }

        [HttpGet]
        public List<BillingMasterModel> GetBillingMasterList()
        {
            return this.iBillingService.GetBillingMasterList();
        }

        [HttpGet]
        public BillingMasterModel GetBillingMasterRecordbyID(int billingMasterID)
        {
            return this.iBillingService.GetBillingMasterRecordbyID(billingMasterID);
        }

        [HttpGet]
        public BillingMaster DeleteBillingMasterRecord(int billingMasterID)
        {
            return this.iBillingService.DeleteBillingMasterRecord(billingMasterID);
        }

        #endregion

        #region Billing Sub Master

        [HttpPost]
        public BillingSubMasterModel AddUpdateBillingSubMasterData(BillingSubMasterModel billingsubMasterModel)
        {
            return this.iBillingService.AddUpdateBillingSubMasterData(billingsubMasterModel);
        }

        [HttpGet]
        public List<BillingSubMasterModel> GetBillingSubMasterList()
        {
            return this.iBillingService.GetBillingSubMasterList();
        }

        [HttpGet]
        public BillingSubMasterModel GetBillingSubMasterRecordbyID(int billingSubMasterID)
        {
            return this.iBillingService.GetBillingSubMasterRecordbyID(billingSubMasterID);
        }

        [HttpGet]
        public List<string> GetSubMasterBillingTypesforMasterBillingType(int masterBillingID, string searchKey)
        {
            return this.iBillingService.GetSubMasterBillingTypesforMasterBillingType(masterBillingID, searchKey);
        }

        [HttpGet]
        public BillingSubMaster DeleteBillingSubMasterRecord(int billingSubMasterID)
        {
            return this.iBillingService.DeleteBillingSubMasterRecord(billingSubMasterID);
        }

        #endregion

        #region Billing Setup Master

        [HttpPost]
        public BillingSetupMasterModel AddUpdateBillingSetupMasterData(BillingSetupMasterModel billingSetupMasterModel)
        {
            return this.iBillingService.AddUpdateBillingSetupMasterData(billingSetupMasterModel);
        }

        [HttpGet]
        public List<BillingSetupMasterModel> GetAllSetupMasterData()
        {
            return this.iBillingService.GetAllSetupMasterData();
        }

        [HttpGet]
        public BillingSetupMasterModel GetSetupMasterRecordbyID(int setupMasterID)
        {
            return this.iBillingService.GetSetupMasterRecordbyID(setupMasterID);
        }

        [HttpGet]
        public BillingSetupMaster DeleteSetUpMasterRecord(int setupMasterID)
        {
            return this.iBillingService.DeleteSetUpMasterRecord(setupMasterID);
        }

        #endregion

        #region Billing payment

        #region Common Payment Grid List

        [HttpGet]
        public List<CommonPaymentModel> GetAllPaymentList()
        {
            return this.iBillingService.GetAllPaymentList();
        }

        [HttpGet]
        public AdmissionPayment DeleteAdmissionPaymentRecord(int admissionPaymentId)
        {
            return this.iBillingService.DeleteAdmissionPaymentRecord(admissionPaymentId);
        }

        [HttpGet]
        public VisitPayment DeleteVisitPaymentRecord(int visitPaymentId)
        {
            return this.iBillingService.DeleteVisitPaymentRecord(visitPaymentId);
        }

        #endregion

        [HttpGet]
        public List<BillingSetupMasterModel> GetbillingParticulars(int departmentID, string searchKey)
        {
            return this.iBillingService.GetbillingParticulars(departmentID, searchKey);
        }

        [HttpGet]
        public List<Patient> GetPatientsForBillingandPaymentSearch(string searchKey)
        {
            return this.iBillingService.GetPatientsForBillingandPaymentSearch(searchKey);
        }

        [HttpGet]
        public List<CommonPaymentDetailsModel> GetAllPaymentParticularsforPatient(int patientID)
        {
            return this.iBillingService.GetAllPaymentParticularsforPatient(patientID);
        }

        [HttpGet]
        public PatientDemographicModel GetPatientRecordById(int PatientId)
        {
            return this.iBillingService.GetPatientRecordById(PatientId);
        }

        #region Visit Payment - Billing Payment

        [HttpPost]
        public VisitPaymentModel AddUpdateVisitPaymentfromBilling(VisitPaymentModel paymentModel)
        {
            return this.iBillingService.AddUpdateVisitPaymentfromBilling(paymentModel);
        }

        [HttpGet]
        public VisitPaymentModel GetVisitPaymentRecordbyID(int visitPaymentId)
        {
            return this.iBillingService.GetVisitPaymentRecordbyID(visitPaymentId);
        }

        #endregion

        #region Admission Payment - Billing Payment

        [HttpPost]
        public AdmissionPaymentModel AddUpdateAdmissionPaymentfromBilling(AdmissionPaymentModel paymentModel)
        {
            return this.iBillingService.AddUpdateAdmissionPaymentfromBilling(paymentModel);
        }

        [HttpGet]
        public AdmissionPaymentModel GetAdmissionPaymentRecordbyID(int admissionPaymentID)
        {
            return this.iBillingService.GetAdmissionPaymentRecordbyID(admissionPaymentID);
        }

        #endregion

        #region Refund - Billing Payment and Search

        [HttpGet]
        public List<string> GetReceiptNumbers(string searchKey)
        {
            return this.iBillingService.GetReceiptNumbers(searchKey);
        }

        [HttpPost]
        public List<CommonPaymentDetailsModel> GetAllPaymentParticularsforRefundbySearch(SearchModel searchModel)
        {
            return this.iBillingService.GetAllPaymentParticularsforRefundbySearch(searchModel);
        }

        [HttpPost]
        public IEnumerable<CommonPaymentDetailsModel> UpdateRefundParticularDetails(IEnumerable<CommonPaymentDetailsModel> refundPaymentCollection)
        {
            return this.iBillingService.UpdateRefundParticularDetails(refundPaymentCollection);
        }

        #endregion

        [HttpGet]
        public VisitandAdmissionModel GetVisitorAdmissionDetailsforPaymentScreen(string billType, int patientId)
        {
            return this.iBillingService.GetVisitorAdmissionDetailsforPaymentScreen(billType, patientId);
        }

        #endregion

    }
}
