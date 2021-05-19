using System.Reflection;
using Core.Data;
using Core.Models;
using Core.Repositories.Abstracts;
using Core.Repositories.Realizations;
using Core.Services.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace Core
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwaggerGen();
            
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(
                    Configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<ICardRepository, CardRepository>();
            services.AddScoped<ITagRepository, TagRepository>();
            services.AddScoped<IDeckRepository, DeckRepository>();
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer(Configuration.GetSection("IdentityServer"))
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services.AddAuthentication()
                .AddIdentityServerJwt();

            services.AddScoped<IAuthorizationHandler, MustBeDeckOwnerHandler>();
            services.AddAuthorization(options =>
            {
                options.AddPolicy("MustBeDeckOwner", policyBuilder =>
                {
                    policyBuilder.RequireAuthenticatedUser();
                    policyBuilder.AddRequirements(new MustBeDeckOwnerRequirement());
                });
            });

            services.AddControllers(cfg =>
                {
                    cfg.ReturnHttpNotAcceptable = true;
                    cfg.RespectBrowserAcceptHeader = true;
                })
                .ConfigureApiBehaviorOptions(opt =>
                {
                    opt.SuppressModelStateInvalidFilter = true;
                    opt.SuppressMapClientErrors = true;
                })
                .AddNewtonsoftJson(opt =>
                {
                    opt.SerializerSettings.DefaultValueHandling = DefaultValueHandling.Populate;
                    opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    opt.SerializerSettings.Converters.Add(new StringEnumConverter());
                });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSwagger(c =>
            {
                c.SerializeAsV2 = true;
            });

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cardsetta");
                c.RoutePrefix = "swagger";
            });

            app.UseSerilogRequestLogging();
            
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}