import { IconComp } from './IconComp'
export function SongListTable() {
    return (
        <table class="playlist-table">
            <thead>
                <tr>
                    <th class="col-index">#</th>
                    <th class="col-title">Title</th>
                    <th class="col-album">Album</th>
                    <th class="col-date">Date added</th>
                    <th class="col-duration">
                        <IconComp name="clock" />
                    </th>
                </tr>
            </thead>
        </table>
    )
}