// types.ts
export interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
    blockNumber: number;
    status: boolean;
}
  
  export interface AddressTag {
    address: string;
    name: string;
}
  
  export interface SignatureData {
    address: string;
    message: string;
    signature: string;
}