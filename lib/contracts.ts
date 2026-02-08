// Contract addresses and ABIs for LIP Protocol

export const CONTRACTS = {
  sepolia: {
    IntentManager: "0xF4fa48A2C917102EA2b17Deb048892379CB772FC",
    ChunkExecutor: "0xa454D02F8945EA236d3017A207aDE95AE3B5Ae40",
    LiquidityBuffer: "0x4AF97E02EFA61Ec438f212A211bf61B74e113DF4",
    PoolManager: "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543", // Real Uniswap v4 Sepolia
  },
  localhost: {
    IntentManager: "0x0000000000000000000000000000000000000000",
    ChunkExecutor: "0x0000000000000000000000000000000000000000",
    LiquidityBuffer: "0x0000000000000000000000000000000000000000",
    PoolManager: "0x0000000000000000000000000000000000000000",
  },
} as const;

// Minimal ABIs for contract interaction
export const INTENT_MANAGER_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "currency0", type: "address" },
          { internalType: "address", name: "currency1", type: "address" },
          { internalType: "uint24", name: "fee", type: "uint24" },
          { internalType: "int24", name: "tickSpacing", type: "int24" },
          { internalType: "address", name: "hooks", type: "address" },
        ],
        internalType: "struct PoolKey",
        name: "pool",
        type: "tuple",
      },
      { internalType: "int24", name: "tickLower", type: "int24" },
      { internalType: "int24", name: "tickUpper", type: "int24" },
      { internalType: "uint128", name: "totalLiquidity", type: "uint128" },
      { internalType: "uint128", name: "maxChunk", type: "uint128" },
    ],
    name: "createIntent",
    outputs: [{ internalType: "uint256", name: "intentId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "intentId", type: "uint256" }],
    name: "cancelIntent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "intentId", type: "uint256" }],
    name: "getIntent",
    outputs: [
      {
        components: [
          { internalType: "address", name: "lp", type: "address" },
          {
            components: [
              { internalType: "address", name: "currency0", type: "address" },
              { internalType: "address", name: "currency1", type: "address" },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              { internalType: "address", name: "hooks", type: "address" },
            ],
            internalType: "struct PoolKey",
            name: "pool",
            type: "tuple",
          },
          { internalType: "int24", name: "tickLower", type: "int24" },
          { internalType: "int24", name: "tickUpper", type: "int24" },
          { internalType: "uint128", name: "totalLiquidity", type: "uint128" },
          {
            internalType: "uint128",
            name: "executedLiquidity",
            type: "uint128",
          },
          { internalType: "uint128", name: "maxChunk", type: "uint128" },
          { internalType: "bool", name: "active", type: "bool" },
        ],
        internalType: "struct IntentManager.Intent",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextIntentId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "intentId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "lp", type: "address" },
      {
        indexed: false,
        internalType: "uint128",
        name: "totalLiquidity",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "maxChunk",
        type: "uint128",
      },
    ],
    name: "IntentCreated",
    type: "event",
  },
] as const;

export const CHUNK_EXECUTOR_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "intentId", type: "uint256" },
      { internalType: "uint128", name: "chunkLiquidity", type: "uint128" },
    ],
    name: "executeChunk",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export type Intent = {
  lp: string;
  pool: {
    currency0: string;
    currency1: string;
    fee: number;
    tickSpacing: number;
    hooks: string;
  };
  tickLower: number;
  tickUpper: number;
  totalLiquidity: bigint;
  executedLiquidity: bigint;
  maxChunk: bigint;
  active: boolean;
};
