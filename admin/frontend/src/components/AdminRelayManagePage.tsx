import { Relay } from 'nostr-tools/relay';
import ImgBtn from "./ImgBtn";
import { LOCALRELAY, SERVER } from "../constants/server.tsx";
import axios from 'axios';
import { useState } from 'react';

let lRelay = LOCALRELAY;

const relay = await Relay.connect(lRelay)
console.log(`connected to ${relay.url}`)

const sub = relay.subscribe([
  {
    kinds: [11001],
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

export default function AdminRelayManagePage() {

  const [requestedRelay, setRequestedRelay] = useState({});
  const [rUrl, setRUrl] = useState("");
  const [pendingList, setPendingList] = useState([]);
  const [numberPending, setNumberPending] = useState(0);
  const [requestStatus, setRequestStatus] = useState("Request");


  const getRelayDetails = async (rurl: string) => {
    const relay = await Relay.connect(rurl)
    console.log(`connected to ${relay.url}`)

    const sub = relay.subscribe([
      {
        kinds: [11000],
      },
    ], {
      onevent(event) {
        setRequestedRelay(() => { return JSON.parse(event.content )});
        console.log(event.content)
        console.log('we got the relay details we wanted:', event)
      },
      oneose() {
        sub.close()
      }
    })
  }

  const sendJoinRequest = async (e: any) => {
    e.preventDefault();
    // await axios({
    //   method: "POST",
    //   url: SERVER + "/admin/joinRelay",
    //   data: {
    //     connectionURL: rUrl,
    //     name: requestedRelay.name,
    //     longitude: requestedRelay.longitude,
    //     latitude: requestedRelay.latitude,
    //     address: requestedRelay.address,
    //     email: requestedRelay.contact.email,
    //     phone: requestedRelay.contact.phone,
    //     mobile: requestedRelay.contact.mobile
    //   }
    // }).then(() => {
    //   setRequestStatus(() => "Request sent");
    //   return true;
    // }).catch(() => {
    //   setRequestStatus(() => "Request failed");
    //   return false;
    // });
  }

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
      <div className="flex w-full justify-between items-center my-5">
        <div className="flex justify-between items-center border-[1px] rounded-md px-3 py-2">
          <div className="text-xs mr-3">Search</div>
          <input
            className="border-none focus:border-none input_nb text-xs"
            type="text"
            name="searchFeild"
            required
            placeholder="id or name"
          // onChange={(e) => searchMerchant(e.target.value)}
          />
          <span className="text-[1.15rem] material-symbols-outlined">
            search
          </span>
        </div>
        <div className="flex flex-row items-center">

          <button className="btn mr-3 text-sm btn-sm">
            Pending requests
            <div className="badge badge-warning">{"+"+numberPending}</div>
          </button>

          <div
            onClick={() => document.getElementById("merchantmodal")?.showModal()}
          >
            <ImgBtn name={"Join relay"} icon={"join_inner"} />
          </div>
        </div>
      </div>


      <div>
        <div className="overflow-x-auto">

          <div className="text-xs mt-6 mb-4">My relay network</div>
          <table className="table table-zebra text-xs">
            {/* head */}
            <thead>
              <tr>
                <th>Status</th>
                <th>Connection URL</th>
                <th>Name</th>
                <th>Location</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* {merchants.map((merchant: Merchant, index) => {
                return (
                  <MerchantTR
                    key={index}
                    ind={index}
                    merchant={merchant}
                    deleteMerchant={confirmDelete}
                    editMerchant={showEditOptions}
                  />
                );
              })} */}
            </tbody>
          </table>
        </div>

        <div className="text-xs mt-6 mb-4">Pending relay requests</div>

        <div className="overflow-x-auto">
          <table className="table table-zebra text-xs">
            {/* head */}
            <thead>
              <tr>
                <th>Connection URL</th>
                <th>Name</th>
                <th>Location</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* {pendingList.map((merchant: Merchant, index) => {
                return (
                  <PendingMerchantTR
                    key={index}
                    ind={index}
                    merchant={merchant}
                    reject={deleteRequest}
                    accept={acceptRequest}
                  />
                );
              })} */}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs mt-6 mb-4">Join a relay network</div>

      <div className="flex justify-between items-center border-[1px] rounded-md px-3 py-2 mt-8">
        <div className="text-xs mr-3">Join via connection URL</div>
        <input
          className="border-none focus:border-none input_nb text-xs"
          type="text"
          name="searchFeild"
          required
          placeholder="wss://relay.damus.io .. etc."
          onChange={(e) => { setRUrl(() => {return e.target.value})}}
        />
        <span className="btn btn-sm" onClick={() => {
          document.getElementById("requestModal")?.showModal()
          getRelayDetails(rUrl)
        }}>
          Request
        </span>
      </div>

      <table className="table table-zebra text-xs mt-6">
        {/* head */}
        <thead>
          <tr>
            <th>Status</th>
            <th>Connection URL</th>
            <th>Name</th>
            <th>Location</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* {pendingList.map((merchant: Merchant, index) => {
                return (
                  <PendingMerchantTR
                    key={index}
                    ind={index}
                    merchant={merchant}
                    reject={deleteRequest}
                    accept={acceptRequest}
                  />
                );
              })} */}
        </tbody>
      </table>

      <div className="overflow-x-auto">

      <dialog id="requestModal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Request</h3>
            <p className="py-4 text-sm">
              Please verify, the relay you are trying to connect to.
            </p>
            <form
              className="flex flex-row flex-wrap justify-between"
              onSubmit={sendJoinRequest}
            >
              <label className="form-control w-[48%]">
                <div className="label">
                  <span className="label-text text-sm">Relay name</span>
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="input w-full"
                  disabled
                  defaultValue={requestedRelay?.name}
                />
              </label>

              <label className="form-control w-[48%]">
                <div className="label">
                  <span className="label-text text-sm">Connection URL</span>
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="input w-full"
                  disabled
                  defaultValue={requestedRelay?.connectionURL}
                />
              </label>

              <label className="form-control w-[48%]">
                <div className="label">
                  <span className="label-text text-sm">Phone number</span>
                </div>
                <input
                  type="text"
                  name="phone"
                  required
                  className="input w-full"
                  disabled
                  defaultValue={requestedRelay?.contact?.phone}
                />
              </label>

              <label className="form-control w-[48%]">
                <div className="label">
                  <span className="label-text text-sm">Mobile</span>
                </div>
                <input
                  type="text"
                  name="mobile"
                  required
                  className="input w-full"
                  disabled
                  defaultValue={requestedRelay?.contact?.mobile}
                />
              </label>

              <label className="form-control w-[48%]">
                <div className="label">
                  <span className="label-text text-sm">Email</span>
                </div>
                <input
                  type='text'
                  name="email"
                  required
                  className="input w-full"
                  disabled
                  defaultValue={requestedRelay?.contact?.email}
                />
              </label>


              <label className="form-control w-[48%]">
                <div className="label">
                  <span className="label-text text-sm">Address</span>
                </div>
                <input
                  type="text"
                  name="address"
                  required
                  className="input w-full"
                  disabled
                  defaultValue={requestedRelay?.address}
                />
              </label>


              <button className="btn mt-8 btn-primary btn-sm w-full" type='submit'>
                {requestStatus}
              </button>

              <div className="mt-12 text-sm">{""}</div>
            </form>
          </div>
        </dialog>

      </div>
    </div>
  );
}
