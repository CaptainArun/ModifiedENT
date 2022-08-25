using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Notestablelabelmapping
    {
        [Key]
        public int Noteslabelmappingid { get; set; }
        public string Tablename { get; set; }
        public string Noteslabel { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime Createddate { get; set; }
        public string Modifiedby { get; set; }
        public Nullable<DateTime> Modifieddate { get; set; }
    }
}
