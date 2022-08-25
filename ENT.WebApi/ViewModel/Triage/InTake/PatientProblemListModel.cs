using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.ViewModel
{
    public class PatientProblemListModel
    {
        #region entity properties
        public int ProblemlistId { get; set; }
        public int PatientId { get; set; }
        public int VisitId { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public int ProblemTypeID { get; set; }
        public string ProblemDescription { get; set; }
        public string ICD10Code { get; set; }
        public string SNOMEDCode { get; set; }
        public string Aggravatedby { get; set; }
        public Nullable<DateTime> DiagnosedDate { get; set; }
        public Nullable<DateTime> ResolvedDate { get; set; }
        public string Status { get; set; }
        public string AttendingPhysican { get; set; }
        public string AlleviatedBy { get; set; }
        public string FileName { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        #endregion

        #region custom Properties
        public string ProblemTypeDesc { get; set; }
        public string signOffstatus { get; set; }
        public string RecordedTime { get; set; }
        public string PatientName { get; set; }
        public string visitDateandTime { get; set; }
        public string recordedDuring { get; set; }
        public string facilityName { get; set; }
        public int FacilityId { get; set; }
        public string VisitNo { get; set; }
        public List<clsViewFile> filePath { get; set; }

        #endregion
    }
}
