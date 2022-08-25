using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class ClientSubscription
    {
        [Key]
        public int Subscriptionid { get; set; }
        public int tenantid { get; set; }
        public int maxusers { get; set; }
        public DateTime startdate { get; set; }
        public DateTime enddate { get; set; }
        public bool isactive { get; set; }
        public DateTime Createddate { get; set; }
        public string Createdby { get; set; }
        public Nullable<DateTime> Modifieddate { get; set; }
        public string Modifiedby { get; set; }
    }
}
