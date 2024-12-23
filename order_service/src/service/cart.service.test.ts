import * as Repository from "../repository/cart.repository";
import { CartRepositoryType } from "../repository/cart.repository";
import { CreateCart } from "./cart.service";

describe("Cart Service", () => {
  let repo: CartRepositoryType;

  beforeEach(() => {
    repo = Repository.cartRepositoryType;
  });

  afterEach(() => {
    repo = {} as CartRepositoryType;
  });

  it("should return correct data while creating cart", async () => {
    const mockCart = {
      title: "smart phone",
      amount: 1200,
    };

    jest
      .spyOn(Repository.cartRepositoryType, "createCart")
      .mockImplementationOnce(() =>
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
