export function itemToCursor(item: string | number): string {
  return Buffer.from(`cursor:${item}`).toString('base64');
}

export function cursorToItem(cursor: string): string {
  return Buffer.from(cursor, 'base64').toString().split(':')[1];
}

export function getPageParams(
  first: number,
  after: string,
): { startAfter: string; limit: number } {
  return {
    startAfter: cursorToItem(after),
    limit: first,
  };
}

export function convertSnapshotToCollection(
  snapshot: any,
  startAfter: string | null,
  limit: number,
) {
  const edges: any = [];
  snapshot.forEach((doc: any) => {
    edges.push({
      cursor: itemToCursor(doc.id),
      node: doc.data(),
    });
  });
  const pageInfo = {
    hasPreviousPage: startAfter !== null,
    hasNextPage: snapshot.size < limit,
    startCursor: edges.length ? itemToCursor(edges[0].node.id) : null,
    endCursor: edges.length
      ? itemToCursor(edges[edges.length - 1].node.id)
      : null,
  };
  return {
    edges: edges,
    totalCount: undefined,
    pageInfo: pageInfo,
  };
}
