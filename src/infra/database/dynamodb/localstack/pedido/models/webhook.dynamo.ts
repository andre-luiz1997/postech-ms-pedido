import { Schema, model } from "dynamoose";
import { ItemModel } from "../../item/models/item.dynamo";
import { ClienteModel } from "../../cliente/models/cliente.dynamo";
import { PedidoModel } from "./pedido.dynamo";

const WebhookSchema = new Schema(
    {
        _id: { type: String },
        pedido: PedidoModel,
        url: { type: String, required: true },
        deletedAt: { type: Date, required: false, default: null },
    },
    { timestamps: true }
)


export const WebhookModel = model("Webhook", WebhookSchema);
