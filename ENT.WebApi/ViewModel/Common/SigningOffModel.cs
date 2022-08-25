using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class SigningOffModel
    {
        public int VisitId { get; set; }
        public int AdmissionId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ScreenName { get; set; }
        public string status { get; set; }
    }
}
