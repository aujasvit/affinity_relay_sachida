import {
    applySpec,
    omit,
    pipe,
    prop,
  } from 'ramda'
  
import { DatabaseClient, Pubkey } from '../@types/base'
import { IRelayRepository } from '../@types/repositories'
import { fromDBAffinityRelay, toBuffer, toJSON } from '../utils/transform'
import { createLogger } from '../factories/logger-factory'
import { AffinityRelay, DBAffinityRelay } from '../@types/affinity'

const debug = createLogger('relay-repository')

export class RelayRepository implements IRelayRepository {
    
    public constructor(private readonly dbClient: DatabaseClient,) { }

    public async findByPubkey(
        pubkey: Pubkey, 
        client: DatabaseClient = this.dbClient
    ): Promise<AffinityRelay | undefined> {
        debug('find relay by pubkey %s', pubkey)
        const [dbRelay] = await client<DBAffinityRelay>('relays')
            .where('pubkey', toBuffer(pubkey))
            .select()
        
        if(!dbRelay) {
            return
        }
        
        return fromDBAffinityRelay(dbRelay)
    }

    public async upsert(
        newRelay: AffinityRelay, 
        client: DatabaseClient = this.dbClient
    ): Promise<number> {
        debug('upsert: %o', newRelay)

        const row = applySpec<DBAffinityRelay>({
            pubkey: pipe(prop('pubkey'), toBuffer),
            url: prop('url'),
            name: prop('name'),
            description: prop('description'),
            pricing: prop('pricing') as () => string,
            contactDetail: toJSON(prop('contactDetail')),
            latitudeRange: toJSON(prop('latitudeRange')),
            longitudeRange: toJSON(prop('longitudeRange')),
        })(newRelay)

        const query = client<DBAffinityRelay>('relays')
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
