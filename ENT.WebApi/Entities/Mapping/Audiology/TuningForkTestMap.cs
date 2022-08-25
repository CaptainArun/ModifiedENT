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
    public class TuningForkTestMap : IEntityTypeConfiguration<TuningForkTest>
    {
        public void Configure(EntityTypeBuilder<TuningForkTest> builder)
        {
            builder.ToTable("TuningForkTest", "dbo");
            builder.HasKey(x => x.TuningForkTestId);

            builder.Property(x => x.TuningForkTestId).HasColumnName("TuningForkTestId");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.WeberLTEar).HasColumnName("WeberLTEar").HasMaxLength(50);
            builder.Property(x => x.WeberRTEar).HasColumnName("WeberRTEar").HasMaxLength(50);
            builder.Property(x => x.RinnersLTEar).HasColumnName("RinnersLTEar").HasMaxLength(50);
            builder.Property(x => x.RinnersRTEar).HasColumnName("RinnersRTEar").HasMaxLength(50);
            builder.Property(x => x.Starttime).HasColumnName("Starttime");
            builder.Property(x => x.Endtime).HasColumnName("Endtime");
            builder.Property(x => x.Totalduration).HasColumnName("Totalduration");
            builder.Property(x => x.Findings).HasColumnName("Findings").HasMaxLength(50);
            builder.Property(x => x.Nextfollowupdate).HasColumnName("Nextfollowupdate");
            builder.Property(x => x.SignOffBy).HasColumnName("SignOffBy").HasMaxLength(50);
            builder.Property(x => x.SignOffStatus).HasColumnName("SignOffStatus");
            builder.Property(x => x.SignOffDate).HasColumnName("SignOffDate");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
