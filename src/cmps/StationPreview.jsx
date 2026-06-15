

export function StationPreview() {

	return <article className="station-preview">
        <header>
            <Link to={`/car/${car._id}`}>{car.vendor}</Link>
        </header>

        <p>Speed: <span>{car.speed.toLocaleString()} Km/h</span></p>
        {car.owner && <p>Owner: <span>{car.owner.fullname}</span></p>}
        
    </article>
	
}