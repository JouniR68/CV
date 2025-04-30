// types.ts
export interface Training {
    Tavoite: string;
    Voimaharjoittelu: {
        liike: string[];
        sarja: number[];
        toisto: number[];
    };
}

export interface TrainingPlanData {
    plan: Training[];
}

export interface TrainingEntry {
    id: string;
    week: number;
    date: string;
    hour: number;
    training: string;
    details: string[];
    details_analyysi?: Analysis[];
    sarjat?: number[];
    toistot?: number[];
}

export interface Analysis {
    liike: string;
    analyysi: string;
    weights?: number[];
    unit1: number;
    unit2?: number;
    unit3?: number;
    unit4?: number;
    toistot?: number[];
}

export interface HeavyProps {
    liike: string;
    sarja?: number[];
    toisto?: number[];
    onAnswer: (
        liike: string,
        feedback: string,
        weights: number[],
        reps: number
    ) => void;
}
