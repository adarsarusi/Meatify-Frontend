import { IconComp } from './IconComp'

export function SongListTable() {
    return (
        <div className="playlist-table">
            <div className="playlist-table__row">
                <div className="playlist-table__index">#</div>
                <div className="playlist-table__title">Title</div>
                <div className="playlist-table__album">Album</div>
                <div className="playlist-table__date">Date added</div>
                <div className="playlist-table__duration">
                    <IconComp name="clock" className='icon--sm'/>
                </div>
            </div>
        </div>
    )
}