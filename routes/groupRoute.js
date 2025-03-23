const express = require("express");
const router = express.Router();

const groupcontroller = require('../controller/groupController')

router.get('/email', groupcontroller.filter_group);
router.get('/unique', groupcontroller.filter_group_unique);

module.exports = router;