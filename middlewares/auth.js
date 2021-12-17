
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { tokenService, userService } = require('../services');
const { tokenTypes } = require('../config/tokens');


const verifyCallback = (req, resolve, reject, requiredRights) => {
  const { user } = req;
  if (!user) return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    const accessToken = req.header("x-auth-key");

    tokenService.verifyToken(accessToken, tokenTypes.ACCESS).then(decoded => {
      userService.getUserById(decoded.user).then(user => {
        req.user = user;
        return verifyCallback(req, resolve, reject, requiredRights);
      }).catch((err) => next(err));
    }).catch((err) => next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')));
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;