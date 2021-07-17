/* eslint-disable react/no-array-index-key */
/* pages/creator-dashboard.js */
import axios from 'axios'
import { nftaddress, nftmarketaddress } from 'config'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import NFT from '../../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { Gradients, TicketColor } from '../../utils'

const ticketColor: TicketColor = 'greenBluePurple'

const CreatorDashboard: NextPage = () => {
  const [nfts, setNfts] = useState<any>([])
  const [sold, setSold] = useState<any>([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer,
    )
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()

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
          sold: i.sold,
          image: meta.data.image,
        }

        return item
      }),
    )
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter((i: any) => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded')
  }
  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No assets created</h1>

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Created</h2>
        <div className="flex flex-wrap gap-4 p-4">
          {nfts.map((nft: any, i: number) => (
            <div
              className={`p-1 rounded-lg shadow-lg hover:shadow-2xl component-hover transition-shadow bg-gradient-to-r ${Gradients[ticketColor]} animate-gradient-x`}
            >
              <div
                key={i}
                className="w-full max-w-xs rounded-lg overflow-hidden"
              >
                <img src={nft.image} className="" alt="nft" />

                <div className="p-4 bg-black">
                  <p
                    className={`font-mono font-semibold text-3xl text-transparent bg-clip-text bg-gradient-to-r animate-gradient-x ${Gradients[ticketColor]}`}
                  >
                    Price - {nft.price} Matic
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4">
        {Boolean(sold.length) && (
          <div>
            <h2 className="text-2xl py-2">Items sold</h2>
            <div className="flex flex-wrap gap-4 p-4">
              {sold.map((nft: any, i: number) => (
                <div
                  className={`p-1 rounded-lg shadow-lg hover:shadow-2xl component-hover transition-shadow bg-gradient-to-r ${Gradients[ticketColor]} animate-gradient-x`}
                >
                  <div
                    key={i}
                    className="w-full max-w-xs rounded-lg overflow-hidden"
                  >
                    <img src={nft.image} className="" alt="nft" />

                    <div className="p-4 bg-black">
                      <p
                        className={`font-mono font-semibold text-3xl text-transparent bg-clip-text bg-gradient-to-r animate-gradient-x ${Gradients[ticketColor]}`}
                      >
                        Price - {nft.price} Matic
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreatorDashboard
