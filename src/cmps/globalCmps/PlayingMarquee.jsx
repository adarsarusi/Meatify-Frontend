import { useLayoutEffect, useRef, useState } from "react"

const PIXELS_PER_SECOND = 8

export function PlayingMarquee({ children, className = "" }) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const measure = () => {
      setDistance(Math.max(0, text.scrollWidth - container.clientWidth))
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(text)
    return () => observer.disconnect()
  }, [children])

  const overflows = distance > 0
  const duration = Math.max(10, distance / PIXELS_PER_SECOND)

  return (
    <div ref={containerRef} className={`${overflows ? 'playing-marquee--overflow' : ''} playing-marquee ${className}`} title={children}>
      <span
        ref={textRef}
        className={`playing-marquee__text ${overflows ? "playing-marquee__text--loop" : ""}`}
        style={{
          "--scroll-distance": `-${distance}px`,
          "--scroll-duration": `${duration}s`,
        }}
      >
        {children}
      </span>
    </div>
  )
}