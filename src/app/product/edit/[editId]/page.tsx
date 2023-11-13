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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";

const formProduct = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  price: z
    .number()
    .or(z.string().regex(/\d+/).transform(Number))
    .refine((n) => n >= 0),
  stock: z
    .number()
    .or(z.string().regex(/\d+/).transform(Number))
    .refine((n) => n >= 0),
  img: z.string().nonempty({ message: "Image cannot be empty" }).url(),
  categoryId: z.string().nonempty({ message: "Please select categpry" }),
});

const EditProduct = ({ params }: { params: { editId: string } }) => {
  const [category, setCategory] = useState<Category[]>([]);
  const [oldCategory, setOldCategory] = useState<string>("Select Category");
  const [product, setProduct] = useState<Product>();
  const { register, handleSubmit } = useForm<Product>();
  const toast = useToast();
  const router = useRouter();
  const id = params.editId;

  const form = useForm<z.infer<typeof formProduct>>({
    defaultValues: {
      name: "",
      img: "",
      price: 0,
      stock: 0,
    },
    resolver: zodResolver(formProduct),
  });

  const { mutate: update, isLoading } = api.product.updateProduct.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully edit product.",
      });
      void router.push("/product");
    },
  });

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

  const onSubmit = (formData: Product) => {
    const { name, img, price, stock, categoryId } = formData;
    update({ id: String(id), name, img, price, stock, categoryId });
    // console.log(formData)
  };

  const { isLoading: isFetching } = api.product.getOne.useQuery(String(id), {
    onSuccess: (data: Product) => {
      setProduct({
        name: data?.name,
        img: data?.img,
        price: data?.price,
        stock: data?.stock,
        categoryId: data?.categoryId,
      } as Product);
    },
  });

  useEffect(() => {
    if (category.length && form.getValues("categoryId")) {
      setOldCategory(
        category.find((item) => item.id === form.getValues("categoryId"))
          ?.name ?? "",
      );
    }
  }, [category, form, setCategory]);

  return (
    <>
      <div className="flex h-full w-full flex-col px-16">
        <div className="mb-4 text-center text-3xl font-bold">Edit Product</div>
        <form action="submit" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-2">
            <InputGroup>
              <InputLeftAddon>{"Product Name"}</InputLeftAddon>
              <Input
                type="text"
                defaultValue={product?.name}
                {...register("name", { required: true })}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon>{"Image Url"}</InputLeftAddon>
              <Input
                type="text"
                defaultValue={product?.img}
                {...register("img", { required: true })}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon>{"Rp."}</InputLeftAddon>
              <Input
                type="number"
                defaultValue={product?.price}
                min={1}
                isRequired
                {...register("price", { required: true, valueAsNumber: true })}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon>{"Stock"}</InputLeftAddon>
              <Input
                type="number"
                defaultValue={product?.stock}
                min={1}
                isRequired
                {...register("stock", { required: true, valueAsNumber: true })}
              />
            </InputGroup>
            <Select
              placeholder={oldCategory}
              defaultValue={product?.categoryId}
              {...register("categoryId", { required: true })}
            >
              {category.map((item: Category) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isFetching || isLoading}
              loadingText={isFetching ? "Get Data" : "Submitting"}
              spinnerPlacement="start"
            >
              Submit
            </Button>
            <div className="mt-4 text-center text-sm font-thin">
              Note: Please reselect category and tab or click every field on
              form before submitting if you not doing that you might lost your
              data. If price and stock value empty please refresh page.
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
