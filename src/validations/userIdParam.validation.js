import { param, validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error.js";

const validateUserIdParam = [
  param('user_id')
    .exists({ checkFalsy: true })
    .withMessage("The user_id parameter is require.")
    .custom(num => Number.isInteger(+num))
    .withMessage("The user_id must be an integer.")
    .isInt({ min: 1 })
    .withMessage("The user_id must be at least 1."),

  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().reduce((acc, err) => {
        if (!acc[err.path]) {
          acc[err.path] = [];
        }

        acc[err.path].push(err.msg);

        return acc;
      }, {});

      next(ApiError.BadRequest('Validation failed.', formattedErrors));
    }
    next();
  }
];

export default validateUserIdParam;