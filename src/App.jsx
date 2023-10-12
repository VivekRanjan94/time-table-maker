import React, { useReducer, useRef, useState } from 'react'
import { exportComponentAsJPEG } from 'react-component-export-image'
import { v4 as uuid } from 'uuid'

import Modal from './Modal'
import Slot from './Slot'
import SubjectForm from './SubjectForm'
import { ReactComponent as DeleteIcon } from './Assets/delete.svg'
import { ReactComponent as EditIcon } from './Assets/edit.svg'
import { ReactComponent as AddIcon } from './Assets/add.svg'

import './Styles/styles.scss'

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const TIME_SLOTS = [
  { id: 'time-slot-1', start: 8, end: 9 },
  { id: 'time-slot-2', start: 9, end: 10 },
  { id: 'time-slot-3', start: 10, end: 11 },
  { id: 'time-slot-4', start: 11, end: 12 },
  { id: 'time-slot-5', start: 12, end: 1 },
  { id: 'time-slot-6', start: 1, end: 2 },
  { id: 'time-slot-7', start: 2, end: 3 },
  { id: 'time-slot-8', start: 3, end: 4 },
  { id: 'time-slot-9', start: 4, end: 5 },
  { id: 'time-slot-10', start: 5, end: 6 },
]

// const TEST_SUBJECT = {
//   name: 'Theory of Computation',
//   code: 'CO303',
//   faculty: 'Anurag Goel',
//   location: 'PBFF3',
//   filled: true,
// }

const generate_slots = () => {
  let res = {}
  DAYS_OF_WEEK.forEach((day) => {
    res[day.toLowerCase()] = TIME_SLOTS.map((time) => {
      return {
        ...time,
        id: `${day.toLowerCase()}-${time.id}`,
        subjectId: '',
        filled: false,
        highlighted: false,
        // ...TEST_SUBJECT,
      }
    })
  })

  return res
}

const INITIAL_SLOTS = generate_slots()

