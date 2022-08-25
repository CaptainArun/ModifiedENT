using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public class Modules
    {
        [Key]
        public int ModuleId { get; set; }
        public string ModuleName { get; set; } 
        public string ModuleDescription { get; set; } 
        public DateTime Createddate { get; set; } 
        public string Createdby { get; set; } 
        public Nullable<DateTime> Modifieddate { get; set; } 
        public string Modifiedby { get; set; } 
    }
}
