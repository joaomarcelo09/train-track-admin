import { useEffect } from 'react'
import { useLineStore } from '../stores/lineStore'
import { useTrackStore } from '../stores/trackStore'
import { useTrainStore } from '../stores/trainStore'

export function useBootstrapData() {
  const fetchTrains = useTrainStore((state) => state.fetchTrains)
  const fetchLines = useLineStore((state) => state.fetchLines)
  const fetchTracks = useTrackStore((state) => state.fetchTracks)

  useEffect(() => {
    void fetchTrains()
    void fetchLines()
    void fetchTracks()
  }, [fetchLines, fetchTracks, fetchTrains])
}
