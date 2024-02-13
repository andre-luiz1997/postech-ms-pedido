import { Repository } from "@shared/ports/repository"
import { CadastrarPedidoDto, CadastrarPedidoUseCase } from "@domain/pedido/usecases/cadastrarPedido.usecase"
import { Pedido, PedidoProps } from "@domain/pedido/entities/pedido"
import { EditarPedidoDto, EditarPedidoUseCase } from "@domain/pedido/usecases/editarPedido.usecase"
import { Cliente } from "src/domain/cliente/entities/cliente"
import { IMessagingQueue } from "src/infra/messaging/ports/queue"
import { Item } from "src/domain/item/entities/item"

export class PedidoController {
  private readonly cadastrarUseCase: CadastrarPedidoUseCase
  private readonly editarUseCase: EditarPedidoUseCase


  constructor(
    private readonly repository: Repository<Pedido>,
    private readonly clienteRepository: Repository<Cliente>,
    private readonly itemRepository: Repository<Item>,
    private readonly messagingQueue: IMessagingQueue,
  ) {
    this.messagingQueue = messagingQueue;
    this.cadastrarUseCase = new CadastrarPedidoUseCase(this.repository, this.clienteRepository, this.itemRepository, this.messagingQueue)
    this.editarUseCase = new EditarPedidoUseCase(this.repository)
  }

  async listar(queryProps?: Object) {
    return this.repository.listar(queryProps)
  }

  async buscarUm(_id: string) {
    return this.repository.buscarUm({
      query: {
        _id,
      },
    })
  }

  async criar(body: CadastrarPedidoDto) {
    return this.cadastrarUseCase.execute(body)
  }

  async editar(body: EditarPedidoDto) {
    return this.editarUseCase.execute(body)
  }

  async deletar(_id: string) {
    return this.repository.deletar({ _id })
  }
}
