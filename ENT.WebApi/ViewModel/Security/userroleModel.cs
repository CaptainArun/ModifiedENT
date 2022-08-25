using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class userroleModel
    {
        #region entity properties

        public int Userroleid { get; set; }
        public string Userid { get; set; }
        public Nullable<int> Roleid { get; set; }
        public Nullable<Boolean> Deleted { get; set; }
        public string Createdby { get; set; }
        public DateTime Createddate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> Modifieddate { get; set; }

        #endregion

        #region custom properties

        public string RoleName { get; set; }

        #endregion
    }
}
