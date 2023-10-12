import React from 'react'

const Slot = ({ dispatch, dayIdx, timeIdx, slot, subject, size, prevSize }) => {
  return (
    <td
      className={`slot-container${size > 1 ? ' long' : ''}`}
      onClick={(e) => {
        dispatch({ TYPE: 'SELECT', payload: { dayIdx, timeIdx } })
      }}
      style={{ background: `${slot.highlighted ? '#53c3e5' : ''}` }}
    >
      {slot.filled && (
        <div
          className={`slot${size > 1 ? ' long' : ''}`}
          style={
            prevSize > 1
              ? { display: 'none' }
              : size > 1
              ? {
                  width: `${100 * size}%`,
                  position: 'absolute',
                  transform: 'translateY(-50%)',
                }
              : {}
          }
        >
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
