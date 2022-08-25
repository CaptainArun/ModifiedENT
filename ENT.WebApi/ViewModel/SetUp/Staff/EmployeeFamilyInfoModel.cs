using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class EmployeeFamilyInfoModel
    {
        #region entity properties

        public int EmployeeFamilyID { get; set; }
        public int EmployeeID { get; set; }
        public Nullable<int> Salutation { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public Nullable<int> Gender { get; set; }
        public int Age { get; set; }
        public string CellNo { get; set; }
        public string PhoneNo { get; set; }
        public string WhatsAppNo { get; set; }
        public string EMail { get; set; }
        public Nullable<int> RelationshipToEmployee { get; set; }
        public string Occupation { get; set; }
        public string AdditionalInfo { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        #endregion

        #region custom properties

        public string SalutationDesc { get; set; }
        public string GenderDesc { get; set; }
        public string RelationshipToEmployeeDesc { get; set; }

        #endregion
    }
}
