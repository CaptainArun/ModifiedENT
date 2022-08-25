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
    public class AudiologyRequestMap : IEntityTypeConfiguration<AudiologyRequest>
    {
        public void Configure(EntityTypeBuilder<AudiologyRequest> builder)
        {
            builder.ToTable("AudiologyRequest", "dbo");
            builder.HasKey(x => x.AudiologyRequestID);

            builder.Property(x => x.AudiologyRequestID).HasColumnName("AudiologyRequestID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.ProviderId).HasColumnName("ProviderId");
            builder.Property(x => x.TuningFork).HasColumnName("TuningFork");
            builder.Property(x => x.SpecialTest).HasColumnName("SpecialTest");
            builder.Property(x => x.Tympanometry).HasColumnName("Tympanometry");
            builder.Property(x => x.OAE).HasColumnName("OAE");
            builder.Property(x => x.BERA).HasColumnName("BERA");
            builder.Property(x => x.ASSR).HasColumnName("ASSR");
            builder.Property(x => x.HearingAid).HasColumnName("HearingAid");
            builder.Property(x => x.TinnitusMasking).HasColumnName("TinnitusMasking");
            builder.Property(x => x.SpeechTherapy).HasColumnName("SpeechTherapy");
            builder.Property(x => x.Electrocochleography).HasColumnName("Electrocochleography");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
