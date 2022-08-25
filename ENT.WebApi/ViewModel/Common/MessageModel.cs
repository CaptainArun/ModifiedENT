using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class MessageModel
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public string Cc { get; set; }
        public string Bcc { get; set; }

    }
}
