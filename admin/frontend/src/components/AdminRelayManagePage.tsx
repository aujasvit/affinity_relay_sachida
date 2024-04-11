import { Relay } from 'nostr-tools/relay';
import { SimplePool } from 'nostr-tools/pool'

let relays = ['ws://172.28.1.210:8008', "wss://relay.damus.io"]

const relay = await Relay.connect(relays[0])
console.log(`connected to ${relay.url}`)

const sub = relay.subscribe([
  {
    kinds: [1, 11002],
  },
], {
  onevent(event) {
    console.log('we got the event we wanted:', event)
  },
  oneose() {
    sub.close()
    console.log('closed')
  }
})

export default function AdminManageRelayPage() {
  
  // const pool = new SimplePool()
  // let h = pool.subscribeMany(
  // relays,
  // [
  //   {
  //     kinds: [11002],
  //   },
  // ],
  // {
  //   onevent(event) {
  //     console.log('event', event)
  //   },
  //   oneose() {
  //     h.close()
  //   }
  // });

  return (
    <div className="w-full h-full px-5 py-5">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center">
          <span className="text-black font-semibold text-lg">Manage</span>
          <span className="w-full max-w-[125px] text-xs border-none logSelector ms-2">
            Relays
          </span>
        </div>
          <div>
            <span className="text-sm">nostr_ts_relay</span>
            <span className="text-[1.25rem] material-symbols-outlined">
              outbound
            </span>
          </div>
      </div>
      <div>
        <div className="mt-12 text-xs">
      // TODO: Manage relays here, we should setup a master server first. To get the relay list first time</div>
      </div>
    </div>
  );
}
