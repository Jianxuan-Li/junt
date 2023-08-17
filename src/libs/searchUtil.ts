/* use trie to search */
import { appliedJob } from '@/types'

class TrieNode {
  children: Map<string, TrieNode>
  rowIds: Map<number, boolean>
  isEnd: boolean
  constructor() {
    this.children = new Map()
    this.isEnd = false
  }
}

class Trie {
  root: TrieNode
  constructor() {
    this.root = new TrieNode()
  }

  insert(word: string, rowId: number) {
    let node = this.root
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase()
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode())
      }
      node = node.children.get(char)!
      if (!node.rowIds) {
        node.rowIds = new Map()
      }
      node.rowIds.set(rowId, true)
    }
    node.isEnd = true
  }

  search(word: string) {
    let node = this.root
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase()
      if (!node.children.has(char)) {
        return false
      }
      node = node.children.get(char)!
    }
    return node.isEnd
  }

  startsWith(prefix: string) {
    let node = this.root
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i].toLowerCase()
      if (!node.children.has(char)) {
        return false
      }
      node = node.children.get(char)!
    }
    return true
  }

  searchByPrefix(prefix: string) {
    let node = this.root
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i].toLowerCase()
      if (!node.children.has(char)) {
        return []
      }
      node = node.children.get(char)!
    }
    if (!node.rowIds) {
      return []
    }
    return Array.from(node.rowIds.keys())
  }
}

const trie = new Trie()

export const clearTrie = () => {
  trie.root = new TrieNode()
}

export const initTrie = (appliedList: appliedJob[]) => {
  clearTrie()

  appliedList.forEach((job) => {
    trie.insert(job.company, job.id)
  })
}

export default trie
