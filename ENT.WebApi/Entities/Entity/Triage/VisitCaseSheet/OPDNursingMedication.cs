using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class OPDNursingMedication 
    {
        [Key]
        public int NursingMedicationID { get; set; }
        public int OPDNOId { get; set; }
        public string Drugname { get; set; }
        public Nullable<int> DispenseformId { get; set; }
        public string SelectedDiagnosis { get; set; }
        public Nullable<int> Quantity { get; set; }
        public string MedicationTime { get; set; }
        public Nullable<bool> After { get; set; }
        public Nullable<bool> Before { get; set; }
        public string DoneBy { get; set; }
        public string SIGNotes { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
