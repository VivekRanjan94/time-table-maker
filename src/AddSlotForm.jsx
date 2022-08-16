import React from 'react'
import { useState } from 'react'

const AddSlotForm = ({ dispatch }) => {
  const [name, setName] = useState('')
  const [faculty, setFaculty] = useState('')
  const [location, setLocation] = useState('')
  const [code, setCode] = useState('')

  const submit = (e) => {
    e.preventDefault()
    dispatch({ TYPE: 'SET-SLOTS', payload: { name, faculty, location, code } })
  }

  return (
    <form className='add-slot-form'>
      <div className='group'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          name='name'
          id='name'
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>
      <div className='group'>
        <label htmlFor='faculty'>Faculty</label>
        <input
          type='text'
          name='faculty'
          id='faculty'
          required
          value={faculty}
          onChange={(e) => {
            setFaculty(e.target.value)
          }}
        />
      </div>
      <div className='group'>
        <label htmlFor='location'>Location</label>
        <input
          type='text'
          name='location'
          id='location'
          required
          value={location}
          onChange={(e) => {
            setLocation(e.target.value)
          }}
        />
      </div>
      <div className='group'>
        <label htmlFor='code'>Code</label>
        <input
          type='text'
          name='code'
          id='code'
          required
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
          }}
        />
      </div>
      <button onClick={submit}>Add</button>
    </form>
  )
}

export default AddSlotForm
