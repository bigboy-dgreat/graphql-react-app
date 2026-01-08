import React from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import CreateUserForm from './components/CreateUserForm'
import UserList from './components/UserList'


const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name 
      age 
      isMarried
    }
  }
`

const App = () => {
  const { data, loading, error } = useQuery(GET_USERS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
   <>
      <CreateUserForm />
      <UserList users={data.getUsers} />
   </>
  )
}

export default App


