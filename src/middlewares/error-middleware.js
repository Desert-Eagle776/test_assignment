import { ApiError } from "../exceptions/api-error.js";

export default function (err, req, res, next) {
  console.log(err);
  if (err instanceof ApiError) {
    const response = { success: false, message: err.message };

    if (Object.keys(err.fails).length !== 0) {
      response.fails = err.fails;
    }

    return res.status(err.status).json(response);
    // return res.status(err.status).json({ success: false, message: err.message, fails: err.fails });
  }
  return res.status(500).json({ success: false, message: 'Internal Server Error', errors: err });
}