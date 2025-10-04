"use client"

import { File, Folder, ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"

interface FileTreeProps {
  files: string[]
  selectedFile: string
  onFileSelect: (path: string) => void
}

interface TreeNode {
  name: string
  path: string
  type: "file" | "folder"
  children?: TreeNode[]
}

function buildTree(files: string[]): TreeNode[] {
  const root: TreeNode[] = []

  files.forEach((filePath) => {
    const parts = filePath.split("/")
    let currentLevel = root
    let currentPath = ""

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part
      const isFile = index === parts.length - 1

      let node = currentLevel.find((n) => n.name === part)

      if (!node) {
        node = {
          name: part,
          path: currentPath,
          type: isFile ? "file" : "folder",
          children: isFile ? undefined : [],
        }
        currentLevel.push(node)
      }

      if (!isFile && node.children) {
        currentLevel = node.children
      }
    })
  })

  return root
}

function TreeItem({
  node,
  selectedFile,
  onFileSelect,
  level = 0,
}: {
  node: TreeNode
  selectedFile: string
  onFileSelect: (path: string) => void
  level?: number
}) {
  const [isOpen, setIsOpen] = useState(true)
  const isSelected = node.path === selectedFile

  if (node.type === "file") {
    return (
      <button
        onClick={() => onFileSelect(node.path)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-secondary/50 transition-colors ${
          isSelected ? "bg-secondary text-secondary-foreground" : "text-foreground/80"
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        <File className="w-4 h-4 flex-shrink-0" />
        <span className="truncate font-mono text-xs">{node.name}</span>
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-secondary/50 transition-colors text-foreground/80"
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        )}
        <Folder className="w-4 h-4 flex-shrink-0" />
        <span className="truncate font-mono text-xs">{node.name}</span>
      </button>
      {isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FileTree({ files, selectedFile, onFileSelect }: FileTreeProps) {
  const tree = buildTree(files)

  return (
    <div className="h-full overflow-auto bg-surface-50/30 border-r border-border">
      <div className="p-3 border-b border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Project Files</h3>
      </div>
      <div className="py-2">
        {tree.map((node) => (
          <TreeItem key={node.path} node={node} selectedFile={selectedFile} onFileSelect={onFileSelect} />
        ))}
      </div>
    </div>
  )
}
