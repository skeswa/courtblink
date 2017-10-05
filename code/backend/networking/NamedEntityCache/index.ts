import { EntityCache } from 'networking/EntityCache'

/** Stores remotely obtained data in memory for later retrieval. */
export interface NamedEntityCache<Id, Name, Entity>
  extends EntityCache<Id, Entity> {
  /**
   * Retrieves the entity matching the specified name, or null if no such entity
   * exists.
   *
   * @param name the name of the entity to retrieve from the cache.
   * @return the entity matching the specified id, or null if no such entity
   *     exists.
   */
  retrieveByName(name: Name): Promise<Entity>

  /** Clears away all expired data in the cache. */
  collectGarbage(): void
}
