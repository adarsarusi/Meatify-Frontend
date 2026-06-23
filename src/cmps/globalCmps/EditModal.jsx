import { useState } from 'react'
import { uploadService } from '../../services/upload.service'

export function EditModal({ title, entity, onSave, onClose }) {
    const [name, setName] = useState(entity.fullname || entity.name || '')
    const [imgUrl, setImgUrl] = useState(entity.imgUrl || '')

    function handleSubmit(ev) {
        ev.preventDefault()

        onSave({
            ...entity,
            imgUrl,
            fullname: entity.fullname ? name : undefined,
            name: entity.name ? name : undefined
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
            <div className="details-modal" onClick={ev => ev.stopPropagation()}>
                <h2>{title}</h2>

                <form onSubmit={handleSubmit}>
                    <label className="details-modal__img-upload">
                        <img
                            className="details-modal__img"
                            src={imgUrl}
                            alt=""
                        />

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={onUploadImg}
                        />
                    </label>

                    <div className="details-modal__content">
                        <input autoFocus
                            value={name}
                            onChange={ev => setName(ev.target.value)} />

                        <div className="modal-actions">
                            <button type="button" onClick={onClose} >
                                Cancel
                            </button>

                            <button type="submit">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}