import { Repository } from "@shared/ports/repository"
import { Cliente } from "@domain/cliente/entities/cliente"
import { EditarClienteUseCase } from "../usecases/editarCliente.usecase"
import { EditarClienteDto } from "../dtos/editarCliente.dto"

export class ClienteController {
  private readonly editarUseCase: EditarClienteUseCase

  constructor(private readonly repository: Repository<Cliente>) {
    this.editarUseCase = new EditarClienteUseCase(this.repository)
  }

  async editar(body: EditarClienteDto) {
    return this.editarUseCase.execute(body)
  }

  async deletar(_id: string) {
    return this.repository.deletar({ _id })
  }
}
