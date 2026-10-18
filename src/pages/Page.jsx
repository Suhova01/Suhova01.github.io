import { useParams, Link } from 'react-router-dom'
import Hero from '../components/Hero'

const pages = {}
for (const [path, mod] of Object.entries(import.meta.glob('../content/pages/**/*.json', { eager: true }))) {
  const slug = path.replace('../content/pages/', '').replace(/\.json$/, '')
  pages[slug === 'home' ? '' : slug] = mod.default
}
import site from '../content/site.json'
import ContactForm from '../components/ContactForm'

function findNavItem(slug) {
  for (const item of site.nav) {
    if (item.slug === slug) return item
    if (item.children) {
      const child = item.children.find((c) => c.slug === slug)
      if (child) return child
    }
  }
  return null
}

function DocList({ docs }) {
  if (!docs?.length) return null
  return (
    <ul className="doc-list">
      {docs.map((doc, i) => (
        <li key={i}>
          {doc.url ? <a href={doc.url}>{doc.name}</a> : <span>{doc.name}</span>}
          <span className="muted">{doc.url ? 'Скачать' : 'Файл скоро появится'}</span>
        </li>
      ))}
    </ul>
  )
}

function LinkList({ links }) {
  if (!links?.length) return null
  return (
    <ul className="link-list">
      {links.map((l, i) => (
        <li key={i}><a href={l.url} target="_blank" rel="noopener noreferrer">{l.title}</a></li>
      ))}
    </ul>
  )
}

export default function Page() {
  const params = useParams()
  const slug = params['*'] || ''
  const data = pages[slug]

  if (!data) {
    return (
      <div>
        <h1>Страница не найдена</h1>
        <p className="muted">Такого раздела пока нет.</p>
      </div>
    )
  }

  const navItem = findNavItem(slug)

  return (
    <article>
      {slug === '' ? (
        <Hero title={data.title} intro={data.intro} />
      ) : (
        <div className="page-header">
          {data.eyebrow && <div className="eyebrow">{data.eyebrow}</div>}
          <h1>{data.title}</h1>
          {data.intro && <p className="muted">{data.intro}</p>}
        </div>
      )}

      {/* Раздел-хаб: показываем ссылки на дочерние страницы */}
      {data.children && navItem?.children && (
        <div className="section">
          {navItem.children.map((child) => (
            <Link className="card-link" key={child.slug} to={`/${child.slug}`}>
              <h3>{child.label}</h3>
              <p className="muted">{pages[child.slug]?.eyebrow}</p>
            </Link>
          ))}
        </div>
      )}

      {data.sections?.map((section, i) => (
        <div className="section" key={i}>
          <h2>{section.heading}</h2>
          {section.body && <p className="prose">{section.body}</p>}
          <LinkList links={section.links} />
          <DocList docs={section.docs} />
        </div>
      ))}

      {data.images?.length > 0 && (
        <div className="image-grid">
          {data.images.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" />
          ))}
        </div>
      )}

      <DocList docs={data.docs} />

      {data.showContactForm && (
        <div className="section">
          <h2>Обратная связь</h2>
          <p className="muted">Пишите на {site.person.email} или через форму ниже.</p>
          <ContactForm />
        </div>
      )}
    </article>
  )
}
