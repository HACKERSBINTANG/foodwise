/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FoodItem {
  id: string;
  name: string;
  quantity: number; // in grams or units
  unit: 'g' | 'unit' | 'kg' | 'portion';
  expiryDate: string;
  addedAt: string;
}

export interface WasteEntry {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'eaten' | 'thrown';
  date: string;
  reason?: string;
}

export interface Nudge {
  id: string;
  message: string;
  type: 'waste' | 'expiry' | 'tips' | 'stats';
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface EnvironmentalImpact {
  co2Saved: number; // in kg
  waterSaved: number; // in liters
  foodSaved: number; // in kg
}

export const CATEGORIES = [
  'Sayuran', 'Buah-buahan', 'Susu & Olahan', 'Daging', 'Biji-bijian', 'Lainnya'
];
