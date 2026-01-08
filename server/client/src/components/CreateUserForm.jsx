import React, { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react';


const CREATE_USER =  gql`
      mutation CreateUser(
            $name: String!,
            $age: Int!,
            $isMarried: Boolean!,
      ) {
            createUser(
                  name: $name,
                  age: $age,
                  isMarried: $isMarried,
            ) {
                  id
                  name 
                  age 
                  isMarried
            }
      }
`

const CreateUserForm = () => {
      const [form, setForm] = useState ({name: '', age: ''})

      // Form Validation
      const isValid = form.name.trim().length > 1 && Number(form.age) > 0

      const [createUser, {loading}] = useMutation(CREATE_USER, {
         update(cache, { data }) {
            cache.modify({
                  fields: {
                        getUsers(existingUsers = []) {
                              return [...existingUsers, data.createUser]
                        },
                  },
            })
         }  , 
      })

      const handleSubmit = () => {
            if (!isValid) return

            createUser({
                  variables: {
                        name: form.name,
                        age: Number(form.age),
                        isMarried: false,
                  },
            })

            setForm({ name: '', age: ''})
      }

  return (
    <>
    <h2> Create User</h2>

    <input
    placeholder='Name...'
    value={form.name}
    onChange={(e) =>setForm((p) =>  
    ({...p, name: e.target.value }))
    }
    />

    <input
    placeholder='Age...'
    value={form.age}
    onChange={(e) => setForm((p) =>
    ({...p, age: e.target.value}))}
    />

    <button disabled={!isValid || loading } onClick={handleSubmit}>
      {loading ? 'Creating...' : 'Create'}
    </button>

    <hr />
      
    </>
  )
}

export default CreateUserForm

