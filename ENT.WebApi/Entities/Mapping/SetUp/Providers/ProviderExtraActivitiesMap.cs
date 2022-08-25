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
    public class ProviderExtraActivitiesMap : IEntityTypeConfiguration<ProviderExtraActivities>
    {
        public void Configure(EntityTypeBuilder<ProviderExtraActivities> builder)
        {
            builder.ToTable("ProviderExtraActivities", "dbo");
            builder.HasKey(x => x.ProviderActivityId);

            builder.Property(x => x.ProviderActivityId).HasColumnName("ProviderActivityId");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.NatureOfActivity).HasColumnName("NatureOfActivity").HasMaxLength(100);
            builder.Property(x => x.YearOfParticipation).HasColumnName("YearOfParticipation");
            builder.Property(x => x.PrizesorAwards).HasColumnName("PrizesorAwards").HasMaxLength(150);
            builder.Property(x => x.StrengthandAreaneedImprovement).HasColumnName("StrengthandAreaneedImprovement").HasMaxLength(200);
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
