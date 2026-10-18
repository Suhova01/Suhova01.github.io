import { useState } from 'react'

// Подключите свой access_key от web3forms.com (бесплатно) — без своего бэкенда
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

export default function ContactForm() {
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!WEB3FORMS_KEY) { setStatus('error'); return }
    setStatus('sending')
    const formData = new FormData(e.target)
    formData.append('access_key', WEB3FORMS_KEY)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      setStatus(result.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <p>Спасибо! Сообщение отправлено.</p>
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Имя" required />
      <input name="email" type="email" placeholder="Эл. почта" required />
      <input name="phone" placeholder="Телефон" />
      <input name="subject" placeholder="Тема" />
      <textarea name="message" placeholder="Сообщение" required />
      <button className="btn-primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Отправка…' : 'Отправить'}
      </button>
      {status === 'error' && <p className="muted">Не получилось отправить, попробуйте ещё раз.</p>}
    </form>
  )
}
