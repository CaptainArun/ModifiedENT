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
    public class NutritionAssessmentMap : IEntityTypeConfiguration<NutritionAssessment>
    {
        public void Configure(EntityTypeBuilder<NutritionAssessment> builder)
        {
            builder.ToTable("NutritionAssessment", "dbo");
            builder.HasKey(x => x.NutritionAssessmentID);

            builder.Property(x => x.NutritionAssessmentID).HasColumnName("NutritionAssessmentID");
            builder.Property(x => x.VisitId).HasColumnName("VisitId");
            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.IntakeCategory).HasColumnName("IntakeCategory").HasMaxLength(50);
            builder.Property(x => x.FoodIntakeTypeID).HasColumnName("FoodIntakeTypeID");
            builder.Property(x => x.EatRegularly).HasColumnName("EatRegularly").HasMaxLength(50);
            builder.Property(x => x.RegularMeals).HasColumnName("RegularMeals").HasMaxLength(75);
            builder.Property(x => x.Carvings).HasColumnName("Carvings").HasMaxLength(75);
            builder.Property(x => x.DislikedIntake).HasColumnName("DislikedIntake").HasMaxLength(75);
            builder.Property(x => x.FoodAllergies).HasColumnName("FoodAllergies").HasMaxLength(500);
            builder.Property(x => x.Notes).HasColumnName("Notes").HasMaxLength(1000);
            builder.Property(x => x.FoodName).HasColumnName("FoodName").HasMaxLength(75);
            builder.Property(x => x.Units).HasColumnName("Units").HasMaxLength(75);
            builder.Property(x => x.Frequency).HasColumnName("Frequency");
            builder.Property(x => x.NutritionNotes).HasColumnName("NutritionNotes").HasMaxLength(1000);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
        }
    }
}
