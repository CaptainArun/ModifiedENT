using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class TimingModel
    {
        public string ScheduleTime { get; set; }
        public string duration { get; set; }
        public Boolean IsAvailable { get; set; }
    }
}
