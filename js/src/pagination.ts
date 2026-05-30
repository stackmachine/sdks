import type { StackMachineRequestOptions } from "./environment";
import { StackMachineValidationError } from "./errors";

const DEFAULT_PAGE_LIMIT = 10;
const MIN_PAGE_LIMIT = 1;
const MAX_PAGE_LIMIT = 100;

export type StackMachinePaginationParams = {
  limit?: number;
  startingAfter?: string | null;
  endingBefore?: string | null;
  starting_after?: string | null;
  ending_before?: string | null;
};

export type StackMachineAutoPagingEachHandler<T> = (
  item: T,
) => boolean | void | Promise<boolean | void>;

export type StackMachineAutoPagingToArrayOptions = {
  limit: number;
};

export type StackMachineList<T> = AsyncIterable<T> & {
  object: "list";
  data: T[];
  hasMore: boolean;
  has_more: boolean;
  url: string;
  nextPageCursor: string | null;
  previousPageCursor: string | null;
  totalCount?: number | null;
  autoPagingEach(handler: StackMachineAutoPagingEachHandler<T>): Promise<void>;
  autoPagingToArray(
    options: StackMachineAutoPagingToArrayOptions,
  ): Promise<T[]>;
};

export type StackMachineListPromise<T> = Promise<StackMachineList<T>> &
  AsyncIterable<T> & {
    autoPagingEach(
      handler: StackMachineAutoPagingEachHandler<T>,
    ): Promise<void>;
    autoPagingToArray(
      options: StackMachineAutoPagingToArrayOptions,
    ): Promise<T[]>;
  };

export type StackMachineNormalizedPaginationParams = {
  limit: number;
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  direction: "forward" | "backward";
};

export type StackMachinePageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
};

export type StackMachineListPageData<T> = {
  data: T[];
  pageInfo: StackMachinePageInfo;
  totalCount?: number | null;
};

export type StackMachineConnectionLike<TNode> = {
  edges?: ReadonlyArray<
    | {
        cursor?: string | null;
        node?: TNode | null;
      }
    | null
    | undefined
  > | null;
  pageInfo?: {
    hasNextPage?: boolean | null;
    hasPreviousPage?: boolean | null;
    endCursor?: string | null;
    startCursor?: string | null;
  } | null;
  totalCount?: number | null;
};

type StackMachineFetchListPage<
  T,
  TParams extends StackMachinePaginationParams,
> = (
  pagination: StackMachineNormalizedPaginationParams,
  params: TParams,
  options?: StackMachineRequestOptions,
) => Promise<StackMachineListPageData<T>>;

function optionalCursor(value: string | null | undefined): string | undefined {
  return value === null || value === undefined || value === ""
    ? undefined
    : value;
}

function resolveAliasedCursor(
  camelCaseValue: string | null | undefined,
  snakeCaseValue: string | null | undefined,
  camelCaseName: string,
  snakeCaseName: string,
): string | undefined {
  const resolvedCamelCaseValue = optionalCursor(camelCaseValue);
  const resolvedSnakeCaseValue = optionalCursor(snakeCaseValue);
  if (
    resolvedCamelCaseValue &&
    resolvedSnakeCaseValue &&
    resolvedCamelCaseValue !== resolvedSnakeCaseValue
  ) {
    throw new StackMachineValidationError({
      message: `\`${camelCaseName}\` and \`${snakeCaseName}\` must match when both are provided.`,
      code: "pagination_alias_conflict",
      param: camelCaseName,
    });
  }
  return resolvedCamelCaseValue ?? resolvedSnakeCaseValue;
}

function validateLimit(limit: number): number {
  if (
    !Number.isInteger(limit) ||
    limit < MIN_PAGE_LIMIT ||
    limit > MAX_PAGE_LIMIT
  ) {
    throw new StackMachineValidationError({
      message: "`limit` must be an integer between 1 and 100.",
      code: "invalid_pagination_limit",
      param: "limit",
    });
  }
  return limit;
}

export function normalizePaginationParams(
  params: StackMachinePaginationParams = {},
): StackMachineNormalizedPaginationParams {
  const limit = validateLimit(params.limit ?? DEFAULT_PAGE_LIMIT);
  const startingAfter = resolveAliasedCursor(
    params.startingAfter,
    params.starting_after,
    "startingAfter",
    "starting_after",
  );
  const endingBefore = resolveAliasedCursor(
    params.endingBefore,
    params.ending_before,
    "endingBefore",
    "ending_before",
  );

  if (startingAfter && endingBefore) {
    throw new StackMachineValidationError({
      message: "`startingAfter` and `endingBefore` cannot both be provided.",
      code: "pagination_cursor_conflict",
    });
  }

  if (endingBefore) {
    return {
      limit,
      last: limit,
      before: endingBefore,
      direction: "backward",
    };
  }

  return {
    limit,
    first: limit,
    after: startingAfter,
    direction: "forward",
  };
}

