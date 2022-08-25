using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class eLabOrderItemsModel
    {
        #region entity properties

        public int LabOrderItemsID { get; set; }
        public int LabOrderID { get; set; }
        public int SetupMasterID { get; set; }
        public string UrgencyCode { get; set; }
        public DateTime LabOnDate { get; set; }
        public string LabNotes { get; set; }
        public string Value { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties

        public string urgencyDescription { get; set; }
        public string setupMasterDesc { get; set; }
        public string masterTestName { get; set; }
        public string subMasterTestName { get; set; }
        public string NormalRange { get; set; }        
        public int patientId { get; set; }

        #endregion
    }
}
