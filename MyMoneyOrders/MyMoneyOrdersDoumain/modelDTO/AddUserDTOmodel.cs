namespace RemittancesWeb.model
{
    public class AddUserDTOmodel
    {
      public string UserName { get; set; }
        public string Email { get; set; }
        public string UserPassword { get; set; }
        public Guid RoleId { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
