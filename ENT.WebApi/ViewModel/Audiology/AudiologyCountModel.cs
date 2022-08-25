using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class AudiologyCountModel
    {
        public int AudiologyTotalTestCount { get; set; }
        public int AudiologyCompletedCount { get; set; }
        public int AudiologyWaitingCount { get; set; }
    }
}
