import React from 'react'
import { useQuery } from 'react-query'
import Axios from 'axios'
import {useState} from 'react'

import UserTable from '../components/UserTable'

function BasicQuery() {
  const [queryAge, setQueryAge] = useState('')
  const fetchAllUsers = async () =>
    await (await fetch('http://localhost:5000/showPatients')).json()

  const { data, error, status } = useQuery('users', fetchAllUsers)

  const orbitInit = () => {
    Axios.post('http://localhost:5000/orbitInit')
  };

  const fetchAgeUsers = async () =>
    await (await fetch('http://localhost:5000/queryAge')).json()

  const handleSubmit = async(event) => {
    event.preventDefault();
    //alert(`The query age was: ${queryAge}`)
    console.log(queryAge)
    Axios.post('http://localhost:5000/ageQuery',{age:queryAge})
    const { data, error, status } = useQuery('users', fetchAgeUsers)
    
  }

  return (

      <div>
        <div>
          <form onSubmit={handleSubmit}>
        <label>
          Query patients whose age older than:
          <input 
            type="number" 
            name="age" 
            onChange={(e)=>setQueryAge(e.target.value)}
          />
        </label>
        <button className="bg-teal-800 border-teal-800 shadow-md text-white btn hover:bg-gray-100 hover:border-2 hover:text-teal-900"
            type="submit"> Query </button>
            </form>
            

      </div>
        {status === 'error' && <div>{error.message}</div>}

        {status === 'loading' && <div>Loading...</div>}

        {status === 'success' && <UserTable users={data} />}
      </div>
      
  )
}

export default BasicQuery
