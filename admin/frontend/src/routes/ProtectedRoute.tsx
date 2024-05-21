import { Relay } from "nostr-tools/relay";
import { useEffect, useState } from "react";
import AdminLoginPage from "../components/AdminLoginPage";
import { LOCALRELAY, SERVER } from "../constants/server";
import axios from "axios";

interface Props {
    comp: any;
}

function ProtectedRoute({ comp }: Props) {
    const [child, setChild] = useState(<>Loading...</>);

    const isAuthed = async () => {
        await axios({
            method: "GET",
            url: SERVER + "/admin/getRelay",
        }).then(() => {
            setChild(() => <>{comp}</>)
            return true;
        }).catch(() => {
            setChild(() => <AdminLoginPage />);
            return false;
        });
    };

    useEffect(() => {
        isAuthed();
    }, []);

    return <>{child}</>;
}

export default ProtectedRoute;
