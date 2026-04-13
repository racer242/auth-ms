import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessExpiry: parseInt(process.env.JWT_ACCESS_EXPIRY ?? '900', 10),
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiry: parseInt(process.env.JWT_REFRESH_EXPIRY ?? '604800', 10),
  refreshExpiryRemember: parseInt(
    process.env.JWT_REFRESH_EXPIRY_REMEMBER ?? '2592000',
    10,
  ),
}));
