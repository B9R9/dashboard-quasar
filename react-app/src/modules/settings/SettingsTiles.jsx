import { useEffect, useMemo } from 'react'

import { DASHBOARD_TILES_DATA } from '../dashboard/hooks/useDashboardTiles'
import useTilePreferencesStore from '../../stores/tilePreferences.store'

import TileSettingsRow from './TileSettingsRow'

export default function SettingsTiles() {
  const { tileOrder, hiddenTileIds, syncTiles, moveUpTile, moveDownTile, toggleTileVisibility } =
    useTilePreferencesStore()

  useEffect(() => {
    syncTiles(DASHBOARD_TILES_DATA.map((tile) => tile.id))
  }, [syncTiles])

  const orderedTiles = useMemo(() => {
    const tilesMap = new Map(DASHBOARD_TILES_DATA.map((tile) => [tile.id, tile]))
    const fallbackOrder = DASHBOARD_TILES_DATA.map((tile) => tile.id)
    const effectiveOrder = tileOrder.length ? tileOrder : fallbackOrder

    return effectiveOrder.map((tileId) => tilesMap.get(tileId)).filter(Boolean)
  }, [tileOrder])

  return (
    <div className="settings-tiles">
      <h3 className="settings-tiles__title">Dashboard Tiles</h3>
      <small className="settings-tiles__description">
        Reorder tiles and control visibility. Hidden tiles are not shown on the dashboard.
      </small>

      <div className="p-4">
        {orderedTiles.map((tile, index) => (
          <TileSettingsRow
            key={tile.id}
            id={tile.id}
            title={tile.title}
            visible={!hiddenTileIds.includes(tile.id)}
            isFirst={index === 0}
            isLast={index === orderedTiles.length - 1}
            moveUpTile={moveUpTile}
            moveDownTile={moveDownTile}
            toggleTileVisibility={toggleTileVisibility}
          />
        ))}
      </div>
    </div>
  )
}
