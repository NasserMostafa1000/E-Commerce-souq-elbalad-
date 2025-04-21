using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StoreDataAccessLayer;
using StoreServices.Products.ProductInterfaces;

namespace StoreBusinessLayer.Products
{
   public class CategoriesRepo:IProductCategory
    {
        AppDbContext _Context;
        public CategoriesRepo(AppDbContext context)
        {
            _Context = context;
        }
        public async Task<byte>GetCategoryIdByNameAsync(string CategoryName)
        {
            var CategoryItem =await _Context.Category.
                FirstOrDefaultAsync(Categories => Categories.CategoryName == CategoryName);
            if(CategoryItem==null)
            {
                return 0;
            }
            return CategoryItem.CategoryId;
        }
        public async Task<List<string>>GetCategoriesName()
        {
            var Categories = await _Context.Category.Select(Category => Category.CategoryName).ToListAsync();
            return Categories;

        }
    }
}
