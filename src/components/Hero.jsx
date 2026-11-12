export default function Hero({ title = '', intro, person }) {
  const words = title.split(' ')
  const parts = person.name.split(' ').filter(Boolean)

  return (
    <header className="hero">
      <h1>
        {words.map((w, i) => (
          <span key={i} className={'w' + (i === words.length - 1 ? ' hl' : '')} style={{ '--i': i }}>{w}{' '}</span>
        ))}
      </h1>
      {intro && <p className="lead">{intro}</p>}

      <div className="namecard">
        <span className="namecard-role">{person.role}</span>
        <div className="namecard-name">
          {parts.map((p, i) => (
            <span key={i} style={{ '--i': i + words.length }}>{p}</span>
          ))}
        </div>
        <div className="namecard-org">{person.org}</div>
      </div>
    </header>
  )
}
