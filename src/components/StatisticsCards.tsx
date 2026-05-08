import { KpiCard } from './KpiCard'
import { GaugeIcon, LineIcon, RailIcon } from './Icons'
import type { SimulationSummary } from '../types'
import { formatNumber } from '../utils/format'

type StatisticsCardsProps = {
  summary: SimulationSummary | null
}

export function StatisticsCards({ summary }: StatisticsCardsProps) {
  const totalEnergy = summary ? `${formatNumber(summary.totalElectricityUsage, 2)} kWh` : '-'
  const totalLength = summary ? `${formatNumber(summary.totalLineLength)} km` : '-'
  const averageConsumption = summary
    ? `${formatNumber(summary.averageElectricityConsumption, 2)} kWh/km`
    : '-'
  const highestEnergy = summary?.highestEnergyPoint
    ? `Track ${summary.highestEnergyPoint.trackIndex}`
    : '-'
  const highestElevation = summary?.highestElevationPoint
    ? `Track ${summary.highestElevationPoint.trackIndex}`
    : '-'

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <KpiCard
        label="Total electricity"
        value={totalEnergy}
        detail="Full route usage"
        icon={<GaugeIcon />}
      />
      <KpiCard
        label="Total line length"
        value={totalLength}
        detail="Selected route length"
        icon={<LineIcon />}
      />
      <KpiCard
        label="Average consumption"
        value={averageConsumption}
        detail="Usage per kilometer"
        icon={<GaugeIcon />}
      />
      <KpiCard
        label="Highest energy point"
        value={highestEnergy}
        detail={
          summary?.highestEnergyPoint
            ? `${formatNumber(summary.highestEnergyPoint.electricityUsage, 2)} kWh`
            : 'Awaiting simulation'
        }
        icon={<RailIcon />}
      />
      <KpiCard
        label="Highest elevation"
        value={highestElevation}
        detail={
          summary?.highestElevationPoint
            ? `${formatNumber(summary.highestElevationPoint.elevation)} m`
            : 'Awaiting simulation'
        }
        icon={<RailIcon />}
      />
    </section>
  )
}
