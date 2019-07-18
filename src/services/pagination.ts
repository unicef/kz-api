import { Request } from "express";

class Pagination {
    private page!: number;
    private pageCount!: number;
    private itemsCount!: number;
    private lastPage!: number;

    constructor (req: Request, pageCount: number) {
        this.pageCount = pageCount;
        this.page = 1;
        if (req.query.page !== undefined) {
            this.page = parseInt(req.query.page);
            if (isNaN(this.page)) {
                this.page = 1;
            }
        }
    }

    public setItemsCount = (itemsCount: number) => {
        this.itemsCount = itemsCount;
        this.getLastPage();
    }

    public getLastPage = (): number => {
        this.lastPage = Math.ceil(this.itemsCount / this.pageCount);

        return this.lastPage;
    }

    public getCurrentPage = (): number => {
        if (this.page > this.lastPage) {
            return this.lastPage;
        }
        return this.page;
    }

    public getLimitOffsetParam = (): string => {
        const offset = this.pageCount * (this.getCurrentPage()-1);
    
        const query = ' LIMIT ' + this.pageCount + ' OFFSET ' + offset;
        return query;
    }
}

export default Pagination;