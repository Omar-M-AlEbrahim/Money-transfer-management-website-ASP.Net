using MyMoneyOrdersDoumain.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyMoneyOrdersInfrastructure.Repository
{
    public class RoleRepository : Repository<Role>
    {
        public RoleRepository(Context context) : base(context)
        {

        }
    }
}
