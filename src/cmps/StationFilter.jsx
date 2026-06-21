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
        store.dispatch({ type: TOGGLE_SQUARE_LIBRARY, isSquare: !isSquare })
    }

    const [isVisible, setIsVisible] = useState(false)

    function toggleTextBox() {
        setIsVisible(prev => !prev)
    }

    return <ul className="station-filter">
        <div className="station-filter-search">

            <button onClick={toggleTextBox} className='search-btn'>
                <IconComp name="search" className="icon--md icon--white" />
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
            <svg className='grid-toggle-btn' onClick={onChangeView}
                xmlns="http://www.w3.org/2000/svg" width={32} height={32}
                fill={"currentColor"} viewBox={"0 0 24 24"}>
                {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                <path d="M4.5 11h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5h-5C3.67 3 3 3.67 3 4.5v5c0 .83.67 1.5 1.5 1.5M5 5h4v4H5zM19.5 3h-5c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5M19 9h-4V5h4zM4.5 21h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5h-5c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5m.5-6h4v4H5zM19.5 13h-5c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5m-.5 6h-4v-4h4z" />
            </svg>
            :
            <svg className='grid-toggle-btn' onClick={onChangeView}
                xmlns="http://www.w3.org/2000/svg" width={32} height={32}
                fill={"currentColor"} viewBox={"0 0 24 24"}>
                {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                <path d="M4 11H20V13H4z" /><path d="M4 6H20V8H4z" /><path d="M4 16H20V18H4z" />
            </svg>
            // <button onClick={onChangeView} className='search-btn'>
            //     <IconComp name="list" className="icon--md icon--white" />
            // </button>
        }
    </ul>
}