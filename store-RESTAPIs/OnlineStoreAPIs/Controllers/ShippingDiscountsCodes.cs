using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StoreServices.DiscountCodes;

namespace OnlineStoreAPIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShippingDiscountsCodes
        : ControllerBase
    {
        private readonly IShippingDiscountCodesRepo _discountRepo;

        public ShippingDiscountsCodes(IShippingDiscountCodesRepo discountRepo)
        {
            _discountRepo = discountRepo;
        }

        /// <summary>
        /// يتحقق من كود الخصم، وإذا كان فعالًا يقوم بإلغائه وإرجاع true.
        /// </summary>
        /// <param name="code">كود الخصم</param>
        /// <returns>200 OK إذا تم التحقق والتحديث، 404 إذا لم يكن موجودًا أو غير فعال</returns>
        [HttpPost("verify-code")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<IActionResult> VerifyAndDeactivateCode([FromBody] string code)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(code))
                    return BadRequest("يجب إدخال كود الخصم.");

                var result = await _discountRepo.IsValidCodeAndIfValidUpdateItFromActiveToNoneAsync(code);
            }catch(Exception ex)
            {
                return StatusCode(401,new { message = ex.Message.ToString().Trim()});

            }

            return Ok("تم تفعيل الكود وتحديث حالته.");
        }

    }
}