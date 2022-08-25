using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ELabController : Controller
    {
        public readonly IELabService iELabService;
        private readonly IHostingEnvironment hostingEnvironment;
        private readonly ITenantMasterService iTenantMasterService;

        public ELabController(IELabService _iELabService, ITenantMasterService _iTenantMasterService, IHostingEnvironment _hostingEnvironment)
        {
            iELabService = _iELabService;
            hostingEnvironment = _hostingEnvironment;
            iTenantMasterService = _iTenantMasterService;
        }

        #region Master Data

        [HttpGet]
        public List<Departments> GetDepartmentListforELab(string searchKey)
        {
            return this.iELabService.GetDepartmentListforELab(searchKey);
        }

        [HttpGet]
        public List<Departments> GetDepartmentsfromMasterforELab(string searchKey)
        {
            return this.iELabService.GetDepartmentsfromMasterforELab(searchKey);
        }

        [HttpGet]
        public List<eLabMasterStatus> GetStatusesforELab()
        {
            return this.iELabService.GetStatusesforELab();
        }

        [HttpGet]
        public List<UrgencyType> GetUrgencyTypesforELab()
        {
            return this.iELabService.GetUrgencyTypesforELab();
        }

        [HttpGet]
        public List<string> GetLabOrderNumber()
        {
            return this.iELabService.GetLabOrderNumber();
        }

        #endregion

        #region eLab Master

        [HttpPost]
        public eLabMasterModel AddUpdateELabMasterData(eLabMasterModel elabMasterModel)
        {
            return this.iELabService.AddUpdateELabMasterData(elabMasterModel);
        }

        [HttpGet]
        public List<eLabMasterModel> GetSubMasterallowedELabTypes(int departmentID, string searchKey)
        {
            return this.iELabService.GetSubMasterallowedELabTypes(departmentID, searchKey);
        }

        [HttpGet]
        public List<eLabMasterModel> GetMasterELabTypes(int departmentID, string searchKey)
        {
            return this.iELabService.GetMasterELabTypes(departmentID, searchKey);
        }

        [HttpGet]
        public List<eLabMasterModel> GetELabMasterList()
        {
            return this.iELabService.GetELabMasterList();
        }

        [HttpGet]
        public List<eLabMasterModel> GetELabMasterListbySearch(string searchKey)
        {
            return this.iELabService.GetELabMasterListbySearch(searchKey);
        }

        [HttpGet]
        public eLabMasterModel GetELabMasterRecord(int eLabMasterId)
        {
            return this.iELabService.GetELabMasterRecord(eLabMasterId);
        }

        [HttpGet]
        public eLabMaster DeleteELabMasterRecord(int eLabMasterId)
        {
            return this.iELabService.DeleteELabMasterRecord(eLabMasterId);
        }

        #endregion

        #region eLab Sub Master

        [HttpPost]
        public eLabSubMasterModel AddUpdateELabSubMasterData(eLabSubMasterModel elabSubMasterModel)
        {
            return this.iELabService.AddUpdateELabSubMasterData(elabSubMasterModel);
        }

        [HttpGet]
        public List<eLabSubMasterModel> GetELabSubMasterList()
        {
            return this.iELabService.GetELabSubMasterList();
        }

        [HttpGet]
        public List<eLabSubMasterModel> GetELabSubMasterListbySearch(string searchKey)
        {
            return this.iELabService.GetELabSubMasterListbySearch(searchKey);
        }

        [HttpGet]
        public eLabSubMasterModel GetELabSubMasterRecord(int eLabSubMasterId)
        {
            return this.iELabService.GetELabSubMasterRecord(eLabSubMasterId);
        }

        [HttpGet]
        public eLabSubMaster DeleteELabSubMasterRecord(int eLabSubMasterId)
        {
            return this.iELabService.DeleteELabSubMasterRecord(eLabSubMasterId);
        }

        #endregion

        #region eLab Setup Master

        [HttpPost]
        public eLabSetupMasterModel AddUpdateELabSetupMasterData(eLabSetupMasterModel elabSetupMasterModel)
        {
            return this.iELabService.AddUpdateELabSetupMasterData(elabSetupMasterModel);
        }

        [HttpGet]
        public List<eLabSetupMasterModel> GetELabSetupMasterList()
        {
            return this.iELabService.GetELabSetupMasterList();
        }

        [HttpGet]
        public List<eLabSetupMasterModel> GetELabSetupMasterListbySearch(string searchKey)
        {
            return this.iELabService.GetELabSetupMasterListbySearch(searchKey);
        }

        [HttpGet]
        public eLabSetupMasterModel GetELabSetupMasterRecordbyID(int eLabSetupMasterId)
        {
            return this.iELabService.GetELabSetupMasterRecordbyID(eLabSetupMasterId);
        }

        [HttpGet]
        public eLabSetupMaster DeleteELabSetupMasterRecord(int eLabSetupMasterId)
        {
            return this.iELabService.DeleteELabSetupMasterRecord(eLabSetupMasterId);
        }

        #endregion

        #region Search and Count

        [HttpGet]
        public List<Patient> GetPatientsForELab(string searchKey)
        {
            return this.iELabService.GetPatientsForELab(searchKey);
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforELab(string searchKey)
        {
            return this.iELabService.GetProvidersforELab(searchKey);
        }

        [HttpGet]
        public List<string> GetLabOrderNumbersbySearch(string searchKey)
        {
            return this.iELabService.GetLabOrderNumbersbySearch(searchKey);
        }

        [HttpGet]
        public List<string> GetLabOrderStatuses()
        {
            return this.iELabService.GetLabOrderStatuses();
        }

        [HttpPost]
        public List<eLabOrderModel> GetELabOrdersbySearch(SearchModel searchModel)
        {
            return this.iELabService.GetELabOrdersbySearch(searchModel);
        }

        [HttpGet]
        public ELabCountModel GetELabCounts()
        {
            return this.iELabService.GetELabCounts();
        }

        #endregion

        #region patient Data

        [HttpGet]
        public PatientDemographicModel GetPatientDetailById(int PatientId)
        {
            return this.iELabService.GetPatientDetailById(PatientId);
        }

        #endregion

        #region E Lab

        [HttpGet]
        public List<PatientVisitModel> GetVisitsbyPatientforELab(int PatientId)
        {
            return this.iELabService.GetVisitsbyPatientforELab(PatientId);
        }

        [HttpPost]
        public eLabOrderModel AddUpdateELabOrder(eLabOrderModel elabOrder)
        {
            return this.iELabService.AddUpdateELabOrder(elabOrder);
        }

        [HttpPost]
        public eLabOrderStatusModel AddUpdateELabOrderStatusReport(eLabOrderStatusModel orderStatusModel)
        {
            return this.iELabService.AddUpdateELabOrderStatusReport(orderStatusModel);
        }

        [HttpGet]
        public eLabOrderStatusModel GetELabOrderStatusRecord(int labOrderId)
        {
            return this.iELabService.GetELabOrderStatusRecord(labOrderId);
        }

        [HttpGet]
        public List<string> LabOrderStatusReportSignOff(string Username, string Password, int labOrderStatusId)
        {
            var status = new List<string>();

            status.Add(this.iELabService.LabOrderStatusReportSignOff(Username, Password, labOrderStatusId));

            return status;
        }

        [HttpGet]
        public List<eLabOrderModel> GetELabOrdersforPatient(int patientId)
        {
            return this.iELabService.GetELabOrdersforPatient(patientId);
        }

        [HttpGet]
        public List<eLabOrderModel> GetAllELabOrders()
        {
            return this.iELabService.GetAllELabOrders();
        }

        [HttpGet]
        public List<eLabOrderModel> GetELabOrdersforHomeGrid()
        {
            return this.iELabService.GetELabOrdersforHomeGrid();
        }

        [HttpGet]
        public eLabOrderModel GetELabOrderbyID(int LabOrderId)
        {
            return this.iELabService.GetELabOrderbyID(LabOrderId);
        }

        [HttpGet]
        public eLabOrderModel GetELabOrderforOrderNo(string orderNo)
        {
            return this.iELabService.GetELabOrderforOrderNo(orderNo);
        }

        [HttpGet]
        public eLabOrder CancelLabOrder(string orderNo)
        {
            return this.iELabService.CancelLabOrder(orderNo);
        }

        [HttpGet]
        public eLabOrder DeleteLabOrderbyId(int labOrderId)
        {
            return this.iELabService.DeleteLabOrderbyId(labOrderId);
        }

        [HttpGet]
        public List<eLabOrderItemsModel> GetELabOrderItems(int labOrderId)
        {
            return this.iELabService.GetELabOrderItems(labOrderId);
        }

        #endregion

        #region e Lab Request

        [HttpGet]
        public List<eLabRequestModel> GetELabRequestsforPatient(int patientId)
        {
            return this.iELabService.GetELabRequestsforPatient(patientId);
        }

        [HttpGet]
        public List<eLabRequestModel> GetAllELabRequests()
        {
            return this.iELabService.GetAllELabRequests();
        }

        [HttpGet]
        public eLabRequestModel GetELabRequestbyId(int labRequestId)
        {
            return this.iELabService.GetELabRequestbyId(labRequestId);
        }

        [HttpGet]
        public eLabRequest ConfirmRequest(int labRequestId)
        {
            return this.iELabService.ConfirmRequest(labRequestId);
        }

        [HttpGet]
        public eLabRequest CancelELabRequest(int labRequestId)
        {
            return this.iELabService.CancelELabRequest(labRequestId);
        }

        [HttpGet]
        public List<string> UserVerification(string userName, string Password)
        {
            List<string> statusData = new List<string>();
            var status = this.iELabService.UserVerification(userName, Password);

            statusData.Add(status);

            return statusData;
        }

        #endregion

        #region File Access

        [HttpPost, DisableRequestSizeLimit]
        public List<string> UploadFiles(int Id, string screen, List<IFormFile> file)
        {
            //string projectRootPath = hostingEnvironment.ContentRootPath;
            string appRootPath = hostingEnvironment.WebRootPath;

            List<string> status = new List<string>();
            try
            {
                if (file.Count() > 0)
                {
                    if (string.IsNullOrWhiteSpace(appRootPath))
                    {
                        appRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    }

                    string fullPath = "";
                    fullPath = appRootPath + "\\Documents\\" + screen + "\\" + Id;

                    this.iTenantMasterService.WriteMultipleFiles(file, fullPath);
                    status.Add("Files successfully uploaded");

                }
                else
                {
                    status.Add("No file found");
                }
            }
            catch (Exception ex)
            {
                status.Add("Error Uploading file -" + ex.Message);
            }

            return status;
        }

        [HttpGet]
        public List<clsViewFile> GetFile(int Id, string screen)
        {
            return this.iELabService.GetFile(Id.ToString(), screen);
        }

        [HttpGet]
        public List<string> DeleteFile(string path, string fileName)
        {
            return this.iELabService.DeleteFile(path, fileName);
        }
        #endregion

        #region Mail and SMS

        [HttpGet]
        public MessageModel SendMail(string eMailId, int labOrderId)
        {
            return this.iELabService.SendMail(eMailId, labOrderId);
        }

        #endregion

    }
}
