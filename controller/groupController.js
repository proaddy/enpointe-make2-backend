const groupModel = require("../models/groupModel")

exports.filter_group = async (req, res) => {
    try {

        const result = await groupModel.filter_group();

        res.status(200).json({
            success: true,
            message: "Grouping with 10 or more same email",
            result: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.filter_group_unique = async (req, res) => {
    try {
        const result = await groupModel.filter_group_unique();
        res.status(200).json({
            success: true,
            message: "unique items after grouping",
            result: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}