import { useEffect, useState } from 'react'

export const DASHBOARD_TILES_DATA = [
  {
    id: 'orders',
    title: 'Orders',
    headline: '128 orders',
    trend: '+12% vs yesterday',
    period: 'Since this morning',
    updatedAt: '2026-02-20T14:20:00',
    stats: [
      { key: 'accepted', label: 'Accepted', value: 120, icon: 'check_circle' },
      { key: 'rejected', label: 'Rejected', value: 3, icon: 'cancel' },
      { key: 'cancelled', label: 'Cancelled', value: 5, icon: 'warning' },
      { key: 'acceptance', label: 'Acceptance', value: '94%', icon: 'query_stats' },
      { key: 'prep_time', label: 'Prep time', value: '14 min', icon: 'schedule' },
    ],
  },
  {
    id: 'revenue-finance',
    title: 'Revenue / Finance',
    headline: '€18,420',
    trend: '+6.2% vs yesterday',
    period: 'Today',
    updatedAt: '2026-02-20T14:20:00',
    stats: [
      { key: 'gmv', label: 'GMV', value: '€21,980', icon: 'payments' },
      {
        key: 'net_revenue',
        label: 'Net revenue',
        value: '€18,420',
        icon: 'account_balance_wallet',
      },
      { key: 'refunds', label: 'Refunds', value: '€240', icon: 'receipt_long' },
      { key: 'avg_basket', label: 'Avg basket', value: '€23.9', icon: 'shopping_bag' },
    ],
  },
  {
    id: 'performance-operations',
    title: 'Performance / Operations',
    headline: 'Ops score 91/100',
    trend: '+2.1 pts vs yesterday',
    period: 'Today',
    updatedAt: '2026-02-20T14:20:00',
    stats: [
      { key: 'accepted', label: 'Accepted orders', value: 412, icon: 'check_circle' },
      { key: 'rejected', label: 'Rejected orders', value: 14, icon: 'cancel' },
      { key: 'cancelled', label: 'Cancelled orders', value: 11, icon: 'warning' },
      { key: 'prep_time', label: 'Prep time', value: '13 min', icon: 'schedule' },
    ],
  },
  {
    id: 'visibility-ranking',
    title: 'Visibility / Ranking',
    headline: '#4 in category',
    trend: '+1 rank vs yesterday',
    period: 'Last 7 days',
    updatedAt: '2026-02-20T14:20:00',
    stats: [
      { key: 'impressions', label: 'Impressions', value: '42.8k', icon: 'visibility' },
      { key: 'search_rank', label: 'Search rank', value: '#4', icon: 'leaderboard' },
      { key: 'share', label: 'Category share', value: '12.4%', icon: 'pie_chart' },
    ],
  },
  {
    id: 'conversion',
    title: 'Conversion',
    headline: '4.9%',
    trend: '+0.6 pts vs yesterday',
    period: 'Today',
    updatedAt: '2026-02-20T14:20:00',
    stats: [
      { key: 'menu_views', label: 'Menu views', value: '8,320', icon: 'menu_book' },
      { key: 'cart_adds', label: 'Adds to cart', value: '1,240', icon: 'add_shopping_cart' },
      {
        key: 'checkout_rate',
        label: 'Checkout rate',
        value: '38%',
        icon: 'shopping_cart_checkout',
      },
    ],
  },
  {
    id: 'customer-experience',
    title: 'Customer Experience',
    headline: '4.6 / 5',
    trend: '-0.1 vs yesterday',
    period: 'Last 30 days',
    updatedAt: '2026-02-20T14:20:00',
    stats: [
      { key: 'rating', label: 'Avg rating', value: '4.6', icon: 'star' },
      { key: 'reviews', label: 'New reviews', value: 37, icon: 'reviews' },
      { key: 'response_time', label: 'Response time', value: '19 min', icon: 'support_agent' },
    ],
  },
  {
    id: 'store-status-availability',
    title: 'Store Status / Availability',
    headline: '99.2% online',
    trend: '+0.4 pts vs yesterday',
    period: 'Today',
    updatedAt: '2026-02-20T14:20:00',
    stats: [
      { key: 'uptime', label: 'Uptime', value: '99.2%', icon: 'cloud_done' },
      { key: 'paused_time', label: 'Paused time', value: '18 min', icon: 'pause_circle' },
      { key: 'stockouts', label: 'Stockouts', value: 6, icon: 'inventory_2' },
    ],
  },
  {
    id: 'time-based',
    title: 'Time-based',
    headline: 'Peak at 12:30',
    trend: 'Stable vs last week',
    period: 'Last 7 days',
    updatedAt: '2026-02-20T14:20:00',
    stats: [
      { key: 'lunch_share', label: 'Lunch share', value: '46%', icon: 'lunch_dining' },
      { key: 'dinner_share', label: 'Dinner share', value: '39%', icon: 'dinner_dining' },
      { key: 'late_night', label: 'Late night', value: '15%', icon: 'nightlife' },
    ],
  },
]

export default function useDashboardTiles() {
  const [tilesData, setTilesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTilesData(DASHBOARD_TILES_DATA)
      setLoading(false)
    }, 700)

    return () => clearTimeout(timer)
  }, [])

  return { tilesData, loading }
}
