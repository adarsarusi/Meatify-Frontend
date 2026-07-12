//Add onMouseDown function to li so it will activate the song/station
import { ScrollArea } from "./globalCmps/ScrollArea"
import { QueuePreview } from "./QueuePreview"
import { StationList } from "./StationList"
export function SearchResultsDropdown({ stations }) {
  return (
    <section className="search-dropdown">
      <ScrollArea >
        <StationList stations={stations} isSearch={true} />
      </ScrollArea >
    </section>
  )
}
