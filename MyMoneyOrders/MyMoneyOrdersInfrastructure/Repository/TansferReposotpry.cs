using AutoMapper; 
using Microsoft.EntityFrameworkCore; 
using MyMoneyOrdersDoumain.model;
using MyMoneyOrdersDoumain.modelDTO;
using RemittancesWeb.model; 

namespace MyMoneyOrdersInfrastructure.Repository 
{
    public class TansferReposotpry : Repository<Transfer> 
    {
        private readonly IMapper _mapper; 
        public TansferReposotpry(Context context, IMapper mapper) : base(context) 
        {
            _mapper = mapper; // حقن المابر
        }
        public async Task<Transfer> CreateTransferAsync(SendTransferModel transferModel) // دالة لإنشاء حوالة جديدة
        {
            try 
            {
              
                if (transferModel == null || transferModel.Amount <= 0 || transferModel.SenderId == Guid.Empty || transferModel.ReceiverId == Guid.Empty)
                {
                    return null; // إذا في مشكلة بالبيانات، رجعلنا null
                }

                var senderOffice = await context.Offices.FindAsync(transferModel.SenderId); // جبنا مكتب المرسل
                var receiverOffice = await context.Offices.FindAsync(transferModel.ReceiverId); // جبنا مكتب المستلم

                if (senderOffice == null) // إذا ما كان في مكتب المرسل
                {
                    return null; // رجعلنا null
                }

                if (receiverOffice == null) // إذا ما كان في مكتب المستلم
                {
                    return null; // رجعلنا null
                }

                if (senderOffice.CurrentBalance < transferModel.Amount) // إذا ما كان عند المرسل رصيد كافي
                {
                    return null; // رجعلنا null
                }

                var newTransfer = _mapper.Map<Transfer>(transferModel); // عملنا تحويل للموديل إلى تحويل

                // تحديث التاريخ
                newTransfer.CreatedAt = DateTime.Now;
                newTransfer.UpdatedAt = null;

                // Add the transfer to the context
                context.Transfers.Add(newTransfer); // إضافة التحويل للسياق
                await context.SaveChangesAsync(); // حفظ التغييرات

                return newTransfer; // رجعنا التحويل الجديد
            }
            catch (Exception ex) // إذا في استثناء صار
            {
                return null; // رجعلنا null
            }
        }


        public async Task<Transfer> ReceiveTransferAsync(Guid transferId, string transferCode)//دالة لاستلام حوالة جديدة  
        {
            try
            {
                var transfer = await context.Transfers
                                                     .FirstOrDefaultAsync(t => t.TransferId == transferId &&
                                                     t.TransferCode == transferCode); // جبنا التحويل بناء على كود التحويل ومعرفه

                if (transfer == null) // لو ما لقينا تحويل
                {
                    return null; // رجعلنا فاضي
                }

                // إيجاد مكاتب الإرسال والاستقبال
                var senderOffice = await context.Offices.FirstOrDefaultAsync(o => o.OfficeId == transfer.SenderId); // جبنا مكتب المرسل
                var receiverOffice = await context.Offices.FirstOrDefaultAsync(o => o.OfficeId == transfer.ReceiverId); // والمستلم

                if (senderOffice == null || receiverOffice == null) // لو ما لقينا مكتب المرسل أو المستلم
                {
                    return null; // رجعلنا فاضي
                }

                // حساب خصم التحويل (5%)
                var discountAmount = transfer.Amount * 0.05; // احسبلي نسبة الخصم
                // حساب المبلغ الفعلي لإرساله (95%)
                var actualAmountToSend = transfer.Amount - discountAmount; // والمبلغ الفعلي المرسل

                // خصم مبلغ التحويل الكامل من رصيد المرسل
                senderOffice.CurrentBalance -= transfer.Amount; // نقصلي المبلغ من رصيد المرسل

                // إضافة المرابح (5%) إلى رصيد المرسل
                senderOffice.CurrentBalance += discountAmount; // والخصم لرصيد المرسل

                // إضافة المبلغ الفعلي المرسل (95%) إلى رصيد المستلم
                receiverOffice.CurrentBalance += actualAmountToSend; // والمبلغ الفعلي لرصيد المستلم
               
                transfer.Status = true; // حطلي التحويل تم
                transfer.UpdatedAt = DateTime.Now; // ووقت التحديث

                // تحديث الكيانات في السياق
                context.Offices.Update(senderOffice); // سجللي المكتب المرسل
                context.Offices.Update(receiverOffice); // والمستلم
                context.Transfers.Update(transfer); // والتحويل

                // حفظ التغييرات في السياق
                await context.SaveChangesAsync(); // سجللي كل التغييرات

                return transfer; // ورجعلي التحويل
            }
            catch (Exception ex) // لو صار استثناء
            {
                return null; // وفاضي
            }
        }


