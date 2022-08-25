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
    public class DrugChartMap : IEntityTypeConfiguration<DrugChart>
    {
        public void Configure(EntityTypeBuilder<DrugChart> builder)
        {
            builder.ToTable("DrugChart", "dbo");
            builder.HasKey(x => x.DrugChartID);

            builder.Property(x => x.DrugChartID).HasColumnName("DrugChartID");
            builder.Property(x => x.PatientID).HasColumnName("PatientID");
            builder.Property(x => x.AdmissionNo).HasColumnName("AdmissionNo").HasMaxLength(50);
            builder.Property(x => x.RecordedDuringID).HasColumnName("RecordedDuringID");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.DrugDate).HasColumnName("DrugDate");
            builder.Property(x => x.DrugName).HasColumnName("DrugName").HasMaxLength(500);
            builder.Property(x => x.DrugRoute).HasColumnName("DrugRoute").HasMaxLength(500);
            builder.Property(x => x.DosageDesc).HasColumnName("DosageDesc").HasMaxLength(1000);
            builder.Property(x => x.DrugTime).HasColumnName("DrugTime").HasMaxLength(20);
            builder.Property(x => x.RateOfInfusion).HasColumnName("RateOfInfusion").HasMaxLength(75);
            builder.Property(x => x.Frequency).HasColumnName("Frequency").HasMaxLength(75);
            builder.Property(x => x.OrderingPhysician).HasColumnName("OrderingPhysician").HasMaxLength(100);
            builder.Property(x => x.StopMedicationOn).HasColumnName("StopMedicationOn").HasMaxLength(1000);
            builder.Property(x => x.AdditionalInfo).HasColumnName("AdditionalInfo").HasMaxLength(1000);
            builder.Property(x => x.ProcedureType).HasColumnName("ProcedureType").HasMaxLength(50);
            builder.Property(x => x.DrugSignOffBy).HasColumnName("DrugSignOffBy").HasMaxLength(50);
            builder.Property(x => x.DrugSignOffDate).HasColumnName("DrugSignOffDate");
            builder.Property(x => x.DrugSignOffStatus).HasColumnName("DrugSignOffStatus");
            builder.Property(x => x.AdministratedBy).HasColumnName("AdministratedBy");
            builder.Property(x => x.AdministratedRemarks).HasColumnName("AdministratedRemarks").HasMaxLength(500);
            builder.Property(x => x.AdminDrugSignOffBy).HasColumnName("AdminDrugSignOffBy").HasMaxLength(50);
            builder.Property(x => x.AdminDrugSignOffDate).HasColumnName("AdminDrugSignOffDate");
            builder.Property(x => x.AdminDrugSignOffStatus).HasColumnName("AdminDrugSignOffStatus");
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
        }
    }
}
