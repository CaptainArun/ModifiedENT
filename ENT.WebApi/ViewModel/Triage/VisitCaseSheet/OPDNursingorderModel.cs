using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class OPDNursingorderModel
    {
        #region entity properties
        public int OPDNOId { get; set; }
        public int VisitID { get; set; }
        public int CaseSheetID { get; set; }
        public string ChiefComplaint { get; set; }
        public int ICD10 { get; set; }
        public int Proceduretype { get; set; }
        public string ProcedureNotes { get; set; }
        public int Instructiontype { get; set; }
        public string NursingNotes { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region custom properties
        public List<OPDNursingMedicationModel> opdnursingMedications { get; set; }
        #endregion
    }
}
