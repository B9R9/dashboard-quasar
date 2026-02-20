import { useEffect, useMemo } from 'react'

import DashboardTilesSkeleton from './DashboardTilesSkeleton'
import TileKpi from './TileKpi'
import useDashboardTiles from '../hooks/useDashboardTiles'
import useTilePreferencesStore from '../../../stores/tilePreferences.store'

export default function DashboardTiles() {
  const { tilesData, loading } = useDashboardTiles()
  const { tileOrder, hiddenTileIds, syncTiles } = useTilePreferencesStore()

  useEffect(() => {
    if (loading || tilesData.length === 0) return
    syncTiles(tilesData.map((tile) => tile.id))
  }, [loading, tilesData, syncTiles])

  const orderedVisibleTiles = useMemo(() => {
    const tilesMap = new Map(tilesData.map((tile) => [tile.id, tile]))
    const effectiveOrder = tileOrder.length ? tileOrder : tilesData.map((tile) => tile.id)

    return effectiveOrder
      .filter((tileId) => !hiddenTileIds.includes(tileId))
      .map((tileId) => tilesMap.get(tileId))
      .filter(Boolean)
  }, [tilesData, tileOrder, hiddenTileIds])

  if (loading) {
    return <DashboardTilesSkeleton count={8} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
      {orderedVisibleTiles.map((tile) => (
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
