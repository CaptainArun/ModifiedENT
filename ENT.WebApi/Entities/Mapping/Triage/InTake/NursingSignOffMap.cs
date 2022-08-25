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
    public class NursingSignOffMap : IEntityTypeConfiguration<NursingSignOff>
    {
        public void Configure(EntityTypeBuilder<NursingSignOff> builder)
        {
            builder.ToTable("NursingSignOff", "dbo");
            builder.HasKey(x => x.NursingId);

            builder.Property(x => x.NursingId).HasColumnName("NursingId");
            builder.Property(x => x.PatientID).HasColumnName("PatientID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.ObservationsNotes).HasColumnName("ObservationsNotes").HasMaxLength(100);
            builder.Property(x => x.FirstaidOrDressingsNotes).HasColumnName("FirstaidOrDressingsNotes").HasMaxLength(150);
            builder.Property(x => x.NursingProceduresNotes).HasColumnName("NursingProceduresNotes").HasMaxLength(100);
            builder.Property(x => x.NursingNotes).HasColumnName("NursingNotes").HasMaxLength(100);
            builder.Property(x => x.AdditionalInformation).HasColumnName("AdditionalInformation").HasMaxLength(150);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
