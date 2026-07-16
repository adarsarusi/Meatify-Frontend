import { useState } from 'react'
import { uploadService } from '../../services/upload.service'
import { IconComp } from '../globalCmps/IconComp'

export function EditModal({ title, entity, onSave, onClose }) {
    const isUser = entity.type !== 'station'

    const [name, setName] = useState(entity.fullname || entity.name || '')
    const [description, setDescription] = useState(entity.description || '')

    const [imgUrl, setImgUrl] = useState(entity.imgUrl || entity.uploadImgUrl || '')
    const defaultCoverUrl = 'https://i.ibb.co/sdR4q2RZ/image.png'

    function handleSubmit(ev) {
        ev.preventDefault()

        onSave({
            ...entity,

            ...(isUser ? { imgUrl } : { uploadImgUrl: imgUrl }),

            ...(entity.fullname ? { fullname: name } : { name })
        })

        onClose()
    }

    async function onUploadImg(ev) {
        try {
            const imgData = await uploadService.uploadImg(ev)

            setImgUrl(imgData.secure_url)

        } catch (err) {
            console.log('Cannot upload image', err)
        }
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="details-modal"
                onClick={ev => ev.stopPropagation()}
            >
                <div className='details-modal__header'>
                    <h2>{title}</h2>
                    <button className='btn hover-bg' onClick={onClose}>
                        <IconComp name='close' className='icon--muted icon--sm' />
                    </button>
                </div>

                <form className='details-modal__form' onSubmit={handleSubmit}>
                    <label className="details-form__img-upload">
                        <img className="details-form__img" src={imgUrl} alt="" />

                        <div className="details-form__img-overlay">
                            <IconComp name='edit' className='icon--lg' />
                            <span>Change photo</span>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={onUploadImg}
                        />
                    </label>


                    <input className='details-modal-form__name' autoFocus
                        value={name}
                        onChange={ev => setName(ev.target.value)}
                    />

                    {!isUser && (
                        <textarea className='details-modal-form__description'
                            value={description}
                            onChange={ev => setDescription(ev.target.value)}
                            placeholder='Add an optional description'
                        />
                    )}

                    <button
                        className='btn form-button details-modal-form__save-btn'
                        type="submit">
                        Save
                    </button>

                    <p className='details-modal-form__disclaimer'>
                        By proceeding, you agree to give Meatify access to the image you choose to upload. Please make sure you have the right to upload the image.
                    </p>
                </form>
            </div>
        </div>
    )
}