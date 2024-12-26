import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";

export class CatalogService {
  private _repository: ICatalogRepository;

  constructor(repository: ICatalogRepository) {
    this._repository = repository;
  }

  async createProduct(input: any) {
    const data = await this._repository.create(input);

    if (!data?.id) {
      throw new Error("unable to create product");
    }

    return data;
  }
  async updateProduct(input: Product) {
    const data = await this._repository.update(input);

    if (!data?.id) {
      throw new Error("unable to update product");
    }

    // emit event to update record in Elastic search
    return data;
  }

  // instead of this we will get product from Elastic search
  async getProducts(limit: number, offset: number) {
    const products = await this._repository.find(limit, offset);

    return products;
  }
  async getProduct(id: number) {
    const product = await this._repository.findOne(id);

    return product;
  }

  async deleteProduct(id: number) {
    const response = await this._repository.findOne(id);

    // delete record from Elastic search
    return {
      id: response.id,
    };
  }

  async getProductStock(ids: number[]) {
    const products = await this._repository.findStock(ids);
    if (!products) {
      throw new Error("unable to find product stock detials");
    }

    return products;
  }
}
