export function itemToCursor(item: string | number): string {
  return btoa(`cursor:${item}`);
}

export function cursorToItem(cursor: string): string {
  return atob(cursor).split(':')[1];
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
  startAfter: string,
  limit: number,
) {
  const edges = snapshot.docs.map((doc: any) => ({
    cursor: itemToCursor(doc.id),
    node: doc,
  }));
  const pageInfo = {
    hasPreviousPage: startAfter !== null,
    hasNextPage: snapshot.size < limit,
    startCursor: itemToCursor(snapshot.docs[0].id),
    endCursor: itemToCursor(snapshot.docs[snapshot.size - 1].id),
  };
  return {
    edges: edges,
    totalCount: undefined,
    pageInfo: pageInfo,
  };
}
