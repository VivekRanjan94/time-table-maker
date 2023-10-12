import React from 'react'

const Slot = ({ dispatch, dayIdx, timeIdx, slot, subject }) => {
  return (
    <td
      className={`slot-container`}
      onClick={(e) => {
        dispatch({ TYPE: 'SELECT', payload: { dayIdx, timeIdx } })
      }}
      style={{ background: `${slot.highlighted ? '#53c3e5' : ''}` }}
    >
      {slot.filled && (
        <div className='slot'>
          <div>
            <span className='slot-code'>{subject.code}</span>{' '}
            <span className='slot-name'>{subject.name}</span>
          </div>
          <div className='slot-faculty'>[{subject.faculty || '-'}]</div>
          <div className='slot-location'>{subject.location}</div>
        </div>
      )}
    </td>
  )
}

export default Slot
