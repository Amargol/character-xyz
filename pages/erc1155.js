
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers'
import CharacterItemsABI from "../abi/CharacterItems.json"

import { Heading, Center, VStack, Button, useDisclosure, Select, Spinner } from '@chakra-ui/react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'


export default function Home() {

  const [balance, setBalance] = useState(0);
  const [itemId, setItemId] = useState("");
  const [itemText, setItemText] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure()

  async function getContract () {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());

    const contract = new ethers.Contract("0x8ac89bE2A904308fe6b01Db4a44CE8507801a250", CharacterItemsABI, signer)

    return contract
  }

  useEffect(() => {
    onChangeItem(0)
  }, [])

  async function onChangeItem(newItemId) {
    console.log(newItemId)

    let itemMap = {
      0: "Sword",
      1: "Shield"
    }


    let contract = await getContract()
    let itemBalance = await contract.getItemBalance(newItemId)
    console.log(itemId, itemBalance)

    setItemId(newItemId)
    setItemText(itemMap[newItemId])
    setBalance(itemBalance)
  }

  async function mint () {
    let contract = await getContract()

    let res = await contract.mintItem(1)

    onOpen()
  }

  console.log(itemText !== "")

  if (itemText == "") {
    return (
      <Center >
        <VStack maxWidth={500} spacing={3} paddingY={10} paddingX={100} marginX={10} marginY={50} backgroundColor={"gray.100"} borderRadius={30} >
          <Heading size='md'>Connecting to Wallet</Heading>
          <Spinner />
        </VStack>
      </Center>
    )
  } else {
    return (
      <Center >
        <VStack maxWidth={500} spacing={3} paddingY={10} paddingX={100} marginX={10} marginY={50} backgroundColor={"gray.100"} borderRadius={30} >
          <Select placeholder='Select option' value={itemId.toString()} onChange={(e) => onChangeItem(parseInt(e.target.value) || 0)} backgroundColor={"white"}>
            <option value='0'>Sword</option>
            <option value='1'>Shield</option>
          </Select>
  
          <Heading size='lg'>You have {balance.toString()} {itemText}</Heading>
          <Button colorScheme='blue' onClick={mint}>Mint {itemText}</Button>
  
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Congratulations 🎉</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Your {itemText} has been minted. <br></br>
                The transaction will be reflected on chain shortly! 
              </ModalBody>
  
              <ModalFooter>
                {/* <Button variant='ghost'>Secondary Action</Button> */}
                <Button colorScheme='blue' mr={10} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Center>
    )
  }

}
