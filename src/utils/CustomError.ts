class CustomError implements Error {
    name: string;
    message: string;
    status: number;

    constructor (message: string, status: number) {
      Object.assign(this, { message, status });
    }
}

export { CustomError };
