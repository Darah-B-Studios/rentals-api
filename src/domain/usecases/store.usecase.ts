import { Store } from "../../data/entities/store";
import { IRepository } from "../../data/repositories/contracts/repository.base";
import { IStore } from "../models/store";
import slugify from "slugify";
export class StoreUseCase {
  /**
   *
   */
  constructor(private readonly storeRepository: IRepository<IStore, Store>) {}

  async createStore(store: IStore): Promise<Store> {
    const existingStore = await this.storeRepository.findByName(
      store.name
    );

    if (existingStore) {
      throw new Error("Store already exists");
    }

    // const _store = new Store({store});
    //because it's already done in the Repository
    return this.storeRepository.create(store);
  }

  async getAll(
    page: number,
    pageSize: number
  ): Promise<{ rows: Store[]; count: number }> {
    return this.storeRepository.getAll(page, pageSize);
  }


  async getStoreById(id: string): Promise<Store | null> {
    return this.storeRepository.findById(id);
  }

  async updateStore(store: IStore): Promise<Store> {
    const { id, name, location, imageBannerUrl } = store;
    const obj: IStore = {
      id,
      name,
      imageBannerUrl,
      location
    };
    return this.storeRepository.update(obj);
  }

  async deleteStore(id: string): Promise<void> {
    return this.storeRepository.delete(id);
  }
}
