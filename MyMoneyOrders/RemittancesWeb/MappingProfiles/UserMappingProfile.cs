using AutoMapper;
using MyMoneyOrdersDoumain.model;
using RemittancesWeb.model;

namespace RemittancesWeb.MappingProfiles
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<User, AddUserDTOmodel>().ReverseMap();
            CreateMap<Office, AddOfficeDTOmodel>().ReverseMap();
            CreateMap<Office, UpdateOfficeDTOmodel>().ReverseMap(); // التأكد من استخدام ReverseMap هنا


            CreateMap<SendTransferModel, Transfer>()
                .ForMember(dest => dest.Amount, opt => opt.MapFrom(src => src.Amount))
                .ForMember(dest => dest.SenderId, opt => opt.MapFrom(src => src.SenderId))
                .ForMember(dest => dest.ReceiverId, opt => opt.MapFrom(src => src.ReceiverId));

            CreateMap<ReceiveTransferModel, Transfer>()
                .ForMember(dest => dest.TransferId, opt => opt.MapFrom(src => src.TransferId))
                .ForMember(dest => dest.TransferCode, opt => opt.MapFrom(src => src.TransferCode))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));




        }
    }
}
