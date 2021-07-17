/* eslint-disable react/no-array-index-key */
import axios from 'axios'
import { nftaddress, nftmarketaddress } from 'config'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { Gradients, TicketColor } from '../utils'

const ticketColor: TicketColor = 'greenBluePurple'

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<any[]>([])
  const [loadingState, setLoadingState] = useState<
    'not-loaded' | 'loading' | 'loaded'
  >('not-loaded')

  useEffect(() => {
    void loadNFTs()
  }, [])

  const loadNFTs = async () => {
    setLoadingState('loading')
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider,
    )
    const data = await marketContract.fetchMarketItems()

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }

        return item
      }),
    )
    setNfts(items)
    setLoadingState('loaded')
  }

  const buyNft = async (nft: any) => {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      },
    )

    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loading')
    return (
      <div className="w-full h-full grid place-items-center">
        <img className="w-32" src="/loading.gif" alt="loading" />
      </div>
    )
  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>

  return (
    <div className="flex">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="flex flex-wrap gap-4 p-4">
          {nfts.map((nft, i: number) => (
            <div
              className={`p-1 rounded-lg hover:shadow-2xl transition-shadow bg-gradient-to-r ${Gradients[ticketColor]} animate-gradient-x`}
            >
              <div
                className="w-full max-w-xs rounded-lg overflow-hidden"
                key={i}
              >
                <img className="object-cover" src={nft.image} alt="nft" />
                <div className="p-4 bg-white">
                  <p
                    style={{ height: '64px' }}
                    className={`font-mono font-semibold text-3xl text-transparent bg-clip-text bg-gradient-to-r animate-gradient-x ${Gradients[ticketColor]}`}
                  >
                    {nft.name}
                  </p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-900">
                  <p className="text-2xl mb-4 font-bold text-white">
                    {nft.price} Matic
                  </p>
                  <button
                    className="w-full bg-green-500 text-white text-center font-bold py-2 rounded-md component-hover"
                    onClick={() => buyNft(nft)}
                    type="button"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
