import { Schema, model } from "dynamoose";
import { ItemModel } from "../../item/models/item.dynamo";
import { ClienteModel } from "../../cliente/models/cliente.dynamo";

const PedidoSchema = new Schema(
    {
        _id: { type: String },
        cliente: ClienteModel,
        itens: [ItemModel],
        status: { type: String, required: true },
        valor: { type: Number, required: true },
        deletedAt: { type: Date, required: false, default: null },
    },
    { timestamps: true }

    )


export const PedidoModel = model("Pedido", PedidoSchema);
