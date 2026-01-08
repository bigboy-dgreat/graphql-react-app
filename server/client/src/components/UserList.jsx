import React from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import EditUserForm from './EditUserForm'


const DELETE_USER = gql`
  mutation DeleteUser($id: ID!){
      deleteUser(id: $id){
            id
      }
  }
`


const UserList = ({ users }) => {
      const [editUser, setEditUser] = useState(null);

      const [ deleteUser ] = useMutation(DELETE_USER, {
            onError(error){
                  console.error('Delete Failed:', error.message)
            },

            optimisticResponse: ({ id }) => ({
                  deleteUser: {
                        __typename: 'User',
                        id,
                  },
            }),

            update(cache, { data }) {
                  const deletedId = data.deleteUser.id 

                  cache.modify({
                        fields: {
                              getUsers(existingUsers = [], { readField }){
                                    return existingUsers.filter(
                                          (userRef) => readField('id', userRef) !== deletedId
                                    )
                              }
                        }
                  })
            }
      })
  return (
   <>
   <h1> Users </h1>

   {users.map((user) => (
      <div key={user.id} style={{marginBottom: '12px'}}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Married: {user.isMarried ? 'Yes' : 'No' }</p>

            <button onClick={() => setEditUser(user)}>Edit</button>
            <button onClick={() => deleteUser({variables: {id: user.id}})}>
                  Delete
            </button>

            {editUser?.id === user.id && (
                  <EditUserForm
                  user={editUser}
                  onClose={() => setEditUser(null)}
                  />
            
            )}
      </div>

))}
   
   </>
  )
}

export default UserList


