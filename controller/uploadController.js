exports.parse_csv = async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.file
    });
}