import React from 'react'
import { useState } from 'react'

const SubjectForm = ({ dispatch, subject, subjectId, isChange }) => {
  const [name, setName] = useState(subject.name)
  const [faculty, setFaculty] = useState(subject.faculty)
  const [location, setLocation] = useState(subject.location)
  const [code, setCode] = useState(subject.code)

  const submit = (e) => {
    e.preventDefault()
    if (isChange) {
      dispatch({
        TYPE: 'CHANGE-SUBJECT',
        payload: {
          subjectId: subjectId,
          subject: { name, faculty, location, code },
        },
      })
    } else {
      dispatch({
        TYPE: 'ADD-SUBJECT',
        payload: { subject: { name, faculty, location, code } },
      })
    }
  }

  return (
    <form className='subject-form'>
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
      <button onClick={submit}>{isChange ? 'Change' : 'Add'}</button>
    </form>
  )
}

export default SubjectForm
