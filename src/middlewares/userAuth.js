import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";

const userAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Not Authorized. Login Again" 
    });
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.id) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token" 
    });
  }
  
  req.user = decoded;
  next();
});

export default userAuth;