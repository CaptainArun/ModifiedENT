using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using ENT.WebApi.DAL.Interfaces;
using ENT.WebApi.DAL.Services;

namespace ENT.WebApi.Injectors
{
    public class PreProcedureSvcInjector
    {
        public static void InjectInjectors(IServiceCollection services)
        {
            services.AddScoped<IPreProcedureService, PreProcedureService>();
        }
    }
}
