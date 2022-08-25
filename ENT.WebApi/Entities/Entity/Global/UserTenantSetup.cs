using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class UserTenantSetup
    {
        [Key]
        public int UserTenantId { get; set; }
        public string UserId  { get; set; }
        public int TenantId { get; set; }
        public DateTime Createddate { get; set; }
        public string Createdby   { get; set; }
        public Nullable<DateTime> Modifieddate { get; set; }
        public string Modifiedby { get; set; }


    }
}
