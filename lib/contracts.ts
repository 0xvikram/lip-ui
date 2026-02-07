// Contract addresses and ABIs for LIP Protocol

export const CONTRACTS = {
  sepolia: {
    IntentManager: "0xE514254c1EBD1B55A5C4A981ff2ef2B7AeC43525",
    ChunkExecutor: "0xE19dA85545Ac7eAc44Fe356D76CbFdBaCa3819fd",
    LiquidityBuffer: "0x8dF2D3b60385325fF42a06850Fa11904fC6E242C",
    PoolManager: "0x1111111111111111111111111111111111111111", // Mock for now
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
