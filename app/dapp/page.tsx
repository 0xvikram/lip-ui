'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Zap, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAccount, useDisconnect, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS, INTENT_MANAGER_ABI, CHUNK_EXECUTOR_ABI } from '@/lib/contracts';

export default function DAppPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'execute' | 'manage'>('create');
  const [selectedIntent, setSelectedIntent] = useState<number | null>(null);
  const [chunkAmount, setChunkAmount] = useState('');
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Read contract - total intents
  const { data: nextIntentId, refetch: refetchNextId } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'nextIntentId',
  });

  // Read up to 20 intents (fixed number for hooks rules)
  const { data: intent0 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(0)],
  });
  const { data: intent1 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(1)],
  });
  const { data: intent2 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(2)],
  });
  const { data: intent3 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(3)],
  });
  const { data: intent4 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(4)],
  });
  const { data: intent5 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(5)],
  });
  const { data: intent6 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(6)],
  });
  const { data: intent7 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(7)],
  });
  const { data: intent8 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(8)],
  });
  const { data: intent9 } = useReadContract({
    address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
    abi: INTENT_MANAGER_ABI,
    functionName: 'getIntent',
    args: [BigInt(9)],
  });

  // Combine into array and filter valid intents
  const totalIntents = nextIntentId ? Number(nextIntentId) : 0;
  const allIntentData = [
    intent0, intent1, intent2, intent3, intent4,
    intent5, intent6, intent7, intent8, intent9
  ];
  
  const intents = allIntentData
    .slice(0, totalIntents)
    .map((data, id) => ({ id, data }))
    .filter(intent => intent.data);

  // Filter user's intents
  const userIntents = intents.filter(
    (intent) => intent.data && intent.data.lp.toLowerCase() === address?.toLowerCase()
  );

  // Filter active intents (for execution)
  const activeIntents = intents.filter((intent) => intent.data && intent.data.active);
  
  // Form state
  const [formData, setFormData] = useState({
    token0: '0x',
    token1: '0x',
    tickLower: '-100',
    tickUpper: '100',
    totalLiquidity: '',
    maxChunk: '',
  });

  const handleCreateIntent = async () => {
    if (!formData.totalLiquidity || !formData.maxChunk) {
      alert('Please fill in all fields');
      return;
    }

    writeContract({
      address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
      abi: INTENT_MANAGER_ABI,
      functionName: 'createIntent',
      args: [
        {
          currency0: formData.token0 as `0x${string}`,
          currency1: formData.token1 as `0x${string}`,
          fee: 3000,
          tickSpacing: 60,
          hooks: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        },
        parseInt(formData.tickLower),
        parseInt(formData.tickUpper),
        parseEther(formData.totalLiquidity),
        parseEther(formData.maxChunk),
      ],
    }, {
      onSuccess: () => {
        refetchNextId(); // Refresh the intent count
      }
    });
  };

  const handleExecuteChunk = async (intentId: number) => {
    if (!chunkAmount) {
      alert('Please enter chunk amount');
      return;
    }

    writeContract({
      address: CONTRACTS.sepolia.ChunkExecutor as `0x${string}`,
      abi: CHUNK_EXECUTOR_ABI,
      functionName: 'executeChunk',
      args: [BigInt(intentId), parseEther(chunkAmount)],
    });
  };

  const handleCancelIntent = async (intentId: number) => {
    writeContract({
      address: CONTRACTS.sepolia.IntentManager as `0x${string}`,
      abi: INTENT_MANAGER_ABI,
      functionName: 'cancelIntent',
      args: [BigInt(intentId)],
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-mono">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 py-4 border-b-2 border-[#2A2A2A] bg-[#0A0A0A]">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-black text-lg">LIP PROTOCOL</span>
        </Link>

        {!isConnected ? (
          <appkit-button />
        ) : (
          <div className="flex items-center gap-4">
            <div className="bg-[#1A1A1A] border-2 border-[#00FFC2] px-6 py-3 font-mono text-sm">
              <span className="text-[#00FFC2]">●</span> {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <button 
              onClick={() => disconnect()}
              className="bg-[#FF5D5D] text-white px-4 py-3 font-bold uppercase text-xs border-2 border-white"
            >
              Disconnect
            </button>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-8 py-4 font-black uppercase text-sm border-2 transition-all ${
              activeTab === 'create'
                ? 'bg-[#5D5DFF] text-white border-white shadow-[6px_6px_0px_0px_#000]'
                : 'bg-[#1A1A1A] border-[#333] hover:border-[#5D5DFF]'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create Intent
          </button>
          <button
            onClick={() => setActiveTab('execute')}
            className={`px-8 py-4 font-black uppercase text-sm border-2 transition-all ${
              activeTab === 'execute'
                ? 'bg-[#00FFC2] text-black border-white shadow-[6px_6px_0px_0px_#000]'
                : 'bg-[#1A1A1A] border-[#333] hover:border-[#00FFC2]'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Execute Chunks
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-8 py-4 font-black uppercase text-sm border-2 transition-all ${
              activeTab === 'manage'
                ? 'bg-[#FF5D5D] text-white border-white shadow-[6px_6px_0px_0px_#000]'
                : 'bg-[#1A1A1A] border-[#333] hover:border-[#FF5D5D]'
            }`}
          >
            <XCircle className="w-4 h-4 inline mr-2" />
            Manage Intents
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="lg:col-span-2">
            {activeTab === 'create' && (
              <div className="bg-[#121212] border-2 border-[#333] p-8">
                <h2 className="text-3xl font-black uppercase mb-8">Create Liquidity Intent</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#888] mb-2 uppercase">Token 0 Address</label>
                      <input
                        type="text"
                        value={formData.token0}
                        onChange={(e) => setFormData({...formData, token0: e.target.value})}
                        className="w-full bg-black border-2 border-[#333] px-4 py-3 font-mono text-sm focus:border-[#5D5DFF] outline-none"
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#888] mb-2 uppercase">Token 1 Address</label>
                      <input
                        type="text"
                        value={formData.token1}
                        onChange={(e) => setFormData({...formData, token1: e.target.value})}
                        className="w-full bg-black border-2 border-[#333] px-4 py-3 font-mono text-sm focus:border-[#5D5DFF] outline-none"
                        placeholder="0x..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#888] mb-2 uppercase">Tick Lower</label>
                      <input
                        type="number"
                        value={formData.tickLower}
                        onChange={(e) => setFormData({...formData, tickLower: e.target.value})}
                        className="w-full bg-black border-2 border-[#333] px-4 py-3 font-mono text-sm focus:border-[#5D5DFF] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#888] mb-2 uppercase">Tick Upper</label>
                      <input
                        type="number"
                        value={formData.tickUpper}
                        onChange={(e) => setFormData({...formData, tickUpper: e.target.value})}
                        className="w-full bg-black border-2 border-[#333] px-4 py-3 font-mono text-sm focus:border-[#5D5DFF] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#888] mb-2 uppercase">Total Liquidity (tokens)</label>
                    <input
                      type="number"
                      value={formData.totalLiquidity}
                      onChange={(e) => setFormData({...formData, totalLiquidity: e.target.value})}
                      className="w-full bg-black border-2 border-[#333] px-4 py-3 font-mono text-sm focus:border-[#5D5DFF] outline-none"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#888] mb-2 uppercase">Max Chunk Size (tokens)</label>
                    <input
                      type="number"
                      value={formData.maxChunk}
                      onChange={(e) => setFormData({...formData, maxChunk: e.target.value})}
                      className="w-full bg-black border-2 border-[#333] px-4 py-3 font-mono text-sm focus:border-[#5D5DFF] outline-none"
                      placeholder="250"
                    />
                    <p className="text-xs text-[#666] mt-2">Smaller chunks = better MEV protection</p>
                  </div>

                  <button
                    onClick={handleCreateIntent}
                    disabled={!isConnected || isPending || isConfirming}
                    className="w-full bg-[#5D5DFF] disabled:bg-[#333] text-white px-8 py-4 font-black uppercase text-sm border-2 border-white shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isConfirming && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Creating Intent...' : isConnected ? 'Create Intent' : 'Connect Wallet First'}
                  </button>
                  
                  {isSuccess && (
                    <div className="bg-[#00FFC2] text-black p-4 font-bold flex items-center gap-2 mt-4">
                      <CheckCircle className="w-5 h-5" />
                      Intent Created! 
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline ml-1"
                      >
                        View on Etherscan: {hash?.slice(0, 10)}...
                      </a>
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-[#FF5D5D] text-white p-4 font-bold flex items-center gap-2 mt-4">
                      <XCircle className="w-5 h-5" />
                      Error: {error.message.slice(0, 100)}...
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'execute' && (
              <div className="bg-[#121212] border-2 border-[#333] p-8">
                <h2 className="text-3xl font-black uppercase mb-8">Execute Chunks</h2>
                
                {activeIntents.length === 0 ? (
                  <div className="text-center py-12 text-[#666]">
                    <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-bold uppercase">No Active Intents</p>
                    <p className="text-sm mt-2">Execute chunks for any active intent</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeIntents.map((intent) => {
                      if (!intent.data) return null;
                      const progress = Number(intent.data.executedLiquidity) / Number(intent.data.totalLiquidity) * 100;
                      const remaining = Number(intent.data.totalLiquidity) - Number(intent.data.executedLiquidity);
                      
                      return (
                        <div key={intent.id} className="bg-black border-2 border-[#00FFC2] p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="text-xl font-black text-[#00FFC2]">INTENT #{intent.id}</div>
                              <div className="text-xs text-[#666] mt-1">
                                LP: {intent.data.lp.slice(0, 6)}...{intent.data.lp.slice(-4)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black">{progress.toFixed(1)}%</div>
                              <div className="text-xs text-[#666]">Complete</div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-2">
                              <span className="text-[#666]">Progress</span>
                              <span className="font-mono">{(Number(intent.data.executedLiquidity) / 1e18).toFixed(4)} / {(Number(intent.data.totalLiquidity) / 1e18).toFixed(4)}</span>
                            </div>
                            <div className="w-full bg-[#1A1A1A] h-2 border border-[#333]">
                              <div className="bg-[#00FFC2] h-full" style={{ width: `${progress}%` }} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                            <div>
                              <div className="text-[#666]">Token Pair</div>
                              <div className="font-mono text-[#00FFC2] text-[10px]">
                                {intent.data.pool.currency0.slice(0, 8)}... / {intent.data.pool.currency1.slice(0, 8)}...
                              </div>
                            </div>
                            <div>
                              <div className="text-[#666]">Tick Range</div>
                              <div className="font-mono">{intent.data.tickLower} → {intent.data.tickUpper}</div>
                            </div>
                            <div>
                              <div className="text-[#666]">Max Chunk</div>
                              <div className="font-mono">{(Number(intent.data.maxChunk) / 1e18).toFixed(4)}</div>
                            </div>
                            <div>
                              <div className="text-[#666]">Remaining</div>
                              <div className="font-mono">{(remaining / 1e18).toFixed(4)}</div>
                            </div>
                          </div>

                          {selectedIntent === intent.id ? (
                            <div className="space-y-3">
                              <input
                                type="number"
                                value={chunkAmount}
                                onChange={(e) => setChunkAmount(e.target.value)}
                                placeholder={`Max: ${(Number(intent.data.maxChunk) / 1e18).toFixed(4)}`}
                                className="w-full bg-[#0A0A0A] border-2 border-[#00FFC2] px-4 py-2 font-mono text-sm"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleExecuteChunk(intent.id)}
                                  disabled={isPending || isConfirming}
                                  className="flex-1 bg-[#00FFC2] text-black px-4 py-2 font-black uppercase text-xs disabled:opacity-50"
                                >
                                  {isPending || isConfirming ? 'Executing...' : 'Execute'}
                                </button>
                                <button
                                  onClick={() => setSelectedIntent(null)}
                                  className="px-4 py-2 border-2 border-[#666] font-bold uppercase text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedIntent(intent.id)}
                              className="w-full bg-[#00FFC2] text-black px-6 py-3 font-black uppercase text-sm border-2 border-white hover:bg-[#00DD9F]"
                            >
                              <Zap className="w-4 h-4 inline mr-2" />
                              Execute Chunk
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'manage' && (
              <div className="bg-[#121212] border-2 border-[#333] p-8">
                <h2 className="text-3xl font-black uppercase mb-8">Your Intents</h2>
                
                {userIntents.length === 0 ? (
                  <div className="text-center py-12 text-[#666]">
                    <XCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-bold uppercase">No Active Intents</p>
                    <p className="text-sm mt-2">Create your first intent to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userIntents.map((intent) => {
                      if (!intent.data) return null;
                      const progress = Number(intent.data.executedLiquidity) / Number(intent.data.totalLiquidity) * 100;
                      const isComplete = progress >= 100;
                      
                      return (
                        <div key={intent.id} className={`bg-black border-2 p-6 ${intent.data.active ? 'border-[#5D5DFF]' : 'border-[#666]'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <div className="text-xl font-black text-[#5D5DFF]">INTENT #{intent.id}</div>
                                {intent.data.active ? (
                                  <span className="bg-[#00FFC2] text-black px-2 py-1 text-[10px] font-black">ACTIVE</span>
                                ) : (
                                  <span className="bg-[#666] text-white px-2 py-1 text-[10px] font-black">CANCELLED</span>
                                )}
                                {isComplete && (
                                  <span className="bg-[#FFD700] text-black px-2 py-1 text-[10px] font-black">COMPLETE</span>
                                )}
                              </div>
                              <div className="text-xs text-[#666] mt-1 font-mono">
                                Created by you
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black">{progress.toFixed(1)}%</div>
                              <div className="text-xs text-[#666]">Executed</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-[#666] mb-1">Token 0</div>
                              <div className="font-mono text-xs bg-[#1A1A1A] px-3 py-2 border border-[#333]">
                                {intent.data.pool.currency0.slice(0, 10)}...
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-[#666] mb-1">Token 1</div>
                              <div className="font-mono text-xs bg-[#1A1A1A] px-3 py-2 border border-[#333]">
                                {intent.data.pool.currency1.slice(0, 10)}...
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                            <div>
                              <div className="text-[#666]">Tick Range</div>
                              <div className="font-mono font-bold">{intent.data.tickLower} → {intent.data.tickUpper}</div>
                            </div>
                            <div>
                              <div className="text-[#666]">Total Liquidity</div>
                              <div className="font-mono font-bold">{(Number(intent.data.totalLiquidity) / 1e18).toFixed(4)}</div>
                            </div>
                            <div>
                              <div className="text-[#666]">Max Chunk</div>
                              <div className="font-mono font-bold">{(Number(intent.data.maxChunk) / 1e18).toFixed(4)}</div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-2">
                              <span className="text-[#666]">Execution Progress</span>
                              <span className="font-mono">
                                {(Number(intent.data.executedLiquidity) / 1e18).toFixed(4)} / {(Number(intent.data.totalLiquidity) / 1e18).toFixed(4)}
                              </span>
                            </div>
                            <div className="w-full bg-[#1A1A1A] h-3 border border-[#333]">
                              <div className="bg-[#5D5DFF] h-full transition-all" style={{ width: `${progress}%` }} />
                            </div>
                          </div>

                          {intent.data.active && !isComplete && (
                            <button
                              onClick={() => handleCancelIntent(intent.id)}
                              disabled={isPending || isConfirming}
                              className="w-full bg-[#FF5D5D] text-white px-6 py-3 font-black uppercase text-sm border-2 border-white hover:bg-[#DD3D3D] disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4 inline mr-2" />
                              {isPending || isConfirming ? 'Cancelling...' : 'Cancel Intent'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Side Panel - Stats */}
          <div className="space-y-6">
            <div className="bg-[#121212] border-2 border-[#333] p-6">
              <h3 className="text-xs font-black uppercase text-[#666] mb-4">Protocol Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-black text-[#5D5DFF]">{nextIntentId ? Number(nextIntentId).toString() : '0'}</div>
                  <div className="text-xs text-[#666] uppercase">Total Intents</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#00FFC2]">$0</div>
                  <div className="text-xs text-[#666] uppercase">TVL Protected</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">0</div>
                  <div className="text-xs text-[#666] uppercase">Chunks Executed</div>
                </div>
              </div>
            </div>

            <div className="bg-black border-2 border-[#5D5DFF] p-6">
              <h3 className="text-xs font-black uppercase text-[#5D5DFF] mb-4">Network</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666]">Chain:</span>
                  <span className="font-bold">Sepolia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Status:</span>
                  <span className="font-bold text-[#00FFC2]">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] border-2 border-[#333] p-6">
              <h3 className="text-xs font-black uppercase text-[#666] mb-4">Contract Addresses</h3>
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="text-[#666] mb-1">IntentManager</div>
                  <div className="text-[#5D5DFF] break-all">{CONTRACTS.sepolia.IntentManager.slice(0, 10)}...</div>
                </div>
                <div>
                  <div className="text-[#666] mb-1">ChunkExecutor</div>
                  <div className="text-[#00FFC2] break-all">{CONTRACTS.sepolia.ChunkExecutor.slice(0, 10)}...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
