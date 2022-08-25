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
    public class PatientInsuranceMap : IEntityTypeConfiguration<PatientInsurance>
    {
        public void Configure(EntityTypeBuilder<PatientInsurance> builder)
        {
            builder.ToTable("PatientInsurance", "dbo");
            builder.HasKey(x => x.InsuranceID);

            builder.Property(x => x.InsuranceID).HasColumnName("InsuranceID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.InsuranceType).HasColumnName("InsuranceType").HasMaxLength(25);
            builder.Property(x => x.InsuranceCategory).HasColumnName("InsuranceCategory").HasMaxLength(25);
            builder.Property(x => x.InsuranceCompany).HasColumnName("InsuranceCompany").HasMaxLength(100);
            builder.Property(x => x.Proposer).HasColumnName("Proposer").HasMaxLength(50);
            builder.Property(x => x.RelationshipToPatient).HasColumnName("RelationshipToPatient").HasMaxLength(35);
            builder.Property(x => x.PolicyNo).HasColumnName("PolicyNo").HasMaxLength(35);
            builder.Property(x => x.GroupPolicyNo).HasColumnName("GroupPolicyNo").HasMaxLength(35);
            builder.Property(x => x.CardNo).HasColumnName("CardNo").HasMaxLength(35);
            builder.Property(x => x.ValidFrom).HasColumnName("ValidFrom");
            builder.Property(x => x.ValidTo).HasColumnName("ValidTo");
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
