const OrderModel = require("../../models/orderModel");

const createOrder = async (userId, orderData) => {
  try {
      const orderDetailsOfUser = await OrderModel.create({
        userId: orderData.userId,
        restaurantId:orderData.restaurantId,
        status: "PROCESSING",
        orderTotalPrice: orderData.orderTotalPrice,
        fooditems: orderData.fooditems,
        shippingDetails: orderData.shippingDetails,
      });
      return orderDetailsOfUser;
  } catch (err) {
    console.log(err);
    throw new Error(`Error while creating order: ${err.message}`);
  }
};

const orderHistoryOfUser = async (userId) => {
  try {
    const ordersOfUser = await OrderModel.find({
      userId: userId,
      isActive: true,
    });
    return ordersOfUser;
  } catch (err) {
    throw new Error(`Error while fetching order history of user: ${err.message}`);
  }
};

const getOrderDetail = async (userId, orderId) => {
  try {
    const ordersOfUser = await OrderModel.find({
      _id: orderId,
      userId: userId,
      isActive: true,
    });
    return ordersOfUser;
  } catch (err) {
    throw new Error(`Error while fetching order history of user: ${err.message}`);
  }
};

const orderHistoryOfAllUsers = async () => {
  try {
    const orders = await OrderModel.find({
      isActive: true,
    });
    return orders;
  } catch (err) {
    throw new Error(`Error while fetching order history of all users: ${err.message}`);
  }
};

const changeOrderStatus = async (orderId, newStatus) => {
  try {
    const orderDetails = await OrderModel.findOne({
      _id: orderId,
      isActive: true,
    });

    if (!orderDetails) {
      return false;
    }

    orderDetails.status = newStatus;
    await orderDetails.save();
    return true;
  } catch (err) {
    throw new Error(`Error while changing order status: ${err.message}`);
  }
};


module.exports = {
  createOrder,
  orderHistoryOfUser,
  orderHistoryOfAllUsers,
  changeOrderStatus,
  getOrderDetail,
};
