import { ApiError } from "../exceptions/api-error.js";
import PositionsModel from "../models/positions.model.js";

class PositionsService {
  async createPositions(name) {
    const checkName = await PositionsModel.findOne({ where: { name } });
    if (checkName) {
      throw ApiError.BadRequest("A position with this name has already been added.");
    }

    const savePosition = await PositionsModel.create({ name });
    if (!savePosition) {
      throw ApiError.InternalServerError("Error when storing data in the database.");
    }

    return savePosition.dataValues;
  }
}

export default new PositionsService();