using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class eLabSubMasterModel
    {
        #region entity properties

        public int LabSubMasterID { get; set; }
        public int DepartmentID { get; set; }
        public int LabMasterId { get; set; }
        public string SubMasterLabCode { get; set; }
        public string SubMasterLabType { get; set; }
        public string SubMasterLabTypeDesc { get; set; }
        public string Status { get; set; }
        public int OrderNo { get; set; }
        public string Units { get; set; }
        public string NormalRange { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties

        public string DepartmentDesc { get; set; }
        public string LabMasterDesc { get; set; }
        public string LabSubMasterDesc { get; set; }

        #endregion
    }
}
