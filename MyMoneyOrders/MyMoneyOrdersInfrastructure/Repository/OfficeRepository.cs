using AutoMapper; // استيراد AutoMapper لإدارة عمليات التحويل بين الكائنات
using Microsoft.EntityFrameworkCore; // استيراد Entity Framework Core لإدارة عمليات قاعدة البيانات
using MyMoneyOrdersDoumain.model; // استيراد النماذج من مشروع MyMoneyOrdersDomain
using RemittancesWeb.model; // استيراد النماذج من مشروع RemittancesWeb


namespace MyMoneyOrdersInfrastructure.Repository
{
    public class OfficeRepository : Repository<Office> 
    {
        private readonly IMapper _mapper; // تعريف حقل خاص بـ AutoMapper
        public OfficeRepository(Context context, IMapper mapper) : base(context)
        {
            _mapper = mapper; // تعيين AutoMapper حقن
        }

        public async Task<Office> AddOfficeAsync(AddOfficeDTOmodel officeDto) // دالة لإضافة مكتب جديد
        {
            var office = _mapper.Map<Office>(officeDto); // تحويل الـ DTO إلى كائن مكتب

            // تأكد من أن المستخدم موجود
            var user = await context.Users.FindAsync(officeDto.UserId); // البحث عن المستخدم في قاعدة البيانات
            if (user == null) // إذا ما كان المستخدم غير موجود
            {
                throw new Exception("User not found"); // رمي استثناء
            }

            office.User = user; // تعيين المستخدم للمكتب

            await context.AddAsync(office); // إضافة المكتب لقاعدة البيانات
            await context.SaveChangesAsync(); // حفظ التغييرات
            // بعد الحفظ، يجب تحديث المستخدم برقم المكتب الجديد
            user.OfficeId = office.OfficeId; // تعيين معرف المكتب للمستخدم
            context.Users.Update(user); // تحديث المستخدم في قاعدة البيانات
            await context.SaveChangesAsync(); // حفظ التغييرات

            return office; // إرجاع المكتب الجديد
        }

        public async Task<Office?> UpdateOfficeAsync(Guid officeId, UpdateOfficeDTOmodel officeDto) // دالة تعديل مكتب
        {
            try
            {
                // الحصول على المكتب بواسطة المعرف
                var officeToUpdate = await context.Offices.FindAsync(officeId); // البحث عن المكتب في قاعدة البيانات

                if (officeToUpdate != null) // إذا كان المكتب موجود
                {
                    // استخدام AutoMapper لتحديث خصائص المكتب
                    _mapper.Map(officeDto, officeToUpdate); // تحديث خصائص المكتب باستخدام AutoMapper

                    // تحديث المكتب في قاعدة البيانات
                    context.Offices.Update(officeToUpdate); // تحديث المكتب في قاعدة البيانات
                    await context.SaveChangesAsync(); // حفظ التغييرات

                    return officeToUpdate; // إرجاع المكتب المحدث
                }

                return null; // إرجاع قيمة تشير إلى عدم العثور على المكتب
            }
            catch (Exception ex) // إذا صار خطأ
            {
                return null; // إرجاع null في حال حدوث خطأ
            }
        }

        public async Task<List<Transfer>> GetOfficeTransfersAsync(Guid officeId) // دالة لجلب الحوالات وفق مكتب
        {
            try
            {
                var office = await GetById(officeId); // الحصول على المكتب بواسطة المعرف
                if (office != null) // إذا كان المكتب موجود
                {
                    // جلب الحوالات المرسلة والمستلمة للمكتب
                    await context.Entry(office)
                        .Collection(o => o.SentTransfers)
                        .LoadAsync(); // جلب الحوالات المرسلة
                    await context.Entry(office)
                        .Collection(o => o.ReceivedTransfers)
                        .LoadAsync(); // جلب الحوالات المستلمة

                    var allTransfers = new List<Transfer>(); // إنشاء قائمة للحوالات
                    allTransfers.AddRange(office.SentTransfers); // إضافة الحوالات المرسلة للقائمة
                    allTransfers.AddRange(office.ReceivedTransfers); // إضافة الحوالات المستلمة للقائمة

                    return allTransfers; // إرجاع قائمة الحوالات
                }
                return new List<Transfer>(); // إذا لم يتم العثور على المكتب
            }
            catch (Exception ex) // إذا صار خطأ
            {
                // إدارة الأخطاء هنا
                return new List<Transfer>(); // إرجاع قائمة فارغة في حال حدوث خطأ
            }
        }

        public async Task<List<Office>> GetOfficesWithTransfersAsync() // دالة لجلب المكاتب مع حوالاتها
        {
            try
            {
                return await context.Offices.Include(o => o.SentTransfers).Include(o => o.ReceivedTransfers).ToListAsync(); // جلب المكاتب مع الحوالات المرسلة والمستلمة
            }
            catch (Exception ex) // إذا صار خطأ
            {
                // إدارة الأخطاء هنا
                return null; // إرجاع null في حال حدوث خطأ
            }
        }
    }
}
