using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ENT.WebApi.Data.Context;

namespace ENT.WebApi.Middlewares
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate _next;       
        private readonly IConfiguration _config;
        public AuthenticationMiddleware(RequestDelegate next, IConfiguration config)
        {
            _next = next;            
            _config = config;
        }
        
        public async Task Invoke(HttpContext context)
        {
            try
            {
                string dbName = context.Request.Headers["DataBaseName"];                
                
                if (dbName != null && dbName != "")
                {
                    //string ConnectionString = _config.GetValue<string>("ConnectionStrings:ConnectionString");
                    string ConnectionString = _config["ConnectionStrings:ConnectionString"];
                    string con = ConnectionString.Replace("_DynamicCustomDB_", dbName);

                    if (true)  
                    {
                        AppDbContext.ConnectionString = con; 
                        if (string.IsNullOrEmpty(AppDbContext.ConnectionString))
                        {
                            //no authorization header    
                            context.Response.StatusCode = 401; //Unauthorized    
                            return;
                        }
                        await _next.Invoke(context);
                    }
                    else
                    {
                        context.Response.StatusCode = 401; //Unauthorized    
                        return;
                    }
                }
                else
                {
                    // no authorization header    
                    context.Response.StatusCode = 401; //Unauthorized    
                    return;
                }
            }
            catch
            {
                // no authorization header    
                context.Response.StatusCode = 400;                
                return;
            }
        }
    }
}
