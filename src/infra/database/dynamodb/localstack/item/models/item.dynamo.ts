import {Schema, model} from "dynamoose";
import { Item as DynamoItem } from "dynamoose/dist/Item";

const ItemSchema = new Schema(
  {
    _id: { type: String },
    tipo: { type: String, required: true },
    medida: { type: String, required: true },
    nome: { type: String, required: true },
    descricao: { type: String, required: false, default: null },
    aceitaOpcional: { type: Boolean, required: true },
    preco: { type: Number, required: true },
    deletedAt: { type: Date, required: false, default: null },
  },
  { timestamps: true }
);

export const ItemModel = model("Item", ItemSchema);
