﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class TreatmentCode
    {
        [Key]
        public int TreatmentCodeID { get; set; }
        public string CPTCode { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public string ServiceIDQualifier { get; set; }
        public Nullable<DateTime> EffectiveDate { get; set; }
        public Nullable<DateTime> TerminationDate { get; set; }
        public Boolean Deleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public string CodeSystem { get; set; }
    }
}
