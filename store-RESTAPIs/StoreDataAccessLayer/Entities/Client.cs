﻿using StoreDataLayer.Entities;

namespace StoreDataAccessLayer.Entities
{
    public class Client
    {
        public int ClientId { get; set; }
        public int UserId { get; set; } 
        public string? PhoneNumber { get; set; }
        public User? User { get; set; } 
        public Cart? Cart { get; set; }
        public ICollection<Address>? Addresses { get; set; }
        public ICollection<Orders>? Orders { get; set; }
        public ICollection<SearchingLogs>? ClientSearching { get; set; }


    }
}
