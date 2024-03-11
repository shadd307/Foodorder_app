const express = require("express");
const { auth, isAdmin } = require("../middleware/authenticationHandler");
const orderRouter = express.Router();

const {
    createOrder,
    orderHistoryOfAllUsers,
    orderHistoryOfUser,
    changeOrderStatus,
    getOrderDetail,
} = require("../services/orderService");

orderRouter.route("/").post(auth, createOrder);
orderRouter.route("/:userId/:orderId").get(auth, getOrderDetail);
orderRouter.route("/:userId").get(auth, orderHistoryOfUser);
orderRouter.route("/").get(auth, isAdmin, orderHistoryOfAllUsers);
orderRouter.route("/:orderId").put(auth, isAdmin, changeOrderStatus);

module.exports = orderRouter;
