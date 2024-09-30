interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
  }
  
  export const formatResponse = (
    success: boolean,
    message: string,
    data: any = null
  ): ApiResponse => {
    return {
      success,
      message,
      data,
    };
  };
  