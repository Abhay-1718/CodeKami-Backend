import userModel from '../models/userModel.js';

export const getUserData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.firstName,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
};