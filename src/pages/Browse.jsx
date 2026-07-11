import { Link } from 'react-router-dom'
import { stationService } from '../services/station'
import { ScrollArea } from '../cmps/globalCmps/ScrollArea'
import { useEffect, useState } from 'react'

export function Browse() {
    const [tagsData, setTagsData] = useState([])

    useEffect(() => {
        stationService.getTagsData()
            .then(tags => setTagsData(tags))
            .catch(err => console.error('Cannot load tags', err))
    }, [])

    return (
        <section className="browse-page dynamic-area">
            <ScrollArea>
                <div className='browse-page__content'>
                    <h1>Browse all</h1>
                    <div className="browse-page__grid">
                        {tagsData.map(tag => (
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
                </div>

            </ScrollArea>
        </section>
    )
}