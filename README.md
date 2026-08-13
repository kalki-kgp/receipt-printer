# reciept-printer

A compound React component that animates a thermal receipt printer: a plastic machine
body, a status screen, and a paper roll that feeds out line-by-line as it "prints".

Built for Next.js (App Router) with Tailwind CSS v4 and `motion/react`.

## Usage

```tsx
"use client";

import { useEffect, useState } from "react";
import {
  ReceiptPrinter,
  type ReceiptPrinterStage,
} from "@/components/receipt-printer";

export function OrderReceipt() {
  const [stage, setStage] = useState<ReceiptPrinterStage>("processing");

  useEffect(() => {
    const toPrinting = setTimeout(() => setStage("printing"), 1200);
    const toComplete = setTimeout(() => setStage("complete"), 3000);

    return () => {
      clearTimeout(toPrinting);
      clearTimeout(toComplete);
    };
  }, []);

  return (
    <ReceiptPrinter.Root feedMotion="stepped" stage={stage}>
      <ReceiptPrinter.Machine>
        <ReceiptPrinter.Header>
          <span className="font-medium text-xs">Order #10241</span>
        </ReceiptPrinter.Header>
        <ReceiptPrinter.Screen>
          <ReceiptPrinter.Status />
        </ReceiptPrinter.Screen>
      </ReceiptPrinter.Machine>

      <ReceiptPrinter.Output>
        <ReceiptPrinter.Paper>
          <h2 className="text-center text-sm uppercase">Receipt</h2>
          <p className="mt-4 text-xs">1x Filter coffee — ₹180</p>
          <p className="text-xs">1x Croissant — ₹220</p>
          <p className="mt-4 text-xs">Total — ₹400</p>
        </ReceiptPrinter.Paper>
      </ReceiptPrinter.Output>
    </ReceiptPrinter.Root>
  );
}
```

## API

### `ReceiptPrinter.Root`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `stage` | `"processing" \| "printing" \| "complete"` | — | Current printer state. Required. |
| `feedMotion` | `"stepped" \| "smooth"` | `"stepped"` | Stepped feeds the paper one line at a time; smooth eases it out in one motion. |
| `animate` | `boolean` | `true` | Set to `false` to disable all stage transitions. |

Also accepts every `<section>` prop. `aria-label` defaults to `"Receipt printer"`.

### Other parts

- `ReceiptPrinter.Machine` — printer chassis, includes the paper slot. Renders a `<div>`.
- `ReceiptPrinter.Header` — top strip of the chassis, for a title or order number.
- `ReceiptPrinter.Screen` — inset dark display panel.
- `ReceiptPrinter.Status` — spinner/check icon plus an `aria-live` label. Defaults to a
  label derived from `stage`; pass children to override.
- `ReceiptPrinter.Output` — masks and drives the paper feed animation.
- `ReceiptPrinter.Paper` — the receipt itself, clipped with a torn zig-zag edge. Renders
  an `<article>`.

Everything except `Root` must be rendered inside `ReceiptPrinter.Root` — the parts read
stage and motion settings from context and throw otherwise.

## Requirements

- `react` 19
- `motion` (`motion/react`)
- `@phosphor-icons/react`
- Tailwind CSS v4

The component also expects a few project-level things:

- A `cn` class-merge helper at `@/helpers/classname-helper`.
- Tailwind theme colors `grayscale-1` … `grayscale-12` and `green-9`, with matching
  `--color-grayscale-*` CSS variables (the shadows use `color-mix()` on them directly).
- Two texture files served from `public/`: `/textures/plastic-noise.svg` and
  `/textures/receipt-paper.svg`. Without them the component still renders — the surfaces
  just lose their grain.

Motion respects `prefers-reduced-motion`: the paper appears in place instead of feeding.
