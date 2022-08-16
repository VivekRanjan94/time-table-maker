import React from 'react'

const Slot = ({ slot, dispatch, dayIdx, timeIdx }) => {
  return (
    <td
      className={`slot-container`}
      onClick={(e) => {
        dispatch({ TYPE: 'ADD', payload: { dayIdx, timeIdx } })
      }}
      style={{ background: `${slot.highlighted ? '#53c3e5' : ''}` }}
    >
      {slot.filled && (
        <div className='slot'>
          <div>
            <span className='slot-code'>{slot.code}</span>{' '}
            <span className='slot-name'>{slot.name}</span>
          </div>
          <div className='slot-faculty'>[{slot.faculty || '-'}]</div>
          <div className='slot-location'>{slot.location}</div>
        </div>
      )}
    </td>
  )
}

export default Slot
