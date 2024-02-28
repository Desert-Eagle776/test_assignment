import PositionsModel from "../models/positions.model.js";
import tokenService from "../services/token.service.js";
import usersService from "../services/users.service.js";

class UsersController {
  async registerPage(req, res, next) {
    const allPosition = await PositionsModel.findAll({});

    res.render('register', { positions: allPosition.map(el => el.dataValues) });
  }

  async createUser(req, res, next) {
    try {
      const {
        name,
        email,
        phone,
        position_id
      } = req.body;

      const photo = req.file;
      const token = req.headers["token"];

      const saveUser = await usersService.createUser(
        name,
        email,
        phone,
        position_id,
        photo
      );

      // Change the isValid field to false, making the token invalid.
      const changeValidateToken = await tokenService.invalidateToken(token);

      return res.status(201).json({
        success: true,
        user_id: saveUser,
        message: "New user successfully registered"
      });
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const { page, count } = req.query;

      const getAllUsers = await usersService.allUsers(page, count);

      return res.render('users', { ...getAllUsers });
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const { user_id } = req.params;

      const getUserById = await usersService.userById(user_id);
      return res.status(200).json({ ...getUserById });
    } catch (e) {
      next(e);
    }
  }
}

export default new UsersController();