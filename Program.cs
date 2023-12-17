using Microsoft.EntityFrameworkCore;
using ranking_app.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = !String.IsNullOrEmpty(builder.Configuration.GetValue<string>("RANKING_APP_CONNECTION_STR"))
    // If environnement variable is defined for the connection string, use it
    ? Environment.GetEnvironmentVariable("RANKING_APP_CONNECTION_STR")
    // Otherwise it means we're in local, so use the connection string defined in the appsettings.json
    : builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Configure dependency injection for ranking_app_DB postgresql database
builder.Services.AddDbContext<RankingAppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.Run();
