using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class AvailabilityModel
    {
        public int ProviderId { get; set; }
        public int FacilityId { get; set; }
        public DateTime AppointDate { get; set; }
        public string availability { get; set; }
    }
}
