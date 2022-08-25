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
    public class PatientDemographicMap : IEntityTypeConfiguration<PatientDemographic>
    {
        public void Configure(EntityTypeBuilder<PatientDemographic> builder)
        {
            builder.ToTable("PatientDemographic", "dbo");
            builder.HasKey(x => x.PatientDemographicId);

            builder.Property(x => x.PatientDemographicId).HasColumnName("PatientDemographicId");
            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.FacilityId).HasColumnName("FacilityId");
            builder.Property(x => x.PatientType).HasColumnName("PatientType").HasMaxLength(20);
            builder.Property(x => x.RegisterationAt).HasColumnName("RegisterationAt").HasMaxLength(20);
            builder.Property(x => x.PatientCategory).HasColumnName("PatientCategory").HasMaxLength(20);
            builder.Property(x => x.Salutation).HasColumnName("Salutation").HasMaxLength(10);
            builder.Property(x => x.IDTID1).HasColumnName("IDTID1");
            builder.Property(x => x.PatientIdentificationtype1details).HasColumnName("PatientIdentificationtype1details").HasMaxLength(50);
            builder.Property(x => x.IDTID2).HasColumnName("IDTID2");
            builder.Property(x => x.PatientIdentificationtype2details).HasColumnName("PatientIdentificationtype2details").HasMaxLength(50);
            builder.Property(x => x.MaritalStatus).HasColumnName("MaritalStatus").HasMaxLength(50);
            builder.Property(x => x.Religion).HasColumnName("Religion").HasMaxLength(50);
            builder.Property(x => x.Race).HasColumnName("Race").HasMaxLength(50);
            builder.Property(x => x.Occupation).HasColumnName("Occupation").HasMaxLength(50);
            builder.Property(x => x.email).HasColumnName("email").HasMaxLength(50);
            builder.Property(x => x.Emergencycontactnumber).HasColumnName("Emergencycontactnumber").HasMaxLength(50);
            builder.Property(x => x.Address1).HasColumnName("Address1").HasMaxLength(50);
            builder.Property(x => x.Address2).HasColumnName("Address2").HasMaxLength(50);
            builder.Property(x => x.Village).HasColumnName("Village").HasMaxLength(50);
            builder.Property(x => x.Town).HasColumnName("Town").HasMaxLength(50);
            builder.Property(x => x.City).HasColumnName("City").HasMaxLength(50);
            builder.Property(x => x.Pincode).HasColumnName("Pincode");
            builder.Property(x => x.State).HasColumnName("State").HasMaxLength(50);
            builder.Property(x => x.Country).HasColumnName("Country").HasMaxLength(50);
            builder.Property(x => x.Bloodgroup).HasColumnName("Bloodgroup").HasMaxLength(15);
            builder.Property(x => x.NKSalutation).HasColumnName("NKSalutation").HasMaxLength(10);
            builder.Property(x => x.NKFirstname).HasColumnName("NKFirstname").HasMaxLength(50);
            builder.Property(x => x.NKLastname).HasColumnName("NKLastname").HasMaxLength(50);
            builder.Property(x => x.NKPrimarycontactnumber).HasColumnName("NKPrimarycontactnumber").HasMaxLength(50);
            builder.Property(x => x.NKContactType).HasColumnName("NKContactType").HasMaxLength(20);
            builder.Property(x => x.RSPId).HasColumnName("RSPId");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
