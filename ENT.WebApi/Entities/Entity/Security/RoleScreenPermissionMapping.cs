using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public class RoleScreenPermissionMapping
    {
        [Key]
        public int RoleScreenId { get; set; }
        public int RoleId { get; set; }
        public int ScreenId { get; set; }
        public int actionid { get; set; }
        public DateTime Createddate { get; set; }
        public string Createdby { get; set; }
        public Nullable<DateTime> Modifieddate { get; set; }
        public string Modifiedby { get; set; }

    }
}
