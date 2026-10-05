export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;

    switch (status) {
      case 401: this.code = 'UNAUTHORIZED'; break;
      case 403: this.code = 'FORBIDDEN'; break;
      case 404: this.code = 'NOT_FOUND'; break;
      case 409: this.code = 'CONFLICT'; break;
      case 422: this.code = 'VALIDATION_ERROR'; break;
      default:
        this.code = status >= 500 ? 'SERVER_ERROR' : 'UNKNOWN_ERROR';
        break;
    }
  }
}
