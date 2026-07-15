import iconsUrl from '../../assets/icons/Icons.svg'

export function IconComp({
    name,
    className = '',
    label,
    isDot = false,
}) {
    return (
        <div className={`icon-wrapper ${isDot ? 'icon--under-dot' : ''}`}>
            <svg
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