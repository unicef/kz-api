interface iInputReportActivity {
    id: number;
    activityId?: number;
    title: string;
    amountA: number;
    amountB: number;
    amountC: number | null;
    amountD: number | null;
    isRejected: boolean;
    rejectReason: string
}

export default iInputReportActivity;