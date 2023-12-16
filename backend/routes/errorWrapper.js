function wrapped(func, errorMessage) {
  return async function (req, res) {
    try {
      const result = await func(req, res);
    } catch (err) {
      console.log("Error in errorWrapper");
      console.log(err);
      res.status(500).send(errorMessage);
    }
  };
}

module.exports = wrapped;
