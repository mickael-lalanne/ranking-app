using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using ranking_app.Data;
using Microsoft.AspNetCore.HttpOverrides;

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

// Security : Sets the Strict-Transport-Security header
builder.Services.AddHsts(options =>
{
    options.Preload = true;
    options.IncludeSubDomains = true;
});

// To fix ERR_TOO_MANY_REDIRECTS error
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

// AUTHENTICATION
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        System.Diagnostics.Debug.WriteLine("#AddAuthentication#");
        // Authority is the URL of your clerk instance
        options.Authority = builder.Configuration["Clerk:Authority"];
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            // Disable audience validation as we aren't using it
            ValidateAudience = false,
            NameClaimType = ClaimTypes.NameIdentifier
        };
        options.Events = new JwtBearerEvents()
        {
            // Additional validation for AZP claim
            OnTokenValidated = context =>
            {
                var azp = context.Principal?.FindFirstValue("azp");

                // AuthorizedParty is the base URL of your frontend.
                if (string.IsNullOrEmpty(azp) || !azp.Equals(builder.Configuration["Clerk:AuthorizedParty"]))
                    context.Fail("AZP Claim is invalid or missing");

                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

app.UseForwardedHeaders();
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

// Middleware to add secure headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("Referrer-Policy", "no-referrer");
    context.Response.Headers.Add("Permissions-Policy", "camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), usb=()");
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'");
    await next();
});

app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.Run();
