import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser, updateUser } from '../store/actions/user.actions'
import { store } from '../store/store'
import { userService } from '../services/user'
import { uploadService } from '../services/upload.service'
import { showSuccessMsg } from '../services/event-bus.service'
// import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'

export function Profile() {

  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.watchedUser)

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

              <h1 onClick={changeNickname}>{user.fullname}</h1>

              <p className="profile-stats">
                {user.likedStationIds?.length || 0} public playlists · 0 following
              </p>
            </div>
          </div>

          {user.likedStationIds?.length > 0 && (
            <section className="user-details-liked-stations">
              <h2>Public Playlists</h2>
              Liked Stations CMP
            </section>
          )}

          {user.likedSongIds?.length > 0 && (
            <section className="user-details-liked-songs">
              <h2>Liked Songs</h2>
              Liked Songs CMP
            </section>
          )}
        </>
      )}
    </section>
  )
}