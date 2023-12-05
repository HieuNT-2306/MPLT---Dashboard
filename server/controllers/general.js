import User from "../models/user.js";

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}
