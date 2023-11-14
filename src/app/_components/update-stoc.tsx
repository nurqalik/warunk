import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { $Enums, Product } from "@prisma/client"
import { FormEvent, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "~/trpc/react"

interface adstock {
  id: string,
  name: string
}

const UpdateStock = (props: adstock) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [stock, setStock] = useState(0)
  const toast = useToast()

  const { isLoading, mutate: update } = api.product.updateStock.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: "Stock has been updated"
      })
      onClose()
    }
  })

  const onSubmit = () => {
    update({ id: String(props.id), stock})
    // console.log(stock)
  }

  const onKeyPress = (e: React.KeyboardEvent) => {
    if(e.which === 13) {
      document.getElementById('submit')?.click()
    }
  }

  return (
    <>
      <Button onClick={onOpen}>+</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Stock</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>{props.name}</FormLabel>
              <Input type="number" onKeyPress={onKeyPress} min={1} isRequired placeholder='0' value={stock} onChange={(e: React.FormEvent<HTMLInputElement>) => setStock(e.currentTarget.valueAsNumber)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' id='submit' mr={3} isLoading={isLoading} loadingText="Adding stock" spinnerPlacement="start" onClick={() => onSubmit()}>
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateStock