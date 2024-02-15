import { Repository } from "@shared/ports/repository"
import { CadastrarPedidoUseCase } from "@domain/pedido/usecases/cadastrarPedido.usecase"
import { Pedido } from "@domain/pedido/entities/pedido"
import { EditarPedidoUseCase } from "@domain/pedido/usecases/editarPedido.usecase"
import { Cliente } from "src/domain/cliente/entities/cliente"
import { IMessagingQueue } from "src/infra/messaging/ports/queue"
import { Item } from "src/domain/item/entities/item"
import { CadastrarPedidoDto } from "../dtos/cadastrarPedido.dto"
import { EditarPedidoDto } from "../dtos/editarPedido.dto"

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
    const transaction = await this.repository.startTransaction()
    try {
      let res; 
      await this.repository.inTransaction(transaction, async () => {
        res = await this.cadastrarUseCase.execute({body, transaction});
      })
      await this.repository.commitTransaction(transaction)
      return res
    } catch (error) {
      await this.repository.rollbackTransaction(transaction)
      throw error
    }
  }

  async editar(body: EditarPedidoDto) {
    const transaction = await this.repository.startTransaction()
    try {
      let res; 
      await this.repository.inTransaction(transaction, async () => {
        res = await this.editarUseCase.execute({body, transaction});
      })
      await this.repository.commitTransaction(transaction)
      return res
    } catch (error) {
      await this.repository.rollbackTransaction(transaction)
      throw error
    }
  }

  async deletar(_id: string) {
    return this.repository.deletar({ _id })
  }
}
