import { Link } from 'react-router-dom'
import { TAGS_DATA } from '../services/station/station.service.local'
import { ScrollArea } from '../cmps/globalCmps/ScrollArea'
export function Browse() {
    return (
        <section className="browse-page">
            <ScrollArea>
            <h1>Browse all</h1>

            <div className="browse-grid">
                {TAGS_DATA.map(tag => (
                    <Link
                        key={tag.title}
                        to={`/browse/${encodeURIComponent(tag.title)}`}
                        className="browse-card"
                        style={{ backgroundColor: tag.color }}
                    >
                        <h2>{tag.title}</h2>

                        <img
                            src={tag.imgUrl}
                            alt={tag.title}
                            loading="lazy"
                        />
                    </Link>
                ))}
            </div>
            </ScrollArea>
        </section>
    )
}