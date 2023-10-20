import {Schema, model} from "dynamoose";
import { Cliente } from "@domain/cliente/entities/cliente";

const ClienteSchema = new Schema(
  {
    _id: { type: String },
    nome: { type: String, required: false },
    email: { type: String, required: false },
    cpf: { type: String, required: false },
    deletedAt: { type: Date, required: false, default: null },
  },
  { timestamps: true }
);

export const ClienteModel = model("Cliente", ClienteSchema);
