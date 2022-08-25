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
    public class PatientSocialHistoryMap : IEntityTypeConfiguration<PatientSocialHistory>
    {
        public void Configure(EntityTypeBuilder<PatientSocialHistory> builder)
        {
            builder.ToTable("PatientSocialHistory", "dbo");
            builder.HasKey(x => x.SocialHistoryId);

            builder.Property(x => x.SocialHistoryId).HasColumnName("SocialHistoryId");
            builder.Property(x => x.VisitId).HasColumnName("VisitId");
            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.Smoking).HasColumnName("Smoking");
            builder.Property(x => x.CigarettesPerDay).HasColumnName("CigarettesPerDay");
            builder.Property(x => x.Drinking).HasColumnName("Drinking");
            builder.Property(x => x.ConsumptionPerDay).HasColumnName("ConsumptionPerDay");
            builder.Property(x => x.DrugHabitsDetails).HasColumnName("DrugHabitsDetails").HasMaxLength(50);
            builder.Property(x => x.LifeStyleDetails).HasColumnName("LifeStyleDetails").HasMaxLength(50);
            builder.Property(x => x.CountriesVisited).HasColumnName("CountriesVisited").HasMaxLength(100);
            builder.Property(x => x.DailyActivities).HasColumnName("DailyActivities").HasMaxLength(100);
            builder.Property(x => x.AdditionalNotes).HasColumnName("AdditionalNotes").HasMaxLength(100);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
        }
    }
}
