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
    public class ProviderEducationMap : IEntityTypeConfiguration<ProviderEducation>
    {
        public void Configure(EntityTypeBuilder<ProviderEducation> builder)
        {
            builder.ToTable("ProviderEducation", "dbo");
            builder.HasKey(x => x.ProviderEducationId);

            builder.Property(x => x.ProviderEducationId).HasColumnName("ProviderEducationId");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.EducationType).HasColumnName("EducationType").HasMaxLength(100);
            builder.Property(x => x.BoardorUniversity).HasColumnName("BoardorUniversity").HasMaxLength(100);
            builder.Property(x => x.MonthandYearOfPassing).HasColumnName("MonthandYearOfPassing");
            builder.Property(x => x.NameOfSchoolorCollege).HasColumnName("NameOfSchoolorCollege").HasMaxLength(100);
            builder.Property(x => x.MainSubjects).HasColumnName("MainSubjects").HasMaxLength(100);
            builder.Property(x => x.PercentageofMarks).HasColumnName("PercentageofMarks").HasMaxLength(30);
            builder.Property(x => x.HonoursorScholarshipHeading).HasColumnName("HonoursorScholarshipHeading").HasMaxLength(100);
            builder.Property(x => x.ProjectWorkUndertakenHeading).HasColumnName("ProjectWorkUndertakenHeading").HasMaxLength(100);
            builder.Property(x => x.PublicationsorPapers).HasColumnName("PublicationsorPapers").HasMaxLength(100);
            builder.Property(x => x.Qualification).HasColumnName("Qualification").HasMaxLength(50);
            builder.Property(x => x.DurationOfQualification).HasColumnName("DurationOfQualification").HasMaxLength(20);
            builder.Property(x => x.NameOfInstitution).HasColumnName("NameOfInstitution").HasMaxLength(50);
            builder.Property(x => x.PlaceOfInstitution).HasColumnName("PlaceOfInstitution").HasMaxLength(50);
            builder.Property(x => x.RegisterationAuthority).HasColumnName("RegisterationAuthority").HasMaxLength(50);
            builder.Property(x => x.RegisterationNumber).HasColumnName("RegisterationNumber").HasMaxLength(50);
            builder.Property(x => x.ExpiryOfRegisterationNumber).HasColumnName("ExpiryOfRegisterationNumber").HasMaxLength(20);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
