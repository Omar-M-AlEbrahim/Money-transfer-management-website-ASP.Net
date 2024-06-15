using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyMoneyOrdersDoumain.model
{
    public class Office
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid OfficeId { get; set; }//
        public string Name { get; set; }
        public string Country { get; set; }//الدولة
        public string Governorate { get; set; }//المحافظة
        public string City { get; set; }//المدينة
        public double CurrentBalance { get; set; }//المبلغ الحالي 

        // مفتاح أجنبي للمستخدم
        [ForeignKey("UserId")]
        public User User { get; set; }
        public Guid UserId { get; set; }

        public ICollection<Transfer> SentTransfers { get; set; }
        public ICollection<Transfer> ReceivedTransfers { get; set; }

        public Office()
        {
            SentTransfers = new List<Transfer>();
            ReceivedTransfers = new List<Transfer>();
          //  OfficeId = Guid.NewGuid();
        }
    }
}
