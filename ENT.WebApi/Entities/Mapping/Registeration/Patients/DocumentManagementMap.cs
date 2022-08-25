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
    public class DocumentManagementMap : IEntityTypeConfiguration<DocumentManagement>
    {
        public void Configure(EntityTypeBuilder<DocumentManagement> builder)
        {
            builder.ToTable("DocumentManagement", "dbo");
            builder.HasKey(x => x.DocumentID);

            builder.Property(x => x.DocumentID).HasColumnName("DocumentID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.DocumentName).HasColumnName("DocumentName").HasMaxLength(50);
            builder.Property(x => x.DocumentType).HasColumnName("DocumentType").HasMaxLength(30);
            builder.Property(x => x.DocumentNotes).HasColumnName("DocumentNotes").HasMaxLength(500);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
