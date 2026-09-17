import User from "../model/user.js";

const upgradeToOrganizer = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "organizer") {
      return res.status(400).json({
        message: "Already an organizer",
      });
    }

    user.role = "organizer";
    await user.save();

    return res.status(200).json({
      message: "Account upgraded to organizer successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default upgradeToOrganizer;