using Microsoft.EntityFrameworkCore; // استيراد Entity Framework Core لإدارة عمليات قاعدة البيانات
using System.Linq.Expressions; // استيراد تعبيرات LINQ


namespace MyMoneyOrdersInfrastructure.Repository 
{
    public class Repository<T> : IRepository<T> where T : class 
    {
        public readonly Context context; // حقل لحفظ السياق

        public Repository(Context context) // دالة البناء للمستودع
        {
            this.context = context; //الحقن 
        }

        public async Task<T> Add(T entity) // دالة لإضافة كائن جديد
        {
            var newEntity = await context.AddAsync(entity); 
            return newEntity.Entity; // إرجاع الكائن الجديد
        }

        public async Task Delete(T entity) // دالة لحذف كائن
        {
            context.Remove(entity); // حذف الكائن من سياق البيانات
        }

        public IEnumerable<T> GetAll() // دالة لجلب كل الكائنات
        {
            return context.Set<T>().ToList(); // جلب كل الكائنات من سياق البيانات 
        }

        public async Task<T?> GetById(Guid id) // دالة لجلب كائن بواسطة معرف
        {
            return await context.FindAsync<T>(id); // البحث عن الكائن بواسطة المعرف في سياق البيانات
        }

        public async Task Savechang() 
        {
            await context.SaveChangesAsync(); 
        }

        public async Task<T> Update(T entity) // دالة لتحديث كائن
        {
            return context.Update(entity).Entity; // تحديث الكائن في سياق البيانات وإرجاع الكائن المحدث
        }

        public async Task<T?> Find(Expression<Func<T, bool>> predicate) // دالة للبحث عن كائن بواسطة شرط
        {
            return await context.Set<T>().FirstOrDefaultAsync(predicate); // البحث عن الكائن الأول الذي يتوافق مع الشرط في سياق البيانات
        }
    }
}
