class HTTP404Error extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "Not Found";
    this.status = 404;
  }
}

class HTTP500Error extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "Internal server Error";
    this.status = 500;
  }
}
class HTTP401Error extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.message);
    this.name = "Unauthorized";
    this.status = 401;
  }
}

class HTTP400Error extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.message);
    this.name = "BAD REQUEST: INSUFICIENT INFORMATION";
    this.status = 400;
  }
}

class HTTP422Error extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.message);
    this.name = "UNPROCESSABLE ENTITY";
    this.status = 422;
  }
}

module.exports = {
  HTTP404Error,
  HTTP500Error,
  HTTP401Error,
  HTTP400Error,
  HTTP422Error,
};
