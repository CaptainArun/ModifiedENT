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
    public class VisitSignOffMap : IEntityTypeConfiguration<VisitSignOff>
    {
        public void Configure(EntityTypeBuilder<VisitSignOff> builder)
        {
            builder.ToTable("VisitSignOff", "dbo");
            builder.HasKey(x => x.VisitSignOffID);

            builder.Property(x => x.VisitSignOffID).HasColumnName("VisitSignOffID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.Intake).HasColumnName("Intake");
            builder.Property(x => x.IntakeSignOffBy).HasColumnName("IntakeSignOffBy").HasMaxLength(50);
            builder.Property(x => x.IntakeSignOffDate).HasColumnName("IntakeSignOffDate");
            builder.Property(x => x.CaseSheet).HasColumnName("CaseSheet");
            builder.Property(x => x.CaseSheetSignOffBy).HasColumnName("CaseSheetSignOffBy").HasMaxLength(50);
            builder.Property(x => x.CaseSheetSignOffDate).HasColumnName("CaseSheetSignOffDate");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
