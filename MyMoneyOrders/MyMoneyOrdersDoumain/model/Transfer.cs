using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyMoneyOrdersDoumain.model
{
    public class Transfer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid TransferId { get; set; }
        public string NameSendingCustomer { get; set; }//اسم الشخص المرسل 
        public string NameBeneficiaryCustomer { get; set; }//ام الشخص المستلم 
        public double Amount { get; set; }//قيمة الحوالة 
        public DateTime TransferDate { get; set; }//تاريخ ارسال الحوالة 
        public bool Status { get; set; }//حالة الحوالة
        public string TransferCode { get; set; }//كود الحوالة عند الاستلام 

        public Guid SenderId { get; set; }// ايدي المكتب المرسل
        [ForeignKey("SenderId")]
        public Office Sender { get; set; }
        public Guid ReceiverId { get; set; }//ايدي المكتب المستلم 
        [ForeignKey("ReceiverId")]
        public Office Receiver { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
      
        
        public Transfer()
        {
            TransferCode = GenerateRandomCode();
            TransferId = new Guid();
            TransferDate = DateTime.Now;

        }



        //توليد كود راندوم تلقائي للحوالة 
        private string GenerateRandomCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new Random();
            StringBuilder stringBuilder = new StringBuilder(10);
            for (int i = 0; i < 10; i++)
            {
                stringBuilder.Append(chars[random.Next(chars.Length)]);
            }
            return stringBuilder.ToString();
        }

    }
}
