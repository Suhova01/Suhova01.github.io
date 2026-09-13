import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Page from './pages/Page'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/*" element={<Page />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
