import {
    applySpec,
    omit,
    pipe,
    prop,
  } from 'ramda'
  
import { DatabaseClient, Pubkey } from '../@types/base'
import { IMerchantRepository } from '../@types/repositories'
import { fromDBAffinityMerchant, toBuffer, toJSON } from '../utils/transform'
import { createLogger } from '../factories/logger-factory'
import { AffinityMerchant, DBAffinityMerchant } from '../@types/affinity'

const debug = createLogger('merchant-repository')

export class MerchantRepository implements IMerchantRepository {
    
    public constructor(private readonly dbClient: DatabaseClient,) { }

    public async findByPubkey(
        pubkey: Pubkey, 
        client: DatabaseClient = this.dbClient
    ): Promise<AffinityMerchant | undefined> {
        debug('find merchant by pubkey %s', pubkey)
        const [dbMerchant] = await client<DBAffinityMerchant>('merchants')
            .where('pubkey', toBuffer(pubkey))
            .select()
        
        if(!dbMerchant) {
            return
        }
        
        return fromDBAffinityMerchant(dbMerchant)
    }
    public async upsert(
        newMerchant: AffinityMerchant, 
        client: DatabaseClient = this.dbClient
    ): Promise<number> {
        debug('upsert: %o', newMerchant)

        const row = applySpec<DBAffinityMerchant>({
            pubkey: pipe(prop('pubkey'), toBuffer),
            name: prop('name'),
            description: prop('description'),
            pricing: prop('pricing') as () => string,
            contactDetail: toJSON(prop('contactDetail')),
            latitude: prop('latitude'),
            longitude: prop('longitude'),
            balance: prop('balance'),
            advertisedOn: prop('advertisedOn'),
            isAdvertised: prop('isAdvertised'),
        })(newMerchant)

        const query = client<DBAffinityMerchant>('merchants')
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
        
        public delete(pubkey: string): Promise<number> {
            debug('deleting merchant with pubkey %s', pubkey)

            return this.dbClient('merchants')
                .where('pubkey', toBuffer(pubkey))
                .del()
        }
        
    }
