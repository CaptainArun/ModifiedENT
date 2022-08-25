using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities.Logging
{
    public partial class DBAudit
    {
        [Key]
        public int AuditId { get; set; }

        [Required]
        public DateTime? AuditDate { get; set; }

        [Required]
        [MaxLength(50)]
        public string UserName { get; set; }

        [Required]
        [MaxLength(75)]
        public string TableName { get; set; }

        [Required]
        [MaxLength(1)]
        public string Action { get; set; }

        public string OldData { get; set; }

        [Required]
        public string NewData { get; set; }

        public string ChangedColumns { get; set; }
    }
}
