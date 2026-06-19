export function Icon({ name, size = 24, className = '', label }) {
    return (
        <div className="icon-container">
            <svg
                width={size}
                height={size}
                className={`icon icon-${name} ${className}`}
                aria-hidden={!label}
                aria-label={label}
                role={label ? 'img' : undefined}
                focusable="false"
            >
                <use href={`/src/assets/icons/icons.svg#icon-${name}`} />
            </svg>
        </div>

    )
}