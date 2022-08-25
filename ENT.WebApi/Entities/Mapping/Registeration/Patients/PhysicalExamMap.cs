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
    public class PhysicalExamMap : IEntityTypeConfiguration<PhysicalExam>
    {
        public void Configure(EntityTypeBuilder<PhysicalExam> builder)
        {
            builder.ToTable("PhysicalExam", "dbo");
            builder.HasKey(x => x.PhysicalExamID);

            builder.Property(x => x.PhysicalExamID).HasColumnName("PhysicalExamID");
            builder.Property(x => x.VisitID).HasColumnName("VisitID");
            builder.Property(x => x.RecordedDate).HasColumnName("RecordedDate");
            builder.Property(x => x.RecordedBy).HasColumnName("RecordedBy").HasMaxLength(50);
            builder.Property(x => x.HeadValue).HasColumnName("HeadValue").HasMaxLength(25);
            builder.Property(x => x.HeadDesc).HasColumnName("HeadDesc").HasMaxLength(250);
            builder.Property(x => x.EARValue).HasColumnName("EARValue").HasMaxLength(25);
            builder.Property(x => x.EARDesc).HasColumnName("EARDesc").HasMaxLength(250);
            builder.Property(x => x.MouthValue).HasColumnName("MouthValue").HasMaxLength(25);
            builder.Property(x => x.MouthDesc).HasColumnName("MouthDesc").HasMaxLength(250);
            builder.Property(x => x.ThroatValue).HasColumnName("ThroatValue").HasMaxLength(25);
            builder.Property(x => x.ThroatDesc).HasColumnName("ThroatDesc").HasMaxLength(250);
            builder.Property(x => x.HairValue).HasColumnName("HairValue").HasMaxLength(25);
            builder.Property(x => x.HairDesc).HasColumnName("HairDesc").HasMaxLength(250);
            builder.Property(x => x.NeckValue).HasColumnName("NeckValue").HasMaxLength(25);
            builder.Property(x => x.NeckDesc).HasColumnName("NeckDesc").HasMaxLength(250);
            builder.Property(x => x.SpineValue).HasColumnName("SpineValue").HasMaxLength(25);
            builder.Property(x => x.SpineDesc).HasColumnName("SpineDesc").HasMaxLength(250);
            builder.Property(x => x.SkinValue).HasColumnName("SkinValue").HasMaxLength(25);
            builder.Property(x => x.SkinDesc).HasColumnName("SkinDesc").HasMaxLength(250);
            builder.Property(x => x.LegValue).HasColumnName("LegValue").HasMaxLength(25);
            builder.Property(x => x.LegDesc).HasColumnName("LegDesc").HasMaxLength(250);
            builder.Property(x => x.SensationValue).HasColumnName("SensationValue").HasMaxLength(25);
            builder.Property(x => x.SensationDesc).HasColumnName("SensationDesc").HasMaxLength(250);
            builder.Property(x => x.EyeValue).HasColumnName("EyeValue").HasMaxLength(25);
            builder.Property(x => x.EyeDesc).HasColumnName("EyeDesc").HasMaxLength(250);
            builder.Property(x => x.NoseValue).HasColumnName("NoseValue").HasMaxLength(25);
            builder.Property(x => x.NoseDesc).HasColumnName("NoseDesc").HasMaxLength(250);
            builder.Property(x => x.TeethValue).HasColumnName("TeethValue").HasMaxLength(25);
            builder.Property(x => x.TeethDesc).HasColumnName("TeethDesc").HasMaxLength(250);
            builder.Property(x => x.ChestValue).HasColumnName("ChestValue").HasMaxLength(25);
            builder.Property(x => x.ChestDesc).HasColumnName("ChestDesc").HasMaxLength(250);
            builder.Property(x => x.ThoraxValue).HasColumnName("ThoraxValue").HasMaxLength(25);
            builder.Property(x => x.ThoraxDesc).HasColumnName("ThoraxDesc").HasMaxLength(250);
            builder.Property(x => x.AbdomenValue).HasColumnName("AbdomenValue").HasMaxLength(25);
            builder.Property(x => x.AbdomenDesc).HasColumnName("AbdomenDesc").HasMaxLength(250);
            builder.Property(x => x.PelvisValue).HasColumnName("PelvisValue").HasMaxLength(25);
            builder.Property(x => x.PelvisDesc).HasColumnName("PelvisDesc").HasMaxLength(250);
            builder.Property(x => x.NailsValue).HasColumnName("NailsValue").HasMaxLength(25);
            builder.Property(x => x.NailsDesc).HasColumnName("NailsDesc").HasMaxLength(250);
            builder.Property(x => x.FootValue).HasColumnName("FootValue").HasMaxLength(25);
            builder.Property(x => x.FootDesc).HasColumnName("FootDesc").HasMaxLength(250);
            builder.Property(x => x.HandValue).HasColumnName("HandValue").HasMaxLength(25);
            builder.Property(x => x.HandDesc).HasColumnName("HandDesc").HasMaxLength(250);
            builder.Property(x => x.IsActive).HasColumnName("IsActive");
            builder.Property(x => x.Createddate).HasColumnName("Createddate");
            builder.Property(x => x.CreatedBy).HasColumnName("CreatedBy").HasMaxLength(50);
            builder.Property(x => x.ModifiedDate).HasColumnName("ModifiedDate");
            builder.Property(x => x.ModifiedBy).HasColumnName("ModifiedBy").HasMaxLength(50);
        }
    }
}
