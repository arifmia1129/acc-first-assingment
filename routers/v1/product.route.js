const express = require("express");

const router = express.Router();
const productController = require("../../controllers/product.controller.js");
const limiter = require("../../middleware/limiter.js");
const viewCount = require("../../middleware/viewCount.js");


// router.get("/", (req, res) => {
//     res.send("loaded products!");
// })

// router.post("/", (req, res) => {
//     res.send("product added!");
// })

router.route("/")
    /**
       * @api {get} /product All product
       * @apiDescription Get all the tools
       * @apiPermission admin
       *
       * @apiHeader {String} Authorization   User's access token
       *
       * @apiParam  {Number{1-}}         [page=1]     List page
       * @apiParam  {Number{1-100}}      [limit=10]  Users per page
       *
       * @apiSuccess {Object[]} all the tools.
       *
       * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
       * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
       */
    .get(productController.getAllProduct)
    /**
   * @api {post} /product Save a product
   * @apiDescription Get all the tools
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [limit=10]  Users per page
   *
   * @apiSuccess {Object[]} all the tools.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
    .post(productController.saveAProduct)


router.route("/:id")
    .get(viewCount, limiter, productController.productDetails)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct)

module.exports = router;