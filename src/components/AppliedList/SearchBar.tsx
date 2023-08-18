import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import './index.css'
type Props = {
  onSearchResult: (ids: number[], keyword: string) => void
}

import trie from '@/libs/searchUtil'

export default function SearchBar({ onSearchResult }: Props) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      onSearchResult([], '')
    }

    const result = trie.searchByPrefix(e.target.value)
    if (result.length === 0) {
      onSearchResult([], e.target.value)
    }

    if (onSearchResult) {
      onSearchResult(result, e.target.value)
    }
  }

  return (
    <div className="searchBar">
      <input type="text" placeholder="Search" className="searchInput" onChange={handleSearch} />
      <div className="searchIcon">
        <SearchIcon />
      </div>
    </div>
  )
}
