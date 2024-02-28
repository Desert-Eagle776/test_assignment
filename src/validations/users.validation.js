import { body, check, validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error.js";

const validateRegistrData = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage("The name field is require.")
    .isString()
    .withMessage("The name field must be a string.")
    .isLength({ min: 2, max: 60 })
    .withMessage("The name field must be at least 2 characters and no more than 60 characters."),
  body('email')
    .exists({ checkFalsy: true })
    .withMessage("The email field is required.")
    .isEmail()
    .withMessage("The email must be a valid email address.")
    .isLength({ min: 2, max: 100 })
    .withMessage("An email can contain from 2 to 100 characters."),
  check('phone')
    .exists({ checkFalsy: true })
    .withMessage("The phone field is require.")
    .matches(/^\+(380)([1-9]{2})([0-9]{7})$/)
    .withMessage("Enter a valid phone number."),
  body("position_id")
    .exists({ checkFalsy: true })
    .withMessage("The position_id field is require.")
    .custom(num => Number.isInteger(+num))
    .withMessage("The position id must be an integer.")
    .isInt({ min: 1 })
    .withMessage("The position id must be an integer and greater than or equal to 1."),
  check("photo")
    .custom((value, { req }) => {
      if (req.file.mimetype === 'image/jpeg') {
        return '.jpeg';
      } else if (req.file.mimetype === 'image/jpg') {
        return '.jpg';
      } else {
        return false;
      }
    })
    .withMessage("Invalid image. Photo should be jpg/jpeg image.")
    .custom((value, { req }) => {
      // 5 Megabyte is equal to 5,242,880 Byte. Formula to convert 5 MB to B is 5 * 1048576.
      const bytesInFiveMb = 5242880;

      if (req.file.size <= bytesInFiveMb) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("The photo may not be greater than 5 Mbytes."),

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

export default validateRegistrData;