const mongoose = require("mongoose");

const FooditemSchema = mongoose.Schema({
  fooditemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
});

const ShippingDetailsSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
});

const orderSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    default: "PROCESSING",
  },
  orderTotalPrice: {
    type: Number,
    required: true,
  },
  fooditems: {
    type: Object,
    required: true
  },

  shippingDetails: {
    type: Object,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  createdTs: {
    type: Date,
    default: new Date(),
  },
  updatedTs: {
    type: Date,
    default: new Date(),
  },
});

const OrderModel = mongoose.model("OrderModel", orderSchema);

module.exports = OrderModel;
