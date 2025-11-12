export interface ChildOrphanageDto {
  Id: number;
  child_id: number;
  orphanage_id: number;
  EntryDate: string; // ISO date
  ExitDate?: string | null; // ISO date or null
}
