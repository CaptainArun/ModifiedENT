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
    public class ClientSubscriptionMap : IEntityTypeConfiguration<ClientSubscription>
    {
        public void Configure(EntityTypeBuilder<ClientSubscription> builder)
        {
            builder.ToTable("ClientSubscription", "dbo");
            builder.HasKey(x => x.Subscriptionid);

            builder.Property(x => x.Subscriptionid).HasColumnName("Subscriptionid");
            builder.Property(x => x.tenantid).HasColumnName("tenantid");
            builder.Property(x => x.maxusers).HasColumnName("maxusers");
            builder.Property(x => x.startdate).HasColumnName("startdate");
            builder.Property(x => x.enddate).HasColumnName("enddate");
            builder.Property(x => x.isactive).HasColumnName("isactive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
