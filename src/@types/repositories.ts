import { DatabaseClient, EventId, Pubkey } from './base'
import { AffinityMerchant, AffinityRelay } from './affinity'
import { DBEvent, Event } from './event'
import { PassThrough } from 'stream'
import { Invoice } from './invoice'
import { SubscriptionFilter } from './subscription'
import { User } from './user'


export type ExposedPromiseKeys = 'then' | 'catch' | 'finally'

export interface IQueryResult<T> extends Pick<Promise<T>, keyof Promise<T> & ExposedPromiseKeys> {
  stream(options?: Record<string, any>): PassThrough & AsyncIterable<T>
}

export interface IEventRepository {
  create(event: Event): Promise<number>
  upsert(event: Event): Promise<number>
  findByFilters(filters: SubscriptionFilter[]): IQueryResult<DBEvent[]>
  deleteByPubkeyAndIds(pubkey: Pubkey, ids: EventId[]): Promise<number>
}

export interface IInvoiceRepository {
  findById(id: string, client?: DatabaseClient): Promise<Invoice | undefined>
  upsert(invoice: Partial<Invoice>, client?: DatabaseClient): Promise<number>
  updateStatus(
    invoice: Pick<Invoice, 'id' | 'status'>,
    client?: DatabaseClient,
  ): Promise<Invoice | undefined>
  confirmInvoice(
    invoiceId: string,
    amountReceived: bigint,
    confirmedAt: Date,
    client?: DatabaseClient,
  ): Promise<void>
  findPendingInvoices(
    offset?: number,
    limit?: number,
    client?: DatabaseClient,
  ): Promise<Invoice[]>
}

export interface IUserRepository {
  findByPubkey(pubkey: Pubkey, client?: DatabaseClient): Promise<User | undefined>
  upsert(user: Partial<User>, client?: DatabaseClient): Promise<number>
  getBalanceByPubkey(pubkey: Pubkey, client?: DatabaseClient): Promise<bigint>
}

export interface IMerchantRepository {
  findByPubkey(pubkey: Pubkey, client?: DatabaseClient): Promise<AffinityMerchant | undefined>
  upsert(newMerchant: AffinityMerchant, client?: DatabaseClient): Promise<number>
  // insert(newMerchant: AffinityMerchant, client?: DatabaseClient): Promise<bigint>
  delete(pubkey: Pubkey): Promise<number>
}

export interface IRelayRepository {
  findByPubkey(pubkey: Pubkey, client?: DatabaseClient): Promise<AffinityRelay | undefined>
  upsert(newRelay: AffinityRelay, client?: DatabaseClient): Promise<number>
  // insert(newRelay: AffinityRelay, client?: DatabaseClient): Promise<void>
  delete(pubkey: Pubkey): Promise<number>
}

export interface IMerchantRequestRepository {
  findByPubkey(pubkey: Pubkey, client?: DatabaseClient): Promise<AffinityMerchant | undefined>
  upsert(newRelay: AffinityMerchant, client?: DatabaseClient): Promise<number>
  // insert(newRelay: AffinityRelay, client?: DatabaseClient): Promise<void>
  delete(pubkey: Pubkey): Promise<number>
}

// export interface IRelayRequestRepository {
//   findByPubkey(pubkey: Pubkey, client?: DatabaseClient): Promise<AffinityRelay | undefined>
//   upsert(newRelay: AffinityRelay, client?: DatabaseClient): Promise<number>
//   // insert(newRelay: AffinityRelay, client?: DatabaseClient): Promise<void>
//   delete(pubkey: Pubkey): Promise<number>
// }
