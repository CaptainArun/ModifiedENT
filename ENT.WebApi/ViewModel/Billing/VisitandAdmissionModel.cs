using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class VisitandAdmissionModel
    {
        public List<PatientVisitModel> visitCollection { get; set; }
        public List<AdmissionsModel> admissionCollection { get; set; }
    }
}
