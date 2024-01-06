import { createContext, useContext, useEffect, useReducer } from 'react'
import { getPendingRecordsByStudentID } from '../service/studentService';

export const PendingRecordsContext = createContext(null);
export const PendingRecordsDispatchContext = createContext(null);

export function PendingRecordProvider({ children }) {
    const [table, dispatch] = useReducer(
        reducer,
        {
            rows:[]
        }
    )

    useEffect(() => {
        const init = async () => {
          try {
            const data = await getPendingRecordsByStudentID();
            if (data && Array.isArray(data) && data.length > 0) {
                const arr = data.map((row) => ({
                    id: row.PendingRecordID,
                    Status: row.Status,
                    SchoolName: row.SchoolName,
                    RecordType: row.RecordType,
                    Description: row.Description,
                    Created_At: row.Created_At,
                    Note: row.Note? row.Note : ''
                }));
                dispatch({ type: 'init', payload: arr });
            } else if (Array.isArray(data) && data.length === 0) {
                dispatch({ type: 'init', payload: [] });
            } else {
                console.error('Data received is not in the expected format:', data);
            }
          } catch (error) {
            console.error('Error fetching pending records:', error);
          }
        };
        init();
      }, []);

    return (
        <PendingRecordsContext.Provider value={table}>
            <PendingRecordsDispatchContext.Provider value={dispatch}>
                {children}
            </PendingRecordsDispatchContext.Provider>
        </PendingRecordsContext.Provider>
    )
}

// Reads Posts (globally)
export function usePendingRecords() {
    return useContext(PendingRecordsContext)
}

// Manage Post (globally)
export function usePendingRecordsDispatch() {
    return useContext(PendingRecordsDispatchContext)
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
        case 'update':{
            console.log(action.payload.id)
            table.rows.find((row)=>{
                if(row.id === action.payload.id){
                    row.Status = action.payload.Status
                }
            })
            return {rows: [...table.rows]}
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}