import request from "supertest";
import express from "express";
import { faker } from "@faker-js/faker";
import catalogRoute, { catalogService } from "../catalog.routes";
import { productFatory } from "../../utils/fixtures";

const app = express();
app.use(express.json());
app.use("/", catalogRoute);

const mockRequest = () => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 10, max: 100 }),
    price: +faker.commerce.price(),
  };
};

describe("Catalog Routes", () => {
  describe("POST /products", () => {
    test("should create product successfully", async () => {
      const requestBody = mockRequest();
      const product = productFatory.build();

      jest
        .spyOn(catalogService, "createProduct")
        .mockImplementationOnce(() => Promise.resolve(product));

      const response = await request(app).post("/products").send(requestBody);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(product);
    });

    test("should response with validation error 400", async () => {
      const requestBody = mockRequest();

      const response = await request(app)
        .post("/products")
        .send({ ...requestBody, name: "" });

      expect(response.status).toBe(400);
      expect(response.body).toContain("name should not be empty");
    });

    test("should response with internal error code 500", async () => {
      const requestBody = mockRequest();

      jest
        .spyOn(catalogService, "createProduct")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("error occurred on create product"))
        );

      const response = await request(app).post("/products").send(requestBody);

      expect(response.status).toBe(500);
      expect(response.body).toContain("error occurred on create product");
    });
  });

  describe("PATCH /products/:id", () => {
    test("should update product successfully", async () => {
      const product = productFatory.build();
      const requestBody = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };

      jest
        .spyOn(catalogService, "updateProduct")
        .mockImplementationOnce(() => Promise.resolve(product));

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(product);
    });

    test("should response with validation error 400", async () => {
      const product = productFatory.build();
      const requestBody = {
        name: product.name,
        price: 0,
        stock: product.stock,
      };

      const response = await request(app)
        .patch(`/products/${product?.id}`)
        .send(requestBody);

      expect(response.status).toBe(400);
      expect(response.body).toContain("price must not be less than 1");
    });

    test("should response with internal error code 500", async () => {
      const product = productFatory.build();
      const requestBody = mockRequest();

      jest
        .spyOn(catalogService, "updateProduct")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("unable to update product"))
        );

      const response = await request(app)
        .patch(`/products/${product?.id}`)
        .send(requestBody);

      expect(response.status).toBe(500);
      expect(response.body).toContain("unable to update product");
    });
  });

  describe("GET /products?limit=0&offset=0", () => {
    test("should return a range of products base on limit and offset", async () => {
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const products = productFatory.buildList(randomLimit);

      jest
        .spyOn(catalogService, "getProducts")
        .mockImplementationOnce(() => Promise.resolve(products));

      const response = await request(app).get(
        `/products?limit=${randomLimit}&offset=0`
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(products);
    });
  });

  describe("GET /product/:id", () => {
    test("should return a product", async () => {
      const product = productFatory.build();

      jest
        .spyOn(catalogService, "getProduct")
        .mockImplementationOnce(() => Promise.resolve(product));

      const response = await request(app).get(`/product/${product.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(product);
    });
  });

  describe("DELETE /product/:id", () => {
    test("should delete product by id", async () => {
      const product = productFatory.build();

      jest
        .spyOn(catalogService, "deleteProduct")
        .mockImplementationOnce(() => Promise.resolve({ id: product.id }));

      const response = await request(app).delete(`/product/${product.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ id: product.id });
    });
  });
});
