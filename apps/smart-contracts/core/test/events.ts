/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: selectively remove/replace collateral related methods with preUSD

import { ethers } from 'hardhat'
import { PrePOMarket } from '../typechain/PrePOMarket'
import { PrePOMarketFactory } from '../typechain/PrePOMarketFactory'
import {
  CollateralDepositRecord,
  AccountAccessController,
  DepositHook,
  WithdrawHook,
} from '../typechain'

export async function getMarketAddedEvent(factory: PrePOMarketFactory): Promise<any> {
  const filter = {
    address: factory.address,
    topics: [ethers.utils.id('MarketAdded(address,bytes32)')],
  }
  const events = await factory.queryFilter(filter, 'latest')
  return events[0].args as any
}

export async function getCollateralValidityChangedEvent(factory: PrePOMarketFactory): Promise<any> {
  const filter = {
    address: factory.address,
    topics: [ethers.utils.id('CollateralValidityChanged(address,bool)')],
  }
  const events = await factory.queryFilter(filter, 'latest')
  return events[0].args as any
}

export async function getMarketCreatedEvent(market: PrePOMarket): Promise<any> {
  const filter = {
    address: market.address,
    topics: [
      ethers.utils.id(
        'MarketCreated(address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256)'
      ),
    ],
  }
  const events = await market.queryFilter(filter, 'latest')
  return events[0].args as any
}

export async function getPublicMintingChangedEvent(market: PrePOMarket): Promise<any> {
  const filter = {
    address: market.address,
    topics: [ethers.utils.id('PublicMintingChanged(bool)')],
  }

  const events = await market.queryFilter(filter, 'latest')
  return events[0].args as any
}

export async function getMarketMintingFeeChangedEvent(market: PrePOMarket): Promise<any> {
  const filter = {
    address: market.address,
    topics: [ethers.utils.id('MintingFeeChanged(uint256)')],
  }

  const events = await market.queryFilter(filter, 'latest')
  return events[0].args as any
}

export async function getMarketRedemptionFeeChangedEvent(market: PrePOMarket): Promise<any> {
  const filter = {
    address: market.address,
    topics: [ethers.utils.id('RedemptionFeeChanged(uint256)')],
  }

  const events = await market.queryFilter(filter, 'latest')
  return events[0].args as any
}

export async function getTreasuryChangedEvent(market: PrePOMarket): Promise<any> {
  const filter = {
    address: market.address,
    topics: [ethers.utils.id('TreasuryChanged(address)')],
  }
  const events = await market.queryFilter(filter, 'latest')
  return events[0].args as any
}

export async function getFinalLongPriceSetEvent(market: PrePOMarket): Promise<any> {
  const filter = {
    address: market.address,
    topics: [ethers.utils.id('FinalLongPriceSet(uint256)')],
  }

  const events = await market.queryFilter(filter, 'latest')
  return events[0].args as any
}

export async function getGlobalDepositCapChangedEvent(
  depositRecord: CollateralDepositRecord
): Promise<any> {
  const filter = {
    address: depositRecord.address,
    topics: [ethers.utils.id('GlobalDepositCapChanged(uint256)')],
  }

  const events = await depositRecord.queryFilter(filter, 'latest')
  return events[0]
}

export async function getAccountDepositCapChangedEvent(
  depositRecord: CollateralDepositRecord
): Promise<any> {
  const filter = {
    address: depositRecord.address,
    topics: [ethers.utils.id('AccountDepositCapChanged(uint256)')],
  }

  const events = await depositRecord.queryFilter(filter, 'latest')
  return events[0]
}

export async function getAllowedHooksChangedEvent(
  depositRecord: CollateralDepositRecord
): Promise<any> {
  const filter = {
    address: depositRecord.address,
    topics: [ethers.utils.id('AllowedHooksChanged(address,bool)')],
  }

  const events = await depositRecord.queryFilter(filter, 'latest')
  return events[0]
}

export async function getRootChangedEvent(
  accountAccessController: AccountAccessController
): Promise<any> {
  const filter = accountAccessController.filters.RootChanged()

  const events = await accountAccessController.queryFilter(filter, 'latest')
  return events[0]
}

export async function getAccountAllowedEvent(
  accountAccessController: AccountAccessController,
  account: string
): Promise<any> {
  const filter = accountAccessController.filters.AccountAllowed(account)

  const events = await accountAccessController.queryFilter(filter, 'latest')
  return events[0]
}

export async function getAccountBlockedEvent(
  accountAccessController: AccountAccessController,
  account: string
): Promise<any> {
  const filter = accountAccessController.filters.AccountBlocked(account)

  const events = await accountAccessController.queryFilter(filter, 'latest')
  return events[0]
}

export async function getAllowedAccountsClearedEvent(
  accountAccessController: AccountAccessController
): Promise<any> {
  const filter = accountAccessController.filters.AllowedAccountsCleared()

  const events = await accountAccessController.queryFilter(filter, 'latest')
  return events[0]
}

export async function getBlockedAccountsClearedEvent(
  accountAccessController: AccountAccessController
): Promise<any> {
  const filter = accountAccessController.filters.BlockedAccountsCleared()

  const events = await accountAccessController.queryFilter(filter, 'latest')
  return events[0]
}

export async function getDepositHookVaultChangedEvent(hook: DepositHook): Promise<any> {
  const filter = {
    address: hook.address,
    topics: [ethers.utils.id('VaultChanged(address)')],
  }

  const events = await hook.queryFilter(filter, 'latest')
  return events[0].args as any
}

export async function getWithdrawHookVaultChangedEvent(hook: WithdrawHook): Promise<any> {
  const filter = {
    address: hook.address,
    topics: [ethers.utils.id('VaultChanged(address)')],
  }

  const events = await hook.queryFilter(filter, 'latest')
  return events[0].args as any
}
