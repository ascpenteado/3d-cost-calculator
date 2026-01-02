export type CalculatorInput = {
  spoolPrice: number;
  spoolWeight: number;
  filamentUsed: number;
  powerDraw: number;
  printTimeHours: number;
  electricityPrice: number;
  machineRate: number;
  riskBufferPercent: number;
  laborHours: number;
  laborRate: number;
  markupMultiplier: number;
  currency: string;
  label: string;
};

export type CalculatorResult = {
  materialCost: number;
  energyCost: number;
  machineCost: number;
  laborCost: number;
  riskCost: number;
  totalCost: number;
  salePrice: number;
  subtotal: number;
};

export function calculateCosts(input: CalculatorInput): CalculatorResult {
  const materialCost =
    input.spoolWeight > 0
      ? (input.filamentUsed / input.spoolWeight) * input.spoolPrice
      : 0;
  const energyCost =
    input.powerDraw > 0 && input.printTimeHours > 0
      ? input.powerDraw * input.printTimeHours * input.electricityPrice
      : 0;
  const machineCost = input.machineRate * input.printTimeHours;
  const laborCost = input.laborHours * input.laborRate;

  const subtotal = materialCost + energyCost + machineCost + laborCost;
  const riskCost = subtotal * (input.riskBufferPercent / 100);
  const totalCost = subtotal + riskCost;
  const salePrice = totalCost * input.markupMultiplier;

  return {
    materialCost,
    energyCost,
    machineCost,
    laborCost,
    riskCost,
    totalCost,
    salePrice,
    subtotal,
  };
}

export type SavedEstimate = {
  id: string;
  name: string;
  createdAt: string;
  input: CalculatorInput;
  result: CalculatorResult;
};
