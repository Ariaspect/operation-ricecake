"use client"

import { useEffect, useState } from "react"
import { Option } from "@/types/db"
import { OptionCard } from "@/components/OptionCard"
import { OptionModal } from "@/components/OptionModal"
import { Button } from "@/components/ui/button"

export default function AdminOptionPage() {
  const [options, setOptions] = useState<Option[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Option | null>(null)

  useEffect(() => {
    fetch("/api/options")
      .then((res) => res.json())
      .then(setOptions)
  }, [])

  const handleModalClose = () => {
    setShowModal(false)
    setTimeout(() => {
      setEditTarget(null)
    }, 150)
  }

  const handleAddUpdate = (updated: Option) => {
    setOptions((prev) =>
      editTarget
        ? prev.map((o) => (o.option_id === updated.option_id ? updated : o))
        : [...prev, updated]
    )
    handleModalClose()
  }

  const handleDelete = (optionId: number) => {
    setOptions((prev) => prev.filter((o) => o.option_id !== optionId))
    handleModalClose()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">옵션 관리</h1>
        <Button onClick={() => setShowModal(true)}>+ 옵션 추가</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option) => (
          <OptionCard
            key={option.option_id}
            option={option}
            onClick={() => {
              setEditTarget(option)
              setShowModal(true)
            }}
          />
        ))}
      </div>

      <OptionModal
        open={showModal}
        onClose={handleModalClose}
        initial={editTarget}
        onSuccess={handleAddUpdate}
        onDelete={handleDelete}
      />
    </>
  )
}
