"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReceiptPrinter,
  type ReceiptFeedMotion,
  type ReceiptPrinterStage,
} from "@/components/receipt-printer";

const lineItems = [
  { name: "Filter coffee", price: 180, quantity: 2 },
  { name: "Butter croissant", price: 220, quantity: 1 },
  { name: "Masala omelette", price: 260, quantity: 1 },
];

const subtotal = lineItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0,
);
const tax = Math.round(subtotal * 0.05);
const total = subtotal + tax;

const currency = (value: number) => `₹${value.toLocaleString("en-IN")}.00`;

export default function Home() {
  const [stage, setStage] = useState<ReceiptPrinterStage>("processing");
  const [feedMotion, setFeedMotion] = useState<ReceiptFeedMotion>("stepped");
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = useCallback(() => {
    for (const timeout of timeouts.current) {
      clearTimeout(timeout);
    }

    setStage("processing");
    timeouts.current = [
      setTimeout(() => setStage("printing"), 1400),
      setTimeout(() => setStage("complete"), 3300),
    ];
  }, []);

  useEffect(() => {
    run();

    return () => {
      for (const timeout of timeouts.current) {
        clearTimeout(timeout);
      }
    };
  }, [run]);

  return (
    <main className="flex min-h-dvh flex-col items-center gap-10 px-6 py-16">
      <ReceiptPrinter.Root feedMotion={feedMotion} stage={stage}>
        <ReceiptPrinter.Machine>
          <ReceiptPrinter.Header>
            <span className="font-medium text-grayscale-1 text-xs uppercase tracking-widest dark:text-grayscale-12">
              Pixel Chutney Café
            </span>
            <span className="font-mono text-grayscale-8 text-xs dark:text-grayscale-11">
              #10241
            </span>
          </ReceiptPrinter.Header>
          <ReceiptPrinter.Screen>
            <ReceiptPrinter.Status />
          </ReceiptPrinter.Screen>
        </ReceiptPrinter.Machine>

        <ReceiptPrinter.Output>
          <ReceiptPrinter.Paper>
            <header className="text-center">
              <h1 className="font-semibold text-sm uppercase tracking-[0.2em]">
                Pixel Chutney
              </h1>
              <p className="mt-1 text-[0.625rem] uppercase tracking-widest opacity-60">
                Banjara Hills · Hyderabad
              </p>
            </header>

            <div className="my-5 border-current border-t border-dashed opacity-30" />

            <dl className="space-y-2 text-xs">
              {lineItems.map((item) => (
                <div className="flex justify-between gap-4" key={item.name}>
                  <dt className="truncate">
                    {item.quantity} × {item.name}
                  </dt>
                  <dd className="tabular-nums">
                    {currency(item.price * item.quantity)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="my-5 border-current border-t border-dashed opacity-30" />

            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-4 opacity-70">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{currency(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4 opacity-70">
                <dt>GST (5%)</dt>
                <dd className="tabular-nums">{currency(tax)}</dd>
              </div>
              <div className="flex justify-between gap-4 pt-2 font-semibold text-sm">
                <dt>Total</dt>
                <dd className="tabular-nums">{currency(total)}</dd>
              </div>
            </dl>

            <p className="mt-8 text-center text-[0.625rem] uppercase tracking-widest opacity-60">
              Thank you · Come again
            </p>
          </ReceiptPrinter.Paper>
        </ReceiptPrinter.Output>
      </ReceiptPrinter.Root>

      <div className="flex items-center gap-2">
        <button
          className="rounded-full border border-grayscale-6 px-4 py-2 font-medium text-xs transition-colors hover:bg-grayscale-3 dark:border-grayscale-4 dark:hover:bg-grayscale-3"
          onClick={run}
          type="button"
        >
          Print again
        </button>
        <button
          className="rounded-full border border-grayscale-6 px-4 py-2 font-medium text-xs transition-colors hover:bg-grayscale-3 dark:border-grayscale-4 dark:hover:bg-grayscale-3"
          onClick={() =>
            setFeedMotion((current) =>
              current === "stepped" ? "smooth" : "stepped",
            )
          }
          type="button"
        >
          Feed: {feedMotion}
        </button>
      </div>
    </main>
  );
}
