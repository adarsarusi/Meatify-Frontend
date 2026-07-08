import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'

export function ScrollArea({ children, className = '', style = {} }) {
  return (
    <OverlayScrollbarsComponent
      defer
      options={{
        paddingAbsolute: true,
        scrollbars: {
          theme: 'os-theme-spotify',
          autoHide: 'leave',
          autoHideDelay: 800,
          clickScroll: true,
        },
      }}
      style={{ height: '100%', width: '100%', ...style }}
      className={className}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}