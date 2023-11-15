using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ZWMS_WebApp.Controllers
{
    public class AnonymousItemsController : Controller
    {
        // GET: AnonymousItems
        public ActionResult Index()
        {
            return View();
        }
    }
}