export function connectionToListPageData<TNode, TItem>(
  connection: StackMachineConnectionLike<TNode> | null | undefined,
  mapNode: (node: TNode) => TItem,
): StackMachineListPageData<TItem> {
  const data =
    connection?.edges
      ?.map((edge) => edge?.node)
      .filter((node): node is TNode => node !== null && node !== undefined)
      .map(mapNode) ?? [];

  return {
    data,
    pageInfo: {
      hasNextPage: Boolean(connection?.pageInfo?.hasNextPage),
      hasPreviousPage: Boolean(connection?.pageInfo?.hasPreviousPage),
      endCursor: connection?.pageInfo?.endCursor ?? null,
      startCursor: connection?.pageInfo?.startCursor ?? null,
    },
    totalCount: connection?.totalCount,
  };
}

function nextPageParams<TParams extends StackMachinePaginationParams>(
  params: TParams,
  list: StackMachineList<unknown>,
  direction: "forward" | "backward",
): TParams | null {
  const cursor =
    direction === "forward" ? list.nextPageCursor : list.previousPageCursor;
  if (!list.hasMore || !cursor) {
    return null;
  }

  const nextParams = { ...params };
  delete nextParams.starting_after;
  delete nextParams.ending_before;

  if (direction === "forward") {
    nextParams.startingAfter = cursor;
    delete nextParams.endingBefore;
  } else {
    nextParams.endingBefore = cursor;
    delete nextParams.startingAfter;
  }

  return nextParams;
}

function validateAutoPagingToArrayLimit(
  options?: StackMachineAutoPagingToArrayOptions,
): number {
  if (!options || !Number.isInteger(options.limit) || options.limit < 1) {
    throw new StackMachineValidationError({
      message:
        "`autoPagingToArray` requires a positive integer `limit` option.",
      code: "invalid_auto_paging_limit",
      param: "limit",
    });
  }
  return options.limit;
}

function createListObject<T, TParams extends StackMachinePaginationParams>(
  pageData: StackMachineListPageData<T>,
  params: TParams,
  options: StackMachineRequestOptions | undefined,
  url: string,
  fetchPage: StackMachineFetchListPage<T, TParams>,
  normalized: StackMachineNormalizedPaginationParams,
): StackMachineList<T> {
  const hasMore =
    normalized.direction === "forward"
      ? pageData.pageInfo.hasNextPage
      : pageData.pageInfo.hasPreviousPage;

  const list = {
    object: "list" as const,
    data: pageData.data,
    hasMore,
    has_more: hasMore,
    url,
    nextPageCursor: pageData.pageInfo.endCursor,
    previousPageCursor: pageData.pageInfo.startCursor,
    totalCount: pageData.totalCount,
  } as StackMachineList<T>;

  const iterate = async function* (): AsyncIterableIterator<T> {
    let currentList: StackMachineList<T> = list;
    let currentParams: TParams | null = params;

    while (currentParams) {
      for (const item of currentList.data) {
        yield item;
      }

      currentParams = nextPageParams(
        currentParams,
        currentList,
        normalized.direction,
      );
      if (!currentParams) {
        return;
      }

      const currentNormalized = normalizePaginationParams(currentParams);
      currentList = createListObject(
        await fetchPage(currentNormalized, currentParams, options),
        currentParams,
        options,
        url,
        fetchPage,
        currentNormalized,
      );
    }
  };

  list[Symbol.asyncIterator] = iterate;
  list.autoPagingEach = async (handler) => {
    for await (const item of iterate()) {
      if ((await handler(item)) === false) {
        return;
      }
    }
  };
  list.autoPagingToArray = async (toArrayOptions) => {
    const limit = validateAutoPagingToArrayLimit(toArrayOptions);
    const items: T[] = [];
    for await (const item of iterate()) {
      items.push(item);
      if (items.length >= limit) {
        break;
      }
    }
    return items;
  };

  return list;
}

export function createStackMachineListPromise<
  T,
  TParams extends StackMachinePaginationParams,
>(input: {
  params: TParams;
  options?: StackMachineRequestOptions;
  url: string;
  fetchPage: StackMachineFetchListPage<T, TParams>;
}): StackMachineListPromise<T> {
  const normalized = normalizePaginationParams(input.params);
  const promise = input
    .fetchPage(normalized, input.params, input.options)
    .then((pageData) =>
      createListObject(
        pageData,
        input.params,
        input.options,
        input.url,
        input.fetchPage,
        normalized,
      ),
    ) as StackMachineListPromise<T>;

  promise[Symbol.asyncIterator] = async function* () {
    const list = await promise;
    yield* list;
  };
  promise.autoPagingEach = async (handler) => {
    const list = await promise;
    return list.autoPagingEach(handler);
  };
  promise.autoPagingToArray = async (options) => {
    const list = await promise;
    return list.autoPagingToArray(options);
  };

  return promise;
}
