import Search from '../modules/search/components/Search'
import Header from '../modules/header/components/Header'

export default function Home() {
  return (
    <div>
      <Search />
      <Header />
      <section>Tiles</section>
      <section>Chatbot</section>
    </div>
  )
}
