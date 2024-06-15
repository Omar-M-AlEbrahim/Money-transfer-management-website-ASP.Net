using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyMoneyOrdersDoumain.model
{
    public class Role : IdentityRole<Guid>
    {
        public ICollection<User> Users { get; set; }//عندي مستخدم واحد 


        public Role()
        {
            Users = new List<User>();
            Id = Guid.NewGuid();
        }
    }
}
