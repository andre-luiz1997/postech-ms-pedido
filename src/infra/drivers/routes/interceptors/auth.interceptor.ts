import * as express from "express";
import { AuthenticationException, DtoValidationException } from "src/shared/exceptions";

function intercept(req: express.Request, res: express.Response, next: express.NextFunction) {
    if(!req.headers.authorization) throw new AuthenticationException();
    console.warn('[AuthInterceptor]');
    return next();
} 

export default [intercept]