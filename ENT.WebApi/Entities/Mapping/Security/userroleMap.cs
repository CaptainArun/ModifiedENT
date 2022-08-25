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
    public class userroleMap : IEntityTypeConfiguration<userrole>
    {
        public void Configure(EntityTypeBuilder<userrole> builder)
        {
            builder.ToTable("userrole", "dbo");
            builder.HasKey(x => x.Userroleid);

            builder.Property(x => x.Userroleid).HasColumnName("Userroleid");
            builder.Property(x => x.Userid).HasColumnName("Userid").HasMaxLength(40);
            builder.Property(x => x.Roleid).HasColumnName("Roleid");
            builder.Property(x => x.Deleted).HasColumnName("Deleted");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.Createdby).HasColumnName("Createdby").HasMaxLength(50);
            builder.Property(x => x.Modifieddate).HasColumnName("Modifieddate");
            builder.Property(x => x.Modifiedby).HasColumnName("Modifiedby").HasMaxLength(50);
        }
    }
}
