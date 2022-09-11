using VRaves.Feature.Navigation.Models;
using Sitecore.Data.Items;

namespace VRaves.Feature.Navigation.Services
{
    public interface IHeaderBuilder
    {
        Header GetHeader(Item contextItem);
    }
}
