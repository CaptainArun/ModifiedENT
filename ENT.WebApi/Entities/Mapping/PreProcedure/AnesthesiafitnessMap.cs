using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ENT.WebApi.Entities;

namespace ENT.WebApi.Mapping
{
    public class AnesthesiafitnessMap : IEntityTypeConfiguration<Anesthesiafitness>
    {
        public void Configure(EntityTypeBuilder<Anesthesiafitness> builder)
        {
            builder.ToTable("Anesthesiafitness", "dbo");
            builder.HasKey(x => x.AnesthesiafitnessId);

            builder.Property(x => x.AnesthesiafitnessId).HasColumnName("AnesthesiafitnessId");
            builder.Property(x => x.AdmissionId).HasColumnName("AdmissionId");
            builder.Property(x => x.WNLRespiratory).HasColumnName("WNLRespiratory");
            builder.Property(x => x.Cough).HasColumnName("Cough");
            builder.Property(x => x.Dyspnea).HasColumnName("Dyspnea");
            builder.Property(x => x.Dry).HasColumnName("Dry");
            builder.Property(x => x.RecentURILRTI).HasColumnName("RecentURILRTI");
            builder.Property(x => x.OSA).HasColumnName("OSA");
            builder.Property(x => x.Productive).HasColumnName("Productive");
            builder.Property(x => x.TB).HasColumnName("TB");
            builder.Property(x => x.COPD).HasColumnName("COPD");
            builder.Property(x => x.Asthma).HasColumnName("Asthma");
            builder.Property(x => x.Pneumonia).HasColumnName("Pneumonia");
            builder.Property(x => x.Fever).HasColumnName("Fever");
            builder.Property(x => x.WNLNeuroMusculoskeletal).HasColumnName("WNLNeuroMusculoskeletal");
            builder.Property(x => x.RhArthritisGOUT).HasColumnName("RhArthritisGOUT");
            builder.Property(x => x.CVATIA).HasColumnName("CVATIA");
            builder.Property(x => x.Seizures).HasColumnName("Seizures");
            builder.Property(x => x.ScoliosisKyphosis).HasColumnName("ScoliosisKyphosis");
            builder.Property(x => x.HeadInjury).HasColumnName("HeadInjury");
            builder.Property(x => x.PsychDisorder).HasColumnName("PsychDisorder");
            builder.Property(x => x.MuscleWeakness).HasColumnName("MuscleWeakness");
            builder.Property(x => x.Paralysis).HasColumnName("Paralysis");
            builder.Property(x => x.WNLCardio).HasColumnName("WNLCardio");
            builder.Property(x => x.Hypertension).HasColumnName("Hypertension");
            builder.Property(x => x.DOE).HasColumnName("DOE");
            builder.Property(x => x.Pacemarker).HasColumnName("Pacemarker");
            builder.Property(x => x.RheumaticFever).HasColumnName("RheumaticFever");
            builder.Property(x => x.OrthopneaPND).HasColumnName("OrthopneaPND");
            builder.Property(x => x.CADAnginaMI).HasColumnName("CADAnginaMI");
            builder.Property(x => x.ExerciseTolerance).HasColumnName("ExerciseTolerance");
            builder.Property(x => x.WNLRenalEndocrine).HasColumnName("WNLRenalEndocrine");
            builder.Property(x => x.RenalInsufficiency).HasColumnName("RenalInsufficiency");
            builder.Property(x => x.ThyroidDisease).HasColumnName("ThyroidDisease");
            builder.Property(x => x.Diabetes).HasColumnName("Diabetes");
            builder.Property(x => x.WNLGastrointestinal).HasColumnName("WNLGastrointestinal");
            builder.Property(x => x.Vomiting).HasColumnName("Vomiting");
            builder.Property(x => x.Cirrhosis).HasColumnName("Cirrhosis");
            builder.Property(x => x.Diarrhea).HasColumnName("Diarrhea");
            builder.Property(x => x.GERD).HasColumnName("GERD");
            builder.Property(x => x.WNLOthers).HasColumnName("WNLOthers");
            builder.Property(x => x.HeamatDisorder).HasColumnName("HeamatDisorder");
            builder.Property(x => x.Radiotherapy).HasColumnName("Radiotherapy");
            builder.Property(x => x.Immunosuppressant).HasColumnName("Immunosuppressant");
            builder.Property(x => x.Pregnancy).HasColumnName("Pregnancy");
            builder.Property(x => x.Chemotherapy).HasColumnName("Chemotherapy");
            builder.Property(x => x.SteroidUse).HasColumnName("SteroidUse");
            builder.Property(x => x.Smoking).HasColumnName("Smoking");
            builder.Property(x => x.Alcohol).HasColumnName("Alcohol");
            builder.Property(x => x.Allergies).HasColumnName("Allergies");
            builder.Property(x => x.LA).HasColumnName("LA");
            builder.Property(x => x.GA).HasColumnName("GA");
            builder.Property(x => x.RA).HasColumnName("RA");
            builder.Property(x => x.NA).HasColumnName("NA");
            builder.Property(x => x.SignificantDetails).HasColumnName("SignificantDetails").HasMaxLength(500);
            builder.Property(x => x.CurrentMedications).HasColumnName("CurrentMedications").HasMaxLength(500);
            builder.Property(x => x.Pulse).HasColumnName("Pulse").HasMaxLength(75);
            builder.Property(x => x.Clubbing).HasColumnName("Clubbing").HasMaxLength(75);
            builder.Property(x => x.IntubationSimpleDifficult).HasColumnName("IntubationSimpleDifficult").HasMaxLength(75);
            builder.Property(x => x.BP).HasColumnName("BP").HasMaxLength(75);
            builder.Property(x => x.Cyanosis).HasColumnName("Cyanosis").HasMaxLength(75);
            builder.Property(x => x.ShortNeck).HasColumnName("ShortNeck").HasMaxLength(75);
            builder.Property(x => x.RR).HasColumnName("RR").HasMaxLength(75);
            builder.Property(x => x.Icterus).HasColumnName("Icterus").HasMaxLength(75);
            builder.Property(x => x.MouthOpening).HasColumnName("MouthOpening").HasMaxLength(75);
            builder.Property(x => x.Temp).HasColumnName("Temp").HasMaxLength(75);
            builder.Property(x => x.Obesity).HasColumnName("Obesity").HasMaxLength(75);
            builder.Property(x => x.MPClass).HasColumnName("MPClass").HasMaxLength(75);
            builder.Property(x => x.Pallor).HasColumnName("Pallor").HasMaxLength(75);
            builder.Property(x => x.ODH).HasColumnName("ODH").HasMaxLength(75);
            builder.Property(x => x.Thyromental).HasColumnName("Thyromental").HasMaxLength(75);
            builder.Property(x => x.LooseTooth).HasColumnName("LooseTooth").HasMaxLength(75);
            builder.Property(x => x.Distance).HasColumnName("Distance").HasMaxLength(75);
            builder.Property(x => x.ArtificialDentures).HasColumnName("ArtificialDentures").HasMaxLength(75);
            builder.Property(x => x.DifficultVenousAccess).HasColumnName("DifficultVenousAccess").HasMaxLength(75);
            builder.Property(x => x.AnesthesiaFitnessCleared).HasColumnName("AnesthesiaFitnessCleared");
            builder.Property(x => x.AnesthesiaFitnessnotes).HasColumnName("AnesthesiaFitnessnotes").HasMaxLength(75);
            builder.Property(x => x.SignOffBy).HasColumnName("SignOffBy").HasMaxLength(50);
            builder.Property(x => x.SignOffDate).HasColumnName("SignOffDate");
            builder.Property(x => x.SignOffStatus).HasColumnName("SignOffStatus");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
