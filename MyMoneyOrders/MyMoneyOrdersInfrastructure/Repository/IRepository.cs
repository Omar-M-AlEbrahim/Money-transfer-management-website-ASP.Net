using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace MyMoneyOrdersInfrastructure.Repository
{
    public interface IRepository<T> where T : class
    {
        Task<T>? GetById(Guid id);
        IEnumerable<T> GetAll();
        Task<T> Add(T entity);
        Task<T> Update(T entity);
        Task Delete(T entity);
        Task<T> Find(Expression<Func<T, bool>> predicate);
        Task Savechang();
    }
}
