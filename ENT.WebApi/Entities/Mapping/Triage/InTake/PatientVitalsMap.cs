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
    public class PatientVitalsMap : IEntityTypeConfiguration<PatientVitals>
    {
        public void Configure(EntityTypeBuilder<PatientVitals> builder)
        {
            builder.ToTable("PatientVitals", "dbo");
            builder.HasKey(x => x.VitalsId);

            builder.Property(x => x.VitalsId).HasColumnName("VitalsId");
            builder.Property(x => x.PatientId).HasColumnName("PatientId");
            builder.Property(x => x.VisitId).HasColumnName("VisitId");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.Height).HasColumnName("Height");
            builder.Property(x => x.Weight).HasColumnName("Weight");
            builder.Property(x => x.BMI).HasColumnName("BMI");
            builder.Property(x => x.WaistCircumference).HasColumnName("WaistCircumference").HasMaxLength(10);
            builder.Property(x => x.BPSystolic).HasColumnName("BPSystolic");
            builder.Property(x => x.BPDiastolic).HasColumnName("BPDiastolic");
            builder.Property(x => x.BPLocationID).HasColumnName("BPLocationID");
            builder.Property(x => x.Temperature).HasColumnName("Temperature");
            builder.Property(x => x.TemperatureLocation).HasColumnName("TemperatureLocation");
            builder.Property(x => x.HeartRate).HasColumnName("HeartRate");
            builder.Property(x => x.RespiratoryRate).HasColumnName("RespiratoryRate");
            builder.Property(x => x.O2Saturation).HasColumnName("O2Saturation");
            builder.Property(x => x.BloodsugarRandom).HasColumnName("BloodsugarRandom");
            builder.Property(x => x.BloodsugarFasting).HasColumnName("BloodsugarFasting");
            builder.Property(x => x.BloodSugarPostpardinal).HasColumnName("BloodSugarPostpardinal");
            builder.Property(x => x.PainArea).HasColumnName("PainArea").HasMaxLength(50);
            builder.Property(x => x.PainScale).HasColumnName("PainScale");
            builder.Property(x => x.HeadCircumference).HasColumnName("HeadCircumference");
            builder.Property(x => x.LastMealdetails).HasColumnName("LastMealdetails").HasMaxLength(50);
            builder.Property(x => x.LastMealtakenon).HasColumnName("LastMealtakenon");
            builder.Property(x => x.PatientPosition).HasColumnName("PatientPosition");
            builder.Property(x => x.IsBloodPressure).HasColumnName("IsBloodPressure").HasMaxLength(1);
            builder.Property(x => x.IsDiabetic).HasColumnName("IsDiabetic").HasMaxLength(1);
            builder.Property(x => x.Notes).HasColumnName("Notes").HasMaxLength(1000);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");            
        }
    }
}
