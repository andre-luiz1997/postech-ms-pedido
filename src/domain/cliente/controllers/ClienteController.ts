import { Repository } from "@shared/ports/repository"
import { Cliente } from "@domain/cliente/entities/cliente"
import { EditarClienteUseCase } from "../usecases/editarCliente.usecase"
import { EditarClienteDto } from "../dtos/editarCliente.dto"
import { IMessagingQueue } from "src/infra/messaging/ports/queue"
import config from "src/shared/config"
import { DeletarClienteUseCase } from "../usecases/deletarCliente.usecase"

export class ClienteController {
  private readonly editarUseCase: EditarClienteUseCase
  private readonly deletarUseCase: DeletarClienteUseCase

  constructor(
    private readonly repository: Repository<Cliente>,
    private readonly messagingQueue: IMessagingQueue,
  ) {
    this.messagingQueue = messagingQueue;
    this.editarUseCase = new EditarClienteUseCase(this.repository);
    this.deletarUseCase = new DeletarClienteUseCase(this.repository);
    this.subscribeToQueues();
  }

  private subscribeToQueues() {
    this.messagingQueue.subscribeToQueue(config.queue.queues.queue1, (message: string) => {
      try {
        const {_id, ...rest} = JSON.parse(message) as Cliente;
        this.editarUseCase.execute({_id, props: rest})
      } catch (error) {
        console.log(error);
      }
    })
    this.messagingQueue.subscribeToQueue(config.queue.queues.queue2, (message: string) => {
      try {
        const {_id, ...rest} = JSON.parse(message) as Cliente;
        this.deletarUseCase.execute(_id)
      } catch (error) {
        console.log(error);
      }
    })
  }

  async editar(body: EditarClienteDto) {
    return this.editarUseCase.execute(body)
  }

  async deletar(_id: string) {
    return this.repository.deletar({ _id })
  }
}
