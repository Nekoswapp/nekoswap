import { useWriteContract, type UseWriteContractParameters } from 'wagmi'
import { useAccount } from 'wagmi'

const acount = useAccount();
const handelstake = useWriteContract();