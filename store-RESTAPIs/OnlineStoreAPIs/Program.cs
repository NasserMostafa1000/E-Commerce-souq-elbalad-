﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OnlineStoreAPIs.Hubs;
using StoreBusinessLayer.AdminInfo;
using StoreBusinessLayer.Carts;
using StoreBusinessLayer.Clients;
using StoreBusinessLayer.Orders;
using StoreBusinessLayer.Products;
using StoreBusinessLayer.Shipping;
using StoreBusinessLayer.Users;
using StoreDataAccessLayer;
using StoreServices.CartServices;
using StoreServices.ClientsServices;
using StoreServices.DiscountCodes;
using StoreServices.Discounts;
using StoreServices.LoginServices;
using StoreServices.OrdersServices;
using StoreServices.Products.ProductInterfaces;
using StoreServices.ShippingServices;
using StoreServices.UsersServices;
using System.Text;

namespace OnlineStoreAPIs
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("ConnStr")));

            // تسجيل خدمات الأعمال (Business Layer)
            builder.Services.AddScoped<IProductCategory,CategoriesRepo>();
            builder.Services.AddScoped<IShipping,ShippingRepo>();
            builder.Services.AddScoped<IUser,UsersRepo>();
            builder.Services.AddScoped<TokenService>();
            builder.Services.AddScoped<IClient,ClientsRepo>();
            builder.Services.AddScoped<IProduct,ProductsRepo>();
            builder.Services.AddScoped<IProductColor,ColorsRepo>();
            builder.Services.AddScoped<IProductSize,SizesRepo>();
            builder.Services.AddScoped<IOrder,OrdersRepo>();
            builder.Services.AddScoped<ISearchLogs, SearchingLogsRepo>();
            builder.Services.AddScoped<IShippingDiscountCodesRepo, shippingDiscountCodesRepo>();
            builder.Services.AddScoped<ICart,CartsRepo>();
            builder.Services.AddScoped<IAdminContactInfo, AdminContactInfo>();
            builder.Services.AddSignalR();

            builder.Services.AddHttpClient<FaceBookLoginService>();


            // إعداد المصادقة باستخدام JWT
            var key = Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]);
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                        ValidAudience = builder.Configuration["JwtSettings:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(key)
                    };
                    
                });

            // تفعيل التصريح (Authorization)
            builder.Services.AddAuthorization();

            // تفعيل CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy =>
                    {
                        policy.AllowAnyOrigin() 
                              .AllowAnyMethod() 
                              .AllowAnyHeader(); 
                    });
            });



            var app = builder.Build();
            app.UseCors("AllowAll"); 
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                _ = endpoints.MapControllers();
                _ =endpoints.MapHub<OrderHub>("/orderHub");
            });

            app.UseHttpsRedirection();

            // تفعيل Swagger في وضع التطوير
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                    c.RoutePrefix = "swagger";
                });
            }

            app.Run();
        }
    }
}
