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
    public class CallCenterController : Controller
    {
        public readonly ICallCenterService iCallCenterService;

        public CallCenterController(ICallCenterService _iCallCenterService)
        {
            iCallCenterService = _iCallCenterService;
        }

        [HttpGet]
        public AppointmentCountModel GetCallCenterCount()
        {
            return this.iCallCenterService.GetCallCenterCount();
        }

        [HttpGet]
        public List<string> GetAppointmentNumbersbySearch(string searchKey)
        {
            return this.iCallCenterService.GetAppointmentNumbersbySearch(searchKey);
        }

        [HttpGet]
        public List<string> GetVisitNumbersbySearch(string searchKey)
        {
            return this.iCallCenterService.GetVisitNumbersbySearch(searchKey);
        }

        #region Patient Appointments

        [HttpPost]
        public List<PatientAppointmentModel> SearchCallCenterAppointments(SearchModel searchModel)
        {
            return this.iCallCenterService.SearchCallCenterAppointments(searchModel);
        }

        [HttpGet]
        public List<PatientAppointmentModel> GetPreviousAppointmentHistoryForPatient(int PatientId)
        {
            return this.iCallCenterService.GetPreviousAppointmentHistoryForPatient(PatientId);
        }

        [HttpGet]
        public AppointmentCountModel GetAppointmentCountsforPatient(int PatientId)
        {
            return this.iCallCenterService.GetAppointmentCountsforPatient(PatientId);
        }

        [HttpGet]
        public PatientAppointmentModel GetAppointmentfromCallCenterbyID(int appointmentId)
        {
            return this.iCallCenterService.GetAppointmentfromCallCenterbyID(appointmentId);
        }

        [HttpPost]
        public PatientAppointmentModel UpdateAppointmentfromCallCenter(PatientAppointmentModel appointData)
        {
            return this.iCallCenterService.UpdateAppointmentfromCallCenter(appointData);
        }

        #endregion

        [HttpGet]
        public List<ProviderSpecialityModel> GetSpecialitiesForCallCenter()
        {
            return this.iCallCenterService.GetSpecialitiesForCallCenter();
        }

        [HttpGet]
        public List<ProviderModel> GetProvidersforCallCenter(string searchKey)
        {
            return this.iCallCenterService.GetProvidersforCallCenter(searchKey);
        }

        [HttpGet]
        public List<Patient> GetPatientsForCallCenter(string searchKey)
        {
            return this.iCallCenterService.GetPatientsForCallCenter(searchKey);
        }

        [HttpGet]
        public List<AppointmentStatus> GetAppointmentStatusesforCallCenter()
        {
            return this.iCallCenterService.GetAppointmentStatusesforCallCenter();
        }

        [HttpPost]
        public CallCenterModel AddUpdateCallCenterData(CallCenterModel CenterData)
        {
            return this.iCallCenterService.AddUpdateCallCenterData(CenterData);
        }

        [HttpGet]
        public List<CallCenterModel> GetAllCallCenterData()
        {
            return this.iCallCenterService.GetAllCallCenterData();
        }

        [HttpGet]
        public CallCenterModel GetCallCenterDataById(int callCenterId)
        {
            return this.iCallCenterService.GetCallCenterDataById(callCenterId);
        }

        [HttpGet]
        public CallCenterModel GetCallCenterDataByAppointmentId(int appointmentId)
        {
            return this.iCallCenterService.GetCallCenterDataByAppointmentId(appointmentId);
        }

        #region Procedure Request

        [HttpPost]
        public List<ProcedureRequestModel> SearchProcedureRequestsforCallCenter(SearchModel searchModel)
        {
            return this.iCallCenterService.SearchProcedureRequestsforCallCenter(searchModel);
        }

        [HttpGet]
        public RequestCountModel GetRequestCountsforCallCenter()
        {
            return this.iCallCenterService.GetRequestCountsforCallCenter();
        }

        [HttpGet]
        public CallCenterModel GetCallCenterDataByProcedureRequestId(int procedureRequestId)
        {
            return this.iCallCenterService.GetCallCenterDataByProcedureRequestId(procedureRequestId);
        }

        #endregion

    }
}