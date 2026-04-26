/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoodItem, WasteEntry } from '../types';

const STORAGE_KEYS = {
  FOOD_ITEMS: 'foodwise_inventory',
  WASTE_LOG: 'foodwise_log',
};

export const Storage = {
  getInventory: (): FoodItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    return data ? JSON.parse(data) : [];
  },

  setInventory: (items: FoodItem[]) => {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items));
  },

  getLog: (): WasteEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.WASTE_LOG);
    return data ? JSON.parse(data) : [];
  },

  addLogEntry: (entry: WasteEntry) => {
    const log = Storage.getLog();
    log.push(entry);
    localStorage.setItem(STORAGE_KEYS.WASTE_LOG, JSON.stringify(log));
  },

  deleteItem: (id: string) => {
    const inventory = Storage.getInventory();
    Storage.setInventory(inventory.filter(item => item.id !== id));
  }
};
