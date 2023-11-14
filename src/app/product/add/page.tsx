"use client";
import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  useToast,
} from "@chakra-ui/react";
import type { Category, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";

const AddProduct = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const { register, handleSubmit } = useForm<Product>();
  const toast = useToast();
  const router = useRouter();
  api.category.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      setCategory(
        data.map(
          (item) =>
            ({
              id: item.id,
              name: item.name,
            }) as Category,
        ),
      );
    },
  });

  const { mutate: create, isLoading } = api.product.createProduct.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You've been success to create product",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      void router.push("/product");
    },
  });

  const onSubmit = (formData: Product) => {
    create(formData);
    console.log(formData);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col px-16">
        <div className="mb-4 text-center text-xl md:text-3xl font-bold mt-24">Add Product</div>
        <form action="submit" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-2">
            <Input
              type="text"
              fontSize={"xs"}
              placeholder="Product name"
              {...register("name", { required: true })}
            />
            <Input
              type="text"
              fontSize={"xs"}
              placeholder="Image url"
              {...register("img", { required: true })}
            />
            <InputGroup>
              <InputLeftAddon fontSize={"xs"}>{"Rp."}</InputLeftAddon>
              <Input
                type="number"
                fontSize={"xs"}
                defaultValue={0}
                {...register("price", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon fontSize={"xs"}>{"Stock"}</InputLeftAddon>
              <Input
                type="number"
                fontSize={"xs"}
                defaultValue={0}
                {...register("stock", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </InputGroup>
            <Select
              placeholder="Select category"
              fontSize={"xs"}
              {...register("categoryId", { required: true })}
            >
              {category.map((item: Category) => (
                <option value={item.id} key={item.id} className="text-xs">
                  {item.name}
                </option>
              ))}
            </Select>
            <Button
              colorScheme="blue"
              fontSize={"xs"}
              type="submit"
              isLoading={isLoading}
              loadingText="Creating Product"
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
