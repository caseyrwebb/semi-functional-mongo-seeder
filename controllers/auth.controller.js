const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const { insertedId } = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(insertedId.toString());
  setTokenCookie(res, tokens);
  res.status(httpStatus.CREATED).send({ tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user.id.toString());

  setTokenCookie(res, tokens);
  res.send({ token: tokens.access, user });
});

const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await authService.logout(refreshToken);
  expireTokenCookie(res);

  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const { tokens, user } = await authService.refreshAuth(req.cookies.refreshToken);
  setTokenCookie(res, tokens);
  res.send({ token: tokens.access, user });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};

// helper functions

function setTokenCookie(res, tokens) {
  const { expires: refreshExp, token: refreshToken } = tokens.refresh;

  // create cookie with refresh token that expires on token expires date
  const cookieRefreshOptions = {
    httpOnly: true,
    expires: new Date(refreshExp),
  };

  res.cookie('refreshToken', refreshToken, cookieRefreshOptions);
}
function expireTokenCookie(res) {
  const expireCookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() - 60 * 1000 * 60 * 24 * 31),
  };
  res.cookie('refreshToken', 'x', expireCookieOptions);
}
function clearTokenCookie(res) {
  res.clearCookie('refreshToken');

}