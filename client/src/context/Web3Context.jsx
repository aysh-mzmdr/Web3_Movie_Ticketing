import { createContext, useContext, useState, useEffect} from "react";
import { Web3 } from "web3"

const CHAIN_ID = 1337n

const Web3Context = createContext()

export function Web3Provider({children}){

    const[web3,setWeb3]=useState(null);
    const[account,setAccount]=useState(null)
    const[correctNetwork,setCorrectNetwork]=useState(true)
    const[connecting,setConnecting]=useState(false)

    useEffect(() => {
        if(!window.ethereum) return;

        const w3=new Web3(window.ethereum)
        setWeb3(w3)

        w3.eth.getChainId().then((fetchedChainID) => {
            if(fetchedChainID!==CHAIN_ID)
                setCorrectNetwork(false)
            else{
                setCorrectNetwork(true)
                w3.eth.getAccounts().then((acc) => {
                    if(acc.length)
                        setAccount(acc[0])
                })
            }
        })

        const handleAccountChanged = (acc) => {
            if(acc.length)
                setAccount(acc[0])
            else
                setAccount(null)
        }

        const handleChainChanged = () => window.location.reload()

        window.ethereum.on("accountsChanged",handleAccountChanged)
        window.ethereum.on("chainChanged",handleChainChanged)

        return () => {
            window.ethereum.removeListener("accountsChanged",handleAccountChanged)
            window.ethereum.removeListener("chainChanged",handleChainChanged)
        }
    },[])

    const connect = async() => {
        if(window.ethereum){
            setConnecting(true)
            try{
                const w3=new Web3(window.ethereum)
                setWeb3(w3)
                const chain = await w3.eth.getChainId()
                if(chain!==CHAIN_ID){
                    setCorrectNetwork(false)
                    throw new Error("Incorrect Network")
                }
                setCorrectNetwork(true)
                const acc=await w3.eth.requestAccounts()
                setAccount(acc[0])
            }
            catch(e){
                console.log("Connection Failed:"+e)
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
            web3,account,connect,disconnect,connecting,correctNetwork
        }}>
        {children}
        </Web3Context.Provider>
    )
}

export default function useWeb3(){
    const context = useContext(Web3Context)
    return context
}