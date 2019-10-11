interface iInputActivity {
    id: number;
    activityId?: number;
    title: string;
    amountE: number;
    amountF: number | null;
    amountG: number | null;
    isRejected: boolean;
    rejectReason: string
}

export default iInputActivity;