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
    public class OPDNursingordersMap : IEntityTypeConfiguration<OPDNursingorders>
    {
        public void Configure(EntityTypeBuilder<OPDNursingorders> builder)
        {
            builder.ToTable("OPDNursingorders", "dbo");
            builder.HasKey(x => x.OPDNOId);

            builder.Property(x => x.OPDNOId).HasColumnName("OPDNOId");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.CaseSheetID).HasColumnName("CaseSheetID");
            builder.Property(x => x.ChiefComplaint).HasColumnName("ChiefComplaint").HasMaxLength(50);
            builder.Property(x => x.ICD10).HasColumnName("ICD10");
            builder.Property(x => x.Proceduretype).HasColumnName("Proceduretype");
            builder.Property(x => x.ProcedureNotes).HasColumnName("ProcedureNotes").HasMaxLength(50);
            builder.Property(x => x.Instructiontype).HasColumnName("Instructiontype");
            builder.Property(x => x.NursingNotes).HasColumnName("NursingNotes").HasMaxLength(50);
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
