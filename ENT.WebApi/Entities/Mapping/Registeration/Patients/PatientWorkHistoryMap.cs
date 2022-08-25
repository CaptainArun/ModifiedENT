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
    public class PatientWorkHistoryMap : IEntityTypeConfiguration<PatientWorkHistory>
    {
        public void Configure(EntityTypeBuilder<PatientWorkHistory> builder)
        {
            builder.ToTable("PatientWorkHistory", "dbo");
            builder.HasKey(x => x.PatientWorkHistoryID);

            builder.Property(x => x.PatientWorkHistoryID).HasColumnName("PatientWorkHistoryID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.EmployerName).HasColumnName("EmployerName").HasMaxLength(50);
            builder.Property(x => x.ContactPerson).HasColumnName("ContactPerson").HasMaxLength(50);
            builder.Property(x => x.Email).HasColumnName("Email").HasMaxLength(50);
            builder.Property(x => x.CellPhone).HasColumnName("CellPhone").HasMaxLength(50);
            builder.Property(x => x.PhoneNo).HasColumnName("PhoneNo").HasMaxLength(50);
            builder.Property(x => x.AddressLine1).HasColumnName("AddressLine1").HasMaxLength(50);
            builder.Property(x => x.AddressLine2).HasColumnName("AddressLine2").HasMaxLength(50);
            builder.Property(x => x.Town).HasColumnName("Town").HasMaxLength(50);
            builder.Property(x => x.City).HasColumnName("City").HasMaxLength(50);
            builder.Property(x => x.District).HasColumnName("District").HasMaxLength(50);
            builder.Property(x => x.State).HasColumnName("State").HasMaxLength(50);
            builder.Property(x => x.Country).HasColumnName("Country").HasMaxLength(50);
            builder.Property(x => x.PIN).HasColumnName("PIN").HasMaxLength(50);
            builder.Property(x => x.WorkDateFrom).HasColumnName("WorkDateFrom");
            builder.Property(x => x.WorkDateTo).HasColumnName("WorkDateTo");
            builder.Property(x => x.AdditionalNotes).HasColumnName("AdditionalNotes").HasMaxLength(200);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
