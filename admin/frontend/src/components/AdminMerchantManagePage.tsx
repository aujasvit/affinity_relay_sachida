import ImgBtn from "./ImgBtn";
import axios from "axios";
import { SERVER } from "../constants/server.tsx";
import { useEffect, useState } from "react";
import { Merchant } from "../objects/classes.tsx";
import MerchantTR from "./MerchantTR.tsx";
import PendingMerchantTR from "./PendingMerchantTR.tsx";

export default function AdminManageMerchantsPage() {
  const [originalmerchants, setOriginalMerchants] = useState([]);
  const [merchants, setMerchants] = useState([]);

  const [originalPendingList, setOriginalPendigList] = useState([]);
  const [pendingList, setPendingList] = useState([]);

  const [totolPendingRequests, setTotalPendingRequests] = useState(0);

  const [addMerchantMsg, setAddMerchantMessage] = useState("");
  const [updateMerchantMsg, setUpdateMerchantMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [currMerchantInd, setCurrMerchantInd] = useState(0);
  const [deleteModalMsg, setDeleteModalMsg] = useState("");

  const refreshList = () => {
    setRefresh(() => {
      return !refresh;
    });
  };

  const getMerchantData = () => {
    // startLoading();
    axios({
      method: "get",
      url: SERVER + "/admin/getMerchants",
    })
      .then((mData) => {
        // stopLoading();
        // navigate("/admin/home");
        // console.log(mData.data.data?.merchants);merchants
        setOriginalMerchants(() => {
          return mData.data.data?.merchants;
        });
      })
      .catch((error: any) => {
        // stopLoading();
        console.log(error);
        // setMessage(() => {
        //     return readErrorMessage(error);
        // });
      });
  };
 
  const getPendingMerchants = () => {
    // startLoading();
    axios({
      method: "get",
      url: SERVER + "/admin/getPendingMerchants",
    })
      .then((mData) => {
        // stopLoading();
        // navigate("/admin/home");
        // console.log(mData.data.data?.merchants);merchants
        setOriginalPendigList(() => {
          return mData.data.data?.merchants;
        });
      })
      .catch((error: any) => {
        // stopLoading();
        console.log(error);
        // setMessage(() => {
        //     return readErrorMessage(error);
        // });
      });
  };

  const addMerchant = (e: any) => {
    e.preventDefault();
    // startLoading();

    const formData = new FormData(e.target);
    console.log(formData);

    axios({
      method: "post",
      url: SERVER + "/admin/addMerchant",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        // stopLoading();
        setAddMerchantMessage(() => {
          return response.data.messege;
        });
        refreshList();
        // navigate("/admin/home");
      })
      .catch((error: any) => {
        // stopLoading();
        // console.log(error.response.data.messege);
        setAddMerchantMessage(() => {
          return error.response.data.messege;
        });
      });
  };

  const deleteRequest = (ind: number, dbid: number) => {
    // startLoading();
    if(!dbid) dbid = pendingList[ind].dbid;
    axios({
      method: "post",
      url: SERVER + "/admin/deleteRequest",
      data: { "dbid": dbid },
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        // stopLoading();
        refreshList();
        // navigate("/admin/home");
      })
      .catch((error: any) => {
        // stopLoading();
        // handle error here
        console.log(error);
      });
  };
  
  const acceptRequest = (ind: number) => {
    // startLoading();

    let formData = pendingList[ind];
    formData.status = "Active";

    axios({
      method: "post",
      url: SERVER + "/admin/addMerchant",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        // stopLoading();
        // setAddMerchantMessage(() => {
        //   return response.data.messege;
        // });
        deleteRequest(ind, formData.dbid);
        // navigate("/admin/home");
      })
      .catch((error: any) => {
        // stopLoading();
        // console.log(error.response.data.messege);
        // handle error
      });
  };

  const updateMerchant = (e: any) => {
    e.preventDefault();
    // startLoading();

    const formData = new FormData(e.target);

    axios({
      method: "post",
      url: SERVER + "/admin/updateMerchant",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        // stopLoading();
        setUpdateMerchantMessage(() => {
          return response.data.messege;
        });
        refreshList();
        // navigate("/admin/home");
      })
      .catch((error: any) => {
        // stopLoading();
        // console.log(error.response.data.messege);
        setUpdateMerchantMessage(() => {
          return error.response.data.messege;
        });
      });
  };

  const confirmDelete = (index: number) => {
    setCurrMerchantInd(() => {
      return index;
    });
    document.getElementById("delete")?.showModal();
  };

  const showEditOptions = (index: number) => {
    setCurrMerchantInd(() => {
      return index;
    });
    document.getElementById("editMerchantmodal")?.showModal();
  };

  const deleteMerchant = (id: number) => {
    // startLoading();
    axios({
      method: "post",
      url: SERVER + "/admin/deleteMerchant",
      data: { id: id },
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        // stopLoading();
        setDeleteModalMsg(() => {
          return response.data.messege;
        });
        document.getElementById("delete")?.close();
        setDeleteModalMsg(() => {
          return "";
        });
        refreshList();
        // navigate("/admin/home");
      })
      .catch((error: any) => {
        // stopLoading();
        // console.log(error.response.data.messege);
        setDeleteModalMsg(() => {
          return error.response.data.messege;
        });
      });
  };

  const searchMerchant = (arg: string) => {
    arg = arg.toLowerCase();
    setMerchants(() => {return originalmerchants.filter((merchant: Merchant) => {
      return merchant.name.toLowerCase().includes(arg) || merchant.id.toString().includes(arg);
    });
  }
    )
  }

  useEffect(() => {
    getMerchantData();
    getPendingMerchants();
  }, [refresh]);

  useEffect(() => {
    setMerchants(() => {
      return originalmerchants;
    });
  }, [originalmerchants])

  useEffect(() => {
    setTotalPendingRequests(() => originalPendingList.length);
    setPendingList(() => {
      return originalPendingList;
    })
  }, [originalPendingList]);

  return (
    <div className="w-full h-full px-5 py-5">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center">
          <span className="text-black font-semibold text-lg">Manage</span>
          <span className="w-full max-w-[125px] text-xs border-none logSelector ms-2">
            Merchants
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
            onChange={(e) => searchMerchant(e.target.value)}
          />
          <span className="text-[1.15rem] material-symbols-outlined">
            search
          </span>
        </div>
        <div className="flex flex-row items-center">

        <button className="btn mr-3 text-sm btn-sm">
          Pending requests
         <div className="badge badge-warning">{"+"+totolPendingRequests}</div>
        </button>

        <div
          onClick={() => document.getElementById("merchantmodal")?.showModal()}
        >
          <ImgBtn name={"Add " + "merchant"} icon={"person_add"} />
        </div>
        </div>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="table table-zebra text-xs">
            {/* head */}
            <thead>
              <tr>
                <th>Status</th>
                <th>Unique ID</th>
                <th>Full name</th>
                <th>Pricing</th>
                <th>Contact details</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((merchant: Merchant, index) => {
                return (
                  <MerchantTR
                    key={index}
                    ind={index}
                    merchant={merchant}
                    deleteMerchant={confirmDelete}
                    editMerchant={showEditOptions}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-xs mt-6 mb-4">Pending requests</div>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra text-xs">
            {/* head */}
            <thead>
              <tr>
                <th>Status</th>
                <th>Unique ID</th>
                <th>Full name</th>
                <th>Pricing</th>
                <th>Contact details</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pendingList.map((merchant: Merchant, index) => {
                return (
                  <PendingMerchantTR
                    key={index}
                    ind={index}
                    merchant={merchant}
                    reject={deleteRequest}
                    accept={acceptRequest}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      

      <dialog id="merchantmodal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add new merchant</h3>
          <p className="py-4 text-sm">
            Please fill up the deatils of the merchant
          </p>
          <form
            className="flex flex-row flex-wrap justify-between"
            onSubmit={addMerchant}
          >
            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Full name</span>
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="ex. Jadhav Hardwares"
                className="input w-full"
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">ID</span>
              </div>
              <input
                type="number"
                name="id"
                required
                placeholder="ex. 9161XX7X99"
                className="input w-full"
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Longitude</span>
              </div>
              <input
                type="number"
                step={0.0000001}
                name="longitude"
                required
                placeholder="ex. 23.123456"
                className="input w-full"
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Latitude</span>
              </div>
              <input
                type="number"
                name="latitude"
                step={0.0000001}
                required
                placeholder="ex. 34.54321"
                className="input w-full"
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Pricing</span>
              </div>
              <input
                type="text"
                name="pricing"
                required
                placeholder="ex. $ 1000/hr"
                className="input w-full"
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Contact details</span>
              </div>
              <input
                type="text"
                name="contact"
                required
                placeholder="Addressline with phone number"
                className="input w-full"
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Short description</span>
              </div>
              <input
                type="text"
                name="shortdes"
                required
                placeholder="Something more about merchant"
                className="input w-full"
              />primary
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Status</span>
              </div>
              <select
                className="select w-full border-none logSelector"
                name="status"
                required
              >
                <option selected>Active</option>
                <option>Inactive</option>
              </select>
            </label>

            <button className="btn mt-11 btn-primary btn-sm" type="submit">
              Submit
            </button>

            <div className="mt-12 text-sm">{addMerchantMsg}</div>
          </form>
        </div>
      </dialog>

      <dialog id="delete" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Delete a merchant</h3>
          <p className="py-4 text-sm">
            {`Are you sure you want to delete this merchant?`}
            <br></br>
          </p>
          <p className="text-xs">
            <br></br>
            {`Merchant ID: ${merchants[currMerchantInd]?.id}`} <br></br>{" "}
            {`Merchant Name: ${merchants[currMerchantInd]?.name}`}
          </p>
          <div className="flex flex-row justify-between items-center">
            <span className="text-xs">{deleteModalMsg}</span>
            <button
              className="btn btn-error btn-sm"
              onClick={() => deleteMerchant(merchants[currMerchantInd]?.id)}
            >
              Yes, delete
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="editMerchantmodal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Edit a merchant</h3>
          <p className="py-4 text-sm">
            Please update the deatils of the merchant
          </p>
          <form
            className="flex flex-row flex-wrap justify-between"
            onSubmit={updateMerchant}
          >
            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Full name</span>
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="ex. Jadhav Ashish Meena"
                className="input w-full"
                defaultValue={merchants[currMerchantInd]?.name}
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">ID (unchangeable)</span>
              </div>
              <input
                type="number"
                name="id"
                required
                placeholder="ex. 9161XX7X99"
                className="input w-full"
                value={merchants[currMerchantInd]?.id}
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Longitude</span>
              </div>
              <input
                type="number"
                step={0.0000001}
                name="longitude"
                required
                placeholder="ex. 23.123456"
                className="input w-full"
                defaultValue={merchants[currMerchantInd]?.longitude}
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Latitude</span>
              </div>
              <input
                type="number"
                name="latitude"
                step={0.0000001}
                required
                placeholder="ex. 34.54321"
                className="input w-full"
                defaultValue={merchants[currMerchantInd]?.latitude}
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Pricing</span>
              </div>
              <input
                type="text"
                name="pricing"
                required
                placeholder="ex. $ 1000/hr"
                className="input w-full"
                defaultValue={merchants[currMerchantInd]?.pricing}
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Contact details</span>
              </div>
              <input
                type="text"
                name="contact"
                required
                placeholder="Addressline with phone number"
                className="input w-full"
                defaultValue={merchants[currMerchantInd]?.contact}
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Short description</span>
              </div>
              <input
                type="text"
                name="shortdes"
                required
                placeholder="Something more about merchant"
                className="input w-full"
                defaultValue={merchants[currMerchantInd]?.shortdes}
              />
            </label>

            <label className="form-control w-[48%]">
              <div className="label">
                <span className="label-text text-sm">Status</span>
              </div>
              <select
                className="select w-full border-none logSelector"
                name="status"
                required
                defaultValue={ merchants[currMerchantInd]?.status ? "Active" : "Inactive"}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>

            <button className="btn mt-11 btn-primary btn-sm" type="submit">
              Update
            </button>

            <div className="mt-12 text-sm">{updateMerchantMsg}</div>
          </form>
        </div>
      </dialog>

    </div>
  );
}
