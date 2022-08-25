using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class EmployeeHobbyInfoModel
    {
        #region entity properties

        public int EmployeeHobbyId { get; set; }
        public int EmployeeID { get; set; }
        public int ActivityType { get; set; }
        public string Details { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties

        public string ActivityTypeDescription { get; set; }

        #endregion
    }
}
