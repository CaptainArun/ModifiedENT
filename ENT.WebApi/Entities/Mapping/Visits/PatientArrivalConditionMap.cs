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
    public class PatientArrivalConditionMap : IEntityTypeConfiguration<PatientArrivalCondition>
    {
        public void Configure(EntityTypeBuilder<PatientArrivalCondition> builder)
        {
            builder.ToTable("PatientArrivalCondition", "Master");
            builder.HasKey(x => x.PatientArrivalConditionId);

            builder.Property(x => x.PatientArrivalConditionId).HasColumnName("PatientArrivalConditionId");
            builder.Property(x => x.Patientarrivalconditioncode).HasColumnName("Patientarrivalconditioncode").HasMaxLength(10);
            builder.Property(x => x.PatientArrivalconditionDescription).HasColumnName("PatientArrivalconditionDescription").HasMaxLength(50);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
