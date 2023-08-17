import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import './index.css'
type Props = {
  onSearchResult: (ids: number[]) => void
}

import trie from '@/libs/searchUtil'

export default function SearchBar({ onSearchResult }: Props) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      onSearchResult([])
    }

    const result = trie.searchByPrefix(e.target.value)
    if (result.length === 0) {
      onSearchResult([])
    }

    if (onSearchResult) {
      onSearchResult(result)
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
