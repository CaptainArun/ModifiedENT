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
    public class EmployeeMap : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {
            builder.ToTable("Employee", "dbo");
            builder.HasKey(x => x.EmployeeId);

            builder.Property(x => x.EmployeeId).HasColumnName("EmployeeId");
            builder.Property(x => x.UserId).HasColumnName("UserId").HasMaxLength(40);
            builder.Property(x => x.FacilityId).HasColumnName("FacilityId").HasMaxLength(100);
            builder.Property(x => x.RoleId).HasColumnName("RoleId");
            builder.Property(x => x.EmployeeDepartment).HasColumnName("EmployeeDepartment");
            builder.Property(x => x.EmployeeCategory).HasColumnName("EmployeeCategory");
            builder.Property(x => x.EmployeeUserType).HasColumnName("EmployeeUserType");
            builder.Property(x => x.EmployeeNo).HasColumnName("EmployeeNo").HasMaxLength(50);
            builder.Property(x => x.DOJ).HasColumnName("DOJ");
            builder.Property(x => x.SchedulerDepartment).HasColumnName("SchedulerDepartment");
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(500);
            builder.Property(x => x.EmployeeSalutation).HasColumnName("EmployeeSalutation");
            builder.Property(x => x.EmployeeFirstName).HasColumnName("EmployeeFirstName").HasMaxLength(50);
            builder.Property(x => x.EmployeeMiddleName).HasColumnName("EmployeeMiddleName").HasMaxLength(50);
            builder.Property(x => x.EmployeeLastName).HasColumnName("EmployeeLastName").HasMaxLength(50);
            builder.Property(x => x.Gender).HasColumnName("Gender");
            builder.Property(x => x.EmployeeDOB).HasColumnName("EmployeeDOB");
            builder.Property(x => x.EmployeeAge).HasColumnName("EmployeeAge");
            builder.Property(x => x.EmployeeIdentificationtype1).HasColumnName("EmployeeIdentificationtype1");
            builder.Property(x => x.EmployeeIdentificationtype1details).HasColumnName("EmployeeIdentificationtype1details").HasMaxLength(50);
            builder.Property(x => x.EmployeeIdentificationtype2).HasColumnName("EmployeeIdentificationtype2");
            builder.Property(x => x.EmployeeIdentificationtype2details).HasColumnName("EmployeeIdentificationtype2details").HasMaxLength(50);
            builder.Property(x => x.MaritalStatus).HasColumnName("MaritalStatus").HasMaxLength(50);
            builder.Property(x => x.MothersMaiden).HasColumnName("MothersMaiden").HasMaxLength(50);
            builder.Property(x => x.PreferredLanguage).HasColumnName("PreferredLanguage").HasMaxLength(50);
            builder.Property(x => x.Bloodgroup).HasColumnName("Bloodgroup").HasMaxLength(50);
            builder.Property(x => x.CellNo).HasColumnName("CellNo").HasMaxLength(20);
            builder.Property(x => x.PhoneNo).HasColumnName("PhoneNo").HasMaxLength(20);
            builder.Property(x => x.WhatsAppNo).HasColumnName("WhatsAppNo").HasMaxLength(20);
            builder.Property(x => x.EMail).HasColumnName("EMail").HasMaxLength(40);
            builder.Property(x => x.EmergencySalutation).HasColumnName("EmergencySalutation");
            builder.Property(x => x.EmergencyFirstName).HasColumnName("EmergencyFirstName").HasMaxLength(50);
            builder.Property(x => x.EmergencyLastName).HasColumnName("EmergencyLastName").HasMaxLength(50);
            builder.Property(x => x.EmergencyContactType).HasColumnName("EmergencyContactType");
            builder.Property(x => x.EmergencyContactNo).HasColumnName("EmergencyContactNo").HasMaxLength(20);
            builder.Property(x => x.TelephoneNo).HasColumnName("TelephoneNo").HasMaxLength(20);
            builder.Property(x => x.Fax).HasColumnName("Fax").HasMaxLength(30);
            builder.Property(x => x.RelationshipToEmployee).HasColumnName("RelationshipToEmployee");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
