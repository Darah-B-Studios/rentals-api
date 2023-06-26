"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/routes/product-routes.ts
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const is_authenticated_middleware_1 = require("../../shared/middlewares/is-authenticated.middleware");
const productController = new product_controller_1.ProductsController();
const productRouter = (0, express_1.Router)();
productRouter.get("", is_authenticated_middleware_1.isAuthenticatedMiddleware, productController.getAll);
productRouter.get("/:id", is_authenticated_middleware_1.isAuthenticatedMiddleware, productController.getProductById);
productRouter.post("", is_authenticated_middleware_1.isAuthenticatedMiddleware, productController.createProduct);
productRouter.put("/:id", is_authenticated_middleware_1.isAuthenticatedMiddleware, productController.updateProduct);
productRouter.delete("/:id", is_authenticated_middleware_1.isAuthenticatedMiddleware, productController.deleteProduct);
exports.default = productRouter;
