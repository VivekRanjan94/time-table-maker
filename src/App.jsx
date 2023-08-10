import React, { useReducer, useRef } from 'react'
import { exportComponentAsJPEG } from 'react-component-export-image'

import Modal from './Modal'
import Slot from './Slot'
import AddSlotForm from './AddSlotForm'

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

// const TEST_SLOT = {
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
        name: '',
        code: '',
        faculty: '',
        location: '',
        filled: false,
        highlighted: false,
        // ...TEST_SLOT,
      }
    })
  })

  return res
}

const INITIAL_SLOTS = generate_slots()

const App = () => {
  console.log(JSON.parse(localStorage.getItem('slots')))
  const tableRef = useRef()
  const reducer = (state, action) => {
    switch (action.TYPE) {
      case 'ADD': {
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
      case 'SET-SLOTS': {
        const newSlots = { ...state.slots }

        state.selectedSlotsIndex.forEach(({ day, time }) => {
          newSlots[day][time] = {
            ...newSlots[day][time],
            name: action.payload.name,
            faculty: action.payload.faculty,
            location: action.payload.location,
            code: action.payload.code,
            highlighted: false,
            filled: true,
          }
        })

        localStorage.setItem('slots', JSON.stringify(newSlots))

        return {
          slots: { ...newSlots },
          showModal: false,
          selectedSlotsIndex: [],
        }
      }
      case 'MODAL': {
        return { ...state, showModal: action.payload.value }
      }
      case 'CLEAR': {
        const newSlots = { ...state.slots }

        state.selectedSlotsIndex.forEach(({ day, time }) => {
          newSlots[day][time] = {
            ...newSlots[day][time],
            name: '',
            faculty: '',
            location: '',
            code: '',
            highlighted: false,
            filled: false,
          }
        })

        localStorage.setItem('slots', JSON.stringify(newSlots))

        return { ...state, slots: { ...newSlots }, selectedSlotsIndex: [] }
      }
      default: {
        console.log('default case')
        return { ...state }
      }
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    selectedSlotsIndex: [],
    slots: JSON.parse(localStorage.getItem('slots')) || INITIAL_SLOTS,
    showModal: false,
  })

  return (
    <div className='app'>
      <Modal
        showModal={state.showModal}
        setShowModal={(value) => {
          dispatch({ TYPE: 'MODAL', payload: { value } })
        }}
        allowClose={true}
      >
        <AddSlotForm
          dispatch={dispatch}
          name={
            state.selectedSlotsIndex.length === 0
              ? ''
              : state.slots[state.selectedSlotsIndex[0].day][
                  state.selectedSlotsIndex[0].time
                ].name
          }
          code={
            state.selectedSlotsIndex.length === 0
              ? ''
              : state.slots[state.selectedSlotsIndex[0].day][
                  state.selectedSlotsIndex[0].time
                ].code
          }
          location={
            state.selectedSlotsIndex.length === 0
              ? ''
              : state.slots[state.selectedSlotsIndex[0].day][
                  state.selectedSlotsIndex[0].time
                ].location
          }
          faculty={
            state.selectedSlotsIndex.length === 0
              ? ''
              : state.slots[state.selectedSlotsIndex[0].day][
                  state.selectedSlotsIndex[0].time
                ].faculty
          }
        />
      </Modal>
      <header>Time Table</header>
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
                      slot={state.slots[day][timeIdx]}
                      dispatch={dispatch}
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
              dispatch({ TYPE: 'MODAL', payload: { value: true } })
            }
          }}
        >
          CHANGE
        </button>
        <button
          className='clear-btn'
          onClick={(e) => {
            if (state.selectedSlotsIndex.length !== 0) {
              dispatch({ TYPE: 'CLEAR' })
            }
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
  )
}

export default App
