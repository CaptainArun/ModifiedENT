using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class VisitSignOffModel
    {
        #region entity properties
        public int VisitSignOffID { get; set; }
        public int VisitID { get; set; }
        public bool Intake { get; set; }
        public string IntakeSignOffBy { get; set; }
        public Nullable<DateTime> IntakeSignOffDate { get; set; }
        public bool CaseSheet { get; set; }
        public string CaseSheetSignOffBy { get; set; }
        public Nullable<DateTime> CaseSheetSignOffDate { get; set; }
        public bool Audiology { get; set; }
        public string AudiologySignOffBy { get; set; }
        public Nullable<DateTime> AudiologySignOffDate { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        #endregion

        #region custom properties

        #endregion
    }
}
