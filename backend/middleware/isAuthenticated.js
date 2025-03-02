import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated ",
      });
    }

    const decode_token = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode_token) {
      return res.status(401).json({
        message: "Invalid",
        success: false,
      });
    }
    req.id = decode_token.userId;
    next();
  } catch (error) {
    console.log(error.message);
  }
};

export default isAuthenticated;
