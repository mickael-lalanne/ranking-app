﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ranking_app.Data;

#nullable disable

namespace ranking_app.Migrations
{
    [DbContext(typeof(RankingAppDbContext))]
    partial class RankingAppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ranking_app.Element", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Image")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<Guid?>("TemplateModelId")
                        .HasColumnType("uuid");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("TemplateModelId");

                    b.ToTable("Element");
                });

            modelBuilder.Entity("ranking_app.Models.TemplateModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Templates");
                });

            modelBuilder.Entity("ranking_app.Models.TierlistModel", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("TemplateId")
                        .HasColumnType("uuid");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Tierlists");
                });

            modelBuilder.Entity("ranking_app.RankedElement", b =>
                {
                    b.Property<Guid>("ElementId")
                        .HasColumnType("uuid");

                    b.Property<int>("Position")
                        .HasColumnType("integer");

                    b.Property<Guid>("TierId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("TierlistModelId")
                        .HasColumnType("uuid");

                    b.HasKey("ElementId");

                    b.HasIndex("TierlistModelId");

                    b.ToTable("RankedElements");
                });

            modelBuilder.Entity("ranking_app.Tier", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Rank")
                        .HasColumnType("integer");

                    b.Property<Guid?>("TemplateModelId")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("TemplateModelId");

                    b.ToTable("Tier");
                });

            modelBuilder.Entity("ranking_app.Element", b =>
                {
                    b.HasOne("ranking_app.Models.TemplateModel", null)
                        .WithMany("Elements")
                        .HasForeignKey("TemplateModelId");
                });

            modelBuilder.Entity("ranking_app.RankedElement", b =>
                {
                    b.HasOne("ranking_app.Models.TierlistModel", null)
                        .WithMany("RankedElements")
                        .HasForeignKey("TierlistModelId");
                });

            modelBuilder.Entity("ranking_app.Tier", b =>
                {
                    b.HasOne("ranking_app.Models.TemplateModel", null)
                        .WithMany("Tiers")
                        .HasForeignKey("TemplateModelId");
                });

            modelBuilder.Entity("ranking_app.Models.TemplateModel", b =>
                {
                    b.Navigation("Elements");

                    b.Navigation("Tiers");
                });

            modelBuilder.Entity("ranking_app.Models.TierlistModel", b =>
                {
                    b.Navigation("RankedElements");
                });
#pragma warning restore 612, 618
        }
    }
}
