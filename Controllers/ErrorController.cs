using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ZWMS_WebApp.Controllers
{
    public class ErrorController : Controller
    {
        // GET: Error
        public ActionResult NotFound()
        {
            // You can add custom logic here, such as logging the error or displaying a custom error page.
            return View();
        }
    }
}