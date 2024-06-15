namespace RemittancesWeb.model
{
    public class SendTransferModel
    {
        public string NameSendingCustomer { get; set; }
        public string NameBeneficiaryCustomer { get; set; }
        public double Amount { get; set; }
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }

    }
}
