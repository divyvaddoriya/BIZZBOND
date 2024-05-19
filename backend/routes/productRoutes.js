import express from "express";
import formidable from "express-formidable";

const router = express.Router()

//controller
import { addProduct,updateProductDetails , removeProduct ,fetchProducts
        ,fetchProductById
        ,fetchAllProducts
        ,addProductReview
        ,fetchTopProducts
        ,fetchNewProducts
} from "../controllers/productController.js";

import { authenticate,authorizedAdmin,authorizedWholeSeller } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router.route('/').get(fetchProducts).post(authenticate,authorizedAdmin,formidable(),addProduct)

router.route('/allproducts').get(fetchAllProducts)

router.route('/:id/reviews').post(authenticate,authorizedAdmin,addProductReview)

router.get('/top',fetchTopProducts)
router.get('/new',fetchNewProducts)

router.route('/:id')
        .get(fetchProductById)
        .put(authenticate,authorizedAdmin,formidable(),updateProductDetails)
        .delete(authenticate,authorizedAdmin,removeProduct)

export default router