import jwt from "jsonwebtoken";

function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];  // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      console.log(err)
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.user = data;
    next();
  });
}

export { verifyJWT };