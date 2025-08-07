"use client"

import { useEffect, useState } from "react"
import { Option, OptionType } from "@/types/db"
import { OptionCard } from "@/components/OptionCard"
import { OptionModal } from "@/components/OptionModal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const OPTION_TYPES: OptionType[] = ["slice", "wrap", "addition"]

export default function AdminOptionPage() {
  const [options, setOptions] = useState<Option[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Option | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [optionToDelete, setOptionToDelete] = useState<number | null>(null)

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
        : [...prev, updated],
    )
    handleModalClose()
  }

  const confirmDelete = () => {
    if (optionToDelete !== null) {
      handleDelete(optionToDelete)
    }
  }

  const handleDelete = async (optionId: number) => {
    const res = await fetch(`/api/options/${optionId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setOptions((prev) => prev.filter((o) => o.option_id !== optionId))
      handleModalClose()
      setIsAlertOpen(false)
      setOptionToDelete(null)
    } else {
      console.error("Failed to delete option")
    }
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Option Management</CardTitle>
          <Button
            onClick={() => {
              setEditTarget(null)
              setShowModal(true)
            }}
          >
            Add Option
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {OPTION_TYPES.map((type) => (
              <section key={type}>
                <h2 className="text-xl font-semibold mb-4 capitalize">
                  {type}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {options
                    .filter((option) => option.type === type)
                    .map((option) => (
                      <OptionCard
                        key={option.option_id}
                        option={option}
                        onClick={() => {
                          setEditTarget(option)
                          setShowModal(true)
                        }}
                        onDelete={() => {
                          setOptionToDelete(option.option_id)
                          setIsAlertOpen(true)
                        }}
                      />
                    ))}
                </div>
              </section>
            ))}
          </div>
        </CardContent>
      </Card>

      <OptionModal
        open={showModal}
        onClose={handleModalClose}
        initial={editTarget}
        onSuccess={handleAddUpdate}
        onDeleteTrigger={() => {
          setOptionToDelete(editTarget!.option_id)
          setIsAlertOpen(true)
        }}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              option.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOptionToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
