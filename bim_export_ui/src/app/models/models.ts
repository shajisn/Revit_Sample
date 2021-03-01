export class TokenResp {
    access_token: string;
    expires_in: string;
    token_type: string;
}

export class JobOrder {  
    constructor(
        public _id: string,
        public name: string,
        public description: string,
        public export_status: string,
        public gracie_status: string,
        public gracie_url: string,
        public upload_file_name: string,
        public upload_file_id: string,
        public upload_status: string,
        public revit_url: string,
        public forge_doc_id: string,
        public forge_status: string,
        public forge_bucket_name: string,
        public json_file_id: string,
        public json_file_name: string,
        public json_url: string,
        public user_id: string,
        public created_time: string,
        public modified_time: string,
        public error_message: string
    ){}
}

export type SortColumn = keyof JobOrder | '';
export type SortDirection = 'asc' | 'desc' | '';

export interface SortEvent {
    column: SortColumn;
    direction: SortDirection;
}