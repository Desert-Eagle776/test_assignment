import { ApiError } from "../exceptions/api-error.js";
import TokensModel from "../models/tokens.model.js";
import tokenService from "../services/token.service.js";

class TokenController {
  async generateToken(req, res, next) {
    try {
      const token = await tokenService.generateToken();

      const saveToken = await TokensModel.create({ token });
      if (!saveToken) {
        throw ApiError.InternalServerError("Error saving a token in the database.");
      }

      return res.status(201).json({
        success: true,
        token: token
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new TokenController();