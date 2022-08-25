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
    public class eLabMasterMap : IEntityTypeConfiguration<eLabMaster>
    {
        public void Configure(EntityTypeBuilder<eLabMaster> builder)
        {
            builder.ToTable("eLabMaster", "Master");
            builder.HasKey(x => x.LabMasterID);

            builder.Property(x => x.LabMasterID).HasColumnName("LabMasterID");
            builder.Property(x => x.DepartmentID).HasColumnName("DepartmentID");
            builder.Property(x => x.MasterLabTypeCode).HasColumnName("MasterLabTypeCode").HasMaxLength(20);
            builder.Property(x => x.MasterLabType).HasColumnName("MasterLabType").HasMaxLength(25);
            builder.Property(x => x.LabTypeDesc).HasColumnName("LabTypeDesc").HasMaxLength(100);
            builder.Property(x => x.Status).HasColumnName("Status").HasMaxLength(20);
            builder.Property(x => x.OrderNo).HasColumnName("OrderNo");
            builder.Property(x => x.AllowSubMaster).HasColumnName("AllowSubMaster");
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
