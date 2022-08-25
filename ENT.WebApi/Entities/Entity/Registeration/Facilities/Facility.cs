﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Facility
    {
        [Key]
        public int FacilityId { get; set; }
        public string FacilityName { get; set; }
        public string FacilityNumber { get; set; }
        public string SpecialityId { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PINCode { get; set; }
        public string Telephone { get; set; }
        public string AlternativeTelphone { get; set; }
        public string Email { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }

    }
}
