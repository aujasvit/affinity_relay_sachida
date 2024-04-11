import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../constants/server";

function LoginPage() {
  const [userType, setUserType] = useState("user");
  const [passType, setPassType] = useState("password");
  const [passIcon, setPassIcon] = useState("visibility");
  const [signInBtnState, setSignInBtnState] = useState("");

  const navigate = useNavigate();

  const togglePassVisibility = () => {
    if (passType == "password") {
      setPassType(() => "text");
      setPassIcon(() => "visibility_off");
    } else {
      setPassType(() => "password");
      setPassIcon(() => "visibility");
    }
  };

  const loginUser = (e: any) => {
    e.preventDefault();
    navigate("/admin/home")
    // setSignInBtnState(() => {
    //   return "disable loading-btn";
    // });
    // document.body.style.cursor = "wait";
    // const formData = new FormData(e.currentTarget);

    // axios({
    //   method: "post",
    //   url: SERVER+"/"+userType+"/login",
    //   data: formData,
    //   withCredentials: true,
    //   headers: { "Content-Type": "multipart/form-data" },
    // })
    //   .then(() => {
    //     setSignInBtnState(() => {
    //       return "";
    //     });
    //     document.body.style.cursor = "default";
    //     navigate("/"+userType+"/home");
    //   })
    //   .catch((error: any) => {
    //     setSignInBtnState(() => {
    //       return "";
    //     });
    //     document.body.style.cursor = "default";
    //     console.log(error)
    //   });
  };

  return (
    <>
      <div className="w-screen h-screen">
        <div className="w-full h-full flex items-center justify-center">
          <div className="card_tr flex flex-col items-center justify-center">
            <div className="flex flex-row w-[400px] px-5 py-4 border_b justify-between">
              <img src="hc_branding.svg" className="h-5" />
              <img src="iitk_logo.svg" className="h-5 scale-150" />
            </div>
            <span className="h-5"></span>
            <div className="px-6 py-4 flex-col flex items-center justify-center">
              <h2 className="font-semibold text-black text-xl mb-1">Sign in</h2>
              <span className="secondary-text text-sm text-center">
                with your credentials
              </span>
              <form onSubmit={loginUser} className="mt-10">
                <input
                  className="input mb-3 w-[350px]"
                  type="text"
                  name="key"
                  placeholder="Public key"
                  required
                />
                <br />
                <div className="flex w-[350px] mb-3 items-center justify-between">
                  <input
                    className="w-[304.422px] input_sharp rounded-tl-[6px] rounded-bl-[6px]"
                    type={passType}
                    name="password"
                    required
                    placeholder="Private key"
                  />
                  <span
                    className="material-symbols-outlined w-[45.578px] h-[48.578px] items-center justify-center flex primary-text text-sm input_sharp rounded-tr-[6px] rounded-br-[6px]"
                    onClick={togglePassVisibility}
                  >
                    {passIcon}
                  </span>
                </div>
                <br />
                <a href="#">
                  <p className="text-sm max-w-[350px]">Forgot password</p>
                </a>
                <p className="max-w-[350px] mt-2 text-sm text-red-500"></p>
                <p className="max-w-[350px] mt-8 text-sm secondary-text">
                  By signing in, you agree and accept to all of our terms and
                  coniditions.{" "}
                  <a href="#" className="text-sm">
                    Read here
                  </a>
                </p>
                <div className="flex flex-row-reverse w-full justify-between mt-8 items-center  max-w-[350px]">
                  <input
                    className={"button text-sm font-semibold"}
                    type="submit"
                    value={"Sign in"}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
