/** Stores remotely obtained data in memory for later retrieval. */
export interface EntityCache<Id, Entity> {
  /**
   * Retrieves the entity matching the specified id, or null if no such entity
   * exists.
   *
   * @param id the id of the entity to retrieve from the cache.
   * @return the entity matching the specified id, or null if no such entity
   *     exists.
   */
  retrieveById(id: Id): Promise<Entity | undefined>

  /** Clears away all expired data in the cache. */
  collectGarbage(): void
}