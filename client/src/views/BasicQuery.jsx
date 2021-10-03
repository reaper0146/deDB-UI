import React from 'react'
import { useQuery } from 'react-query'
import Axios from 'axios'

import UserTable from '../components/UserTable'

function BasicQuery() {
  const fetchAllUsers = async () =>
    await (await fetch('http://localhost:3004/users')).json()

  const { data, error, status } = useQuery('users', fetchAllUsers)

  const orbitInit = () => {
    Axios.post('http://localhost:5000/orbitInit')
  };

  return (
    <div>
      <h2 className="mb-4">Basic Query Example</h2>
      <div>
        <h1>Init OrbitDB</h1> <br/>
        <button onClick = {orbitInit}>orbitDB Init</button><br/>
        </div>

      <form action="user/create">
    <input type="submit" value="User add" />
    </form>


      <div>
        {status === 'error' && <div>{error.message}</div>}

        {status === 'loading' && <div>Loading...</div>}

        {status === 'success' && <UserTable users={data} />}
      </div>
      
    </div>
  )
}

export default BasicQuery
