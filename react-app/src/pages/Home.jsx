import Search from '../modules/search/components/Search'
import Header from '../modules/header/components/Header'
import DashboardTiles from '../modules/dashboard/DashboardTiles'

export default function Home() {
  return (
    <div>
      <Search />
      <Header />
      <DashboardTiles />
      <section>Chatbot</section>
    </div>
  )
}
