using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface IELabService
    {
        #region Master Data

        List<Departments> GetDepartmentListforELab(string searchKey);
        List<Departments> GetDepartmentsfromMasterforELab(string searchKey);
        List<eLabMasterStatus> GetStatusesforELab();
        List<UrgencyType> GetUrgencyTypesforELab();
        List<string> GetLabOrderNumber();

        #endregion

        #region eLab Master

        eLabMasterModel AddUpdateELabMasterData(eLabMasterModel elabMasterModel);
        List<eLabMasterModel> GetSubMasterallowedELabTypes(int departmentID, string searchKey);
        List<eLabMasterModel> GetELabMasterList();
        List<eLabMasterModel> GetELabMasterListbySearch(string searchKey);
        List<eLabMasterModel> GetMasterELabTypes(int departmentID, string searchKey);
        eLabMasterModel GetELabMasterRecord(int eLabMasterId);
        eLabMaster DeleteELabMasterRecord(int eLabMasterId);

        #endregion

        #region eLab Sub Master

        eLabSubMasterModel AddUpdateELabSubMasterData(eLabSubMasterModel elabSubMasterModel);
        List<eLabSubMasterModel> GetELabSubMasterList();
        List<eLabSubMasterModel> GetELabSubMasterListbySearch(string searchKey);
        eLabSubMasterModel GetELabSubMasterRecord(int eLabSubMasterId);
        eLabSubMaster DeleteELabSubMasterRecord(int eLabSubMasterId);

        #endregion

        #region eLab Setup Master

        eLabSetupMasterModel AddUpdateELabSetupMasterData(eLabSetupMasterModel elabSetupMasterModel);
        List<eLabSetupMasterModel> GetELabSetupMasterList();
        List<eLabSetupMasterModel> GetELabSetupMasterListbySearch(string searchKey);
        eLabSetupMasterModel GetELabSetupMasterRecordbyID(int eLabSetupMasterId);
        eLabSetupMaster DeleteELabSetupMasterRecord(int eLabSetupMasterId);

        #endregion

        #region Search and Count

        List<Patient> GetPatientsForELab(string searchKey);
        List<ProviderModel> GetProvidersforELab(string searchKey);
        List<string> GetLabOrderNumbersbySearch(string searchKey);
        List<string> GetLabOrderStatuses();
        List<eLabOrderModel> GetELabOrdersbySearch(SearchModel searchModel);
        ELabCountModel GetELabCounts();

        #endregion

        #region patient Data

        PatientDemographicModel GetPatientDetailById(int PatientId);

        #endregion

        #region E Lab

        List<PatientVisitModel> GetVisitsbyPatientforELab(int PatientId);
        eLabOrderModel AddUpdateELabOrder(eLabOrderModel elabOrder);
        eLabOrderStatusModel AddUpdateELabOrderStatusReport(eLabOrderStatusModel orderStatusModel);
        eLabOrderStatusModel GetELabOrderStatusRecord(int labOrderId);
        string LabOrderStatusReportSignOff(string Username, string Password, int labOrderStatusId);
        List<eLabOrderModel> GetELabOrdersforPatient(int patientId);
        List<eLabOrderModel> GetAllELabOrders();
        List<eLabOrderModel> GetELabOrdersforHomeGrid();
        eLabOrderModel GetELabOrderbyID(int LabOrderId);
        eLabOrderModel GetELabOrderforOrderNo(string orderNo);
        eLabOrder CancelLabOrder(string orderNo);
        eLabOrder DeleteLabOrderbyId(int labOrderId);
        List<eLabOrderItemsModel> GetELabOrderItems(int labOrderId);

        #endregion

        #region e Lab Request

        List<eLabRequestModel> GetELabRequestsforPatient(int patientId);
        List<eLabRequestModel> GetAllELabRequests();
        eLabRequestModel GetELabRequestbyId(int labRequestId);
        eLabRequest ConfirmRequest(int labRequestId);
        eLabRequest CancelELabRequest(int labRequestId);
        string UserVerification(string userName, string Password);

        #endregion

        #region File Access

        List<clsViewFile> GetFile(string Id, string screen);
        List<string> DeleteFile(string path, string fileName);
        #endregion

        #region Mail and SMS

        MessageModel SendMail(string eMailId, int labOrderId);

        #endregion

    }
}
