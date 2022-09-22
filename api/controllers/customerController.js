const CustomerModel = require("../../models/customerModel");

const customerController = async (req, res) => {
  console.log(CustomerModel);
  const {
    first_name,
    last_name,
    email,
    phone,
    has_logged_in,
    active,
    last_logged_in,
  } = req.body;
  const newCustomer = new CustomerModel({
    first_name,
    last_name,
    email,
    phone,
    has_logged_in,
    active,
    last_logged_in,
  });
  console.log(req.body);
  try {
    const savedCustomer = await newCustomer.save();
    res.status(200).json(savedCustomer);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = customerController;
