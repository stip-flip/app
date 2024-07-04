We introduce ourself as a synthetic protocol.
In reality, S&F stands between perpetual swaps and synthetic assets. Using the singularity of the EVM to create a new type of financial instrument.
Let's make a comparison between perpetual swaps and the S&F OTC mode. 🧵

In finance a perpetual swap is a contract where 2 parties takes the long and short side of a trade. These 2 trader profiles are aggregated into a short and a long pool. The ratio between the 2 pools represent the contract price. If the contract price is above or below the spot price, a funding rate is introduced in order to rebalance the pool and serve as an incentive for traders to enter or leave their trade.

In a perpetual swap the contract price is relative to the ratio between the 2 pools, the contract price is subject to the trader movement, a big entry or exit can move the contract price significantly. On a blockchain, this could introduce huge MEV opportunities.

The funding rate needs to be calculated in real time based on the contract price versus the spot price.
This introduce the need for a fast oracle. Which is a problem in a decentralized environment.

S&F introduce the notion of a funding rate free market. Liquidity providers organise their liquidity in an order book concentrated around the funding rate price. A trader in search of a counterparty will buy liquidities, increasing the funding rate price in the process. The funding rate is no longer a function of the contract price, but of the counterparty risk.

Each S&F pool start with a ratio of 1:1. As opposed to perpetual contracts, the ratio is not subject to trader movements, but to asset price movement and aggregated funding rate. On each price update, an amount of liquidity is automatically secured or released. Increasing or decreasing the funding rate and moving the pool ratio as a result.

Each trader entering a pool has a number of shares minted, that is a function of the pool ratio and liquidity provided. For each enter, we keep track of the average ratio the traders entered at. This is used to calculate the trader profit and loss. The amount entered is bought on the funding rate market, increasing the funding rate as a result.

On trader exit we calculate the value of the shares exited, that is a function of the pool ratio and the shares burned. The trader PnL is the difference between the shares value at enter and at exit. The PnL is then reported to all the current active liquidities. Finally the exited shares value is sold on the funding rate free market, decreasing the funding rate as a result.

The important difference between perpetual swap and S&F lies in the way the contract price and funding rate is calculated.
On S&F the contract price or asset price will be whatever the oracle has last reported. And the funding rate will be the price of the last liquidity buy on the funding rate free market. Which brings us closer to a synthetic asset than a perpetual swap.

Finally, The S&F OTC mode is an analogy to Over The Counter trades, where trades are settled at the end of the day at a price that is agreed upon.
This works well for us because trader entry/exit are allowed at the oracle frequency. If the Oracle price update happen every 24 hours the S&F OTC mode will settle all trades at the same time and at the new price.
