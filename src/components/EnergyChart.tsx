import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECharts, EChartsCoreOption } from 'echarts/core'
import type { SimulationPoint } from '../types'
import { formatNumber } from '../utils/format'

echarts.use([GridComponent, TooltipComponent, DataZoomComponent, LineChart, CanvasRenderer])

type EnergyChartProps = {
  points: SimulationPoint[]
}

export function EnergyChart({ points }: EnergyChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<ECharts | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    chartRef.current = echarts.init(containerRef.current)
    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.resize()
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    const option: EChartsCoreOption = {
      color: ['#d97706'],
      grid: { left: 58, right: 24, top: 28, bottom: 78 },
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: (params: unknown) => {
          const param = (Array.isArray(params) ? params[0] : params) as {
            dataIndex?: number
          }
          const point =
            typeof param.dataIndex === 'number' ? points[param.dataIndex] : undefined

          if (!point) {
            return ''
          }

          return [
            `<strong>Track ${point.trackIndex}</strong>`,
            `Elevation: ${formatNumber(point.elevation)} m`,
            `Length: ${formatNumber(point.trackLength)} km`,
            `Bending: ${formatNumber(point.bending, 2)}`,
            `Electricity: ${formatNumber(point.electricityUsage, 2)} kWh`,
            `Cumulative distance: ${formatNumber(point.cumulativeDistance)} km`,
          ].join('<br />')
        },
      },
      xAxis: {
        type: 'category',
        name: 'Distance / track progression',
        nameLocation: 'middle',
        nameGap: 42,
        boundaryGap: false,
        data: points.map(
          (point) => `${formatNumber(point.cumulativeDistance)} km (T${point.trackIndex})`,
        ),
        axisLabel: { color: '#475569', hideOverlap: true },
        axisLine: { lineStyle: { color: '#cbd5e1' } },
      },
      yAxis: {
        type: 'value',
        name: 'Electricity usage (kWh)',
        nameTextStyle: { color: '#475569', align: 'left' },
        axisLabel: {
          color: '#475569',
          formatter: (value: number) => formatNumber(value),
        },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
      },
      dataZoom: [
        { type: 'inside', minSpan: 20 },
        { type: 'slider', height: 24, bottom: 20 },
      ],
      series: [
        {
          type: 'line',
          name: 'Electricity usage',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          data: points.map((point) => Number(point.electricityUsage.toFixed(2))),
          lineStyle: { width: 3 },
          areaStyle: { opacity: 0.12 },
        },
      ],
    }

    chartRef.current.setOption(option, true)
  }, [points])

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Electricity usage</h2>
          <p className="mt-1 text-sm text-slate-500">
            Track segment consumption by distance progression.
          </p>
        </div>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {points.length} segments
        </span>
      </div>
      <div className="relative mt-4 h-[420px] w-full">
        <div ref={containerRef} className="h-full w-full" />
        {points.length === 0 ? (
        <div className="absolute inset-0 grid place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          Run a simulation to render the energy curve.
        </div>
        ) : null}
      </div>
    </div>
  )
}
