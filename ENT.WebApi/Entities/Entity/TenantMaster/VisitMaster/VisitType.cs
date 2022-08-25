using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class VisitType
    {
        [Key]
        public int VisitTypeId { get; set; }
        public string VisitTypeCode { get; set; }
        public string VisitTypeDescription { get; set; }
        public int OrderNo { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> Modifieddate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
