// import {
//     __,
//     always,
//     applySpec,
//     complement,
//     cond,
//     equals,
//     evolve,
//     filter,
//     forEach,
//     forEachObjIndexed,
//     groupBy,
//     ifElse,
//     invoker,
//     is,
//     isEmpty,
//     isNil,
//     map,
//     modulo,
//     nth,
//     omit,
//     path,
//     paths,
//     pipe,
//     prop,
//     propSatisfies,
//     T,
//     toPairs,
//   } from 'ramda'
  
// import { ContextMetadataKey, EventDeduplicationMetadataKey, EventExpirationTimeMetadataKey } from '../constants/base'
// import { DatabaseClient, EventId, Pubkey } from '../@types/base'
// import { DBEvent, Event } from '../@types/event'
// import { IMerchantRepository, IQueryResult } from '../@types/repositories'
// import { fromDBMerchant, toBuffer, toJSON } from '../utils/transform'
// import { createLogger } from '../factories/logger-factory'
// import { isGenericTagQuery } from '../utils/filter'
// import { SubscriptionFilter } from '../@types/subscription'
// import { AffinityMerchant } from '../@types/affinity'
// import { DBUser } from '../@types/user'

// const debug = createLogger('merchant-repository')

// export class MerchantRepository implements IMerchantRepository {
    
//     public constructor(
//         private readonly dbClient: DatabaseClient,
//     ) { }

//     public async findByPubkey(
//         pubkey: Pubkey, 
//         client: DatabaseClient = this.dbClient
//     ): Promise<AffinityMerchant | undefined> {
//         debug('find by pubkey %s', pubkey)
//         const [dbuser] = await client<DBUser>('merchants')
//             .where('pubkey', toBuffer(pubkey))
//             .select()
        
//         if(!dbuser) {
//             return
//         }
        
//         return fromDBMerchant(dbuser)
//     }
//     public async upsert(
//         newMerchant: AffinityMerchant, 
//         client: DatabaseClient = this.dbClient
//     ): Promise<number> {
//         debug('upsert: %o', newMerchant)

//         const row = applySpec<>
//     }

//     delete(pubkey: string): Promise<void> {
//         throw new Error('Method not implemented.')
//     }

//   }