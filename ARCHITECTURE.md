# LIP Protocol Architecture

## Current Implementation (v1 - HackMoney 2026)

### What's Implemented ✅

1. **Intent-Based Liquidity Provisioning**
   - Users create intents specifying total liquidity and max chunk size
   - Permissionless execution in smaller chunks
   - Progressive liquidity addition prevents MEV extraction

2. **Smart Contracts (Deployed on Sepolia)**
   - `IntentManager`: Create, track, cancel liquidity intents
   - `ChunkExecutor`: Execute intents in bounded chunks
   - `LiquidityBuffer`: Token custody (simplified for MVP)
   - `LIPHook`: Uniswap v4 hook enforcing intent-based LP only

3. **MEV Protection Mechanism**
   - Chunked execution spreads liquidity over time
   - Max chunk size limits single execution impact
   - Reduces sandwich attack profitability
   - Hook prevents direct LP adds (bypassing intent system)

4. **UI Features**
   - Create Intent: Set pool, range, total liquidity, chunk size
   - Execute Chunks: Anyone can execute chunks for active intents
   - Manage Intents: View your intents, track progress, cancel active ones

### What's NOT Implemented ❌

1. **Market Condition Protection**
   - ❌ No price volatility monitoring
   - ❌ No automatic pause during market drops
   - ❌ No price rise detection to stop execution
   - ❌ No oracle integration for market data
   - ❌ No emergency withdrawal mechanism

2. **Why Not?**
   - **Scope**: HackMoney 2026 focused on core intent-based MEV protection
   - **Complexity**: Market condition logic requires oracles, complex state machines
   - **Hook Constraints**: Uniswap v4 hooks have gas limits and limited access to external data

### Future Enhancements (v2+)

1. **Volatility Protection**
   ```solidity
   // Pseudo-code for future implementation
   function beforeAddLiquidity(...) {
       uint256 currentPrice = getOraclePrice();
       uint256 volatility = calculateVolatility();
       
       if (volatility > MAX_VOLATILITY) {
           revert("Market too volatile - intent paused");
       }
       
       if (priceDroppedBy(currentPrice, 5%)) {
           // Emergency: dump remaining liquidity
           emergencyDumpLiquidity(intentId);
       }
   }
   ```

2. **Emergency Controls**
   - User-defined price bounds (stop-loss/take-profit)
   - Automatic intent pause on extreme volatility
   - Time-weighted average price (TWAP) validation

3. **Advanced Features**
   - Dynamic chunk sizing based on market conditions
   - Gas price optimization (execute when gas is low)
   - Multi-pool intents with rebalancing

## Why LIP Works for MEV Protection (Without Market Conditions)

The core innovation is **intent-based chunking**:

1. **Problem**: Large LP adds create predictable opportunities for MEV bots
2. **Solution**: Split large adds into many small chunks executed over time
3. **Result**: No single execution is large enough for profitable sandwiching

Market condition protection is **orthogonal** to MEV protection:
- MEV protection = prevent sandwich attacks during execution
- Market protection = prevent losses from macro price movements

LIP v1 solves the first problem. Market protection would be a v2 enhancement.

## Contract Architecture

```
┌─────────────────┐
│   User (LP)     │
└────────┬────────┘
         │ createIntent()
         ▼
┌─────────────────┐
│ IntentManager   │  Stores intents, validates cancellations
└────────┬────────┘
         │
         │ Anyone calls executeChunk()
         ▼
┌─────────────────┐
│ ChunkExecutor   │  Reads intent, validates chunk, adds liquidity
└────────┬────────┘
         │ modifyLiquidity()
         ▼
┌─────────────────┐
│ PoolManager     │  Uniswap v4 core
│   (v4-core)     │
└────────┬────────┘
         │ beforeAddLiquidity hook
         ▼
┌─────────────────┐
│    LIPHook      │  Blocks direct LP, enforces intent context
└─────────────────┘
```

## FAQ

**Q: Why no price protection in the hook?**  
A: Hooks have limited access to external data (oracles). Price monitoring would need to be in the executor layer or off-chain monitoring system.

**Q: Can users protect against price drops?**  
A: Currently, users should monitor markets and cancel intents manually if they want to exit. Future versions could add automated price bounds.

**Q: What happens if market crashes during execution?**  
A: Intent continues executing chunks. User should cancel intent if they want to stop. In v2, we could add automatic pause conditions.

**Q: Is this production-ready?**  
A: No. This is a HackMoney MVP demonstrating intent-based MEV protection. Production would need:
- Comprehensive testing
- Audit
- Oracle integration
- Market condition monitoring
- Emergency pause mechanisms
- Governance for parameter updates
