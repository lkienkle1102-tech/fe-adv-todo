"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useTranslation } from "@/features/i18n/hooks/use-translation"
import {
  getMinimumScheduleDateTimeLocal,
  getScheduleTimeOptions,
  toDateTimeLocal,
} from "@/features/tasks/schedule"
import { cn } from "@/lib/utils"

export function TaskScheduleFields({
  idPrefix,
  defaultDueAt = null,
  disabled = false,
  invalid = false,
  showLabels = false,
  preserveInitialTime = false,
  className,
}: {
  idPrefix: string
  defaultDueAt?: string | null
  disabled?: boolean
  invalid?: boolean
  showLabels?: boolean
  preserveInitialTime?: boolean
  className?: string
}) {
  const { t } = useTranslation()
  const initialValue = toDateTimeLocal(defaultDueAt)
  const initialDate = initialValue.slice(0, 10)
  const initialTime = initialValue.slice(11, 16)
  const [now] = useState(() => new Date())
  const [dateValue, setDateValue] = useState(initialDate)
  const [timeValue, setTimeValue] = useState(initialTime)
  const minimumDate = getMinimumScheduleDateTimeLocal(now).slice(0, 10)
  const generatedOptions = getScheduleTimeOptions(dateValue, now)
  const timeOptions =
    dateValue === initialDate &&
    initialTime &&
    !generatedOptions.includes(initialTime) &&
    (preserveInitialTime ||
      new Date(`${initialDate}T${initialTime}`).getTime() > now.getTime())
      ? [...generatedOptions, initialTime].sort()
      : generatedOptions

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <div className="space-y-2">
        {showLabels && <Label htmlFor={`${idPrefix}-date`}>{t("dashboard.schedule.date")}</Label>}
        <Input
          id={`${idPrefix}-date`}
          type="date"
          min={minimumDate}
          value={dateValue}
          disabled={disabled}
          aria-label={t("dashboard.schedule.date")}
          aria-invalid={invalid}
          onChange={(event) => {
            setDateValue(event.currentTarget.value)
            setTimeValue("")
          }}
          className="h-11 rounded-xl border-[#dfe4ef] bg-[#f8f9fc] px-3 text-[#5e687f]"
        />
      </div>
      <div className="space-y-2">
        {showLabels && <Label htmlFor={`${idPrefix}-time`}>{t("dashboard.schedule.time")}</Label>}
        <NativeSelect
          id={`${idPrefix}-time`}
          value={timeValue}
          disabled={disabled || !dateValue}
          aria-label={t("dashboard.schedule.time")}
          aria-invalid={invalid}
          onChange={(event) => setTimeValue(event.currentTarget.value)}
          className="w-full [&_select]:h-11 [&_select]:rounded-xl [&_select]:border-[#dfe4ef] [&_select]:bg-[#f8f9fc]"
        >
          <NativeSelectOption value="">{t("dashboard.schedule.chooseTime")}</NativeSelectOption>
          {timeOptions.map((option) => (
            <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <input
        type="hidden"
        name="dueAt"
        value={dateValue && timeValue ? `${dateValue}T${timeValue}` : ""}
      />
    </div>
  )
}
