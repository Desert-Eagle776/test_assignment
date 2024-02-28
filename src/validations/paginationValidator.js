import { query, validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error.js";

const validatePagination = [
  query('page')
    .exists({ checkFalsy: true })
    .withMessage("The page parameter is require.")
    .custom(num => Number.isInteger(+num))
    .withMessage("The page must be an integer.")
    .isInt({ min: 1 })
    .withMessage("The page must be at least 1."),
  query('count')
    .exists({ checkFalsy: true })
    .withMessage("The count parameter is required.")
    .custom(num => Number.isInteger(+num))
    .withMessage("The count must be an integer.")
    .isInt({ min: 1 })
    .withMessage("The count must be at least 1."),

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

      next(ApiError.UnprocessableEntity('Validation failed.', formattedErrors));
    }
    next();
  }
];

export default validatePagination;