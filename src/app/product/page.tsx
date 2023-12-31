"use client";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Button,
} from "@chakra-ui/react";
import type { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogTrigger } from "../_components/alert";
import AlertDelete from "../_components/alert-delete";
import MoneyFormatter from "../_components/money-formatter";
import UpdateStock from "../_components/update-stoc";

interface ProductDetail extends Product {
  categoryName: string;
  actionEdit: (id: string) => void;
  actionDelete: (id: string) => void;
}

const ProductPage = () => {
  const [product, setProduct] = useState<ProductDetail[]>([]);
  const { data: session } = useSession();
  const Id = session?.user.id;
  const router = useRouter();
  const toast = useToast();
  const deleteProduct = api.product.deleteProduct.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully deleting product",
      });
      void refetchProduct();
    },
  });
  const { refetch: refetchProduct } = api.product.getAll.useQuery(String(Id), {
    onSuccess: (data) =>
      setProduct(
        data.map(
          (item) =>
            ({
              id: item.id,
              name: item.name,
              img: item.img,
              price: item.price,
              stock: item.stock,
              categoryId: item.categoryId,
              createdById: item.createdById,
              categoryName: item.category.name,
              actionDelete: (id: string) => {
                deleteProduct.mutate({ id });
              },
              actionEdit: (id: string) => {
                void router.push(`/product/edit/${id}`);
              },
            }) as ProductDetail,
        ),
      ),
  });

  useEffect(() => {
    product
  }, [product])

  return (
    <>
      <TableContainer>
        <Table variant="unstyled" className="w-full">
          <TableCaption fontSize={'xs'}>{product.length != 0 ? 'Product List' : 'No Product Left, Please Add Product Before.'} <br/><Button variant='solid' colorScheme="blue" fontSize={'xs'} onClick={() => router.push(`/product/add`)} className="mt-2">Add New Product</Button></TableCaption>
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Name</Th>
              <Th>Image</Th>
              <Th isNumeric>Price</Th>
              <Th isNumeric>Stock</Th>
              <Th>Category</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {product.map((item, index) => (
              <Tr key={item.id}>
                <Td fontSize={"sm"}>{index + 1}</Td>
                <Td  fontSize={"sm"}>
                  {item.name}
                </Td>
                <Td>
                  <img
                    src={item.img}
                    width={0}
                    height={0}
                    sizes="100"
                    alt=""
                    className="h-20 w-20 object-contain"
                  />
                </Td>
                <Td fontSize={"sm"}><MoneyFormatter value={item.price}/></Td>
                <Td  fontSize={"sm"}>{item.stock} <UpdateStock id={item.id} name={item.name}/></Td>
                <Td fontSize={"sm"}>{item.categoryName}</Td>
                <Td>
                  <div className="flex flex-row gap-x-2">
                    <AlertDialog>
                      <Button
                        fontSize={"xs"}
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => item.actionEdit(item.id)}
                      >
                        Edit
                      </Button>
                      <AlertDialogTrigger className="flex w-full">
                        <Button variant="solid" colorScheme="red" fontSize={"xs"}>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDelete
                        title={`Are you sure to delete ${item.name} from product list ?`}
                        description="This will permanently delete your product."
                        onAction={() => item.actionDelete(item.id)}
                      >
                        Delete
                      </AlertDelete>
                    </AlertDialog>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProductPage;
