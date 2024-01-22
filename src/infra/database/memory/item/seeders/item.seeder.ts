import { DataReader } from "@shared/ports/dataReader";
import { Repository } from "@shared/ports/repository";
import { Seeder } from "@shared/ports/seeder";
import { Item, ItemProps } from "@domain/item/entities/item";

export class ItemSeeder implements Seeder {
  constructor(
    private readonly repository: Repository<Item>,
    private readonly itensDataReader: DataReader<ItemProps[]>
  ) {
  }

  async seed(): Promise<number> {
    try {
      const data = await this.itensDataReader.read({
        path: "src/domain/item/data/itens.json",
      });
      await Promise.all(
        data.map(async (item) => {
          await this.repository.criar({ item: new Item(item) });
        })
      );

      return data.length;
    } catch (error) {
      throw error;
    }
  }
}
