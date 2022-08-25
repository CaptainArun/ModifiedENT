using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class MenuModel
    {
        public MenuModel()
        {
            this.Items = new List<MenuModel>();
        }
        public int Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }

        public List<MenuModel> Items { get; set; }
        public string ActionIds { get; set; }
        public string ActionName { get; set; }
    }
}