const App = () => {
  const tableRef = useRef()
  const [right, setRight] = useState(false)
  const reducer = (state, action) => {
    switch (action.TYPE) {
      case 'SELECT': {
        const newSlots = { ...state.slots }
        if (
          state.selectedSlotsIndex.some(
            (s) =>
              s.day === action.payload.dayIdx &&
              s.time === action.payload.timeIdx
          )
        ) {
          newSlots[action.payload.dayIdx][
            action.payload.timeIdx
          ].highlighted = false
          return {
            ...state,
            slots: newSlots,
            selectedSlotsIndex: state.selectedSlotsIndex.filter((s) => {
              return !(
                s.day === action.payload.dayIdx &&
                s.time === action.payload.timeIdx
              )
            }),
          }
        }

        newSlots[action.payload.dayIdx][
          action.payload.timeIdx
        ].highlighted = true

        return {
          ...state,
          slots: newSlots,
          selectedSlotsIndex: [
            ...state.selectedSlotsIndex,
            { day: action.payload.dayIdx, time: action.payload.timeIdx },
          ],
        }
      }
      case 'SET': {
        const newSlots = { ...state.slots }

        state.selectedSlotsIndex.forEach(({ day, time }) => {
          newSlots[day][time] = {
            id: newSlots[day][time].id,
            subjectId: action.payload.subjectId,
            highlighted: false,
            filled: true,
          }
        })
        localStorage.setItem('slots-2', JSON.stringify(newSlots))
        return {
          ...state,
          slots: { ...newSlots },
          selectedSlotsIndex: [],
        }
      }
      case 'MODAL': {
        return { ...state, showModal: !state.showModal }
      }
      case 'CLEAR': {
        const newSlots = { ...state.slots }

        state.selectedSlotsIndex.forEach(({ day, time }) => {
          newSlots[day][time] = {
            ...newSlots[day][time],
            subjectId: '',
            highlighted: false,
            filled: false,
          }
        })

        localStorage.setItem('slots-2', JSON.stringify(newSlots))

        return { ...state, slots: { ...newSlots } }
      }
      case 'ADD-SUBJECT': {
        const newSubjects = {
          ...state.subjects,
          [uuid()]: action.payload.subject,
        }
        localStorage.setItem('subjects-2', JSON.stringify(newSubjects))
        return {
          ...state,
          subjects: newSubjects,
          showModal: false,
        }
      }
      case 'EDIT-SUBJECT': {
        return {
          ...state,
          selectedSubjectId: action.payload.subjectId,
          showModal: true,
        }
      }
      case 'CHANGE-SUBJECT': {
        const newSubjects = {
          ...state.subjects,
          [action.payload.subjectId]: action.payload.subject,
        }
        localStorage.setItem('subjects-2', JSON.stringify(newSubjects))

        return {
          ...state,
          subjects: newSubjects,
          selectedSubjectId: '',
          showModal: false,
        }
      }
      case 'DELETE-SUBJECT': {
        const id = action.payload.subjectId
        const newSlots = { ...state.slots }

        DAYS_OF_WEEK.forEach((day) => {
          TIME_SLOTS.forEach((t, timeIdx) => {
            if (newSlots[day][timeIdx].subjectId === id) {
              newSlots[day][timeIdx] = {
                ...newSlots[day][timeIdx],
                filled: false,
                subjectId: '',
              }
            }
          })
        })

        delete state.subjects[id]

        localStorage.setItem('slots-2', JSON.stringify(newSlots))
        localStorage.setItem('subjects-2', JSON.stringify(state.subjects))

        return { ...state, slots: newSlots, showModal: false }
      }
      default: {
        console.log(`Default case: ${action.TYPE}`)
        return { ...state }
      }
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    selectedSlotsIndex: [],
    slots: JSON.parse(localStorage.getItem('slots-2')) || INITIAL_SLOTS,
    showModal: false,
    subjects: JSON.parse(localStorage.getItem('subjects-2')) || {},
    selectedSubjectId: '',
  })

  const getSize = (day, time) => {
    if (time === -1) return -1
    if (time === 9) return 1

    const subject = state.slots[day][time].subjectId
    if (subject === '') return 1

    let s = 1
    let t = time + 1
    while (state.slots[day][t].subjectId === subject) {
      t++
      s++
    }
    return s
  }

  return (
    <div className='app'>
      <Modal
        showModal={state.showModal}
        setShowModal={(value) => {
          dispatch({ TYPE: 'MODAL', payload: { value } })
        }}
        allowClose={true}
      >
        <SubjectForm
          dispatch={dispatch}
          subject={
            state.selectedSubjectId === ''
              ? { name: '', code: '', location: '', faculty: '' }
              : state.subjects[state.selectedSubjectId]
          }
          subjectId={state.selectedSubjectId}
          isChange={state.selectedSubjectId !== ''}
        />
      </Modal>
      <header>Time Table</header>
      <div className='split'>
        <div className='left'>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th></th>
                {TIME_SLOTS.map((time) => {
                  return (
                    <th key={`slot-${time.id}`}>
                      {time.start}-{time.end}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {DAYS_OF_WEEK.map((day) => {
                return (
                  <tr key={day}>
                    <th>{day.charAt(0).toUpperCase() + day.slice(1)}</th>
                    {TIME_SLOTS.map((time, timeIdx) => {
                      return (
                        <Slot
                          key={state.slots[day][timeIdx].id}
                          dayIdx={day}
                          timeIdx={timeIdx}
                          dispatch={dispatch}
                          slot={state.slots[day][timeIdx]}
                          subject={
                            state.subjects[state.slots[day][timeIdx].subjectId]
                          }
                          size={getSize(day, timeIdx)}
                          prevSize={getSize(day, timeIdx - 1)}
                        />
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className='buttons'>
            <button
              className='change-btn'
              onClick={(e) => {
                if (state.selectedSlotsIndex.length !== 0) {
                  setRight(true)
                }
              }}
            >
              CHANGE
            </button>
            <button
              className='clear-btn'
              onClick={(e) => {
                dispatch({ TYPE: 'CLEAR' })
              }}
            >
              CLEAR
            </button>
            <button
              className='download-btn'
              onClick={() => {
                exportComponentAsJPEG(tableRef)
              }}
            >
              Download
            </button>
          </div>
        </div>

        <div className={`right${right ? '' : ' hide'}`}>
          <div className='header'>
            <h3>Subjects</h3>
            <span
              className={`cross`}
              onClick={() => {
                setRight(false)
              }}
            ></span>
          </div>
          <ul>
            {Object.entries(state.subjects).map(([subjectId, s]) => {
              return (
                <li key={`subject-${subjectId}`} className='subject'>
                  <div
                    className='subject-description'
                    onClick={() => {
                      dispatch({ TYPE: 'SET', payload: { subjectId } })
                      setRight(false)
                    }}
                  >
                    <div>Code: {s.code}</div>
                    <div>Name: {s.name}</div>
                    <div>Faculty: {s.faculty}</div>
                    <div>Location: {s.location}</div>
                  </div>
                  <div className='options'>
                    <EditIcon
                      className='icon'
                      onClick={() => {
                        dispatch({
                          TYPE: 'EDIT-SUBJECT',
                          payload: { subjectId: subjectId },
                        })
                      }}
                    />
                    <DeleteIcon
                      className='icon'
                      onClick={() => {
                        dispatch({
                          TYPE: 'DELETE-SUBJECT',
                          payload: { subjectId: subjectId },
                        })
                      }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <AddIcon
            className='icon'
            onClick={() => {
              dispatch({ TYPE: 'MODAL' })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default App
