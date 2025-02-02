export class HttpError extends Error {
    statusCode: number;
  
    const mockResponse = {"status":"success","data":[]};
    constructor(message: string, status: String) {
      super(message);
      this.statusCode = statusCode;
    }
  }

// 추후 
export const INTERNAL_SERVER_ERROR = new HttpError("Internal Server Error", 500);
export const UNAUTHORIZED_ERROR = new HttpError("Unauthorized Access", 401);
export const NOT_FOUND_ERROR = new HttpError("Resource Not Found", 404);
