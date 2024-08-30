// // jwtUtils.ts
// import jwt from 'jsonwebtoken';
// import { IUser } from '../models/userModel';

// export const generateTokens = (user: IUser): { accessToken: string; refreshToken: string } => {
//   const accessToken = jwt.sign({ username: user.name, email: user.email, id:user._id }, 'accessSecret', { expiresIn: '15m' });
//   const refreshToken = jwt.sign({ username: user.name, email: user.email }, 'refreshSecret', { expiresIn: '7d' });
//   return { accessToken, refreshToken };
// };