        public async Task<bool> DeleteTransferAsync(Guid transferId) // دالة لحذف التحويل
        {
            try // بنحاول
            {
                var transfer = await context.Transfers.FindAsync(transferId); // جبلي التحويل بناء على رقمه

                if (transfer == null) // لو ما لقينا تحويل
                {
                    return false; // رجعلي لا
                }

                if (transfer.Status) // لو التحويل تم
                {
                    return false; // رجعلي لا
                }

                context.Transfers.Remove(transfer); // امسحلي التحويل
                await context.SaveChangesAsync(); // وسجللي التغييرات

                return true; // رجعلي تم
            }
            catch (Exception ex) // لو صار استثناء
            {
                return false; // رجعلي لا
            }
        }


        public IQueryable<Transfer> GetTransfersBySenderId(Guid senderOfficeId) // دالة لجلب التحويلات بمعرف المرسل
        {
            return context.Transfers
                .Include(t => t.Sender) // جبلي المرسل
                .Include(t => t.Receiver) // والمستلم
                .Where(t => t.SenderId == senderOfficeId); // حسب رقم المرسل
        }


        public IQueryable<Transfer> GetReceivedTransfersByOfficeId(Guid officeId) // دالة لجلب التحويلات المستلمة بمعرف المكتب
        {
            return context.Transfers
                .Include(t => t.Sender) // جبلي المرسل
                .Include(t => t.Receiver) // والمستلم
                .Where(t => t.ReceiverId == officeId && !t.Status); // اللي هي لسا ما استلمت
        }





        public IQueryable<Transfer> GetReceivedTransfersByOfficeIdAndstutusEqalTrue(Guid officeId) // دالة لجلب التحويلات المستلمة بمعرف المكتب والتي تمت بنجاح
        {
            return context.Transfers
                .Include(t => t.Sender) // جبلي المرسل
                .Include(t => t.Receiver) // والمستلم
                .Where(t => t.ReceiverId == officeId && t.Status); // اللي هي تمت
        }


        //هي للادمن 
        public IQueryable<Transfer> GetAllTransfersWithOffices() // دالة لجلب كل التحويلات مع المكاتب
        {
            return context.Transfers
                .Include(t => t.Sender) // جبلي المرسل
                .Include(t => t.Receiver); // والمستلم
        }


        public IQueryable<TransferCountPerDay> GetTransferCountPerDayLastWeek()
        {
            // تاريخ اليوم
            var today = DateTime.Today;

            // تاريخ بداية الأيام الستة الماضية
            var lastWeekStartDate = today.AddDays(-6);

            // جلب عدد الحوالات لكل يوم على مدى الأيام السبعة الماضية
            var transferCountPerDay = context.Transfers
                .Where(t => t.CreatedAt.Date >= lastWeekStartDate && t.CreatedAt.Date <= today)
                .GroupBy(t => t.CreatedAt.Date)
                .Select(g => new TransferCountPerDay
                {
                    Date = g.Key,
                    Count = g.Count()
                });

            return transferCountPerDay;
        }

    }

}
