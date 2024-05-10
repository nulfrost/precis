export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class RateLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
  }
}
