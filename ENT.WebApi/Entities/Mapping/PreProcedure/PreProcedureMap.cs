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
    public class PreProcedureMap : IEntityTypeConfiguration<PreProcedure>
    {
        public void Configure(EntityTypeBuilder<PreProcedure> builder)
        {
            builder.ToTable("PreProcedure", "dbo");
            builder.HasKey(x => x.PreProcedureID);

            builder.Property(x => x.PreProcedureID).HasColumnName("PreProcedureID");
            builder.Property(x => x.AdmissionID).HasColumnName("AdmissionID");
            builder.Property(x => x.ProcedureDate).HasColumnName("ProcedureDate");
            builder.Property(x => x.ScheduleApprovedBy).HasColumnName("ScheduleApprovedBy");
            builder.Property(x => x.ProcedureStatus).HasColumnName("ProcedureStatus").HasMaxLength(50);
            builder.Property(x => x.CancelReason).HasColumnName("CancelReason").HasMaxLength(500);
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
