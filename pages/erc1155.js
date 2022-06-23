
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers'
import CharacterItemsABI from "../abi/CharacterItems.json"

import { Button } from '@chakra-ui/react'


export default function Home() {

  const [shieldBalance, setShieldBalance] = useState(0);

  useEffect(() => {
    let getData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract("0x8ac89bE2A904308fe6b01Db4a44CE8507801a250", CharacterItemsABI, signer)

      let balance = await contract.getItemBalance(1)
      setShieldBalance(balance)

      console.log("Account:", await signer.getAddress());
      console.log("Shield Balance:", shieldBalance);
    }

    getData()
  }, [])

  async function mint () {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract("0x8ac89bE2A904308fe6b01Db4a44CE8507801a250", CharacterItemsABI, signer)

    let shieldBalance = await contract.mintItem(1)
}

  return (
    <div>
      <h1>You have {shieldBalance.toString()} shields</h1>
      <Button colorScheme='blue' onClick={mint}>Mint</Button>
    </div>
  )
}
