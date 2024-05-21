import { useEffect, useState } from "react";
import { SERVER } from '../constants/server';
import axios from 'axios';

export default function AdminLoginPage() {

  const [connectionURL, setConnectionURL] = useState("");
  const [name, setName] = useState("");
  const [longitude, setLongitude] = useState(0.0);
  const [latitude, setLatitude] = useState(0.0);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");

  const [serverMessage, setServerMessage] = useState("");

  const getRelayDetails = async () => {

    await axios({
      method: "GET",
      url: SERVER + "/admin/getRelay",
    }).then((res) => {
      console.log(res.data);
      const content = JSON.parse(res.data.data.event_content);
      setConnectionURL(() => content.connectionURL);
      setName(() => content.name);
      setLongitude(() => content.longitude);
      setLatitude(() => content.latitude);
      setAddress(() => content.address);
      setEmail(() => content.contact.email);
      setPhone(() => content.contact.phone);
      setMobile(() => content.contact.mobile);
      return true;
    }).catch(() => {
      setServerMessage(() => "Welcome to Affinity Relay, please setup your relay")
      return false;
    });
  }

  const setupRelay = async (e: any) => {
    e.preventDefault();
    await axios({
      method: "POST",
      url: SERVER + "/admin/setupRelay",
      data: {
        connectionURL: connectionURL,
        name: name,
        longitude: longitude,
        latitude: latitude,
        address: address,
        email: email,
        phone: phone,
        mobile: mobile
      }
    }).then(() => {
      setServerMessage(() => "Relay setup successful, please refresh the page");
      return true;
    }).catch(() => {
      setServerMessage(() => "Relay setup failed");
      return false;
    });

  }

  useEffect(() => {
    getRelayDetails();
  }, []);


  return (
    <div className="w-full h-full px-5 py-5">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center">
          <span className="text-black font-semibold text-lg">Account</span>
          <span className="w-full max-w-[125px] text-xs border-none logSelector ms-2">
            Relay admin
          </span>
        </div>

        <div>
          <span className="text-sm">nostr_ts_relay</span>
          <span className="text-[1.25rem] material-symbols-outlined">
            outbound
          </span>
        </div>

      </div>

      <div className="mt-12 flex items-center justify-center flex-col h-[75%]">
        <h3 className="font-bold text-lg">Setup your relay</h3>
        <p className="py-4 text-sm">
          Please fill up the relay details
        </p>
        <form
          className="flex flex-row flex-wrap justify-between max-w-[712px] mt-10"
          onSubmit={setupRelay}
        >
          <label className="form-control w-[48%]">
            <div className="label">
              <span className="label-text text-sm">Name of the relay *</span>
            </div>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(() => e.target.value)}
              required
              placeholder="Affinity Relay"
              className="input w-full"
            />
          </label>

          <label className="form-control w-[48%]">
            <div className="label">
              <span className="label-text text-sm">Public Connection URL *</span>
            </div>
            <input
              type="connectionURL"
              name="id"
              required
              placeholder="ws://localhost:8008"
              className="input w-full"
              value={connectionURL}
              onChange={(e) => setConnectionURL(() => e.target.value)}
            />
          </label>

          <label className="form-control w-[48%]">
            <div className="label">
              <span className="label-text text-sm">Longitude *</span>
            </div>
            <input
              type="number"
              step={0.0000001}
              name="longitude"
              required
              placeholder="ex. 23.123456"
              className="input w-full"
              value={longitude}
              onChange={(e) => setLongitude(() => parseFloat(e.target.value))}
            />
          </label>

          <label className="form-control w-[48%]">
            <div className="label">
              <span className="label-text text-sm">Latitude *</span>
            </div>
            <input
              type="number"
              name="latitude"
              step={0.0000001}
              required
              placeholder="ex. 34.54321"
              className="input w-full"
              value={latitude}
              onChange={(e) => setLatitude(() => parseFloat(e.target.value))}
            />
          </label>

          <label className="form-control w-[48%]">
            <div className="label">
              <span className="label-text text-sm">Address *</span>
            </div>
            <input
              type="text"
              name="address"
              required
              placeholder="ex. $ 1000/hr"
              className="input w-full"
              value={address}
              onChange={(e) => setAddress(() => e.target.value)}
            />
          </label>

          <label className="form-control w-[48%]">
            <div className="label">
              <span className="label-text text-sm">Email *</span>
            </div>
            <input
              type="text"
              name="email"
              required
              placeholder="sachida@relay"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(() => e.target.value)}
            />
          </label>

          <label className="form-control w-[48%]">
            <div className="label">
              <span className="label-text text-sm">Phone</span>
            </div>
            <input
              type="text"
              name="tel"
              placeholder="1242 XXXX XXXX ex"
              className="input w-full"
              value={phone}
              onChange={(e) => setPhone(() => e.target.value)}
            />
          </label>

          <label className="form-control w-[48%]">
            <div className="label">
              <span className="label-text text-sm">Mobile with country code</span>
            </div>
            <input
              type="text"
              name="mob"
              placeholder="+91 630700-XXXX"
              className="input w-full"
              value={mobile}
              onChange={(e) => setMobile(() => e.target.value)}
            />
          </label>

          <button className="btn mt-11 btn-primary btn-sm" type="submit">
            Submit
          </button>

          <div className="mt-12 text-sm">{serverMessage}</div>
        </form>
      </div>

    </div>
  );
}
