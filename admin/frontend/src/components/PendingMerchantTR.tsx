import { Merchant } from "../objects/classes.tsx";
import ActionImgBtnTransBg from "./ActionImgBtnTransBg.tsx";

interface props {
  merchant: Merchant;
  ind: number;
  accept: (index: number) => void;
  reject: (index: number) => void;
}

export default function PendingMerchantTR({
  ind,
  merchant,
  reject,
  accept,
}: props) {
  return (
    <tr>
      <td>
        <div className={`badge badge-xs badge-warning`}></div>
      </td>
      <td>{merchant.id}</td>
      <td>{merchant.name}</td>
      <td>{merchant.pricing}</td>
      <td>{merchant.contact}</td>
      <td>
        <div className="flex flex-row justify-around">
          <button className="btn btn-xs" onClick={() => accept(ind)}>Accept</button>
          <div onClick={() => reject(ind)}>
            <ActionImgBtnTransBg icon={"close"} />
          </div>{" "}
        </div>
      </td>
    </tr>
  );
}
