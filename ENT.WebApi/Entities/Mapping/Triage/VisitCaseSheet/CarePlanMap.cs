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
    public class CarePlanMap : IEntityTypeConfiguration<CarePlan>
    {
        public void Configure(EntityTypeBuilder<CarePlan> builder)
        {
            builder.ToTable("CarePlan", "dbo");
            builder.HasKey(x => x.CarePlanId);

            builder.Property(x => x.CarePlanId).HasColumnName("CarePlanId");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.PlanningActivity).HasColumnName("PlanningActivity").HasMaxLength(2000);
            builder.Property(x => x.Duration).HasColumnName("Duration").HasMaxLength(20);
            builder.Property(x => x.StartDate).HasColumnName("StartDate");
            builder.Property(x => x.EndDate).HasColumnName("EndDate");
            builder.Property(x => x.CarePlanStatus).HasColumnName("CarePlanStatus").HasMaxLength(20);
            builder.Property(x => x.Progress).HasColumnName("Progress").HasMaxLength(20);
            builder.Property(x => x.NextVisitDate).HasColumnName("NextVisitDate");
            builder.Property(x => x.AdditionalNotes).HasColumnName("AdditionalNotes").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
