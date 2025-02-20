import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.json({ success: false, message: "Invalid token" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.json({ success: false, message: "Authentication failed" });
  }
};

export default userAuth;
