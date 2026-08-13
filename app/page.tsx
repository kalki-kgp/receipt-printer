"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReceiptPrinter,
  type ReceiptFeedMotion,
  type ReceiptPrinterStage,
} from "@/components/receipt-printer";

const sponsors = [
  { amount: 25000, name: "Kagura Labs", tier: "Gold" },
  { amount: 12000, name: "Northwind Studio", tier: "Silver" },
  { amount: 6000, name: "Devanagari Type Co.", tier: "Bronze" },
];

const subtotal = sponsors.reduce((total, sponsor) => total + sponsor.amount, 0);
const platformFee = Math.round(subtotal * 0.05);
const total = subtotal - platformFee;

const currency = (value: number) => `₹${value.toLocaleString("en-IN")}.00`;

const statusLabels: Record<ReceiptPrinterStage, string> = {
  complete: "Payout settled",
  printing: "Printing sponsor receipt",
  processing: "Tallying sponsors",
};

export default function Home() {
  const [stage, setStage] = useState<ReceiptPrinterStage>("processing");
  const [feedMotion, setFeedMotion] = useState<ReceiptFeedMotion>("stepped");
  const [isDark, setIsDark] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((current) => {
      document.documentElement.classList.toggle("dark", !current);

      return !current;
    });
  }, []);

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
              PaperKnife
            </span>
            <span className="font-mono text-grayscale-8 text-xs dark:text-grayscale-11">
              #10241
            </span>
          </ReceiptPrinter.Header>
          <ReceiptPrinter.Screen>
            {/* `Status` derives its label from `stage` by default — children override it. */}
            <ReceiptPrinter.Status>{statusLabels[stage]}</ReceiptPrinter.Status>
          </ReceiptPrinter.Screen>
        </ReceiptPrinter.Machine>

        <ReceiptPrinter.Output>
          <ReceiptPrinter.Paper>
            <header className="text-center">
              <h1 className="font-semibold text-sm uppercase tracking-[0.2em]">
                PaperKnife
              </h1>
              <p className="mt-1 text-[0.625rem] uppercase tracking-widest opacity-60">
                paperknife.app · sponsors
              </p>
            </header>

            <div className="my-5 border-current border-t border-dashed opacity-30" />

            <dl className="space-y-3 text-xs">
              {sponsors.map((sponsor) => (
                <div className="flex justify-between gap-4" key={sponsor.name}>
                  <dt className="min-w-0">
                    <span className="block truncate">{sponsor.name}</span>
                    <span className="block text-[0.625rem] uppercase tracking-widest opacity-60">
                      {sponsor.tier}
                    </span>
                  </dt>
                  <dd className="tabular-nums">{currency(sponsor.amount)}</dd>
                </div>
              ))}
            </dl>

            <div className="my-5 border-current border-t border-dashed opacity-30" />

            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-4 opacity-70">
                <dt>Sponsors</dt>
                <dd className="tabular-nums">{currency(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4 opacity-70">
                <dt>Platform fee (5%)</dt>
                <dd className="tabular-nums">−{currency(platformFee)}</dd>
              </div>
              <div className="flex justify-between gap-4 pt-2 font-semibold text-sm">
                <dt>Payout</dt>
                <dd className="tabular-nums">{currency(total)}</dd>
              </div>
            </dl>

            <p className="mt-8 text-center text-[0.625rem] uppercase tracking-widest opacity-60">
              Thank you for backing PaperKnife
            </p>
          </ReceiptPrinter.Paper>
        </ReceiptPrinter.Output>
      </ReceiptPrinter.Root>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          className="rounded-full border border-grayscale-6 px-4 py-2 font-medium text-xs transition-colors hover:bg-grayscale-3 dark:border-grayscale-4"
          onClick={run}
          type="button"
        >
          Print again
        </button>
        <button
          className="rounded-full border border-grayscale-6 px-4 py-2 font-medium text-xs transition-colors hover:bg-grayscale-3 dark:border-grayscale-4"
          onClick={() =>
            setFeedMotion((current) =>
              current === "stepped" ? "smooth" : "stepped",
            )
          }
          type="button"
        >
          Feed: {feedMotion}
        </button>
        <button
          className="rounded-full border border-grayscale-6 px-4 py-2 font-medium text-xs transition-colors hover:bg-grayscale-3 dark:border-grayscale-4"
          onClick={toggleTheme}
          type="button"
        >
          Theme: {isDark ? "dark" : "light"}
        </button>
      </div>
    </main>
  );
}
