import  {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
// import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import Tokens from "../constants";
import { useState, useEffect } from "react"


function ProtectedRoute({children}){
    const [IsAuthorized, SetIsAuthorized]=useState(null);

    useEffect(() => {
        auth()
            .then(() => setIsAuthorized(true))
            .catch(() => setIsAuthorized(false));
    }, []);


    
    const refreshToken= async() => {
        const refreshToken=localStorage.getItem(Tokens.REFRESH_TOKEN)
        try{
            const res= await api.post("/api/token/refresh/", {
                refresh: refreshToken,});
                if (res.status=200){
                    localStorage.setItem(Tokens.ACCESS_TOKEN, res.data.access)
                    SetIsAuthorized(true)
                }
                else{
                    SetIsAuthorized(false)
                }

        }
        catch (error){
            console.log(error)
            IsAuthorized(false)
        }
        

    }
    const auth=async()=>{

        const token=localStorage.getItem(Tokens.ACCESS_TOKEN)
        if (!token){
            SetIsAuthorized(false)
            return
        }
        const decode=jwtDecode(token)
        const tokenExpiration=decode.exp
        const now=Date.now()/1000
        if (tokenExpiration<now){
            await refreshToken()
        }
        else {
            SetIsAuthorized(true)
        }
    }
    if (IsAuthorized==null){
        return <div>Loading...</div>
    }

    return IsAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute