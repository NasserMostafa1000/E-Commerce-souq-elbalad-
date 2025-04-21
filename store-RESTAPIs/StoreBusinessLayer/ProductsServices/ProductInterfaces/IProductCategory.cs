using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreServices.Products.ProductInterfaces
{
    public interface IProductCategory
    {
        Task<byte> GetCategoryIdByNameAsync(string CategoryName);
        Task<List<string>> GetCategoriesName();
    }
}
