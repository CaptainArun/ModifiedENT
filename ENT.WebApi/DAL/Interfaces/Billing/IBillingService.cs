using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IBillingService
    {
        #region Master Data

        List<Departments> GetDepartmentList(string searchKey);
        List<Departments> GetDepartmentsfromMaster(string searchKey);
        List<BillingMasterStatus> GetAllBillingStatuses();
        List<string> GetReceiptNumberforBilling();
        List<string> GetBillNumberforBilling();
        List<PaymentType> GetPaymentTypeListforBilling();

        #endregion

        #region Billing Master

        List<BillingMasterModel> GetSubMasterallowedBillingTypes(int departmentID, string searchKey);
        List<BillingMasterModel> GetMasterBillingTypes(int departmentID, string searchKey);
        BillingMasterModel AddUpdateBillingMasterData(BillingMasterModel billingMasterModel);
        List<BillingMasterModel> GetBillingMasterList();
        BillingMasterModel GetBillingMasterRecordbyID(int billingMasterID);
        BillingMaster DeleteBillingMasterRecord(int billingMasterID);

        #endregion

        #region Billing Sub Master

        BillingSubMasterModel AddUpdateBillingSubMasterData(BillingSubMasterModel billingsubMasterModel);
        List<BillingSubMasterModel> GetBillingSubMasterList();
        BillingSubMasterModel GetBillingSubMasterRecordbyID(int billingSubMasterID);
        List<string> GetSubMasterBillingTypesforMasterBillingType(int masterBillingID, string searchKey);
        BillingSubMaster DeleteBillingSubMasterRecord(int billingSubMasterID);

        #endregion

        #region Billing Setup Master

        BillingSetupMasterModel AddUpdateBillingSetupMasterData(BillingSetupMasterModel billingSetupMasterModel);
        List<BillingSetupMasterModel> GetAllSetupMasterData();
        BillingSetupMasterModel GetSetupMasterRecordbyID(int setupMasterID);
        BillingSetupMaster DeleteSetUpMasterRecord(int setupMasterID);

        #endregion

        #region Billing payment

        #region Common Payment GridList

        List<CommonPaymentModel> GetAllPaymentList();
        AdmissionPayment DeleteAdmissionPaymentRecord(int admissionPaymentId);
        VisitPayment DeleteVisitPaymentRecord(int visitPaymentId);

        #endregion

        List<BillingSetupMasterModel> GetbillingParticulars(int departmentID, string searchKey);
        List<Patient> GetPatientsForBillingandPaymentSearch(string searchKey);
        PatientDemographicModel GetPatientRecordById(int PatientId);

        #region Visit Payment - Billing Payment

        VisitPaymentModel AddUpdateVisitPaymentfromBilling(VisitPaymentModel paymentModel);
        VisitPaymentModel GetVisitPaymentRecordbyID(int visitPaymentId);

        #endregion

        #region Admission Payment - Billing Payment

        AdmissionPaymentModel AddUpdateAdmissionPaymentfromBilling(AdmissionPaymentModel paymentModel);
        AdmissionPaymentModel GetAdmissionPaymentRecordbyID(int admissionPaymentID);

        #endregion

        #region Refund - Billing Payment and Search

        List<string> GetReceiptNumbers(string searchKey);
        List<CommonPaymentDetailsModel> GetAllPaymentParticularsforRefundbySearch(SearchModel searchModel);
        List<CommonPaymentDetailsModel> GetAllPaymentParticularsforPatient(int patientID);
        IEnumerable<CommonPaymentDetailsModel> UpdateRefundParticularDetails(IEnumerable<CommonPaymentDetailsModel> refundPaymentCollection);

        #endregion

        VisitandAdmissionModel GetVisitorAdmissionDetailsforPaymentScreen(string billType, int patientId);

        #endregion
    }
}
