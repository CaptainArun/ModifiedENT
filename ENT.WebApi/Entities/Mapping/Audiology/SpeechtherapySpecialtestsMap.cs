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
    public class SpeechtherapySpecialtestsMap : IEntityTypeConfiguration<SpeechtherapySpecialtests>
    {
        public void Configure(EntityTypeBuilder<SpeechtherapySpecialtests> builder)
        {
            builder.ToTable("SpeechtherapySpecialtests", "dbo");
            builder.HasKey(x => x.SpeechTherapySpecialTestId);

            builder.Property(x => x.SpeechTherapySpecialTestId).HasColumnName("STSTId");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.ChiefComplaint).HasColumnName("ChiefComplaint").HasMaxLength(50);
            builder.Property(x => x.SRTRight).HasColumnName("SRTRight");
            builder.Property(x => x.SRTLeft).HasColumnName("SRTLeft");
            builder.Property(x => x.SDSRight).HasColumnName("SDSRight");
            builder.Property(x => x.SDSLeft).HasColumnName("SDSLeft");
            builder.Property(x => x.SISIRight).HasColumnName("SISIRight");
            builder.Property(x => x.SISILeft).HasColumnName("SISILeft");
            builder.Property(x => x.TDTRight).HasColumnName("TDTRight");
            builder.Property(x => x.TDTLeft).HasColumnName("TDTLeft");
            builder.Property(x => x.ABLBLeft).HasColumnName("ABLBLeft");
            builder.Property(x => x.ABLBRight).HasColumnName("ABLBRight");
            builder.Property(x => x.NotesandInstructions).HasColumnName("NotesandInstructions").HasMaxLength(50);
            builder.Property(x => x.Starttime).HasColumnName("Starttime");
            builder.Property(x => x.Endtime).HasColumnName("Endtime");
            builder.Property(x => x.Totalduration).HasColumnName("Totalduration");
            builder.Property(x => x.Nextfollowupdate).HasColumnName("Nextfollowupdate");
            builder.Property(x => x.SignOffBy).HasColumnName("SignOffBy").HasMaxLength(50);
            builder.Property(x => x.SignOffStatus).HasColumnName("SignOffStatus");
            builder.Property(x => x.SignOffDate).HasColumnName("SignOffDate");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
