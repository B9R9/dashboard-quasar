import DashboardTilesSkeleton from './DashboardTilesSkeleton'
import TileKpi from './TileKpi'
import useDashboardTiles from '../hooks/useDashboardTiles'

export default function DashboardTiles() {
  const { tilesData, loading } = useDashboardTiles()

  if (loading) {
    return <DashboardTilesSkeleton count={8} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
      {tilesData.map((tile) => (
        <TileKpi
          key={tile.id}
          title={tile.title}
          headline={tile.headline}
          trend={tile.trend}
          period={tile.period}
          updatedAt={tile.updatedAt}
          stats={tile.stats}
        />
      ))}
    </div>
  )
}
