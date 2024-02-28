import { ApiError } from "../exceptions/api-error.js";
import PositionsModel from "../models/positions.model.js";
import positionsService from "../services/positions.service.js";

class PositionsController {
  async createPositions(req, res, next) {
    try {
      const { name } = req.body;

      const saveData = await positionsService.createPositions(name);
      return res.status(201).json({ ...saveData });
    } catch (e) {
      next(e);
    }
  }

  async positions(req, res, next) {
    try {
      const getAllPositions = await PositionsModel.findAll({});
      if (!getAllPositions.length) {
        throw ApiError.UnprocessableEntity("Positions not found");
      }

      return res.status(200).json({ success: true, positions: getAllPositions });
    } catch (e) {
      next(e);
    }
  }
}

export default new PositionsController();