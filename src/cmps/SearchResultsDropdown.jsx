//Add onMouseDown function to li so it will activate the song/station

export function SerachResultsDropdown({ stations }) {
  return (
    <section className="search-dropdown">
      <ul>
        {stations.map((station) => (
          <li key={station._id}>
            <span>{station.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
