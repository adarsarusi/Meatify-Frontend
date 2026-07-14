import { useEffect } from "react"
import { Library } from "../cmps/Library"
import { TURN_OFF_MINIMIZE_LIBRARY } from "../store/reducers/system.reducer.js"
import { store } from "../store/store.js"

export function LibraryPage() {

    useEffect(() => {
        store.dispatch({ type: TURN_OFF_MINIMIZE_LIBRARY })
    }, [])


    return <Library mobile />
}