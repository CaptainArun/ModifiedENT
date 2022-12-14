using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class NutritionAssessment
    {
        [Key]
        public int NutritionAssessmentID { get; set; }
        public int VisitId { get; set; }
        public int PatientId { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public string IntakeCategory { get; set; }
        public int FoodIntakeTypeID { get; set; }
        public string EatRegularly { get; set; }
        public string RegularMeals { get; set; }
        public string Carvings { get; set; }
        public string DislikedIntake { get; set; }
        public string FoodAllergies { get; set; }
        public string Notes { get; set; }
        public string FoodName { get; set; }
        public string Units { get; set; }
        public Nullable<int> Frequency { get; set; }
        public string NutritionNotes { get; set; }
        public bool IsActive { get; set; }
        public string Createdby { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
    }
}
