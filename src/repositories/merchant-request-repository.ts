import {
    applySpec,
    omit,
    pipe,
    prop,
  } from 'ramda'
import { createLogger } from '../factories/logger-factory'
import { IMerchantRequestRepository } from '../@types/repositories'
import { AffinityMerchantRequest, DBAffinityMerchantRequest } from '../@types/affinity'
import { DatabaseClient, Pubkey } from '../@types/base'
import { fromDBAffinityMerchantRequest, toBuffer, toJSON } from '../utils/transform'


const debug = createLogger('merchant-request-repository')

export class MerchantRequestRepository implements IMerchantRequestRepository {

    public constructor(private readonly dbClient: DatabaseClient,) { }

    public async findByPubkey(
        pubkey: Pubkey, 
        client: DatabaseClient = this.dbClient): Promise<AffinityMerchantRequest | undefined> {
            debug('find merchant request by pubkey %s', pubkey)
            const [dbMerchantRequest] = await client<DBAffinityMerchantRequest>('merchant_requests')
                .where('pubkey', toBuffer(pubkey))
                .select()

            
                if(!dbMerchantRequest) {
                    return
                }
                
                return fromDBAffinityMerchantRequest(dbMerchantRequest)
    }

    public async upsert(
        newMerchantRequest: AffinityMerchantRequest, 
        client: DatabaseClient = this.dbClient
    ): Promise<number> {
        debug('upsert: %o', newMerchantRequest)

        const row = applySpec<DBAffinityMerchantRequest> ({
            pubkey: pipe(prop('pubkey'), toBuffer),
            name: prop('name'),
            description: prop('description'),
            pricing: prop('pricing') as () => string,
            contactDetail: toJSON(prop('contactDetail')),
            latitude: prop('latitude'),
            longitude: prop('longitude'),
        })(newMerchantRequest)

        const query = client<DBAffinityMerchantRequest>('merchant_requests')
            .insert(row)
            .onConflict('pubkey')
            .merge(
                omit([
                    'pubkey',
                ])(row)
            )

        return {
            then: <T1, T2>(onfulfilled: (value: number) => T1 | PromiseLike<T1>, onrejected: (reason: any) => T2 | PromiseLike<T2>) => query.then(prop('rowCount') as () => number).then(onfulfilled, onrejected),
            catch: <T>(onrejected: (reason: any) => T | PromiseLike<T>) => query.catch(onrejected),
            toString: (): string => query.toString(),
            } as Promise<number>
    }


    public async delete(pubkey: Pubkey): Promise<number> {
        debug('deleting merchant request with pubkey %s', pubkey)

        return this.dbClient('merchant_requests')
            .where('pubkey', toBuffer(pubkey))
            .del()
    }

}