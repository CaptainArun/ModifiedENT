using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class EmployeeModel
    {
        public string EmployeeFirstName { get; set; }
        public string EmployeeLastName { get; set; }
        public string EmployeeMiddleName { get; set; }
        public string EmployeeName { get; set; }
        public string RoleName { get; set; }
        public string ModuleName { get; set; }
        public string ScreenName { get; set; }
        public string ActionName { get; set; }
        public string Userid { get; set; }
        public int id { get; set; }
        public int RoleId { get; set; }
        public int ScreenId { get; set; }
        public int ModuleId { get; set; }
        public int ActionId { get; set; }
        public string FacilityId { get; set; }
        public string FacilityName { get; set; }
        public List<int> FacilityArray { get; set; }

    }
}
