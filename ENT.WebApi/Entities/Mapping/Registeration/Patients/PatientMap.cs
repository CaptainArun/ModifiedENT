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
    public class PatientMap : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.ToTable("Patient", "dbo");
            builder.HasKey(x => x.PatientId);

            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.MRNo).HasColumnName("MRNo").HasMaxLength(20);
            builder.Property(x => x.PatientFirstName).HasColumnName("PatientFirstName").HasMaxLength(50);
            builder.Property(x => x.PatientMiddleName).HasColumnName("PatientMiddleName").HasMaxLength(50);
            builder.Property(x => x.PatientLastName).HasColumnName("PatientLastName").HasMaxLength(50);
            builder.Property(x => x.PatientDOB).HasColumnName("PatientDOB");
            builder.Property(x => x.PatientAge).HasColumnName("PatientAge");
            builder.Property(x => x.Gender).HasColumnName("Gender").HasMaxLength(15);
            builder.Property(x => x.PrimaryContactNumber).HasColumnName("PrimaryContactNumber").HasMaxLength(50);
            builder.Property(x => x.PrimaryContactType).HasColumnName("PrimaryContactType").HasMaxLength(20);
            builder.Property(x => x.SecondaryContactNumber).HasColumnName("SecondaryContactNumber").HasMaxLength(50);
            builder.Property(x => x.SecondaryContactType).HasColumnName("SecondaryContactType").HasMaxLength(20);
            builder.Property(x => x.PatientStatus).HasColumnName("PatientStatus").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
