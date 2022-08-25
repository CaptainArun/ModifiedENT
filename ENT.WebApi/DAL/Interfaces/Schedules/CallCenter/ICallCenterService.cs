using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Entities;
using ENT.WebApi.ViewModel;

namespace ENT.WebApi.DAL.Interfaces
{
    public interface ICallCenterService
    {
        AppointmentCountModel GetCallCenterCount();
        List<string> GetAppointmentNumbersbySearch(string searchKey);
        List<string> GetVisitNumbersbySearch(string searchKey);

        #region Patient Appointments

        List<PatientAppointmentModel> SearchCallCenterAppointments(SearchModel searchModel);
        List<PatientAppointmentModel> GetPreviousAppointmentHistoryForPatient(int PatientId);
        AppointmentCountModel GetAppointmentCountsforPatient(int PatientId);
        PatientAppointmentModel GetAppointmentfromCallCenterbyID(int appointmentId);
        PatientAppointmentModel UpdateAppointmentfromCallCenter(PatientAppointmentModel appointData);

        #endregion

        List<ProviderSpecialityModel> GetSpecialitiesForCallCenter();
        CallCenterModel AddUpdateCallCenterData(CallCenterModel CenterData);
        List<CallCenterModel> GetAllCallCenterData();
        CallCenterModel GetCallCenterDataById(int callCenterId);
        CallCenterModel GetCallCenterDataByAppointmentId(int appointmentId);
        List<ProviderModel> GetProvidersforCallCenter(string searchKey);
        List<Patient> GetPatientsForCallCenter(string searchKey);
        List<AppointmentStatus> GetAppointmentStatusesforCallCenter();

        #region Procedure Request

        List<ProcedureRequestModel> SearchProcedureRequestsforCallCenter(SearchModel searchModel);
        RequestCountModel GetRequestCountsforCallCenter();
        CallCenterModel GetCallCenterDataByProcedureRequestId(int procedureRequestId);

        #endregion
    }
}
