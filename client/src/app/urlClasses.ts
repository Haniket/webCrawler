export class UrlCount{
    constructor(
        public _id: string,
        public count: number,
    ){}
}

export class LinkedUrl{
    constructor(
        public _id: string,
        public anchorText: String,
    ){}
}
export class DomainUrl{
    constructor(
        public domain: string,
    ){}
}