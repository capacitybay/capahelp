const createTicketController = (req, res) => {
  try {
    res.status(200).json("post ticket route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getTicketController = (req, res) => {
  try {
    res.status(200).json("get ticket route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createTicketController,
  getTicketController,
};
