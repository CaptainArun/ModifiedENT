using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class EmployeeLanguageInfoModel
    {
        #region entity properties

        public int EmployeeLanguageID { get; set; }
        public int EmployeeID { get; set; }
        public string Language { get; set; }
        public Nullable<bool> IsSpeak { get; set; }
        public Nullable<int> SpeakingLevel { get; set; }
        public Nullable<bool> IsRead { get; set; }
        public Nullable<int> ReadingLevel { get; set; }
        public Nullable<bool> IsWrite { get; set; }
        public Nullable<int> WritingLevel { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties



        #endregion
    }
}
