"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalculatorInput,
  calculateCosts,
  SavedEstimate,
} from "@/lib/calculations";
import {
  loadHistory,
  loadInput,
  persistHistory,
  persistInput,
} from "@/lib/storage";

const defaultInput: CalculatorInput = {
  spoolPrice: 120,
  spoolWeight: 1000,
  filamentUsed: 85,
  powerDraw: 0.12,
  printTimeHours: 6,
  electricityPrice: 0.9,
  machineRate: 3,
  riskBufferPercent: 15,
  laborHours: 0.5,
  laborRate: 40,
  markupMultiplier: 2,
  currency: "R$",
  label: "Sample part",
};

const markupPresets = [
  { label: "Friends / hobby (1.2×)", value: 1.2 },
  { label: "Online sales (1.8×)", value: 1.8 },
  { label: "Premium / rush (3×)", value: 3 },
];

function formatCurrency(value: number, currency: string) {
  const sanitized = currency.trim() || "$";
  return `${sanitized}${value.toFixed(2)}`;
}

export default function Home() {
  const [input, setInput] = useState<CalculatorInput>(defaultInput);
  const [history, setHistory] = useState<SavedEstimate[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedInput = loadInput();
    const storedHistory = loadHistory();
    if (storedInput) setInput(storedInput);
    if (storedHistory.length) setHistory(storedHistory);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistInput(input);
  }, [hydrated, input]);

  const result = useMemo(() => calculateCosts(input), [input]);

  const handleChange = (
    key: keyof CalculatorInput,
    value: string | number,
  ) => {
    const numericKeys: Array<keyof CalculatorInput> = [
      "spoolPrice",
      "spoolWeight",
      "filamentUsed",
      "powerDraw",
      "printTimeHours",
      "electricityPrice",
      "machineRate",
      "riskBufferPercent",
      "laborHours",
      "laborRate",
      "markupMultiplier",
    ];

    setInput((prev) => ({
      ...prev,
      [key]: numericKeys.includes(key) ? Number(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`;

    const entry: SavedEstimate = {
      id,
      name: input.label || "Untitled",
      createdAt: now,
      input,
      result,
    };

    const nextHistory = [entry, ...history].slice(0, 12);
    setHistory(nextHistory);
    persistHistory(nextHistory);
  };

  const handleLoad = (estimate: SavedEstimate) => {
    setInput(estimate.input);
  };

  const handleDelete = (id: string) => {
    const nextHistory = history.filter((item) => item.id !== id);
    setHistory(nextHistory);
    persistHistory(nextHistory);
  };

  const totalLabel = formatCurrency(result.totalCost, input.currency);
  const saleLabel = formatCurrency(result.salePrice, input.currency);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          3D Print Cost Calculator
        </p>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Price your prints with confidence.
          </h1>
          <div className="flex flex-wrap gap-2">
            {markupPresets.map((item) => (
              <button
                key={item.value}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                  input.markupMultiplier === item.value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                }`}
                onClick={() => handleChange("markupMultiplier", item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <p className="max-w-3xl text-slate-600">
          Capture every hidden cost: filament, energy, machine wear, failure
          risk, labor, and markup. Data stays on your device via localStorage.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="section-title">Input</h2>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <label className="input-label" htmlFor="currency">
                  Currency
                </label>
                <input
                  id="currency"
                  value={input.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-20 rounded-md border border-slate-200 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  aria-label="Currency symbol"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
            <InputCard title="Material">
              <TextInput
                label="Project / part name"
                value={input.label}
                onChange={(value) => handleChange("label", value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <NumberInput
                  label="Spool price"
                  value={input.spoolPrice}
                  prefix={input.currency}
                  min={0}
                  onChange={(value) => handleChange("spoolPrice", value)}
                />
                <NumberInput
                  label="Spool weight"
                  value={input.spoolWeight}
                  suffix="g"
                  min={0}
                  onChange={(value) => handleChange("spoolWeight", value)}
                />
              </div>
              <NumberInput
                label="Filament used"
                value={input.filamentUsed}
                suffix="g"
                min={0}
                onChange={(value) => handleChange("filamentUsed", value)}
                helper="Copy this from your slicer."
              />
            </InputCard>

            <InputCard title="Electricity">
              <NumberInput
                label="Printer power draw"
                value={input.powerDraw}
                suffix="kW"
                step="0.01"
                min={0}
                onChange={(value) => handleChange("powerDraw", value)}
                helper="Average draw (e.g., 0.12 kW for a Bambu A1 Mini)."
              />
              <NumberInput
                label="Print time"
                value={input.printTimeHours}
                suffix="hours"
                step="0.1"
                min={0}
                onChange={(value) => handleChange("printTimeHours", value)}
              />
              <NumberInput
                label="Energy price"
                value={input.electricityPrice}
                prefix={input.currency}
                step="0.01"
                min={0}
                onChange={(value) => handleChange("electricityPrice", value)}
              />
            </InputCard>

            <InputCard title="Machine & Risk">
              <NumberInput
                label="Machine rate"
                value={input.machineRate}
                prefix={input.currency}
                step="0.1"
                min={0}
                onChange={(value) => handleChange("machineRate", value)}
                helper="Covers wear, consumables, and depreciation."
              />
              <NumberInput
                label="Risk buffer"
                value={input.riskBufferPercent}
                suffix="%"
                step="1"
                min={0}
                max={50}
                onChange={(value) => handleChange("riskBufferPercent", value)}
                helper="Protects against failed prints (10–20% is typical)."
              />
            </InputCard>

            <InputCard title="Labor & Markup">
              <div className="grid grid-cols-2 gap-4">
                <NumberInput
                  label="Labor hours"
                  value={input.laborHours}
                  step="0.25"
                  min={0}
                  onChange={(value) => handleChange("laborHours", value)}
                />
                <NumberInput
                  label="Labor rate"
                  value={input.laborRate}
                  prefix={input.currency}
                  step="1"
                  min={0}
                  onChange={(value) => handleChange("laborRate", value)}
                />
              </div>
              <NumberInput
                label="Markup multiplier"
                value={input.markupMultiplier}
                step="0.1"
                min={1}
                onChange={(value) => handleChange("markupMultiplier", value)}
                helper="Price = total cost × markup."
              />
            </InputCard>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <SummaryCard
            currency={input.currency}
            result={result}
            totalLabel={totalLabel}
            saleLabel={saleLabel}
          />
          <HistoryCard
            history={history}
            onSave={handleSave}
            onLoad={handleLoad}
            onDelete={handleDelete}
          />
        </div>
      </section>

      <section className="card grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
        <Stat
          title="Material"
          value={formatCurrency(result.materialCost, input.currency)}
          hint="(filament used ÷ spool weight) × spool price"
        />
        <Stat
          title="Energy"
          value={formatCurrency(result.energyCost, input.currency)}
          hint="power draw × hours × kWh price"
        />
        <Stat
          title="Machine time"
          value={formatCurrency(result.machineCost, input.currency)}
          hint="hours × machine rate"
        />
        <Stat
          title="Risk buffer"
          value={formatCurrency(result.riskCost, input.currency)}
          hint={`subtotal × ${input.riskBufferPercent}%`}
        />
        <Stat
          title="Labor"
          value={formatCurrency(result.laborCost, input.currency)}
          hint="labor hours × labor rate"
        />
        <Stat
          title="Subtotal"
          value={formatCurrency(result.subtotal, input.currency)}
          hint="material + energy + machine + labor"
        />
      </section>
    </main>
  );
}

type InputCardProps = {
  title: string;
  children: React.ReactNode;
};

function InputCard({ title, children }: InputCardProps) {
  return (
    <div className="card flex flex-col gap-4 border border-slate-100 p-5">
      <h3 className="section-title">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

type NumberInputProps = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: string | number;
  onChange: (value: number) => void;
  helper?: string;
};

function NumberInput({
  label,
  value,
  prefix,
  suffix,
  min,
  max,
  step,
  onChange,
  helper,
}: NumberInputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="input-label">{label}</span>
      <div className="flex items-center gap-2">
        {prefix ? (
          <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {prefix}
          </span>
        ) : null}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="input-field"
        />
        {suffix ? (
          <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {suffix}
          </span>
        ) : null}
      </div>
      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </label>
  );
}

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TextInput({ label, value, onChange }: TextInputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="input-label">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      />
    </label>
  );
}

type SummaryCardProps = {
  currency: string;
  totalLabel: string;
  saleLabel: string;
  result: ReturnType<typeof calculateCosts>;
};

function SummaryCard({
  currency,
  totalLabel,
  saleLabel,
  result,
}: SummaryCardProps) {
  return (
    <div className="card border border-slate-100">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="section-title">Totals</h2>
      </div>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Total cost (with risk)</p>
            <p className="text-3xl font-bold text-slate-900">{totalLabel}</p>
          </div>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
            Break-even
          </div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Sale price (after markup)</p>
            <p className="text-3xl font-bold text-emerald-700">{saleLabel}</p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
            Price to quote
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Material
            </p>
            <p className="font-semibold">
              {formatCurrency(result.materialCost, currency)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Energy
            </p>
            <p className="font-semibold">
              {formatCurrency(result.energyCost, currency)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Machine
            </p>
            <p className="font-semibold">
              {formatCurrency(result.machineCost, currency)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Risk
            </p>
            <p className="font-semibold">
              {formatCurrency(result.riskCost, currency)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Labor
            </p>
            <p className="font-semibold">
              {formatCurrency(result.laborCost, currency)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Subtotal
            </p>
            <p className="font-semibold">
              {formatCurrency(result.subtotal, currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type HistoryCardProps = {
  history: SavedEstimate[];
  onSave: () => void;
  onLoad: (estimate: SavedEstimate) => void;
  onDelete: (id: string) => void;
};

function HistoryCard({ history, onSave, onLoad, onDelete }: HistoryCardProps) {
  return (
    <div className="card flex flex-col border border-slate-100">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="section-title">Saved estimates</h2>
          <p className="text-sm text-slate-500">Stored locally on this device</p>
        </div>
        <button
          onClick={onSave}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Save current
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">
            No saved estimates yet. Save a calculation to reuse it later.
          </p>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <div>
                <p className="font-semibold text-slate-800">{entry.name}</p>
                <p className="text-xs text-slate-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLoad(entry)}
                  className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50"
                >
                  Load
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

type StatProps = {
  title: string;
  value: string;
  hint: string;
};

function Stat({ title, value, hint }: StatProps) {
  return (
    <div className="stat">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  );
}
