"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date?: Date
    setDate: (date?: Date) => void
    className?: string
    placeholder?: string
    disabled?: boolean
}

export function DatePicker({ date, setDate, className, placeholder = "Pick a date", disabled }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal h-[50px] rounded-xl bg-slate-50 border-slate-200 px-4 hover:bg-slate-100 transition-all",
                        !date && "text-slate-400",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {date ? (
                        <span className="text-slate-700 font-medium">{format(date, "PPP")}</span>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border border-slate-200" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
