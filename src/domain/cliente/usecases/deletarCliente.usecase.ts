import { Repository } from "@shared/ports/repository";
import { UseCase } from "@shared/ports/usecase";
import { DtoValidationException } from "@shared/exceptions/dtoValidationError.exception";
import { Cliente } from "@domain/cliente/entities/cliente";
import { EditarClienteDto } from "@domain/cliente/dtos/editarCliente.dto";
import { CPFInvalidoException } from "@shared/exceptions/cpfInvalido.exception";
import { isCPFValido, sanitizar } from "@shared/utils";
import config from "src/shared/config";
import { IMessagingQueue } from "src/infra/messaging/ports/queue";


type OutputProps = Boolean

export class DeletarClienteUseCase implements UseCase<string, OutputProps> {
    constructor(
        private readonly repository: Repository<Cliente>,
    ){
    }

    async execute(_id: string): Promise<OutputProps> {
        const item = await this.repository.buscarUm({query: {_id}});
        if(!item) return null;
        const res = await this.repository.deletar({_id})
        return res;
    }

}