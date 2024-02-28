import jwt from 'jsonwebtoken';
import TokensModel from '../models/tokens.model.js';

class TokenService {
  async generateToken() {
    const token = jwt.sign({}, process.env.JWT_TOKEN_SECRET, { expiresIn: '40m' });
    return token;
  }

  validateToken(token) {
    try {
      const verifyToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      return verifyToken;
    } catch (e) {
      return null;
    }
  }

  async invalidateToken(token) {
    const checkToken = await TokensModel.findOne({ where: { token } });

    checkToken.isValid = false;
    await checkToken.save();
  }
}

export default new TokenService();