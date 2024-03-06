// controllers/orderController.js
const { Order } = require('../models');
const { OrderItem  } = require('../models');


// Create a new order for users
const createOrder = async (req, res) => {
  try {
    // Assuming you have the necessary information in req.body, adjust as needed
    const { amount, quantity, address, items } = req.body;

    const order = await Order.create({ amount, quantity, address, items });

    // Assuming you have the user information attached to the request
    const userId = req.user.id;

    // Associate the order with the user
    await order.setUser(userId);

    // Create order items
    await OrderItem.bulkCreate(items.map(item => ({ ...item, orderId: order.id })));

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order.' });
  }
};

// Get all orders (user and admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders.' });
  }
};

// Get a single order by ID (user and admin)
const getOrderById = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findByPk(orderId);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order.' });
  }
};

// Update order status by ID (admin)
const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const token =req.cookies.userToken
    if (!token) {
      // console.log(req.cookies.userToken,'ggggggggggggg')
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const order = await Order.findByPk(orderId);
    if (order) {
      order.status = status;
      await order.save();
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order status.' });
  }
};

// Delete order by ID (admin)
const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const token =req.cookies.userToken
    if (!token) {
      // console.log(req.cookies.userToken,'ggggggggggggg')
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const deletedRowsCount = await Order.destroy({ where: { id: orderId } });
    if (deletedRowsCount > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting order.' });
  }
};
const getOrderCount = async (req, res, next) => {
    try {
      const token =req.cookies.userToken
      if (!token) {
        // console.log(req.cookies.userToken,'ggggggggggggg')
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }
      const orderCount = await Order.countDocuments();
      res.status(200).json({ count: orderCount });
    } catch (err) {
      next(err);
    }
  };
  
  const getMonthlyIncome = async (req, res, next) => {
    try {
      const token =req.cookies.userToken
      if (!token) {
        // console.log(req.cookies.userToken,'ggggggggggggg')
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }
      const productId = req.query.pid;
      const date = new Date();
      const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
      const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
      const matchCriteria = {
        createdAt: { $gte: previousMonth },
        ...(productId && { products: { $elemMatch: { productId } } }),
      };
  
      const income = await Order.aggregate([
        { $match: matchCriteria },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
  
      res.status(200).json(income);
    } catch (err) {
      next(err);
    }
  };
  const getOrderStatistics = async (req, res, next) => {
    try {
      const { productId } = req.query;
  
      // Calculate the start date of the current month
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
      // Match criteria based on the provided query parameters
      const matchCriteria = {
        createdAt: { $gte: startOfMonth },
        ...(productId && { 'products.productId': productId }),
      };
  
      // Use aggregation to calculate order statistics
      const statistics = await Order.aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$amount' },
          },
        },
      ]);
  
      // Return the calculated statistics as a JSON response
      res.status(200).json(statistics[0]);
    } catch (err) {
      next(err);
    }
  };


module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderCount,
  getMonthlyIncome,
  getOrderStatistics,
};
