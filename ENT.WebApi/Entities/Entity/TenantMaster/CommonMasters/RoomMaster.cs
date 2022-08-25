using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class RoomMaster
    {
        [Key]
        public int Roomtypeid { get; set; }
        public string Roomtype { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string Createdby { get; set; }
        public Nullable<DateTime> Modifieddate { get; set; }
        public string Modifiedby { get; set; }
    }
}
