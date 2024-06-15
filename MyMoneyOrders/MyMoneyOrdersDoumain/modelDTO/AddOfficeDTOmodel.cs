namespace RemittancesWeb.model
{
    public class AddOfficeDTOmodel
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public string Governorate { get; set; }
        public string City { get; set; }
        public double CurrentBalance { get; set; }
        public Guid UserId { get; set; }

    }
}
