import { BaseException } from "./base.exception";

export class AuthenticationException extends BaseException {
    constructor(mensagem?: string) {
        super(mensagem ?? `Header Authentication não enviado`)
    }
}