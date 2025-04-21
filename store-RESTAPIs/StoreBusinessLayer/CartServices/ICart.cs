﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StoreBusinessLayer.Carts;
using StoreDataAccessLayer.Entities;

namespace StoreServices.CartServices
{
    public interface ICart
    {
          Task<int> AddCartDetailsToSpecificClient(CartDtos.AddCartDetailsReq req, int ClientId);
          Task<Cart> GetClientCart(int clientId);
          Task<List<CartDtos.GetCartReq>> GetCartDetailsByClientId(int clientId);
          Task<bool> RemoveItemOnCartByCartDetailsId(int CartDetailsId);
          Task<bool> RemoveCartDetailsByCartId(int cartId);
          Task<bool> RemoveCartDetailsByClientId(int ClientId);

    }
}
