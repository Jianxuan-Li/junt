import React, { useEffect } from 'react'
import { fetchAppliedList } from '@/libs/sync'
import { appliedJob } from '@/types'
import moment from 'moment'
import './index.css'
import SearchBar from './SearchBar'

type Props = {
  defaultAppliedList?: appliedJob[]
}

const formattedDateTime = (datetime: string) => {
  if (datetime.length === 10 || datetime.length === 16 || datetime.length === 19) {
    return moment(datetime).format('YYYY-MM-DD')
  }

  return ''
}

let originalAppliedList: appliedJob[] = []

export default function AppliedList({ defaultAppliedList }: Props) {
  const [appliedList, setAppliedList] = React.useState([])

  useEffect(() => {
    const getData = async () => {
      originalAppliedList = await fetchAppliedList()
      setAppliedList(originalAppliedList)
    }
    getData()
  }, [])

  useEffect(() => {
    if (defaultAppliedList && defaultAppliedList.length > 0) {
      originalAppliedList = defaultAppliedList
      setAppliedList(defaultAppliedList)
    }
  }, [defaultAppliedList])

  const handleSearchedResult = (ids: number[]) => {
    if (ids.length === 0) {
      setAppliedList(originalAppliedList)
      return
    }
    const idMap = new Map()
    ids.forEach((id) => idMap.set(id, true))
    const result = appliedList.filter((item) => idMap.has(item.id))
    setAppliedList(result)
  }

  return (
    <div className="applied">
      <SearchBar onSearchResult={handleSearchedResult} />
      <div className="appliedList">
        {appliedList.map((item, index) => (
          <div key={'applied_item_' + index} className="appliedItem">
            {item.datetime && formattedDateTime(item.datetime)} {item.company} {item.title && '-'} {item.title}
          </div>
        ))}
      </div>
    </div>
  )
}
