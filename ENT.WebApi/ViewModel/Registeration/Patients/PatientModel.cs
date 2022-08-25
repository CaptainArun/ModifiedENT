using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class PatientModel
    {
        #region entity properties
        public int PatientId { get; set; }
        public string MRNo { get; set; }
        public string PatientFirstName { get; set; }
        public string PatientMiddleName { get; set; }
        public string PatientLastName { get; set; }
        public DateTime PatientDOB { get; set; }
        public int PatientAge { get; set; }
        public string Gender { get; set; }
        public string PrimaryContactNumber { get; set; }
        public string PrimaryContactType { get; set; }
        public string SecondaryContactNumber { get; set; }
        public string SecondaryContactType { get; set; }
        public string PatientStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string Createdby { get; set; }
        public string Modifiedby { get; set; }
        #endregion

        #region custom properties

        #endregion
    }
}
