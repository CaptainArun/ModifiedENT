using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class BaseModel
    {
        public BaseModel()
        {
            this.Status = 0;
            this.StatusMessage = "";
        }

        public int Status { get; set; }

        public string StatusMessage { get; set; }
        public object Result;
        public DateTime CreatedDate { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDate { get; set; }

        public string ModifiedBy { get; set; }
    }
}
