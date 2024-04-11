import { useState } from "react";
import SideBarBtn from "../components/SideBarBtn";
import AdminDashboardPage from "../components/AdminDashboardPage";
import AdminManageMerchantsPage from "../components/AdminMerchantManagePage";
import AdminManageRelayPage from "../components/AdminRelayManagePage";

const divisions = [<AdminDashboardPage />, <AdminManageMerchantsPage />, <AdminManageRelayPage />];

export default function AdminPage() {
  const [pn, setpn] = useState(0);

  return (
    <>
      <div className="w-full h-screen flex flex-row">
        <div className="bg-base-200 min-h-full px-6 py-5 flex justify-between flex-col">
          <img src="../../affinity_logo.svg" className="h-7" />
          <ul className="flex-row items-center">
            <li>
              <div
                className="tooltip text-sm tooltip-right"
                data-tip="Dashboard"
                onClick={() => {
                  setpn(() => 0);
                }}
              >
                <SideBarBtn name={"Dashboard"} icon={"team_dashboard"} />
              </div>
            </li>
            <li>
              <div
                className="tooltip text-sm tooltip-right"
                data-tip="Manage merchants"
                onClick={() => {
                  setpn(() => 1);
                }}
              >
                <SideBarBtn name={"Manage merchants"} icon={"storefront"} />
              </div>
            </li>
            <li>
              <div
                className="tooltip text-sm tooltip-right"
                data-tip="Manage relays"
                onClick={() => {
                  setpn(() => 2);
                }}
              >
                <SideBarBtn name={"Manage relays"} icon={"hub"} />
              </div>
            </li>
          </ul>
          <div className="tooltip text-sm tooltip-right" data-tip="Account">
            <SideBarBtn name={"manage_account"} icon={"account_circle"} />
          </div>
        </div>
        {divisions[pn]}
      </div>
    </>
  );
}
