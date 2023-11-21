import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import { useState } from "react"
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
      <Button onClick={onOpen} fontSize={'sm'} margin={"2"} rounded={"full"}>+</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"xs"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'sm'}>Add Stock</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel fontSize={'sm'}>{props.name}</FormLabel>
              <Input type="number" fontSize={'sm'} onKeyPress={onKeyPress} min={1} isRequired placeholder='0' value={stock} onChange={(e: React.FormEvent<HTMLInputElement>) => setStock(e.currentTarget.valueAsNumber)} />
              <div className="text-xs font-thin text-center mt-2">If stock didn&apos;t increase please refresh the page.</div>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' id='submit' fontSize={'sm'} mr={3} isLoading={isLoading} loadingText="Adding stock" spinnerPlacement="start" onClick={() => onSubmit()}>
              Submit
            </Button>
            <Button onClick={onClose} fontSize={'sm'}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateStock