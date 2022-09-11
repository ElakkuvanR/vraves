using System.Collections.Generic;
using Sitecore.Data;
using Sitecore.Data.Items;

namespace VRaves.Feature.Products.Services
{
    public interface IProductRepository
    {
        IEnumerable<Item> GetProducts(Item parent);
    }
}
