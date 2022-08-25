using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ENT.WebApi.ViewModel
{
    public class VisitIntakeModel
    {
        public PatientVitalsModel vitalModel { get; set; }
        public List<PatientAllergyModel> allergiesModel { get; set; }
        public List<PatientMedicationHistoryModel> medicationModel { get; set; }
        public List<PatientProblemListModel> problemCollection { get; set; }
        public PatientSocialHistoryModel socialModel { get; set; }
        public ROSModel rosModel { get; set; }
        public List<NutritionAssessmentModel> nutritionCollection { get; set; }
        public NutritionAssessmentModel nutritionModel { get; set; }
        public CognitiveModel cognitiveModel { get; set; }
        public NursingSignOffModel nursingModel { get; set; }
        public int FacilityId { get; set; }
        public string facilityName { get; set; }
        public string VisitNo { get; set; }
        public string visitDateandTime { get; set; }
    }
}
