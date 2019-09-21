interface iInputActivity {
    id: number;
    title: string;
    amountE: number;
    amountF: number | null;
    amountG: number | null;
    isRejected: boolean;
    rejectReason: string
}

export default iInputActivity;