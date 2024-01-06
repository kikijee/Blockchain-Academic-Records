import { createContext, useContext, useEffect, useReducer } from 'react'
import {getPendingInstitutions} from '../service/authService'


export const PendingTableDataContext = createContext(null);
export const PendingTableDataDispatchContext = createContext(null);

export function PendingTableDataProvider({ children }) {

    const [table, dispatch] = useReducer(
        reducer,
        {
            rows:[]
        }
    )

useEffect(() => {
  const init = async () => {
    try {
      const data = await getPendingInstitutions();
      if (data && Array.isArray(data) && data.length > 0) {
        const arr = data.map((row) => ({
          id: row.PendingInstitutionID,
          schoolname: row.SchoolName,
          address: row.Address,
          email: row.Email,
          walletaddress: row.WalletAddress,
          firstname: row.FirstName,
          lastname: row.LastName,
          dateofbirth: row.DateOfBirth,
          created_at: row.Created_At,
        }));
        dispatch({ type: 'init', payload: arr });
      } else if (Array.isArray(data) && data.length === 0) {
        dispatch({ type: 'init', payload: [] });
      } else {
        console.error('Data received is not in the expected format:', data);
      }
    } catch (error) {
      console.error('Error fetching pending institutions:', error);
    }
  };
  init();
}, []);

    return (
        <PendingTableDataContext.Provider value={table}>
            <PendingTableDataDispatchContext.Provider value={dispatch}>
                {children}
            </PendingTableDataDispatchContext.Provider>
        </PendingTableDataContext.Provider>
    )

}

// Reads Posts (globally)
export function usePendingTableData() {
    return useContext(PendingTableDataContext)
}

// Manage Post (globally)
export function usePendingTableDataDispatch() {
    return useContext(PendingTableDataDispatchContext)
}

function reducer(table,action){
    switch(action.type){
        case 'init':{
            return{rows:action.payload}
        }
        case 'delete':{
            table.rows = table.rows.filter(row => row.id !== action.payload.id)
            return {rows: [...table.rows]}
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
