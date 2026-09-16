const express = require('express');
const { getLocationAutocomplete } = require('../controllers/locationController');

const router = express.Router();

router.get('/autocomplete', getLocationAutocomplete);

module.exports = router;
