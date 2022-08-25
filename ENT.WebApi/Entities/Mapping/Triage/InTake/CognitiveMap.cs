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
    public class CognitiveMap : IEntityTypeConfiguration<Cognitive>
    {
        public void Configure(EntityTypeBuilder<Cognitive> builder)
        {
            builder.ToTable("Cognitive", "dbo");
            builder.HasKey(x => x.CognitiveID);

            builder.Property(x => x.CognitiveID).HasColumnName("CognitiveID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.Gait).HasColumnName("Gait");
            builder.Property(x => x.GaitNotes).HasColumnName("GaitNotes").HasMaxLength(250);
            builder.Property(x => x.Balance).HasColumnName("Balance").HasMaxLength(20);
            builder.Property(x => x.BalanceNotes).HasColumnName("BalanceNotes").HasMaxLength(250);
            builder.Property(x => x.NeuromuscularNotes).HasColumnName("NeuromuscularNotes").HasMaxLength(250);
            builder.Property(x => x.Mobility).HasColumnName("Mobility").HasMaxLength(20);
            builder.Property(x => x.MobilitySupportDevice).HasColumnName("MobilitySupportDevice").HasMaxLength(50);
            builder.Property(x => x.MobilityNotes).HasColumnName("MobilityNotes").HasMaxLength(250);
            builder.Property(x => x.Functionalstatus).HasColumnName("Functionalstatus").HasMaxLength(50);
            builder.Property(x => x.Cognitivestatus).HasColumnName("Cognitivestatus").HasMaxLength(50);
            builder.Property(x => x.PrimaryDiagnosisNotes).HasColumnName("PrimaryDiagnosisNotes").HasMaxLength(250);
            builder.Property(x => x.ICD10).HasColumnName("ICD10").HasMaxLength(500);
            builder.Property(x => x.PrimaryProcedure).HasColumnName("PrimaryProcedure").HasMaxLength(250);
            builder.Property(x => x.CPT).HasColumnName("CPT").HasMaxLength(500);
            builder.Property(x => x.Physicianname).HasColumnName("Physicianname").HasMaxLength(50);
            builder.Property(x => x.Hospital).HasColumnName("Hospital").HasMaxLength(50);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
            builder.Property(x => x.PatientID).HasColumnName("PatientID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
        }
    }
}
