using Microsoft.AspNetCore.Identity;
using MyMoneyOrdersDoumain.model;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyMoneyOrdersDoumain.model
{
    public class User : IdentityUser<Guid>
    {
        public bool UserIsStatus { get; set; }//هل هو مفعل 
        public DateTime UserCreatedAt { get; set; }//تاريخ انشاء الحساب 
        public DateTime UpdatedAt { get; set; }//اخر تعديل حصل 

        // مفتاح أجنبي للمكتب
        [ForeignKey("OfficeId")]
        public Office Office { get; set; }//العملية one to one
        public Guid OfficeId { get; set; }

        // مفتاح أجنبي للدور
        [ForeignKey("RoleId")]
        public Role Role { get; set; } //يتبع ل دور 
        public Guid? RoleId { get; set; }

        public User()
        {
            Id = Guid.NewGuid();
            UserCreatedAt = DateTime.UtcNow;
            UserIsStatus = false;
        }
    }
}
