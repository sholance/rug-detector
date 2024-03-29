import { HandleTransaction, TransactionEvent } from 'forta-agent'
// Monitor for token creators that are EOA with low reputation
import creatorMonitorFunctionAgent from "./token.creator.monitor";

// Monitor all liquidity pools to see if no one else deposits liquidity into the pool
import liquidityPoolMonitorFunctionAgent from "./liquidity.pool.monitor";

// Monitor for when creator removes liquidity or takes large amount of token and sell on the token liquidity pool
import tokenLiquidityMonitorFunctionAgent from "./token.liquidity.monitor";

type Agent = {
  handleTransaction: HandleTransaction,
}

function provideHandleTransaction(
  creatorMonitorFunctionAgent: Agent,
  liquidityPoolMonitorFunctionAgent: Agent,
  tokenLiquidityMonitorFunctionAgent: Agent,
): HandleTransaction {

  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings = (await Promise.all([
      creatorMonitorFunctionAgent.handleTransaction(txEvent),
      liquidityPoolMonitorFunctionAgent.handleTransaction(txEvent),
      tokenLiquidityMonitorFunctionAgent.handleTransaction(txEvent)
    ])).flat()

    return findings
  }
}

export default {
  handleTransaction: provideHandleTransaction(
    creatorMonitorFunctionAgent,
    liquidityPoolMonitorFunctionAgent,
    tokenLiquidityMonitorFunctionAgent
  ),
}