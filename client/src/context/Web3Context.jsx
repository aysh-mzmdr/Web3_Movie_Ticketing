import { createContext, useContext, useState, useEffect} from "react";
import { Web3 } from "web3"

const Web3Context = createContext()

export function Web3Provider({children}){

    const[web3,setWeb3]=useState(null);
    const[account,setAccount]=useState(null)
    const[connecting,setConnecting]=useState(false)

    useEffect(() => {
        if(window.ethereum){
            const w3=new Web3(window.ethereum)
            setWeb3(w3)
            w3.eth.getAccounts().then((acc) => {
                if(acc.length)
                    setAccount(acc[0])
            })
        }
    },[])

    const connect = async() => {
        if(window.ethereum){
            setConnecting(true)
            try{
                const w3=new Web3(window.ethereum)
                setWeb3(w3)
                const acc=await w3.eth.requestAccounts()
                setAccount(acc[0])
            }
            catch(e){
                console.log("Connection Failed")
            }
            finally{
                setConnecting(false)
            }
        }
        else{
            console.log("Install Metamask!!")
        }
    }

    const disconnect = () => setAccount(null)

    return(
        <Web3Context.Provider value={{
            web3,account,connect,disconnect,connecting
        }}>
        {children}
        </Web3Context.Provider>
    )
}

export default function useWeb3(){
    const context = useContext(Web3Context)
    return context
}