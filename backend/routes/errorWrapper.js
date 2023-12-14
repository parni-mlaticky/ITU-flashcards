function wrapped(func, errorMessage) {
    return async function(req, res) {
        try {
            const result = await func(req, res);
            res.status(200).json(result);
        } catch (err) {
            console.log(err);
            res.status(500).send(errorMessage);
        }
    };
}

module.exports = wrapped;
