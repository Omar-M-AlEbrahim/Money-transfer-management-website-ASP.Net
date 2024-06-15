using MyMoneyOrdersDoumain.model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RemittancesWeb.model;
using AutoMapper;
using MyMoneyOrdersInfrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace MyMoneyOrdersInfrastructure.Repository
{
    public class UserRepository : Repository<User>
    {
        private readonly IMapper _mapper;

        public UserRepository(Context context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }

        public async Task<User?> UpdateUser(Guid userId, AddUserDTOmodel userDTO)
        {
            try
            {
                var userToUpdate = await GetById(userId); // جلب بيانات المستخدم المراد تحديثه بناءً على المعرّف
                if (userToUpdate != null) // إذا وجدنا المستخدم
                {
                    _mapper.Map(userDTO, userToUpdate); // نقوم بنسخ البيانات الجديدة إلى بيانات المستخدم
                    userToUpdate.UpdatedAt = DateTime.UtcNow; // نعيد تحديث وقت آخر تعديل للمستخدم

                    // تأكيد حفظ التغييرات في قاعدة البيانات
                    context.Users.Update(userToUpdate); // تأكد من تحديث الكيان في السياق (إذا لزم الأمر)
                    await context.SaveChangesAsync(); // حفظ التغييرات في قاعدة البيانات

                    return userToUpdate; // نقوم بإعادة الكائن المحدث
                }
                return null; // إذا لم نجد المستخدم، نرجع قيمة فارغة
            }
            catch (Exception ex)
            {
                return null; // نرجع قيمة فارغة
            }
        }

        public async Task<bool> DeleteUser(User user)
        {

            try
            {
                if (user == null) // التأكد من وجود المستخدم
                    return false; // في حال عدم وجوده، برجعلك قيمة منطقية تعني فشل عملية التنشيط

                user.UserIsStatus = false; //ما منحذف  تغيير حالة تنشيط المستخدم (إما تفعيل أو إلغاء تفعيل)
                await Savechang(); // حفظ التغييرات في قاعدة البيانات

                return true; // برجعلك قيمة منطقية تعني نجاح عملية التنشيط
            }
            catch (Exception ex)
            {
                return false; // برجعلك قيمة منطقية تعني فشل عملية التنشيط
            }
        }


        public async Task<bool> ActivateUser(User user)
        {
            try
            {
                if (user == null) // التأكد من وجود المستخدم
                    return false; // في حال عدم وجوده، برجعلك قيمة منطقية تعني فشل عملية التنشيط

                user.UserIsStatus = !user.UserIsStatus; // تغيير حالة تنشيط المستخدم (إما تفعيل أو إلغاء تفعيل)
                user.UpdatedAt = DateTime.UtcNow; // تحديث وقت آخر تعديل للمستخدم
                await Savechang(); // حفظ التغييرات في قاعدة البيانات

                return true; // برجعلك قيمة منطقية تعني نجاح عملية التنشيط
            }
            catch (Exception ex)
            {
                return false; // برجعلك قيمة منطقية تعني فشل عملية التنشيط
            }
        }

      
    }
}
