import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { SquarePreview } from '../cmps/globalCmps/SquarePreview'
import { SongList } from '../cmps/globalCmps/SongList'
import { EditModal } from '../cmps/globalCmps/EditModal'
import { ScrollArea } from '../cmps/globalCmps/ScrollArea'

import { loadUser, updateUser } from '../store/actions/user.actions'
import { store } from '../store/store'
import { userService } from '../services/user'
import { stationService } from '../services/station'
import { uploadService } from '../services/upload.service'
import { showSuccessMsg } from '../services/event-bus.service'
// import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'

export function Profile() {

  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.watchedUser)
  const songs = useSelector(storeState => storeState.songModule.songs)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [likedStations, setLikedStations] = useState([])

  const likedSongs = songs.filter(song =>
    user?.likedSongIds?.includes(song._id)
  )

  useEffect(() => {
    if (!user?.likedStationIds?.length) return

      ; (async () => {
        const stations = await stationService.getByIds(
          user.likedStationIds
        )

        setLikedStations(stations)
      })()
  }, [user])

  async function loadLikedStations() {
    const stations = await stationService.getByIds(
      user.likedStationIds
    )

    setLikedStations(stations)
  }

  useEffect(() => {
    loadUser(params.id)

    // socketService.emit(SOCKET_EMIT_USER_WATCH, params.id)
    // socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

    // return () => {
    //   socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    // }

  }, [params.id])

  async function changeNickname() {
    const user = await userService.getById(params.id)
    const fullname = prompt('Change Nickname', user.fullname)

    if (!fullname) return

    user.fullname = fullname

    await updateUser(user)
  }

  async function changeProfileImg(ev) {
    try {
      const imgData = await uploadService.uploadImg(ev)

      const updatedUser = {
        ...user,
        imgUrl: imgData.secure_url
      }

      await updateUser(updatedUser)
    } catch (err) {
      console.log('Cannot upload image', err)
    }
  }


  return (
    <section className="user-details dynamic-area">
      <ScrollArea>
        {user && (
          <>
            <div className="profile-hero">
              <label className="profile-avatar-upload">
                <img
                  className="profile-avatar"
                  src={user.imgUrl}
                  alt={user.fullname}
                />

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={changeProfileImg}
                />
              </label>

              <div className="user-details-header">
                <p className="profile-type">Profile</p>

                <h1 onClick={() => setIsEditOpen(true)}>
                  {user.fullname}
                </h1>

                <p className="profile-stats">
                  {user.likedStationIds?.length || 0} public playlists · 0 following
                </p>
              </div>
            </div>

            {user.likedStationIds?.length > 0 && (
              <section className="user-details-liked-stations">
                <h2>Liked Playlists</h2>
                <ul className='station-list square-list'>
                  {likedStations.map(station =>

                    <li key={station._id} className="user-details-liked-stations-list">
                      <SquarePreview entity={station} />
                    </li>)}
                </ul>
              </section>
            )}

            {user.likedSongIds?.length > 0 && (
              <section className="user-details-liked-songs">
                <h2>Liked Songs</h2>
                <SongList songs={likedSongs} />
              </section>
            )}

            {isEditOpen && (
              <EditModal
                title="Edit profile"
                entity={user}
                onClose={() => setIsEditOpen(false)}
                onSave={updateUser}
              />
            )}
          </>
        )}
      </ScrollArea>
    </section>
  )
}