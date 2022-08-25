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
    public class RadiologyOrderMap : IEntityTypeConfiguration<RadiologyOrder>
    {
        public void Configure(EntityTypeBuilder<RadiologyOrder> builder)
        {
            builder.ToTable("Radiology", "dbo");
            builder.HasKey(x => x.RadiologyID);

            builder.Property(x => x.RadiologyID).HasColumnName("RadiologyID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.OrderingPhysician).HasColumnName("OrderingPhysician").HasMaxLength(50);
            builder.Property(x => x.NarrativeDiagnosis).HasColumnName("NarrativeDiagnosis").HasMaxLength(1000);
            builder.Property(x => x.PrimaryICD).HasColumnName("PrimaryICD").HasMaxLength(500);
            builder.Property(x => x.RadiologyProcedure).HasColumnName("RadiologyProcedure").HasMaxLength(50);
            builder.Property(x => x.Type).HasColumnName("RadiologyType").HasMaxLength(50);
            builder.Property(x => x.Section).HasColumnName("Section").HasMaxLength(50);
            builder.Property(x => x.ContrastNotes).HasColumnName("ContrastNotes").HasMaxLength(1000);
            builder.Property(x => x.PrimaryCPT).HasColumnName("PrimaryCPT").HasMaxLength(500);
            builder.Property(x => x.ProcedureRequestedDate).HasColumnName("ProcedureRequestedDate");
            builder.Property(x => x.InstructionsToPatient).HasColumnName("InstructionsToPatient").HasMaxLength(1000);
            builder.Property(x => x.ProcedureStatus).HasColumnName("ProcedureStatus").HasMaxLength(50);
            builder.Property(x => x.ReferredLab).HasColumnName("ReferredLab");
            builder.Property(x => x.ReferredLabValue).HasColumnName("ReferredLabValue").HasMaxLength(50);
            builder.Property(x => x.ReportFormat).HasColumnName("ReportFormat").HasMaxLength(100);
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(1000);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
