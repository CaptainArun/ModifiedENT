using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class Anesthesiafitness
    {
        [Key]
        public int AnesthesiafitnessId { get; set; }
        public int AdmissionId { get; set; }
        public Nullable<bool> WNLRespiratory { get; set; }
        public Nullable<bool> Cough { get; set; }
        public Nullable<bool> Dyspnea { get; set; }
        public Nullable<bool> Dry { get; set; }
        public Nullable<bool> RecentURILRTI { get; set; }
        public Nullable<bool> OSA { get; set; }
        public Nullable<bool> Productive { get; set; }
        public Nullable<bool> TB { get; set; }
        public Nullable<bool> COPD { get; set; }
        public Nullable<bool> Asthma { get; set; }
        public Nullable<bool> Pneumonia { get; set; }
        public Nullable<bool> Fever { get; set; }
        public Nullable<bool> WNLNeuroMusculoskeletal { get; set; }
        public Nullable<bool> RhArthritisGOUT { get; set; }
        public Nullable<bool> CVATIA { get; set; }
        public Nullable<bool> Seizures { get; set; }
        public Nullable<bool> ScoliosisKyphosis { get; set; }
        public Nullable<bool> HeadInjury { get; set; }
        public Nullable<bool> PsychDisorder { get; set; }
        public Nullable<bool> MuscleWeakness { get; set; }
        public Nullable<bool> Paralysis { get; set; }
        public Nullable<bool> WNLCardio { get; set; }
        public Nullable<bool> Hypertension { get; set; }
        public Nullable<bool> DOE { get; set; }
        public Nullable<bool> Pacemarker { get; set; }
        public Nullable<bool> RheumaticFever { get; set; }
        public Nullable<bool> OrthopneaPND { get; set; }
        public Nullable<bool> CADAnginaMI { get; set; }
        public Nullable<bool> ExerciseTolerance { get; set; }
        public Nullable<bool> WNLRenalEndocrine { get; set; }
        public Nullable<bool> RenalInsufficiency { get; set; }
        public Nullable<bool> ThyroidDisease { get; set; }
        public Nullable<bool> Diabetes { get; set; }
        public Nullable<bool> WNLGastrointestinal { get; set; }
        public Nullable<bool> Vomiting { get; set; }
        public Nullable<bool> Cirrhosis { get; set; }
        public Nullable<bool> Diarrhea { get; set; }
        public Nullable<bool> GERD { get; set; }
        public Nullable<bool> WNLOthers { get; set; }
        public Nullable<bool> HeamatDisorder { get; set; }
        public Nullable<bool> Radiotherapy { get; set; }
        public Nullable<bool> Immunosuppressant { get; set; }
        public Nullable<bool> Pregnancy { get; set; }
        public Nullable<bool> Chemotherapy { get; set; }
        public Nullable<bool> SteroidUse { get; set; }
        public Nullable<bool> Smoking { get; set; }
        public Nullable<bool> Alcohol { get; set; }
        public Nullable<bool> Allergies { get; set; }
        public Nullable<bool> LA { get; set; }
        public Nullable<bool> GA { get; set; }
        public Nullable<bool> RA { get; set; }
        public Nullable<bool> NA { get; set; }
        public string SignificantDetails { get; set; }
        public string CurrentMedications { get; set; }
        public string Pulse { get; set; }
        public string Clubbing { get; set; }
        public string IntubationSimpleDifficult { get; set; }
        public string BP { get; set; }
        public string Cyanosis { get; set; }
        public string ShortNeck { get; set; }
        public string RR { get; set; }
        public string Icterus { get; set; }
        public string MouthOpening { get; set; }
        public string Temp { get; set; }
        public string Obesity { get; set; }
        public string MPClass { get; set; }
        public string Pallor { get; set; }
        public string ODH { get; set; }
        public string Thyromental { get; set; }
        public string LooseTooth { get; set; }
        public string Distance { get; set; }
        public string ArtificialDentures { get; set; }
        public string DifficultVenousAccess { get; set; }
        public bool AnesthesiaFitnessCleared { get; set; }
        public string AnesthesiaFitnessnotes { get; set; }
        public string SignOffBy { get; set; }
        public Nullable<bool> SignOffStatus { get; set; }
        public Nullable<DateTime> SignOffDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
