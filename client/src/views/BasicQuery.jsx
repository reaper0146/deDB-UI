import React from 'react'
import { useQuery } from 'react-query'
import Axios from 'axios'

import UserTable from '../components/UserTable'

function BasicQuery() {
  const fetchAllUsers = async () =>
    await (await fetch('http://localhost:5000/showPatients')).json()

  const { data, error, status } = useQuery('users', fetchAllUsers)

  const orbitInit = () => {
    Axios.post('http://localhost:5000/orbitInit')
  };

  return (

      <div>
        {status === 'error' && <div>{error.message}</div>}

        {status === 'loading' && <div>Loading...</div>}

        {status === 'success' && <UserTable users={data} />}
      </div>
      
  )
}

export default BasicQuery
