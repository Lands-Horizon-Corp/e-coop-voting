export class ClaimAuthError extends Error {
    status : number        

    constructor(message: string, statusCode : number) {
        super(message);
        this.name = 'ClaimAuthError';
        this.status = statusCode;
    }
}