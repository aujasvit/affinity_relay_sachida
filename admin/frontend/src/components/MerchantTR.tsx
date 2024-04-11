import { Merchant } from "../objects/classes.tsx";
import ActionImgBtnTransBg from "./ActionImgBtnTransBg.tsx";
import ImgBtn from "./ImgBtn";

interface props {
  merchant: Merchant;
  ind: number;
  deleteMerchant: (index: number) => void;
  editMerchant: (index: number) => void;
}

export default function MerchantTR({ ind, merchant, deleteMerchant, editMerchant }: props) {
  return (
    <tr>
      <td>
        <div
          className={`badge badge-xs ${
            merchant.status ? "badge-success" : "badge-error"
          }`}
        ></div>
      </td>
      <td>{merchant.id}</td>
      <td>{merchant.name}</td>
      <td>{merchant.pricing}</td>
      <td>{merchant.contact}</td>
      <td>
        <div className="flex flex-row justify-around">
          <div onClick={() => deleteMerchant(ind)}><ActionImgBtnTransBg icon={"delete"}/></div>{" "}
          <div onClick={() => editMerchant(ind)}><ActionImgBtnTransBg icon={"edit"}/></div>
        </div>
      </td>
    </tr>
  );
}
