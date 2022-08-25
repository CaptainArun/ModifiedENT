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
    public class ProviderVacationMap : IEntityTypeConfiguration<ProviderVacation>
    {
        public void Configure(EntityTypeBuilder<ProviderVacation> builder)
        {
            builder.ToTable("Providervacation", "dbo");
            builder.HasKey(x => x.ProvidervacationID);

            builder.Property(x => x.ProvidervacationID).HasColumnName("ProvidervacationID");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.Reason).HasColumnName("Reason").HasMaxLength(100);
            builder.Property(x => x.StartDate).HasColumnName("StartDate");
            builder.Property(x => x.EndDate).HasColumnName("EndDate");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
