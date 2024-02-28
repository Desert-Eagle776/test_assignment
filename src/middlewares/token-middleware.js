import { ApiError } from "../exceptions/api-error.js";
import TokensModel from "../models/tokens.model.js";
import tokenService from "../services/token.service.js";

export default async function (req, res, next) {
  try {
    const token = req.headers.token;
    if (!token) {
      return next(ApiError.UnauthorizedError());
    }

    const checkValidateToken = await TokensModel.findOne({ where: { token } });
    if (!checkValidateToken) {
      return next(ApiError.UnauthorizedError());
    }

    if (checkValidateToken && !checkValidateToken.isValid) {
      return next(ApiError.UnauthorizedError());
    }

    const verifyToken = tokenService.validateToken(token);
    if (!verifyToken) {
      const changeValidateToken = await TokensModel.update(
        { isValid: false },
        {
          where: { token }
        }
      );

      return next(ApiError.UnauthorizedError());
    }

    // req.user = token;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}