import * as Joi from "joi"

import { DTO } from "@shared/ports/dto"
import { statusPedidos } from "@domain/pedido/entities/pedido"
import { medidasItem, tiposItem } from "src/domain/item/entities/item"

const clienteSchema = Joi.object({
  _id: Joi.any().required(),
  nome: Joi.string().optional(),
  email: Joi.string().email().optional(),
  cpf: Joi.string().optional(),
}).required()

const itemSchema = Joi.object({
  _id: Joi.any().required(),
  tipo: Joi.string().required().valid(...tiposItem),
  medida: Joi.string().required().valid(...medidasItem),
  nome: Joi.string().required(),
  descricao: Joi.string().allow(null).optional(),
  aceitaOpcional: Joi.boolean().required(),
  preco: Joi.number().required(),
}).required()

const itemPedidoSchema = Joi.object({
  item: itemSchema,
  qtd: Joi.number().min(0).required(),
}).required()

export class PedidoDTO {
  static schema = Joi.object({
    cliente: clienteSchema,
    itens: Joi.array().items(itemPedidoSchema).required(),
    status: Joi.string()
      .required()
      .valid(...statusPedidos),
  })

  static validate(req: any, res: any, next: any): boolean {
    const dto = new DTO(PedidoDTO.schema)
    return dto.validate(req, res, next)
  }
}
