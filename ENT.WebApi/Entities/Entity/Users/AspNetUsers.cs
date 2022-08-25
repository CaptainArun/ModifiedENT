using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ENT.WebApi.Entities
{
    public partial class AspNetUsers : IdentityUser
    {
        //[Key]
        //public string Id { get; set; }
        //public string UserName { get; set; }
        //public string NormalizedUserName { get; set; }
        //public string Email { get; set; }
        //public string NormalizedEmail { get; set; }
        //public bool EmailConfirmed { get; set; }
        //public string PasswordHash { get; set; }
        //public string SecurityStamp { get; set; }
        //public string ConcurrencyStamp { get; set; }
        //public string PhoneNumber { get; set; }
        //public bool PhoneNumberConfirmed { get; set; }
        //public bool TwoFactorEnabled { get; set; }
        //public Nullable<DateTimeOffset> LockoutEnd { get; set; }
        //public bool LockoutEnabled { get; set; }
        //public int AccessFailedCount { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public bool isActive { get; set; }

    }
}
