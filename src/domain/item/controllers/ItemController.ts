import { Repository } from "@shared/ports/repository"
import { Item, ItemProps } from "@domain/item/entities/item"
import { EditarItemUseCase } from "../usecases/editarItem.usecase";

export class ItemController {
  private readonly editarItemUseCase: EditarItemUseCase;
  constructor(private readonly repository: Repository<Item>) {
    this.editarItemUseCase = new EditarItemUseCase(this.repository)
  }

  async editar(_id: string, body: ItemProps) {
    return this.editarItemUseCase.execute({_id, props: body})
  }

  async deletar(_id: string) {
    return this.repository.deletar({ _id })
  }
}
