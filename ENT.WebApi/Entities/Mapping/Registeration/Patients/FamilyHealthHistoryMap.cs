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
    public class FamilyHealthHistoryMap : IEntityTypeConfiguration<FamilyHealthHistory>
    {
        public void Configure(EntityTypeBuilder<FamilyHealthHistory> builder)
        {
            builder.ToTable("FamilyHealthHistory", "dbo");
            builder.HasKey(x => x.FamilyHealthHistoryID);

            builder.Property(x => x.FamilyHealthHistoryID).HasColumnName("FamilyHealthHistoryID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.ICDCode).HasColumnName("ICDCode").HasMaxLength(500);
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.FamilyMemberName).HasColumnName("FamilyMemberName").HasMaxLength(50);
            builder.Property(x => x.FamilyMemberAge).HasColumnName("FamilyMemberAge");
            builder.Property(x => x.Relationship).HasColumnName("Relationship").HasMaxLength(50);
            builder.Property(x => x.DiagnosisNotes).HasColumnName("DiagnosisNotes").HasMaxLength(1000);
            builder.Property(x => x.IllnessType).HasColumnName("IllnessType").HasMaxLength(50);
            builder.Property(x => x.ProblemStatus).HasColumnName("ProblemStatus").HasMaxLength(20);
            builder.Property(x => x.PhysicianName).HasColumnName("PhysicianName").HasMaxLength(50);
            builder.Property(x => x.AdditionalNotes).HasColumnName("AdditionalNotes").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
