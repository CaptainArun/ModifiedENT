using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Data.ORM;

namespace ENT.WebApi.Injectors
{
    public class BaseInjector
    {
        public static void InjectInjectors(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped(typeof(IGlobalGenericRepository<>), typeof(GlobalGenericRepository<>));
            services.AddScoped<IGlobalUnitOfWork, GlobalUnitOfWork>();

            AuthSvcInjector.InjectInjectors(services);
            RegisterationSvcInjector.InjectInjectors(services);
            AppointmentSvcInjector.InjectInjectors(services);
            UtilSvcInjector.InjectInjectors(services);
            VisitSvcInjector.InjectInjectors(services);
            CallCenterSvcInjector.InjectInjectors(services);
            ProviderSetUpSvcInjector.InjectInjectors(services);
            StaffSvcInjector.InjectInjectors(services);
            TriageSvcInjector.InjectInjectors(services);
            AudiologySvcInjector.InjectInjectors(services);
            PreProcedureSvcInjector.InjectInjectors(services);
            PostProcedureSvcInjector.InjectInjectors(services);
            AdmissionSvcInjector.InjectInjectors(services);
            BillingSvcInjector.InjectInjectors(services);
            DischargeSvcInjector.InjectInjectors(services);
            EPrescriptionSvcInjector.InjectInjectors(services);
            ELabSvcInjector.InjectInjectors(services);
            TenantMasterSvcInjector.InjectInjectors(services);
        }
    }
}
