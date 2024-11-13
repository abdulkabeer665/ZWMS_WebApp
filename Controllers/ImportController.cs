using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ZWMS_WebApp.Controllers
{
    public class ImportController : Controller
    {
        // GET: Import
        public ActionResult MasterData()
        {
            return View();
        }
        public ActionResult BookStockInventoryData()
        {
            return View();
        }
        public ActionResult GetImportMasterData()
        {
            return View();
        }
    }
}