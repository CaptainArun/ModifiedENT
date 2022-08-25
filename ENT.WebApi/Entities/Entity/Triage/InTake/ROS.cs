using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ENT.WebApi.Entities
{
    public partial class ROS
    {
        [Key]
        public int ROSID { get; set; }
        public int PatientID { get; set; }
        public int VisitID { get; set; }
        public DateTime RecordedDate { get; set; }
        public string RecordedBy { get; set; }
        public Nullable<bool> Weightlossorgain { get; set; }
        public Nullable<bool> Feverorchills { get; set; }
        public Nullable<bool> Troublesleeping { get; set; }
        public Nullable<bool> Fatigue { get; set; }
        public Nullable<bool> GeneralWeakness { get; set; }
        public Nullable<bool> GeneralOthers { get; set; }
        public string GeneralothersComments { get; set; }
        public Nullable<bool> Rashes { get; set; }
        public Nullable<bool> SkinItching { get; set; }
        public Nullable<bool> Colorchanges { get; set; }
        public Nullable<bool> SkinLumps { get; set; }
        public Nullable<bool> Dryness { get; set; }
        public Nullable<bool> Hairandnailchanges { get; set; }
        public Nullable<bool> SkinOthers { get; set; }
        public string SkinothersComments { get; set; }
        public Nullable<bool> Headache { get; set; }
        public Nullable<bool> Headinjury { get; set; }
        public Nullable<bool> Others { get; set; }
        public string HeadothersComments { get; set; }
        public Nullable<bool> Decreasedhearing { get; set; }
        public Nullable<bool> Earache { get; set; }
        public Nullable<bool> Ringinginears { get; set; }
        public Nullable<bool> Drainage { get; set; }
        public Nullable<bool> EarOthers { get; set; }
        public string EarothersComments { get; set; }
        public Nullable<bool> Vision { get; set; }
        public Nullable<bool> Blurryordoublevision { get; set; }
        public Nullable<bool> Cataracts { get; set; }
        public Nullable<bool> Glassesorcontacts { get; set; }
        public Nullable<bool> Flashinglights { get; set; }
        public Nullable<bool> Lasteyeexam { get; set; }
        public Nullable<bool> EyePain { get; set; }
        public Nullable<bool> Specks { get; set; }
        public Nullable<bool> Redness { get; set; }
        public Nullable<bool> Glaucoma { get; set; }
        public Nullable<bool> EyeOthers { get; set; }
        public string EyesothersComments { get; set; }
        public Nullable<bool> Stuffiness { get; set; }
        public Nullable<bool> NoseItching { get; set; }
        public Nullable<bool> Nosebleeds { get; set; }
        public Nullable<bool> Discharge { get; set; }
        public Nullable<bool> Hayfever { get; set; }
        public Nullable<bool> Sinuspain { get; set; }
        public Nullable<bool> NoseOthers { get; set; }
        public string NoseothersComments { get; set; }
        public Nullable<bool> Teeth { get; set; }
        public Nullable<bool> Soretongue { get; set; }
        public Nullable<bool> Thrush { get; set; }
        public Nullable<bool> Gums { get; set; }
        public Nullable<bool> Drymouth { get; set; }
        public Nullable<bool> Nonhealingsores { get; set; }
        public Nullable<bool> Bleeding { get; set; }
        public Nullable<bool> Sorethroat { get; set; }
        public Nullable<bool> Sinus { get; set; }
        public Nullable<bool> Lastdentalexam { get; set; }
        public Nullable<DateTime> Lastdentalexamdate { get; set; }
        public Nullable<bool> Dentures { get; set; }
        public Nullable<bool> Hoarseness { get; set; }
        public Nullable<bool> ThroatOthers { get; set; }
        public string ThroatothersComments { get; set; }
        public Nullable<bool> NeckLumps { get; set; }
        public Nullable<bool> NeckPain { get; set; }
        public Nullable<bool> Swollenglands { get; set; }
        public Nullable<bool> Stiffness { get; set; }
        public Nullable<bool> NeckOthers { get; set; }
        public string NeckothersComments { get; set; }
        public Nullable<bool> Cough { get; set; }
        public Nullable<bool> Coughingupblood { get; set; }
        public Nullable<bool> Wheezing { get; set; }
        public Nullable<bool> Sputum { get; set; }
        public Nullable<bool> Shortnessofbreath { get; set; }
        public Nullable<bool> Painfulbreathing { get; set; }
        public Nullable<bool> RespiratoryOthers { get; set; }
        public string Respiratoryotherscomments { get; set; }
        public Nullable<bool> Dizziness { get; set; }
        public Nullable<bool> Weakness { get; set; }
        public Nullable<bool> Tremor { get; set; }
        public Nullable<bool> Fainting { get; set; }
        public Nullable<bool> Numbness { get; set; }
        public Nullable<bool> Seizures { get; set; }
        public Nullable<bool> Tingling { get; set; }
        public Nullable<bool> NeurologicOthers { get; set; }
        public string Neurologicotherscomments { get; set; }
        public Nullable<bool> Easeofbruising { get; set; }
        public Nullable<bool> Easeofbleeding { get; set; }
        public Nullable<bool> HematologicOthers { get; set; }
        public string Hematologicotherscomments { get; set; }
        public Nullable<bool> Nervousness { get; set; }
        public Nullable<bool> Memoryloss { get; set; }
        public Nullable<bool> Stress { get; set; }
        public Nullable<bool> Depression { get; set; }
        public Nullable<bool> PsychiatricOthers { get; set; }
        public string Psychiatricotherscomments { get; set; }
        public bool IsActive { get; set; }
        public DateTime Createddate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
    }
}
