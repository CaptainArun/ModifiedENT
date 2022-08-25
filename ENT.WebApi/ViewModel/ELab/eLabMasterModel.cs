using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class eLabMasterModel
    {
        #region entity properties

        public int LabMasterID { get; set; }
        public int DepartmentID { get; set; }
        public string MasterLabTypeCode { get; set; }
        public string MasterLabType { get; set; }
        public string LabTypeDesc { get; set; }
        public string Status { get; set; }
        public int OrderNo { get; set; }
        public bool AllowSubMaster { get; set; }
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

        #endregion
    }
}
