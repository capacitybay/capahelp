const createTicket = (req, res) => {
  try {
    res.status(200).json("post ticket route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getTicket = (req, res) => {
  try {
    res.status(200).json("get ticket route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const updateTicket = (req, res) => {
  try {
    res.status(200).json("update ticket route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const listTicket = (req, res) => {
  try {
    res.status(200).json("view ticket route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const deleteTicket = (req, res) => {
  try {
    res.status(200).json("delete ticket route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
};
