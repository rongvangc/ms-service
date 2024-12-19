import * as Repository from "../repository/cart.repository";
import { CartRepositoryType } from "../types/repository.type";
import { CreateCart } from "./cart.service";

describe("Cart Service", () => {
  let repo: CartRepositoryType;

  beforeEach(() => {
    repo = Repository.CartRepository;
  });

  afterEach(() => {
    repo = {} as CartRepositoryType;
  });

  it("should return correct data while creating cart", async () => {
    const mockCart = {
      title: "smart phone",
      amount: 1200,
    };

    jest.spyOn(Repository.CartRepository, "create").mockImplementationOnce(() =>
      Promise.resolve({
        message: "fake response from cart repository",
        input: mockCart,
      })
    );

    const res = await CreateCart(mockCart, repo);

    expect(res).toEqual({
      input: mockCart,
      message: "fake response from cart repository",
    });
  });
});
