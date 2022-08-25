using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class ScreenModel
    {
        public int ScreenId { get; set; }
        public Nullable<int> ModuleId { get; set; }
        public string ScreenName { get; set; }
        public string ScreenDescription { get; set; }
        public string ActionURL { get; set; }
        public Nullable<Boolean> Deleted { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime Createddate { get; set; }
        public string Createdby { get; set; }
        public Nullable<DateTime> Modifieddate { get; set; }
        public string Modifiedby { get; set; }

        //
        public int ActionId { get; set; }
        public string ActionName { get; set; }
        public string ModuleName { get; set; }
    }
}
