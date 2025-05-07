export interface ConfirmationDialogProps {
    exercise: string;
    open: boolean;
    onClose: () => void;
    onConfirm: (
        feedback: string,
        weights: number[],
        reps: number[],
        result: string[]
    ) => void;
    series: number;
    toistot: number[] | undefined;
}

export interface AeroProps {
    handleConfirm?: (
        fiilis: string,
        intervals: number,
        timeUsed: number,
        distance: number
    ) => void;
    onVapaaAnswer: (
        liike: string,
        fiilis: string,
        intervals: number,
        timeUsed: number,
        distance: number
    ) => void;
}
export interface VapaaConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (
        liike: string,
        fiilis: string,
        intervals: number,
        timeUsed: number,
        distance: number
    ) => void;
    handleConfirm: (
        fiilis: string,
        intervals: number,
        timeUsed: number,
        distance: number
    ) => void;
    onVapaaAnswer: (
        liike: string,
        fiilis: string,
        intervals: number,
        timeUsed: number,
        distance: number
    ) => void;
}

export interface HeavyProps {
    onAnswer: (
        liike: string,
        palaute: string,
        weights: number[],
        reps: number[],
        result: string[]
    ) => void;
    liike: string;
    sarja: number[];
    toisto?: string;
}
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
