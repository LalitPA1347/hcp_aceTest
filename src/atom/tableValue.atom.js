import { atom } from "jotai";

//............ segmentation Atom

export const segmentationDataAtom = atom({
  indicationVersion: [],
  indication: [],
  product: [],
  version: [],
  selectedValues: [],
  RegimenCategoryRuleList: [],
  SegmentCategoryRuleList: [],
  MetRuleList: [],
  RegimenCategoryList: [],
  LotList: [],
  LOT:[]
});

export const createdRegimenRulesAtom = atom({ added: [], deleted: [] });
export const createdSegmentRulesAtom = atom({ added: [], deleted: [] });
export const createdProgressionRulesAtom = atom({ added: [], deleted: [] });
export const createdProgressionDataAtom = atom([]);
export const segmentationIndicationValue = atom({
  indication: "",
  version: "",
});
export const regimenListAtom = atom([]);
export const segmentListAtom = atom([]);
export const matRuleListAtom = atom([]);
export const progressionDaysAtom = atom({ AtoA: "", AtoB: "" });

