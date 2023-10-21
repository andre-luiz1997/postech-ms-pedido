import { Schema, model } from "dynamoose";
import { ItemModel } from "../../item/models/item.dynamo";
import { ClienteModel } from "../../cliente/models/cliente.dynamo";
import { PedidoModel } from "../../pedido/models/pedido.dynamo";
import { formasPagamento, statusPagamento } from "src/domain/pagamento/entities/pagamento";

const PagamentoSchema = new Schema(
    {
        _id: { type: String },
        pedido: PedidoModel,
        status: { type: String, required: true, enum: statusPagamento },
        valor: { type: Number, required: true },
        valorPago: { type: Number, required: false, default: null },
        formaPagamento: { type: String, required: false, default: null, enum: formasPagamento },
        deletedAt: { type: Date, required: false, default: null },
    },
    { timestamps: true }
)


export const PagamentoModel = model("Pagamento", PagamentoSchema);
