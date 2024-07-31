import {
    applySpec,
    omit,
    pipe,
    prop,
  } from 'ramda'
  
import { DatabaseClient, Pubkey } from '../@types/base'
import { IRelayRequestRepository } from '../@types/repositories'
import { fromDBAffinityRelayRequest, toBuffer, toJSON } from '../utils/transform'
import { createLogger } from '../factories/logger-factory'
import { AffinityRelayRequest, DBAffinityRelayRequest } from '../@types/affinity'

const debug = createLogger('relay-repository')

export class RelayRequestRepository implements IRelayRequestRepository {
    
    public constructor(private readonly dbClient: DatabaseClient,) { }

    public async findByPubkey(
        pubkey: Pubkey, 
        client: DatabaseClient = this.dbClient
    ): Promise<AffinityRelayRequest | undefined> {
        debug('find relay request with pubkey %s', pubkey)
        const [dbRelayRequest] = await client<DBAffinityRelayRequest>('relay_requests')
            .where('pubkey', toBuffer(pubkey))
            .select()
        
        if(!dbRelayRequest) {
            return
        }
        
        return fromDBAffinityRelayRequest(dbRelayRequest)
    }

    public async upsert(
        newRelayRequest: AffinityRelayRequest, 
        client: DatabaseClient = this.dbClient
    ): Promise<number> {
        debug('upsert: %o', newRelayRequest)

        const row = applySpec<DBAffinityRelayRequest>({
            pubkey: pipe(prop('pubkey'), toBuffer),
            senderPubkeys: toJSON(prop('senderPubkeys')),
            url: prop('url'),
            name: prop('name'),
            description: prop('description'),
            pricing: prop('pricing') as () => string,
            contactDetail: toJSON(prop('contactDetail')),
            latitudeRange: toJSON(prop('latitudeRange')),
            longitudeRange: toJSON(prop('longitudeRange')),
        })(newRelayRequest)

        const query = client<DBAffinityRelayRequest>('relay_requests')
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
            debug('deleting relay request with pubkey %s', pubkey)

            return this.dbClient('relay_requests')
                .where('pubkey', toBuffer(pubkey))
                .del()
        }
        
    }
