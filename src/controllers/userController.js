import userModel from '../models/userModel.js'

export const getUserData = async (req, res) => {
  try {
    // The user ID is now available from req.user.id
    const userId = req.user.id;

    // Fetch the user from the database using the userId
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found"
      });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};
