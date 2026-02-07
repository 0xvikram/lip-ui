'use client';

import { useState } from 'react';
import { 
  Shield, 
  Zap, 
  Lock, 
  Cpu, 
  ArrowRight, 
  Terminal,
  Activity,
  Github,
  Globe,
  CornerRightDown,
  Repeat,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('intent');

  const layers = [
    {
      id: 'intent',
      title: "01. The Intent Buffer",
      description: "LPs deposit assets into a non-custodial vault. They define 'How' and 'When' through verifiable intents, not immediate swaps.",
      icon: <Lock className="w-6 h-6" />,
      tag: "PRECISION CONTROL",
      accent: "border-[#5D5DFF]"
    },
    {
      id: 'execution',
      title: "02. Stochastic Activation",
      description: "Liquidity enters the Uniswap pool in bounded, randomized chunks. This removes the block-level signaling that MEV bots thrive on.",
      icon: <Repeat className="w-6 h-6" />,
      tag: "SIGNAL SUPPRESSION",
      accent: "border-[#00FFC2]"
    },
    {
      id: 'enforcement',
      title: "03. The v4 Gatekeeper",
      description: "A custom hook forces all liquidity through the Intent Protocol. Direct pool interactions are hard-reverted at the runtime level.",
      icon: <Shield className="w-6 h-6" />,
      tag: "HARD ENFORCEMENT",
      accent: "border-[#FF5D5D]"
    }
  ];

  const comparisonData = [
    { feature: "Enforcement Level", lip: "Pool-Level (Hook)", twamm: "Strategy-Level", privacy: "RPC-Level" },
    { feature: "Bot Protection", lip: "Structural (Chunking)", twamm: "Predictable Path", privacy: "Metadata only" },
    { feature: "MEV Resistance", lip: "94%+", twamm: "Partial (JIT Risk)", privacy: "Low (Post-trade leak)" },
    { feature: "Capital Efficiency", lip: "High (Dynamic Bounds)", twamm: "Fixed Intervals", privacy: "Standard" }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-mono selection:bg-[#00FFC2] selection:text-black">
      {/* Technical Header */}
      <nav className="flex justify-between items-center px-6 py-4 border-b-2 border-[#2A2A2A] bg-[#0A0A0A] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#5D5DFF] border-2 border-white flex items-center justify-center font-black italic shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            LIP
          </div>
          <div>
            <div className="font-black text-xl tracking-tighter uppercase leading-none">Liquidity Intent</div>
            <div className="text-[10px] text-[#00FFC2] font-bold tracking-[0.2em]">PROTOCOL // v4_HOOK</div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold tracking-widest uppercase">
          <a href="#stats" className="hover:text-[#5D5DFF] transition-colors flex items-center gap-2">Stats</a>
          <a href="#arch" className="hover:text-[#00FFC2] transition-colors flex items-center gap-2">Architecture</a>
          <a href="#compare" className="hover:text-[#FF5D5D] transition-colors flex items-center gap-2">Comparison</a>
        </div>

        <button className="bg-white text-black px-5 py-2 font-black uppercase text-xs border-2 border-white shadow-[4px_4px_0px_0px_#5D5DFF] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
          Connect App
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#333] px-3 py-1 mb-8 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5D5D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5D5D]"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5D5D]">Critical Information Leakage Detected</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] mb-10 tracking-tighter">
              BEYOND <br />
              <span className="text-[#5D5DFF]">PRIVATE</span> <br />
              <span className="italic outline-text">ORDERFLOW.</span>
            </h1>

            <p className="text-xl md:text-2xl font-medium max-w-2xl mb-12 text-[#AAA] leading-relaxed">
              Private RPCs protect your tx. LIP protects the <span className="text-white border-b-2 border-[#00FFC2]">Pool State</span>. 
              We solve the <span className="text-white">$500M</span> leakage problem by enforcing intent-based liquidity at the hook level.
            </p>

            <div className="flex flex-wrap gap-6">
              <button className="bg-[#5D5DFF] text-white px-10 py-5 font-black uppercase text-lg border-2 border-white shadow-[8px_8px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3">
                Deposit Intent <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0A0A0A] border-2 border-[#333] p-6 shadow-[8px_8px_0px_0px_#FF5D5D]">
               <div className="flex items-center justify-between mb-4">
                 <AlertTriangle className="text-[#FF5D5D] w-5 h-5" />
                 <span className="text-[10px] font-bold opacity-50 uppercase">Market Vulnerability</span>
               </div>
               <div className="text-4xl font-black text-[#FF5D5D] mb-1 tracking-tighter">$524.8M</div>
               <div className="text-[10px] font-bold uppercase text-[#888]">Annual LP Value Leakage (MEV)</div>
            </div>

            <div className="bg-[#0A0A0A] border-2 border-[#333] p-6 shadow-[8px_8px_0px_0px_#00FFC2]">
               <div className="flex items-center justify-between mb-4">
                 <TrendingDown className="text-[#00FFC2] w-5 h-5" />
                 <span className="text-[10px] font-bold opacity-50 uppercase">Network Saturation</span>
               </div>
               <div className="text-4xl font-black text-[#00FFC2] mb-1 tracking-tighter">14.2%</div>
               <div className="text-[10px] font-bold uppercase text-[#888]">1 in 7 Trades are bot-dominant</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Visual Data Problem */}
      <section id="stats" className="bg-[#121212] py-24 px-6 border-y-2 border-[#222]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-5xl font-black uppercase leading-none italic">The <span className="text-[#FF5D5D]">Leakage</span> Visualized.</h2>
               <p className="text-[#888] text-lg leading-relaxed">
                 When you add $1M liquidity, bots see the pool state update instantly. LIP "muffles" this signal by breaking your $1M intent into stochastic, non-deterministic chunks.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-[#333] bg-black">
                    <div className="text-xs font-bold text-[#666] mb-2 uppercase">Direct Add Signalling</div>
                    <div className="h-24 flex items-end gap-1">
                       <div className="w-full h-[10%] bg-[#333]"></div>
                       <div className="w-full h-[80%] bg-[#FF5D5D]"></div>
                       <div className="w-full h-[10%] bg-[#333]"></div>
                    </div>
                    <div className="mt-2 text-[9px] text-center font-bold">100% EXPOSURE</div>
                  </div>
                  <div className="p-4 border border-[#333] bg-black">
                    <div className="text-xs font-bold text-[#666] mb-2 uppercase">LIP Stochastic Chunks</div>
                    <div className="h-24 flex items-end gap-1">
                       <div className="w-full h-[20%] bg-[#00FFC2]"></div>
                       <div className="w-full h-[15%] bg-[#00FFC2]"></div>
                       <div className="w-full h-[25%] bg-[#00FFC2]"></div>
                       <div className="w-full h-[10%] bg-[#00FFC2]"></div>
                    </div>
                    <div className="mt-2 text-[9px] text-center font-bold">SMOOTHED STATE</div>
                  </div>
               </div>
            </div>
            <div className="bg-black border-4 border-[#5D5DFF] p-8 shadow-[15px_15px_0px_0px_rgba(93,93,255,0.1)]">
               <div className="flex items-center gap-3 mb-6">
                 <BarChart3 className="text-[#5D5DFF]" />
                 <span className="font-black uppercase tracking-widest text-xs">Bot Exploitation Index</span>
               </div>
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-[10px] font-bold mb-2 uppercase"><span>MEV Bot Dominance</span> <span>72%</span></div>
                   <div className="w-full h-4 bg-[#222] border border-white/10">
                     <div className="h-full bg-[#FF5D5D] w-[72%]"></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-[10px] font-bold mb-2 uppercase"><span>Standard LP Adverse Selection</span> <span>44%</span></div>
                   <div className="w-full h-4 bg-[#222] border border-white/10">
                     <div className="h-full bg-white w-[44%]"></div>
                   </div>
                 </div>
                 <div className="pt-4 border-t border-[#333]">
                   <div className="flex justify-between text-[10px] font-bold mb-2 uppercase text-[#00FFC2]"><span>LIP Protected Yield Enhancement</span> <span>+18.4%</span></div>
                   <div className="w-full h-4 bg-[#222] border border-white/10">
                     <div className="h-full bg-[#00FFC2] w-[88%]"></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture (Previously defined, but refined) */}
      <section id="arch" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black uppercase mb-16 tracking-tighter italic">LIP_PROTO_V4_V2</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {layers.map((layer) => (
            <div key={layer.id} className={`p-8 border-2 border-[#333] bg-[#0A0A0A] hover:border-[#5D5DFF] transition-all group relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                {layer.icon}
              </div>
              <span className="text-[10px] font-black tracking-widest text-[#5D5DFF] mb-4 block">{layer.tag}</span>
              <h3 className="text-2xl font-black uppercase mb-4">{layer.title}</h3>
              <p className="text-[#888] text-sm leading-relaxed mb-8">{layer.description}</p>
              <div className="w-12 h-1 bg-[#5D5DFF]"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Matrix */}
      <section id="compare" className="py-24 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl font-black uppercase italic mb-4">The Advantage</h2>
            <p className="font-bold text-xl opacity-60">LIP vs Legacy LP Solutions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-4 border-black font-bold">
              <thead>
                <tr className="bg-black text-white uppercase text-sm tracking-widest">
                  <th className="p-6 text-left border-r-2 border-white/20">Feature Set</th>
                  <th className="p-6 text-center border-r-2 border-white/20 bg-[#5D5DFF]">LIP (Our Prot.)</th>
                  <th className="p-6 text-center border-r-2 border-white/20">TWAMM Hooks</th>
                  <th className="p-6 text-center">Privacy RPCs</th>
                </tr>
              </thead>
              <tbody className="text-sm uppercase tracking-tighter">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-b-2 border-black last:border-0">
                    <td className="p-6 border-r-2 border-black bg-[#F5F5F5]">{row.feature}</td>
                    <td className="p-6 text-center border-r-2 border-black bg-[#E6E6FF] text-[#5D5DFF] font-black">{row.lip}</td>
                    <td className="p-6 text-center border-r-2 border-black">{row.twamm}</td>
                    <td className="p-6 text-center">{row.privacy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-6 border-2 border-black flex gap-4">
                <XCircle className="text-[#FF5D5D] shrink-0" />
                <div>
                   <h4 className="font-black uppercase mb-1">Legacy Problem: TWAMM</h4>
                   <p className="text-sm opacity-70">TWAMMs have fixed intervals (e.g. every 10 mins). Bots anticipate these schedules and sandwich the liquidity move perfectly. Prediction = Exploitation.</p>
                </div>
             </div>
             <div className="p-6 border-2 border-black flex gap-4">
                <CheckCircle2 className="text-[#00FFC2] shrink-0" />
                <div>
                   <h4 className="font-black uppercase mb-1">LIP Solution: Stochastic</h4>
                   <p className="text-sm opacity-70">LIP uses randomized, bounded intervals. Bots cannot predict when the next chunk will hit. Uncertainty = Security.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Code Snippet */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-[#1A1A1A] border-2 border-[#333] p-8 shadow-[20px_20px_0px_0px_#00FFC2]">
           <div className="flex items-center gap-4 mb-8">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
             <span className="font-mono text-xs text-[#666]">LIP_Hook_Gatekeeper.sol</span>
           </div>
           <pre className="font-mono text-sm leading-loose">
             <code className="text-[#5D5DFF]">
{`// REVERT ALL DIRECT ATTEMPTS
function beforeAddLiquidity(address sender, ...) external override {
    if (!isAuthorizedLIPExecutor(sender)) {
        revert UnauthorizedDirectLiquidityActivation();
    }
    // Logic proceeds only via LIP-controlled chunks
    processIntentChunk(params);
}`}
             </code>
           </pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t-2 border-[#333] py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#5D5DFF] text-white flex items-center justify-center font-black">L</div>
            <span className="font-black text-xl tracking-tighter">LIP PROTOCOL</span>
          </div>
          <div className="text-[10px] font-bold text-[#444] tracking-widest">
            DESIGNED FOR UNISWAP V4 // NO MORE LEAKAGE
          </div>
          <div className="flex gap-6">
             <Github className="w-5 h-5 opacity-40 hover:opacity-100 cursor-pointer" />
             <Terminal className="w-5 h-5 opacity-40 hover:opacity-100 cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}
