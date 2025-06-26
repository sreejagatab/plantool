export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: string[];
  image?: string;
  price?: number;
}

export interface EquipmentCategory {
  name: string;
  description: string;
  icon: string;
}

export declare const equipment: EquipmentItem[];
export declare const equipmentCategories: Record<string, EquipmentCategory>;
