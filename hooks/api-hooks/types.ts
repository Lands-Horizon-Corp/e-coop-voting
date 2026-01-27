export interface IQueryHook<T = unknown, E = unknown>
    extends IAPICallback<T, E> {
    enable?: boolean;
    refetchInterval? : number
}

export interface IMutationHook<T = unknown, E = unknown>
    extends IAPICallback<T, E> {
    enable?: boolean;
}

export interface IAPICallback<TData, TError> {
    onSuccess? : (data: TData) => void;
    onError? : (err: TError) => void;
}
