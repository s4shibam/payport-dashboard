'use client'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { EVENT_MODES } from '@/lib/constants'
import { capitalize } from '@/lib/utils'
import type { TEventMode } from '@/types'

type TModeSelectorProps = {
  value: TEventMode
  onChange: (mode: TEventMode) => void
}

export const ModeSelector = ({ value, onChange }: TModeSelectorProps) => {
  return (
    <Combobox
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as TEventMode)
      }}
      items={EVENT_MODES}
      itemToStringLabel={capitalize}
    >
      <ComboboxInput
        placeholder="Select mode…"
        className="w-44 h-8"
        showTrigger
        readOnly
      />
      <ComboboxContent>
        <ComboboxList>
          {EVENT_MODES.map((mode) => (
            <ComboboxItem key={mode} value={mode}>
              <span className="capitalize">{capitalize(mode)}</span>
            </ComboboxItem>
          ))}
          <ComboboxEmpty>No modes found.</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
