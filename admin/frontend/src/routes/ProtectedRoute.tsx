import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER } from "../constants/server";

interface Props {
    userType: String; 
    comp: any;
}

function ProtectedRoute({ userType, comp }: Props) {
    const [child, setChild] = useState(<>Loading...</>);

    const isAuthed = () => {
        try {
            axios({
                method: "get",
                withCredentials: true,
                url: SERVER + "/"+userType+"/check-auth",
            })
                .then(() => {
                    setChild(() => {
                        return comp;
                    });
                    return true;
                })
                .catch(() => {
                    setChild(() => {
                        return (
                            comp
                            // <>
                            //     <Link to="/login">
                            //         <button className="btn">Login</button>
                            //     </Link>
                            // </>
                        );
                    });
                    return false;
                });
        } catch {
            return false;
        }
    };

    useEffect(() => {
        isAuthed();
    }, []);

    return <>{child}</>;
}

export default ProtectedRoute;
