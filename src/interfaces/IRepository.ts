export interface IRepository {
    index: (key: any) => Promise<any>;
    create: (data: any) => void;
    update: (data: any) => void;
    delete: (key: any) => void;
};
