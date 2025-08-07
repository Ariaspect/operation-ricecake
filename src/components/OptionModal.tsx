"use client"

import { useEffect, useState } from "react"
import { Option, OptionType } from "@/types/db"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface OptionModalProps {
  open: boolean
  onClose: () => void
  initial: Option | null
  onSuccess: (option: Option) => void
  onDeleteTrigger: (optionId: number) => void
}

export function OptionModal({
  open,
  onClose,
  initial,
  onSuccess,
  onDeleteTrigger,
}: OptionModalProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<OptionType>("slice")
  const [price, setPrice] = useState(0)

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setType(initial.type)
      setPrice(initial.price)
    } else {
      setName("")
      setType("slice")
      setPrice(0)
    }
  }, [initial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(
      `/api/options${initial ? `/${initial.option_id}` : ""}`,
      {
        method: initial ? "PUT" : "POST",
        body: JSON.stringify({ name, type, price }),
      }
    )

    if (res.ok) {
      const option = await res.json()
      onSuccess(option)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "옵션 수정" : "옵션 추가"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2">
            <label>종류</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as OptionType)}
              className="p-2 border rounded-md"
            >
              <option value="slice">slice</option>
              <option value="wrap">wrap</option>
              <option value="addition">addition</option>
            </select>
          </div>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
          <div className="flex justify-end gap-2">
            {initial && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => onDeleteTrigger(initial.option_id)}
              >
                삭제
              </Button>
            )}
            <Button type="submit">{initial ? "수정" : "추가"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
