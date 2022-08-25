using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Tenants
    {
        [Key]
        public int TenantId { get; set; }
        public string TenantName { get; set; }
        public string DisplayName { get; set; }
        public string TenantDescription { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public int clientid { get; set; }
        public string Tenantdbname { get; set; }
        public string Type { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string Createdby { get; set; }
        public Nullable<DateTime> Modifieddate { get; set; }
        public string Modifiedby { get; set; }

    }
}
