using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class UserModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string ClientName { get; set; }
        public string ClientDisplayName { get; set; }
        public string TenantName { get; set; }
        public string TenantDisplayName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Tenantdbname { get; set; }
        public int maxusers { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool isActive { get; set; }
        public string UserId { get; set; }
        public int ClientId { get; set; }
        public int TenantId { get; set; }
        public int StatusID { get; set; }        
    }
}
