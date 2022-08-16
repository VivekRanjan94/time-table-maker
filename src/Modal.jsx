import React, { useRef } from 'react'
import useEventListener from './Hooks/useEventListener'
import ReactDOM from 'react-dom'

const Modal = ({ showModal, setShowModal, allowClose, children }) => {
  const backgroundRef = useRef()

  useEventListener('keydown', (e) => {
    if (e.key === 'Escape' && showModal && allowClose) {
      setShowModal(false)
    }
  })
  useEventListener('mousedown', (e) => {
    if (e.target === backgroundRef.current && showModal && allowClose) {
      setShowModal(false)
    }
  })

  return ReactDOM.createPortal(
    <>
      {showModal && (
        <div ref={backgroundRef} className='background'>
          <div className='modal'>
            <div className='body'>{children}</div>
            <span
              className={`cross ${!allowClose ? 'disabled' : ''}`}
              onClick={() => {
                if (allowClose) {
                  setShowModal(false)
                }
              }}
            ></span>
          </div>
        </div>
      )}
    </>,
    document.querySelector('#portal')
  )
}

export default Modal
