'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Zap, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ethers } from 'ethers';
import { CONTRACTS, INTENT_MANAGER_ABI } from '@/lib/contracts';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function DAppPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'execute' | 'manage'>('create');
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  
  // Transaction states
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState<string>('');
  const [nextIntentId, setNextIntentId] = useState<number>(0);
  
  // Form state
  const [formData, setFormData] = useState({
    token0: '0x',
    token1: '0x',
    tickLower: '-100',
    tickUpper: '100',
    totalLiquidity: '',
    maxChunk: '',
  });

  // Connect wallet
  const connectWallet = async () => {
    console.log('Connect wallet clicked');
    try {
      if (typeof window === 'undefined') {
        console.error('Window is undefined');
        return;
      }

      // Check for wallet providers
      const ethereum = window.ethereum;
      if (!ethereum) {
        alert('Please install MetaMask or Backpack wallet!');
        console.error('No wallet found');
        return;
      }

      console.log('Requesting accounts...');
      
      // Request accounts - works for both MetaMask and Backpack
      let accounts;
      try {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (e: any) {
        console.error('Failed to request accounts:', e);
        alert('Failed to connect wallet. Please try again.');
        return;
      }
      
      console.log('Accounts:', accounts);
      
      if (!accounts || accounts.length === 0) {
        alert('No accounts found. Please unlock your wallet.');
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      console.log('Signer obtained');
      
      // Check network
      let network;
      try {
        network = await provider.getNetwork();
        console.log('Network:', network.chainId);
      } catch (e: any) {
        console.error('Failed to get network:', e);
        // Continue anyway for Backpack
        setProvider(provider);
        setSigner(signer);
        setAddress(accounts[0]);
        setIsConnected(true);
        console.log('Connected (skipped network check)');
        await fetchNextIntentId(provider);
        return;
      }
      
      if (network.chainId !== BigInt(11155111)) {
        const switchNetwork = confirm('You are not on Sepolia network. Switch now?');
        if (switchNetwork) {
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }], // Sepolia
            });
            // Reconnect after switch
            setTimeout(() => window.location.reload(), 1000);
          } catch (switchError: any) {
            console.error('Switch error:', switchError);
            if (switchError.code === 4902) {
              alert('Please add Sepolia network to your wallet manually.');
            }
          }
        }
        return;
      }

      setProvider(provider);
      setSigner(signer);
      setAddress(accounts[0]);
      setIsConnected(true);
      console.log('Connected successfully!');
      
      // Read nextIntentId
      await fetchNextIntentId(provider);
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      alert('Error connecting wallet. Please try MetaMask instead.');
      setError(err.message);
    }
  };

  // Fetch nextIntentId
  const fetchNextIntentId = async (prov?: ethers.BrowserProvider) => {
    try {
      const p = prov || provider;
      if (!p) return;
      
      const contract = new ethers.Contract(
        CONTRACTS.sepolia.IntentManager,
        INTENT_MANAGER_ABI,
        p
      );
      const id = await contract.nextIntentId();
      setNextIntentId(Number(id));
    } catch (err) {
      console.error('Error reading nextIntentId:', err);
    }
  };

  // Handle create intent
  const handleCreateIntent = async () => {
    if (!formData.totalLiquidity || !formData.maxChunk) {
      alert('Please fill in all fields');
      return;
    }

    if (!signer) {
      alert('Please connect wallet first');
      return;
    }

    setError('');
    setIsSuccess(false);
    setIsPending(true);

    try {
      const contract = new ethers.Contract(
        CONTRACTS.sepolia.IntentManager,
        INTENT_MANAGER_ABI,
        signer
      );

      const tx = await contract.createIntent(
        {
          currency0: formData.token0,
          currency1: formData.token1,
          fee: 3000,
          tickSpacing: 60,
          hooks: '0x0000000000000000000000000000000000000000',
        },
        parseInt(formData.tickLower),
        parseInt(formData.tickUpper),
        ethers.parseEther(formData.totalLiquidity),
        ethers.parseEther(formData.maxChunk)
      );

      setIsPending(false);
      setIsConfirming(true);
      setTxHash(tx.hash);

      await tx.wait();
      
      setIsConfirming(false);
      setIsSuccess(true);
      await fetchNextIntentId();
    } catch (err: any) {
      console.error('Error creating intent:', err);
      setError(err.message || 'Transaction failed');
      setIsPending(false);
      setIsConfirming(false);
    }
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
          <button 
            onClick={connectWallet}
            className="bg-[#5D5DFF] text-white px-6 py-3 font-bold uppercase text-sm border-2 border-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="bg-[#1A1A1A] border-2 border-[#00FFC2] px-6 py-3 font-mono text-sm">
            <span className="text-[#00FFC2]">●</span> {address.slice(0, 6)}...{address.slice(-4)}
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
                      Intent Created! Transaction: {txHash.slice(0, 10)}...
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-[#FF5D5D] text-white p-4 font-bold flex items-center gap-2 mt-4">
                      <XCircle className="w-5 h-5" />
                      Error: {error.slice(0, 100)}...
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'execute' && (
              <div className="bg-[#121212] border-2 border-[#333] p-8">
                <h2 className="text-3xl font-black uppercase mb-8">Execute Chunks</h2>
                <div className="text-center py-12 text-[#666]">
                  <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-bold uppercase">No Active Intents</p>
                  <p className="text-sm mt-2">Execute chunks for any active intent</p>
                </div>
              </div>
            )}

            {activeTab === 'manage' && (
              <div className="bg-[#121212] border-2 border-[#333] p-8">
                <h2 className="text-3xl font-black uppercase mb-8">Your Intents</h2>
                <div className="text-center py-12 text-[#666]">
                  <XCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-bold uppercase">No Active Intents</p>
                  <p className="text-sm mt-2">Create your first intent to get started</p>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel - Stats */}
          <div className="space-y-6">
            <div className="bg-[#121212] border-2 border-[#333] p-6">
              <h3 className="text-xs font-black uppercase text-[#666] mb-4">Protocol Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-black text-[#5D5DFF]">{nextIntentId}</div>
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
