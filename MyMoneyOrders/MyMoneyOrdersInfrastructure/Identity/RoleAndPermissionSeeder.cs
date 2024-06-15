    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using MyMoneyOrdersDoumain.model;
    using MyMoneyOrdersInfrastructure.Repository;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace MyMoneyOrdersInfrastructure.Identity
    {
    public class RoleAndPermissionSeeder
    {
        private readonly RoleManager<Role> _roleManager; // مدير الأدوار
        private readonly Context _context; // سياق البيانات
        private readonly UserManager<User> _userManager; // مدير المستخدمين

        public RoleAndPermissionSeeder(RoleManager<Role> roleManager,
                                        Context context,
                                        UserManager<User> userManager)
        {
            _roleManager = roleManager; // حقن مدير الأدوار
            _context = context; // حقن سياق البيانات
            _userManager = userManager; // حقن مدير المستخدمين
        }

        public async Task SeedRolesAndPermissions()
        {
            // إنشاء الأدوار إذا لم تكن موجودة
            if (!_context.Roles.Any()) // إذا لم تكن هناك أدوار
            {
                await CreateRoles(); // إنشاء الأدوار
                await CreateUser(); // إنشاء المستخدم
            }
        }

        private async Task CreateRoles()
        {
            await _roleManager.CreateAsync(new Role { Name = "admin" }); // إنشاء دور المسؤول
            await _roleManager.CreateAsync(new Role { Name = "user" }); // إنشاء دور المستخدم
        }

        private async Task CreateUser()
        {
            // بحث عن معرف الدور الخاص بالإداري
            var adminRoleId = await _context.Roles
                                            .Where(r => r.Name == "admin")
                                            .Select(r => r.Id)
                                            .FirstOrDefaultAsync();
            // إنشاء مستخدم جديد
            var user = new User
            {
                UserName = "omar", // اسم المستخدم
                Email = "omar@gmail.com", // البريد الإلكتروني
                EmailConfirmed = true, // تأكيد البريد الإلكتروني
                UserIsStatus = true,
                RoleId = adminRoleId
            };

            // إنشاء المستخدم باستخدام مدير المستخدمين
            var result = await _userManager.CreateAsync(user, "Omar123!"); // كلمة المرور

            if (result.Succeeded)
            {
                // إضافة المستخدم لدور معين
                await _userManager.AddToRoleAsync(user, "admin");
            }
         
        }

        //    private async Task AddClaimsToRoles()
        //    {
        //        var adminClaims = new List<(string roleName, string claimType, string claimValue)>
        //{
        //    ("admin", "permission", "user-index"),
        //    ("admin", "permission", "user-create"),
        //    ("admin", "permission", "user-edit"),
        //    ("admin", "permission", "user-delete"),
        //    ("admin", "permission", "office-index"),
        //    ("admin", "permission", "office-show"),
        //    ("admin", "permission", "office-create"),
        //    ("admin", "permission", "office-edit"),
        //    ("admin", "permission", "office-delete"),
        //    ("admin", "permission", "transfer-index"),
        //    ("admin", "permission", "transfer-delete"),
        //    ("admin", "permission", "transfer-office"),
        //    ("admin", "permission", "transfer-mark-received")
        //};

        //        var userClaims = new List<(string roleName, string claimType, string claimValue)>
        //{
        //    ("user", "permission", "user-index"),
        //    ("user", "permission", "office-index"),
        //    ("user", "permission", "office-show"),
        //    ("user", "permission", "transfer-create"),
        //    ("user", "permission", "transfer-office"),
        //    ("user", "permission", "transfer-mark-received")
        //};

        //        foreach (var (roleName, claimType, claimValue) in adminClaims)
        //        {
        //            await AddClaimToRole(roleName, claimType, claimValue);
        //            Console.WriteLine($"Claim {claimType} with value {claimValue} added to role {roleName}");
        //        }

        //        foreach (var (roleName, claimType, claimValue) in userClaims)
        //        {
        //            await AddClaimToRole(roleName, claimType, claimValue);
        //            Console.WriteLine($"Claim {claimType} with value {claimValue} added to role {roleName}");
        //        }
        //    }

        //    private async Task AddClaimToRole(string roleName, string claimType, string claimValue)
        //    {
        //        var role = await _roleManager.FindByNameAsync(roleName);

        //        if (role != null)
        //        {
        //            var claim = new System.Security.Claims.Claim(claimType, claimValue);
        //            await _roleManager.AddClaimAsync(role, claim);
        //            Console.WriteLine($"Claim {claimType} with value {claimValue} added to role {roleName}");
        //        }
        //        else
        //        {
        //            Console.WriteLine($"Role {roleName} not found");
        //        }
        //    }



    }
    }
