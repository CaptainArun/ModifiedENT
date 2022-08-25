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
    public class ProviderLanguagesMap : IEntityTypeConfiguration<ProviderLanguages>
    {
        public void Configure(EntityTypeBuilder<ProviderLanguages> builder)
        {
            builder.ToTable("ProviderLanguages", "dbo");
            builder.HasKey(x => x.ProviderLanguageId);

            builder.Property(x => x.ProviderLanguageId).HasColumnName("ProviderLanguageId");
            builder.Property(x => x.ProviderID).HasColumnName("ProviderID");
            builder.Property(x => x.Language).HasColumnName("Language").HasMaxLength(50);
            builder.Property(x => x.IsSpeak).HasColumnName("IsSpeak");
            builder.Property(x => x.SpeakingLevel).HasColumnName("SpeakingLevel");
            builder.Property(x => x.IsRead).HasColumnName("IsRead");
            builder.Property(x => x.ReadingLevel).HasColumnName("ReadingLevel");
            builder.Property(x => x.IsWrite).HasColumnName("IsWrite");
            builder.Property(x => x.WritingLevel).HasColumnName("WritingLevel");
            builder.Property(x => x.CreatedDate).HasColumnName("CreatedDate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
