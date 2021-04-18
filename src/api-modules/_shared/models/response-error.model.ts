export abstract class ResponseError {
    abstract statusCode: number;
    abstract message: string;
    abstract typeError: string;
    abstract errorDetails: any;
}