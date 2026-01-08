import React, { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'

const UPDATE_USER = gql `
  mutation UpdateUser(
      $id: ID!
      $name: String 
      $age: Int 
      $isMarried: Boolean
  ) {
      updateUser(
            id: $id 
            name: $name 
            age: $age 
            isMarried: $isMarried 
    ) {
      id 
      name 
      age 
      isMarried
    }
  }
`


const EditUserForm = ( {user, onClose }) => {
const [form, setForm] = useState({
      name: user.name,
      age: user.age,
      isMarried: user.isMarried,
})

const isValid =
form.name.trim().length > 1 && Number(form.age) > 0

const [updateUser, { loading }] = useMutation(UPDATE_USER, {
      optimisticResponse: {
            updateUser: {
                  __typename: 'User',
                  id: user.id,
                  name: form.name, 
                  age: Number(form.age),
                  isMarried: form.isMarried,
            },
      },

      update(cache, { data }) {
            cache.modify({
                  fields: {
                        getUsers(existingUsers = [], { readField }) {
                              return existingUsers.map((userRef) => 
                              readField('id', userRef) === data.updateUser.id 
                              ? data.updateUser 
                              : userRef
                              )
                        }
                  }
            })
      },

      onCompleted: onClose,
})

      const handleSave = () => {
            if(!isValid) return 

            updateUser({
                  variables: {
                        id: user.id,
                        name: form.name,
                        age: Number(form.age),
                        isMarried: form.isMarried
                  }
            })
      }



  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h3>Edit User</h3>  

      <input 
      value={form.name}
      onChange={(e) =>
      setForm((p) => 
      ({...p, name: e.target.value}))
      }    
      />

      <input 
      value={form.age}
      onChange={(e) =>
      setForm((p) => 
      ({...p, age: Number(e.target.value)}))
      }    
      />

      <label>
            Married:
            <input
            type='checkbox'
            checked={form.isMarried}
            onChange={(e) => 
            setForm((p) => 
            ({...p, isMarried: e.target.checked }))
            }
            />
      </label>

      <br />

      <button disabled={!isValid || loading } onClick={handleSave}>
            {loading ? 'Saving...' : 'Save' }
      </button>

      <button onClick={onClose}>Cancel</button>
    </div>
  )
}

export default EditUserForm


