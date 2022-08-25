using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class PatientImmunization
    {
        [Key]
        public int ImmunizationID { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public Nullable<DateTime> ImmunizationDate { get; set; }
        public string InjectingPhysician { get; set; }
        public string VaccineName { get; set; }
        public string ProductName { get; set; }
        public string Manufacturer { get; set; }
        public string BatchNo { get; set; }
        public string Route { get; set; }
        public string BodySite { get; set; }
        public string DoseUnits { get; set; }
        public string FacilityName { get; set; }
        public Nullable<int> PatientAge { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
