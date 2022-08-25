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
    public class TympanometryMap : IEntityTypeConfiguration<Tympanometry>
    {
        public void Configure(EntityTypeBuilder<Tympanometry> builder)
        {
            builder.ToTable("Tympanometry", "dbo");
            builder.HasKey(x => x.TympanogramId);

            builder.Property(x => x.TympanogramId).HasColumnName("TympanogramId");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.ECVRight).HasColumnName("ECVRight");
            builder.Property(x => x.ECVLeft).HasColumnName("ECVLeft");
            builder.Property(x => x.MEPRight).HasColumnName("MEPRight");
            builder.Property(x => x.MEPLeft).HasColumnName("MEPLeft");
            builder.Property(x => x.SCRight).HasColumnName("SCRight");
            builder.Property(x => x.SCLeft).HasColumnName("SCLeft");
            builder.Property(x => x.GradRight).HasColumnName("GradRight");
            builder.Property(x => x.GradLeft).HasColumnName("GradLeft");
            builder.Property(x => x.TWRight).HasColumnName("TWRight");
            builder.Property(x => x.TWLeft).HasColumnName("TWLeft");
            builder.Property(x => x.SpeedRight).HasColumnName("SpeedRight");
            builder.Property(x => x.SpeedLeft).HasColumnName("SpeedLeft");
            builder.Property(x => x.DirectionRight).HasColumnName("DirectionRight");
            builder.Property(x => x.DirectionLeft).HasColumnName("DirectionLeft");
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
