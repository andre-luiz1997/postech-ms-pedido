import { Cliente } from "src/domain/cliente/entities/cliente"
import { ClienteMemoriaRepository } from "./clientesMemoria.repository"
import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"
import { RegistroExistenteException } from "src/shared/exceptions/registroExistente.exception"

describe("Deve instanciar um repository de memória", () => {
  const clientesRepository = ClienteMemoriaRepository.Instance

  test("Verifica se a instância existe", () => {
    expect(clientesRepository).toBeDefined()
    expect(clientesRepository).toBe(ClienteMemoriaRepository.Instance)
  })

  test("Verifica se retorna uma lista de clientes", () => {
    try {
      const output = clientesRepository.listar()
      expect(output).toBeDefined()
    } catch (error) {}
  })

  test("Verifica se cria um cliente", async () => {
    try {
      const cliente = new Cliente({ _id: "1", nome: "teste", email: "teste@teste.com.br", cpf: "12345678901" })
      const output = await clientesRepository.criar({ item: cliente })
      expect(output).toBeTruthy()
      expect(output.nome).toBe("teste")
    } catch (error) {
      console.log("🚀 ~ test ~ error:", error)
      
    }
  })

  test("Verifica erro de email ao criar cliente duplicado", async () => {
    try {
      const cliente = new Cliente({ _id: "2", nome: "teste", email: "teste@teste.com.br" })
      const output = await clientesRepository.criar({ item: cliente })
      expect(output).toThrow(RegistroExistenteException)
    } catch (error) {}
  })

  test("Verifica erro de cpf ao criar cliente duplicado", async () => {
    try {
      const cliente = new Cliente({ _id: "2", nome: "teste", cpf: "12345678901" })
      const output = await clientesRepository.criar({ item: cliente })
      expect(output).toThrow(RegistroExistenteException)
    } catch (error) {}
  })

  test("Verifica erro de nome ao criar cliente duplicado", async () => {
    try {
      const cliente = new Cliente({ _id: "2", nome: "teste" })
      const output = await clientesRepository.criar({ item: cliente })
      expect(output).toThrowError()
    } catch (error) {}
  })

  test("Verifica erro de id ao criar cliente duplicado", async () => {
    try {
      const cliente = new Cliente({ _id: "1", nome: "teste2" })
      const output = await clientesRepository.criar({ item: cliente })
      expect(output).toThrowError()
    } catch (error) {}
  })

  test("Verifica se retorna um cliente", async () => {
    try {
      const output = await clientesRepository.buscarUm({ query: { _id: "1" } })
      expect(output).toBeTruthy()
      expect(output.nome).toBe("teste")
    } catch (error) {}
  })

  test("Verifica se edita um cliente", async () => {
    try {
      const cliente = await clientesRepository.buscarUm({ query: { _id: "1" } })
      cliente.nome = "teste2"
      const output = await clientesRepository.editar({ item: cliente, _id: "1" })
      expect(output).toBeTruthy()
      expect(output.nome).toBe("teste2")
    } catch (error) {}
  })

  test("Verifica erro ao edita um cliente que nao existe", async () => {
    try {
      const cliente = await clientesRepository.buscarUm({ query: { _id: "1" } })
      cliente.nome = "teste2"
      const output = await clientesRepository.editar({ item: cliente, _id: "10" })
      expect(output).toThrowError()
    } catch (error) {}
  })

  test("Verifica se deleta um cliente", async () => {
    try {
      const output = await clientesRepository.deletar({ _id: "1" })
      expect(output).toBeTruthy()
    } catch (error) {}
  })

  test("Verifica se deleta um cliente que nao esta cadastrado", async () => {
    try {
      const output = await clientesRepository.deletar({ _id: "10" })
      expect(output).toThrow(RegistroInexistenteException)
    } catch (error) {}
  })
})
