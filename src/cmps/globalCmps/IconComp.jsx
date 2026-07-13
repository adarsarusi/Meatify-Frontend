import iconsUrl from '../../assets/icons/Icons.svg'

export function IconComp({ name, size = 24, className = '', label, isDot = false }) {
    return (
        <div className={`${isDot ? 'icon--under-dot' : ''}`}>
            <svg
                width={size}
                height={size}
                className={`icon icon-${name} ${className}`.trim()}
                aria-hidden={!label}
                aria-label={label}
                role={label ? 'img' : undefined}
                focusable="false"
            >
                <use href={`${iconsUrl}#icon-${name}`} />
            </svg>
        </div>
    )
}