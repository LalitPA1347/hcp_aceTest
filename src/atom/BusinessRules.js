import { atom } from "jotai";

// Create an atom to store fetched data, initialized with an object containing empty arrays
export const fetchDataAtom = atom({
  selectedIndication: "",
  selectedVersion: "",
  indication: [],
  version: [],
  productName: [],
  diagnosisCode: [],
  metastaticCode: [],
  surgeryCode: [],
  finalVersionName: [],
  dayDiff:0,
  LOT:[],
  testingCode:[],
  comorbidCode:[],
});

export const addPopupDataAtom = atom({
  allProducts: [],
  diagnosisCode: [],
  metastaticCode: [],
  surgeryCode: [],
});

export const addedDataAtom = atom({
  products: [],
  diagnosisCode: [],
  surgeryCode: [],
  metastaticCode: [],
});

export const deleteDataAtom = atom({
  products: [],
  diagnosisCode: [],
  surgeryCode: [],
  metastaticCode: [],
});

export const ndcProcedureCodeAtom = atom({
  productName: "Select the Product Name",
  ndcCode: [],
  procedureCode: [],
});

export const toggleAtom = atom(true);

export const allTestingCodeRules = atom([]); 
export const allComorbidCodeRules = atom([]); 
