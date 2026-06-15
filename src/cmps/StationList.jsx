

export function StationList() {
	

	return  <ul className="station-list">
            {stations.map(station =>
                <li key={station._id}>
                    <StationPreview station={station}/>
                    {shouldShowActionBtns(car) && <div className="actions">
                        <button onClick={() => onUpdateCar(car)}>Edit</button>
                        <button onClick={() => onRemoveCar(car._id)}>x</button>
                    </div>}
                </li>)
            }
        </ul>
}