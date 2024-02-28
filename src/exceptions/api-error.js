export class ApiError extends Error {
  status;
  fails;

  constructor(status, message, fails = {}) {
    super(message);

    this.status = status;
    this.fails = fails;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'The token expired.');
  }

  static BadRequest(message, errors) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message, errors) {
    return new ApiError(404, message, errors);
  }

  static Conflict(message, errors) {
    return new ApiError(409, message, errors);
  }

  static UnprocessableEntity(message, errors) {
    return new ApiError(422, message, errors);
  }

  static InternalServerError(message, errors) {
    return new ApiError(500, message, errors);
  }
}