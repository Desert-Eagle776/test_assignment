import { Op } from "sequelize";
import { ApiError } from "../exceptions/api-error.js";
import UsersModel from "../models/users.model.js";
import fs from 'fs';
import { faker } from '@faker-js/faker';
import PositionsModel from "../models/positions.model.js";
import tinify from 'tinify';

class UsersService {
  async createUser(
    name,
    email,
    phone,
    position_id,
    photo
  ) {
    // Checking if there is a user with this phone number or email
    const checkUser = await UsersModel.findOne({
      where: {
        [Op.or]: [
          { email },
          { phone }
        ]
      }
    });
    if (checkUser) {
      throw ApiError.BadRequest("User with this phone or email already exist.");
    }

    const checkPosition = await PositionsModel.findByPk(position_id);
    if (!checkPosition) {
      throw ApiError.BadRequest("Position not found.");
    }

    // Path to the directory with users' photos.
    const dir = 'public/images/users';

    // Checking whether the user directory exists.
    // If not, we create one.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const source = tinify.fromFile(photo.path);
    // Crop a photo
    const resized = source.resize({
      method: "cover",
      width: 70,
      height: 70
    });
    await resized.toFile(`public/images/users/${photo.filename}.jpg`);

    const currentDate = new Date();

    const saveUserData = await UsersModel.create({
      name,
      email,
      phone,
      position_id,
      registration_timestamp: currentDate,
      photo: `${photo.filename}.jpg`
    });

    if (!saveUserData) {
      throw ApiError.InternalServerError("Registration failed.");
    }

    return saveUserData.id;
  }

  async allUsers(page, count) {
    const offset = (+page - 1) * +count;

    const users = await UsersModel.findAll({
      offset: offset,
      limit: +count,
      include: [
        {
          model: PositionsModel,
          as: "position"
        }
      ],
      order: [
        ['registration_timestamp', 'DESC']
      ]
    });

    const totalCountUsers = await UsersModel.count();
    const totalCountPages = Math.ceil(totalCountUsers / count);

    const transformedUsers = users.map(user => ({
      id: String(user.id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      position: user.position.name,
      position_id: String(user.position_id),
      registration_timestamp: new Date(user.registration_timestamp).getTime() / 1000,
      photo: `${process.env.API_URL}images/users/${user.photo}`
    }));

    return {
      success: true,
      page: +page,
      total_pages: totalCountPages,
      total_users: totalCountUsers,
      count: +count,
      links: {
        prev_link: +page - 1 <= 0 ? null : `${process.env.API_URL}users/?page=${+page - 1}&count=${count}`,
        next_link: +page + 1 >= totalCountPages ? null : `${process.env.API_URL}users/?page=${+page + 1}&count=${count}`
      },
      users: transformedUsers
    };
  }

  async userById(userId) {
    console.log(userId)
    const user = await UsersModel.findByPk(userId, {
      include: [
        {
          model: PositionsModel,
          as: 'position'
        }
      ]
    });
    if (!user) {
      throw ApiError.NotFound("The user with the requested identifier does not exist", { user_id: ["User not found."] });
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        position: user.position.name,
        position_id: user.position_id,
        photo: `${process.env.API_URL}images/users/${user.photo}`
      }
    }
  }

  async seedDatabase() {
    const listFakeUsers = [];
    const listPosition = [
      { name: "Content Manager" },
      { name: "Security" },
      { name: "Designer" },
      { name: "Lawyer" },
      { name: "Software Engineer" }
    ];

    await PositionsModel.bulkCreate(listPosition);

    const promises = Array.from({ length: 45 }).map(async (_, i) => {
      const image = faker.image.imageUrl(1000, 1000, 'jpeg');

      const downloadImage = await this.downloadAndCropImage(`image_${++i}`, image);

      let phone = faker.helpers.fromRegExp(/\+380[1-9]{2}[0-9]{7}/);
      phone = phone.replace('\\', '');

      const fakeUser = {
        name: faker.internet.userName(),
        email: faker.internet.email({ provider: "gmail" }),
        phone: phone,
        position_id: faker.number.int({ min: 1, max: 5 }),
        registration_timestamp: faker.date.past(),
        photo: downloadImage.filename
      };

      listFakeUsers.push(fakeUser);
    });

    await Promise.all(promises);

    await UsersModel.bulkCreate(listFakeUsers);
  }

  async downloadAndCropImage(filename, url) {
    // Path to the directory with users' photos.
    const dir = 'public/images/users';

    // Checking whether the user directory exists.
    // If not, we create one.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const source = tinify.fromUrl(url);
    // Crop a photo
    const resized = source.resize({
      method: "cover",
      width: 70,
      height: 70
    });
    await resized.toFile(`public/images/users/${filename}.jpg`);

    return {
      filename: `${filename}.jpg`
    };
  }
}

export default new UsersService();