using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ENT.WebApi.ViewModel
{
    public class PatientInsuranceModel
    {
        #region entity properties
        public int InsuranceID { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string InsuranceType { get; set; }
        public string InsuranceCategory { get; set; }
        public string InsuranceCompany { get; set; }
        public string Proposer { get; set; }
        public string RelationshipToPatient { get; set; }
        public string PolicyNo { get; set; }
        public string GroupPolicyNo { get; set; }
        public string CardNo { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public string AdditionalInfo { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region custom properties
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
