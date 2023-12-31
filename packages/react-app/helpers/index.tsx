import Blockies from "react-blockies";
import { BigNumber } from "ethers";

export const identiconTemplate = (address: string) => {
  return (
    <Blockies
      size={14} // number of pixels square
      scale={4} // width/height of each 'pixel'
      className="identicon border-2 border-white rounded-full" // optional className
      seed={address} // seed used to generate icon data, default: random
    />
  );
};


export type Product = {
  id: number;
  name: string;
  price: BigNumber;
  owner: string;
  image: string;
  description: string;
  location: string;
  sold: boolean;
};

export type TransactionHistory = {
  txID: number;
  tranType: number;
  productId: number;
  seller: string;
  price: BigNumber;
  createdAt: number;
}

export const truncateAddress = (address: string) => {
  if (!address) return;
  return (
    address.slice(0, 5) +
    "..." +
    address.slice(address.length - 5, address.length)
  );
};

export const convertTime = (secs: number) => {
  if (secs === 0) {
    return "--";
  }

  let dateObj = new Date(secs * 1000);

  let date = dateObj.toLocaleDateString("en-us", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  let time = dateObj.toLocaleString("en-us", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return date + ", " + time;
};

export const getTxnType = (type: number) => {
  switch(type) {
    case 0:
      return "ADD"
    case 1:
      return "REMOVE"
    case 2:
      return "BUY"
  }  
}
