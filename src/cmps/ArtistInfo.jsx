import { useSelector } from "react-redux"
import { ScrollArea } from "./globalCmps/ScrollArea"
import { SquarePreview } from "./globalCmps/SquarePreview"
import { QueueCmp } from "./QueueCmp"
import { ArtistInfoPreview } from "./globalCmps/ArtistInfoPreview"


export function ArtistInfo() {

    const currentSong = useSelector(storeState => storeState.playerModule.currentSong)

    if (!currentSong) return

    return (
        <section className="artist-info">

            <ScrollArea>
                <ArtistInfoPreview entity={currentSong} />
                <QueueCmp />
            </ScrollArea>
        </section >
    )
}

