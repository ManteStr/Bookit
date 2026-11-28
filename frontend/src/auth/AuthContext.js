import { createContext } from 'react'

// Čia saugoma, kas šiuo metu prisijungęs. Naudoti per useAuth().
export const AuthContext = createContext(null)
