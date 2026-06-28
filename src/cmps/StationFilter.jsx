import { SET_FILTER_BY } from '../store/reducers/station.reducer'
import { useState, useRef, useEffect } from "react"

import { IconComp } from './globalCmps/IconComp'

import { utilService } from "../services/util.service"
import { useDispatch, useSelector } from "react-redux"

import { TOGGLE_SQUARE_LIBRARY } from '../store/reducers/system.reducer'
import { store } from '../store/store.js'

export function StationFilter() {

    const filterBy = useSelector(state => state.stationModule.filterBy)
    const dispatch = useDispatch()

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    const debouncedApplyFilter = useRef(
        utilService.debounce(updatedFilter => {
            dispatch({ type: SET_FILTER_BY, filterBy: updatedFilter })
        }, 500)
    ).current

    useEffect(() => {
        debouncedApplyFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const { name, value } = target

        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            [name]: value
        }))
    }

    const isSquare = useSelector(
        storeState => storeState.systemModule.isSquare
    )

    function onChangeView() {
        store.dispatch
            ({ type: TOGGLE_SQUARE_LIBRARY, isSquare: !isSquare })
    }

    const [isVisible, setIsVisible] = useState(false)

    function toggleTextBox() {
        setIsVisible(prev => !prev)
    }

    return <ul className="station-filter">
        <div className="station-filter-search">

            <button onClick={toggleTextBox} className='btn hover-bg'>
                <IconComp name="search" className="icon--muted" />
            </button>
            {isVisible && (
                <input
                    type="text"
                    name="txt"
                    value={filterByToEdit.txt}
                    onChange={handleChange}
                    placeholder="Search stations..."
                />
            )}
        </div>

        {isSquare ?
            <button onClick={onChangeView} className='btn hover-bg'>
                <IconComp name="default-view" className='icon--muted' />
            </button>
            :
            <button onClick={onChangeView} className='btn hover-bg'>
                <IconComp name="square-view" className='icon--muted' />
            </button>
            // <button onClick={onChangeView} className='search-btn'>
            //     <IconComp name="list" className="icon--md icon--white" />
            // </button>
        }
    </ul>
}