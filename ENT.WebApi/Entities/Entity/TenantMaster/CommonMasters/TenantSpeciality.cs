﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class TenantSpeciality
    {
        [Key]
        public int TenantSpecialityID { get; set; }
        public string TenantSpecialityCode { get; set; }
        public string TenantSpecialityDescription { get; set; }
        public int OrderNo { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
