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
    public class eLabSubMasterMap : IEntityTypeConfiguration<eLabSubMaster>
    {
        public void Configure(EntityTypeBuilder<eLabSubMaster> builder)
        {
            builder.ToTable("eLabSubMaster", "Master");
            builder.HasKey(x => x.LabSubMasterID);

            builder.Property(x => x.LabSubMasterID).HasColumnName("LabSubMasterID");
            builder.Property(x => x.DepartmentID).HasColumnName("DepartmentID");
            builder.Property(x => x.LabMasterId).HasColumnName("LabMasterId");
            builder.Property(x => x.SubMasterLabCode).HasColumnName("SubMasterLabCode").HasMaxLength(20);
            builder.Property(x => x.SubMasterLabType).HasColumnName("SubMasterLabType").HasMaxLength(50);
            builder.Property(x => x.SubMasterLabTypeDesc).HasColumnName("SubMasterLabTypeDesc").HasMaxLength(100);
            builder.Property(x => x.Status).HasColumnName("Status").HasMaxLength(20);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.Units).HasColumnName("Units").HasMaxLength(50);
            builder.Property(x => x.NormalRange).HasColumnName("NormalRange").HasMaxLength(200);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
