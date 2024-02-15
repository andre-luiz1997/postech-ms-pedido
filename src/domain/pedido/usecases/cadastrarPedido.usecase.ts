import { Repository } from "src/shared/ports/repository"
import { UseCase } from "src/shared/ports/usecase"
import { Pedido, PedidoProps } from "../entities/pedido"
import { DtoValidationException } from "src/shared/exceptions/dtoValidationError.exception"
import { Cliente } from "src/domain/cliente/entities/cliente"
import { IMessagingQueue } from "src/infra/messaging/ports/queue"
import config from "src/shared/config"
import { Item } from "src/domain/item/entities/item"
import { CadastrarPedidoDto } from "../dtos/cadastrarPedido.dto"

export interface InputProps {
  body: CadastrarPedidoDto;
  transaction?: any;
}

type OutputProps = Pedido

export class CadastrarPedidoUseCase implements UseCase<InputProps, OutputProps> {
  private queue: string;
  constructor(
    private readonly repository: Repository<Pedido>,
    private readonly clienteRepository: Repository<Cliente>,
    private readonly itemRepository: Repository<Item>,
    private readonly messagingQueue: IMessagingQueue,
  ) {
    this.queue = config.queue.queues.queue3
  }

  async execute({body: props, transaction}: InputProps): Promise<OutputProps> {
    if(!props.cliente || !props.itens || props.itens.length == 0) throw new DtoValidationException(['Registros obrigatórios do pedido não encontrados'])
    let item = new Pedido(props)
    let cliente = await this.clienteRepository.buscarUm({query: {_id: item.cliente._id}});
    if(!cliente) {
      cliente = new Cliente(item.cliente);
      cliente = await this.clienteRepository.criar({item:cliente});
      item.cliente = cliente;
    }
    const pms = item.itens.map(async __item => {
      let _item = await this.itemRepository.buscarUm({query: {_id: __item.item._id}});
      if(!_item) {
        _item = new Item(__item.item);
        _item = await this.itemRepository.criar({item: _item});
        __item.item = _item;
      }
    })
    await Promise.all(pms);
    item = await this.repository.criar({ item });
    this.messagingQueue.publishToQueue(this.queue, JSON.stringify(item));
    return item
  }
}
