import { JsonDataReader } from "@shared/adapters/jsonDataReader"
import { Cliente, ClienteProps } from "@domain/cliente/entities/cliente"
import { ClienteMemoriaRepository } from "@infra/database/memory/cliente/repositories/clientesMemoria.repository"
import { ClienteSeeder } from "@infra/database/memory/cliente/seeders/cliente.seeder"
import { DtoValidationException } from "src/shared/exceptions/dtoValidationError.exception"
import { CPFInvalidoException } from "src/shared/exceptions/cpfInvalido.exception"
import { CadastrarClienteUseCase } from "./cadastrarCliente.usecase"

const clientesRepository = ClienteMemoriaRepository.Instance
const usecase = new CadastrarClienteUseCase(clientesRepository)

test("Deve cadastrar um cliente", async function () {
  const clientesDataReader = new JsonDataReader<Array<ClienteProps>>()
  const clientesSeeder = new ClienteSeeder(clientesRepository, clientesDataReader)
  const expectedLength = await clientesSeeder.seed()
  const output = await clientesRepository.listar()
  expect(output).toHaveLength(expectedLength)
})

test("Cadastrar um cliente sem os campos obrigatorios", async function () {
  const cliente = new Cliente({})
  try {
    const output = await usecase.execute(cliente)
    expect(output).toThrow(DtoValidationException)
  } catch (error) {}
})

test("Cadastrar um cliente com cpf invalido", async function () {
  const clientesRepository = ClienteMemoriaRepository.Instance
  const usecase = new CadastrarClienteUseCase(clientesRepository)
  const cliente = new Cliente({
    cpf: "11111111111",
  })
  try {
    const output = await usecase.execute(cliente)
    expect(output).toThrow(CPFInvalidoException)
  } catch (error) {}
})
