using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ProviderLanguagesModel : BaseModel
    {
        #region entity properties
        public int ProviderLanguageId { get; set; }
        public int ProviderID { get; set; }
        public string Language { get; set; }
        public Nullable<bool> IsSpeak { get; set; }
        public Nullable<int> SpeakingLevel { get; set; }
        public Nullable<bool> IsRead { get; set; }
        public Nullable<int> ReadingLevel { get; set; }
        public Nullable<bool> IsWrite { get; set; }
        public Nullable<int> WritingLevel { get; set; }
        #endregion

        #region custom properties

        #endregion
    }
}
