import { createContext, useContext, useReducer } from 'react'

export const PendingDataContext = createContext(null);
export const PendingDataDispatchContext = createContext(null);

export function PendingDataProvider({ children }) {

    const [pendingData, dispatch] = useReducer(
        pendingDataReducer,
        {
            id:"",
            schoolname:"",
            address:"",
            email:"",
            walletaddress:"",
            lastname:"",
            firstname:"",
            dateofbirth:"",
            created_at:""
        }
    )

   

    return (
        <PendingDataContext.Provider value={pendingData}>
            <PendingDataDispatchContext.Provider value={dispatch}>
                {children}
            </PendingDataDispatchContext.Provider>
        </PendingDataContext.Provider>
    )

}

// Reads Posts (globally)
export function usePendingData() {
    return useContext(PendingDataContext)
}

// Manage Post (globally)
export function usePendingDataDispatch() {
    return useContext(PendingDataDispatchContext)
}

function pendingDataReducer(pendingData, action) {
    switch (action.type) {
        case 'change': {
            return{
                id:action.payload.id,
                schoolname:action.payload.schoolname,
                address:action.payload.address,
                email:action.payload.email,
                walletaddress:action.payload.walletaddress,
                lastname:action.payload.lastname,
                firstname:action.payload.firstname,
                dateofbirth:action.payload.dateofbirth,
                created_at:action.payload.created_at
            }
        }
        case 'reset': {
            return{
                id:"",
                schoolname:"",
                address:"",
                email:"",
                walletaddress:"",
                lastname:"",
                firstname:"",
                dateofbirth:"",
                created_at:""
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
  }