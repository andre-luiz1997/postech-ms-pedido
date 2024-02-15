import { Repository } from "src/shared/ports/repository"
import { UseCase } from "src/shared/ports/usecase"
import { Pedido, PedidoProps } from "../entities/pedido"
import { DtoValidationException } from "src/shared/exceptions/dtoValidationError.exception"
import { EditarPedidoDto } from "../dtos/editarPedido.dto";

export interface InputProps {
    transaction?: any
    body: EditarPedidoDto
}

type OutputProps = Pedido

export class EditarPedidoUseCase implements UseCase<InputProps, OutputProps> {
  constructor(private readonly repository: Repository<Pedido>) {}
  async execute({body: {_id, props}, transaction}: InputProps): Promise<OutputProps> {
    if(!props.cliente || !props.itens || props.itens.length == 0) throw new DtoValidationException(['Registros obrigatórios do pedido não encontrados'])
    const item = new Pedido(props)
    return this.repository.editar({ _id, item, transaction })
  }
}
