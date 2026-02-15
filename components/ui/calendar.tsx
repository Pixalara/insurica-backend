"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import "react-day-picker/style.css"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    const defaultClassNames = getDefaultClassNames()

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            captionLayout="dropdown"
            startMonth={new Date(1930, 0)}
            endMonth={new Date(2080, 11)}
            className={cn("rdp-calendar-custom p-4", className)}
            classNames={{
                root: `${defaultClassNames.root} rounded-xl`,
                month_caption: `${defaultClassNames.month_caption}`,
                caption_label: `${defaultClassNames.caption_label}`,
                dropdowns: `${defaultClassNames.dropdowns}`,
                nav: `${defaultClassNames.nav}`,
                button_previous: `${defaultClassNames.button_previous}`,
                button_next: `${defaultClassNames.button_next}`,
                chevron: `${defaultClassNames.chevron}`,
                weekdays: `${defaultClassNames.weekdays}`,
                weekday: `${defaultClassNames.weekday}`,
                week: `${defaultClassNames.week}`,
                day: `${defaultClassNames.day}`,
                day_button: `${defaultClassNames.day_button}`,
                today: `${defaultClassNames.today}`,
                selected: `${defaultClassNames.selected}`,
                outside: `${defaultClassNames.outside}`,
                disabled: `${defaultClassNames.disabled}`,
                hidden: `${defaultClassNames.hidden}`,
                ...classNames,
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
