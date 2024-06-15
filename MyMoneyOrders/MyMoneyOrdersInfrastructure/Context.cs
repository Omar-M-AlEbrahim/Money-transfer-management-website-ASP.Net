using Microsoft.AspNetCore.Identity.EntityFrameworkCore; 
using Microsoft.EntityFrameworkCore; 
using MyMoneyOrdersDoumain.model;

namespace MyMoneyOrdersInfrastructure 
{
    public class Context : IdentityDbContext<User, Role, Guid> 
    {
        public Context(DbContextOptions<Context> options) : base(options) 
        {
        }

        public DbSet<Office> Offices { get; set; } // مجموعة مكاتب
        public DbSet<Transfer> Transfers { get; set; } // مجموعة تحويلات

        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            base.OnModelCreating(modelBuilder); 

            // تحديد العلاقات بين الموديلات
            modelBuilder.Entity<User>()
                .HasOne(u => u.Office) // المستخدم له مكتب واحد
                .WithOne(o => o.User) // المكتب له مستخدم واحد
                .HasForeignKey<Office>(o => o.UserId) // مفتاح الخارجي للمكتب هو معرف المستخدم
                .OnDelete(DeleteBehavior.Cascade); //  سلوك الحذف 

            modelBuilder.Entity<User>()
                .HasOne(u => u.Role) // المستخدم له دور واحد
                .WithMany(r => r.Users) // الدور له عدة مستخدمين
                .HasForeignKey(u => u.RoleId); // مفتاح الخارجي للمستخدم هو معرف الدور

            modelBuilder.Entity<Office>()
                .HasMany(o => o.SentTransfers) // المكتب يرسل العديد من التحويلات
                .WithOne(t => t.Sender) // التحويل له مرسل واحد
                .HasForeignKey(t => t.SenderId) // مفتاح الخارجي للمرسل هو معرف المكتب
                .OnDelete(DeleteBehavior.Restrict); // تغيير إلى Restrict لتجنب الحذف التلقائي المتعدد

            modelBuilder.Entity<Office>()
                .HasMany(o => o.ReceivedTransfers) // المكتب يستقبل العديد من التحويلات
                .WithOne(t => t.Receiver) // التحويل له مستقبل واحد
                .HasForeignKey(t => t.ReceiverId) // مفتاح الخارجي للمستقبل هو معرف المكتب
                 .OnDelete(DeleteBehavior.Restrict); // تغيير إلى Restrict لتجنب الحذف التلقائي المتعدد
       
        }
    }
}
