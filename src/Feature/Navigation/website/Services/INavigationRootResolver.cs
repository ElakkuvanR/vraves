using Sitecore.Data.Items;

namespace VRaves.Feature.Navigation.Services
{
    public interface INavigationRootResolver
    {
        Item GetNavigationRoot(Item contextItem);
    }
}
