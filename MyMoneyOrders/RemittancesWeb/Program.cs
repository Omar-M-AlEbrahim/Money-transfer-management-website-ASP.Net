using Microsoft.AspNetCore.Authentication.JwtBearer; // استيراد مكتبة المصادقة بواسطة JWT
using Microsoft.AspNetCore.Identity; // استيراد مكتبة الهوية
using Microsoft.EntityFrameworkCore; // استيراد مكتبة Entity Framework Core
using Microsoft.IdentityModel.Tokens; // استيراد مكتبة الرموز الخاصة بالمصادقة
using MyMoneyOrdersDoumain.model; // استيراد نماذج المال والطلبات الخاصة بي
using MyMoneyOrdersInfrastructure.Repository; // استيراد مكتبة السجل الذهني
using MyMoneyOrdersInfrastructure; // استيراد مكتبة البنية التحتية للسجل
using System.Text; // استيراد مكتبة النصوص
using MyMoneyOrdersInfrastructure.Identity; // استيراد مكتبة التأكيد اللامع

var builder = WebApplication.CreateBuilder(args); // إنشاء بناء لتطبيق الويب باستخدام البناء المقدم من ASP.NET Core

// إضافة خدمة Swagger لتوثيق وثائق API
builder.Services.AddSwaggerGen();

// إضافة خدمة DbContext للاتصال بقاعدة البيانات وتحديد موفر البيانات الخاص بها
builder.Services.AddDbContext<Context>(option => option.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB; Initial Catalog=myRemittances_DB"));

// إضافة خدمة هوية المستخدم والإعدادات الخاصة بها
builder.Services.AddIdentity<User, Role>(options =>
{
    // متطلبات كلمة المرور
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;

    // متطلبات القفل
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // متطلبات المستخدم
    options.User.RequireUniqueEmail = true;

    // متطلبات تسجيل الدخول
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedPhoneNumber = false;
})
    .AddEntityFrameworkStores<Context>() // إضافة متجر الهوية الخاص بـ Entity Framework Core
    .AddDefaultTokenProviders(); // إضافة مزودات الرموز الافتراضية

builder.Services.AddScoped<IRepository<Role>, Repository<Role>>();
builder.Services.AddScoped<IRepository<User>, Repository<User>>();
builder.Services.AddScoped<IRepository<Office>, Repository<Office>>();
builder.Services.AddScoped<IRepository<Transfer>, Repository<Transfer>>();

// إضافة خدمات scoped لخدمات الرموز
builder.Services.AddScoped<ITokenServices, TokenServices>();

builder.Services.AddScoped<TansferReposotpry>();
builder.Services.AddScoped<RoleRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<OfficeRepository>();
builder.Services.AddScoped<TokenServices>();

// إضافة مهمة فاعلة لزراعة الأدوار والأذونات الأولية
builder.Services.AddTransient<RoleAndPermissionSeeder>();

// إضافة خدمة AutoMapper 
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMemoryCache();

// إضافة خدمة المصادقة  JWT
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Token:Key"])),
        ValidIssuer = builder.Configuration["Token:Issuer"],
        ValidateIssuer = true,
        ValidateAudience = false,
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("myAllowOrigins", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
var app = builder.Build(); 

if (app.Environment.IsDevelopment())
{
    using (var serviceScope = app.Services.CreateScope())
    {
        var roleAndPermissionSeeder = serviceScope.ServiceProvider.GetRequiredService<RoleAndPermissionSeeder>();
        await roleAndPermissionSeeder.SeedRolesAndPermissions(); 
    }
    app.UseSwagger(); 
    app.UseSwaggerUI(); 
}

app.UseCors("myAllowOrigins"); 
app.UseAuthentication();
app.UseAuthorization(); 
app.MapControllers();

app.Run(); 
