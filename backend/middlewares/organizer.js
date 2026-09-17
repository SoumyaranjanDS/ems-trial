import User from "../model/user.js";

const checkOrganizer = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.role === "organizer") {
      next();
    } else {
      return res.status(403).json({ message: "Requires organizer role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default checkOrganizer;
