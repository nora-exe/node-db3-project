const Scheme = require('../schemes/scheme-model');

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = (req, res, next) => {
  const scheme = Scheme.findById(req.params.id)
  if (!scheme) {
    res.status(404).json({
      message: "scheme with scheme_id <actual id> not found"
    })
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  if (!req.scheme_name || !req.scheme_name.trim()) {
    res.status(400).json({ message: 'invalid scheme_name' })
  } else {
    req.scheme_name = req.scheme_name.trim()
    next()
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
const instructions = req.body
if (!instructions || !instructions.trim() || !isNaN(step_number) || step_number < 1) {
  res.status(400).json({
    message: 'invalid step'
  })
} else {
  req.instructions = instructions.trim()
  next()
}
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
