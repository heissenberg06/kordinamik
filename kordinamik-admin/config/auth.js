module.exports = {
  // JWT settings
  jwt: {
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '30m',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
  },
  
  // Password settings
  password: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
  },
  
  // Cookie settings for refresh token
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  }
};

