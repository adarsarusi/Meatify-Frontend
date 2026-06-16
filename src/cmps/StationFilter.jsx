import { SET_FILTER_BY } from '../store/reducers/station.reducer'
import { useState, useRef, useEffect } from "react"

import { utilService } from "../services/util.service"
import { useDispatch, useSelector } from "react-redux"

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

    const [isVisible, setIsVisible] = useState(false)

    function toggleTextBox() {
        setIsVisible(prev => !prev)
    }

    return <ul className="station-filter">
        <button onClick={toggleTextBox}>🔍</button>
        {isVisible && (
            <input
                type="text"
                name="txt"
                value={filterByToEdit.txt}
                onChange={handleChange}
                placeholder="Search stations..."
            />
        )}
    </ul>
}